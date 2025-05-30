import { canvasSpaceToWorldSpace, worldSpaceToCanvasSpace } from "$lib/util/coordinates.svelte"
import { localState } from "$lib/state/local_state.svelte"
import { canvasState, getSelectedTileCoords, selectTile } from "$lib/state/ui_state.svelte.ts"
import { TilePalette } from "./tile_palette"
import type { ClientTile } from "$lib/entities/ClientTile.svelte"
import { MapPainter } from "./MapPainter.svelte"

const sideLength = 50 // This is also the hexagon's circumcircle radius
const circumcircleRadius = sideLength
const circumcircleDiameter = circumcircleRadius * 2
const incircleDiameter = sideLength * Math.sqrt(3)
const incircleRadius = incircleDiameter / 2

const hexagonVertexOffsets = Array.from({ length: 6 }, (_, i) => {
	const currAngle = i * (Math.PI / 3) // 60 degrees * i
	const x = Math.cos(currAngle) * sideLength
	const y = Math.sin(currAngle) * sideLength
	return [x, y]
})

/**
 * Convert from the p,q axial coordinate system of the hexagonal gameboard to
 * the x,y cartesian coordinate system of worldspace.
 */
function axialToWorldSpace(p: number, q: number): [number, number] {
	/**
	 * Apply this matrix multiplication, where l := sideLength
	 *
	 * [ x ]   [  (3l)/2     0   ] [ p ]
	 * [   ] = [                 ] [   ]
	 * [ y ]   [  (l√3)/2   l√3  ] [ q ]
	 */

	const x = p * (3 / 2) * sideLength
	const y = p * incircleRadius + q * 2 * incircleRadius
	return [x, y]
}

/**
 * Convert from the x,y cartesian coordinate system of worldspace to the axial
 * coordinate system of the hexagonal gameboard.
 *
 * The resulting axial coordinates are NOT INTEGERS.
 * To get the actual hexagon clicked, use worldSpaceToAxialInt instead.
 */
function worldSpaceToAxial(x: number, y: number): [number, number] {
	/**
	 * Apply this matrix multiplication, where l := sideLength
	 * (this is the inverse matrix to the one in axialToWorldSpace)
	 *
	 * [ p ]   [   (2)/(3l)       0      ] [ x ]
	 * [   ] = [                         ] [   ]
	 * [ q ]   [  (-1)/(3l)   (1)/(l√3)  ] [ y ]
	 */

	const p = x * (2 / (3 * sideLength))
	const q = x * (-1 / (3 * sideLength)) + y * (1 / incircleDiameter)
	return [p, q]
}

/**
 * Convert from the x,y cartesian coordinate system of worldspace to the axial
 * coordinate system of the hexagonal gameboard.
 *
 * Return the integer axial coordinates of the hexagon clicked.
 */
export function worldSpaceToAxialInt(x: number, y: number): [number, number] {
	const [p, q] = worldSpaceToAxial(x, y)

	// convert axial coordinates to cube coordinates
	// (all valid cube coordinates lie on the plane x+y+z=0)
	const cubeX = p
	const cubeY = q
	const cubeZ = -cubeX - cubeY

	// round each of the cube coordinates
	let rx = Math.round(cubeX)
	let ry = Math.round(cubeY)
	let rz = Math.round(cubeZ)

	// Using the strategy from
	// - https://www.redblobgames.com/grids/hexagons/#rounding
	// - https://blocks.roadtolarissa.com/patricksurry/0603b407fa0a0071b59366219c67abca
	// fix the coordinate with the largest error
	const dx = Math.abs(rx - cubeX)
	const dy = Math.abs(ry - cubeY)
	const dz = Math.abs(rz - cubeZ)

	if (dx > dy && dx > dz) {
		rx = -ry - rz
	} else if (dy > dz) {
		ry = -rx - rz
	} else {
		// rz = -rx - ry
		// not actually used
	}

	// convert back to axial
	return [rx, ry]
}

export class GameCanvas {
	private readonly canvas: HTMLCanvasElement
	private readonly ctx: CanvasRenderingContext2D
	private nextAnimationFrameId: number

	private readonly palette: TilePalette
	readonly mapPainter: MapPainter

	// initialised as long as handleResize gets called in constructor
	private cullingBoundCanvasSpace!: {
		minX: number
		minY: number
		maxX: number
		maxY: number
	}
	private cullingBoundWorldSpace!: {
		minX: number
		minY: number
		maxX: number
		maxY: number
	}

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.ctx = ctx

		this.palette = new TilePalette()
		this.mapPainter = new MapPainter()

		this.handleResize()

		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))
	}

	public destroy() {
		cancelAnimationFrame(this.nextAnimationFrameId)
	}

	public click(canvasX: number, canvasY: number) {
		const [worldX, worldY] = canvasSpaceToWorldSpace(canvasX, canvasY)
		const [p, q] = worldSpaceToAxialInt(worldX, worldY)
		selectTile(p, q)
	}

	public handleResize() {
		this.recalculateCanvasCullingBoundary()
	}

	public handleZoomAndPan() {
		this.recalculateWorldCullingBoundary()
	}

	/**
	 * All coordinates should be given in canvas space.
	 * @param buttons Bitfield representing which mouse buttons are pressed.
	 * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
	 */
	public handleDrag(newX: number, newY: number, oldX: number, oldY: number, buttons: number) {
		const leftButton = !!(buttons & 0b1)
		const middleButton = !!(buttons & 0b100)

		if (middleButton || !this.mapPainter.enabled) {
			canvasState.offsetX -= newX - oldX
			canvasState.offsetY -= newY - oldY
		} else if (leftButton) {
			this.mapPainter.handleDrag(newX, newY, oldX, oldY)
		}
	}

	private draw() {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))

		const start = performance.now()

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		const game = localState.game
		if (!game) {
			return
		}

		const [selectedP, selectedQ] = getSelectedTileCoords() ?? [null, null]
		this.ctx.lineWidth = 1
		for (const tile of Object.values(game.tiles)) {
			const { p, q } = tile.coordinates
			const [x, y] = axialToWorldSpace(p, q)

			if (!this.isHexWithinCullingBoundary(p, q)) {
				continue
			}

			this.drawTile(tile, x, y, null, p == selectedP && q == selectedQ)
		}

		// this.drawCullingBoundary()

		const elapsed = performance.now() - start
		canvasState.millisecondsElapsedForPreviousFrame = elapsed
	}

	private drawTile(
		tile: ClientTile,
		centerWorldX: number,
		centerWorldY: number,
		label?: string | null,
		isSelected: boolean = false,
	) {
		const zoom = canvasState.zoom

		const [x, y] = worldSpaceToCanvasSpace(
			centerWorldX - circumcircleRadius,
			centerWorldY - incircleRadius,
		)

		const width = circumcircleDiameter * zoom
		const height = incircleDiameter * zoom
		const tileScale = this.palette.getClosestScale(width)

		this.palette.paint(this.ctx, this.palette.getTileSprite(tile), x, y, width, height, tileScale)

		if (isSelected) {
			const vertices: [number, number][] = hexagonVertexOffsets.map((offset) => {
				const [x, y] = offset
				return worldSpaceToCanvasSpace(centerWorldX + x, centerWorldY + y)
			})

			this.ctx.beginPath()
			this.ctx.moveTo(...vertices[vertices.length - 1])
			for (const vert of vertices) {
				this.ctx.lineTo(...vert)
			}
			this.ctx.fillStyle = "#aad8"
			this.ctx.fill()
		}

		if (label) {
			this.ctx.fillStyle = "black"
			this.ctx.textBaseline = "middle"
			this.ctx.textAlign = "center"
			this.ctx.font = `${(sideLength / 3) * zoom}px monospace`
			this.ctx.fillText(label, ...worldSpaceToCanvasSpace(centerWorldX, centerWorldY))
		}
	}

	private isHexWithinCullingBoundary(p: number, q: number) {
		const { minX, minY, maxX, maxY } = this.cullingBoundWorldSpace

		const [x, y] = axialToWorldSpace(p, q)
		return (
			x + sideLength > minX &&
			x - sideLength < maxX &&
			y + incircleRadius > minY &&
			y - incircleRadius < maxY
		)
	}

	private recalculateCanvasCullingBoundary() {
		const { width: canvasWidth, height: canvasHeight } = this.canvas

		this.cullingBoundCanvasSpace = {
			minX: 0, // canvasWidth * 0.1,
			minY: 0, // canvasHeight * 0.1,
			maxX: canvasWidth, // * 0.9,
			maxY: canvasHeight, // * 0.9,
		}

		this.recalculateWorldCullingBoundary()
	}

	private recalculateWorldCullingBoundary() {
		const { minX, minY, maxX, maxY } = this.cullingBoundCanvasSpace
		const [minWorldXCull, minWorldYCull] = canvasSpaceToWorldSpace(minX, minY)
		const [maxWorldXCull, maxWorldYCull] = canvasSpaceToWorldSpace(maxX, maxY)

		this.cullingBoundWorldSpace = {
			minX: minWorldXCull,
			minY: minWorldYCull,
			maxX: maxWorldXCull,
			maxY: maxWorldYCull,
		}
	}

	private drawCullingBoundary() {
		this.ctx.strokeStyle = "red"
		this.ctx.lineWidth = 2

		const { minX, minY, maxX, maxY } = this.cullingBoundCanvasSpace
		this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
	}
}
