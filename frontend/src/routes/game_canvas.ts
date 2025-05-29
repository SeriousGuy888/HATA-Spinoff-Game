import type { TileAxialCoordinateKey } from "#shared/types/tile_data_types"
import { canvasSpaceToWorldSpace, worldSpaceToCanvasSpace } from "$lib/util/coordinates.svelte"
import { localState } from "$lib/state/local_state.svelte"
import { canvasState, getSelectedTileCoords, selectTile } from "$lib/state/ui_state.svelte.ts"
import { TileAsset, TilePalette } from "./tile_palette"

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
function worldSpaceToAxialInt(x: number, y: number): [number, number] {
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
	private readonly palette: TilePalette
	private nextAnimationFrameId: number

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.ctx = ctx
		this.palette = new TilePalette()

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

	private drawHexagon(
		centerWorldX: number,
		centerWorldY: number,
		label?: string,
		isSelected: boolean = false,
	) {
		const zoom = canvasState.zoom

		const [x, y] = worldSpaceToCanvasSpace(
			centerWorldX - circumcircleRadius,
			centerWorldY - incircleRadius,
		)
		this.palette.paint(
			this.ctx,
			TileAsset.WATER,
			x,
			y,
			circumcircleDiameter * zoom,
			incircleDiameter * zoom,
		)

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

	private draw() {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))

		const start = performance.now()

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		const game = localState.game
		if (!game) {
			return
		}

		const [cullX, cullY, cullW, cullH] = this.getCullingBoundary()
		// convert top-left and bottom-right to world space
		const [minWorldXCull, minWorldYCull] = canvasSpaceToWorldSpace(cullX, cullY)
		const [maxWorldXCull, maxWorldYCull] = canvasSpaceToWorldSpace(cullX + cullW, cullY + cullH)

		const [selectedP, selectedQ] = getSelectedTileCoords() ?? [null, null]
		this.ctx.lineWidth = 1
		for (const _key in game.tiles) {
			const key = _key as TileAxialCoordinateKey

			const [p, q] = key.split(",").map((v) => parseInt(v))
			const [x, y] = axialToWorldSpace(p, q)
			if (
				x + sideLength < minWorldXCull ||
				x - sideLength > maxWorldXCull ||
				y + incircleRadius < minWorldYCull ||
				y - incircleRadius > maxWorldYCull
			) {
				continue
			}

			this.drawHexagon(x, y, `${p},${q}`, p == selectedP && q == selectedQ)
		}

		this.drawCullingBoundary()

		const elapsed = performance.now() - start
		canvasState.millisecondsElapsedForPreviousFrame = elapsed
	}

	private getCullingBoundary(): [number, number, number, number] {
		const { width: canvasWidth, height: canvasHeight } = this.canvas

		const x = canvasWidth * 0.1
		const y = canvasHeight * 0.1
		const w = canvasWidth * 0.8
		const h = canvasHeight * 0.8

		return [x, y, w, h]
	}

	private drawCullingBoundary() {
		this.ctx.strokeStyle = "red"
		this.ctx.lineWidth = 2
		this.ctx.strokeRect(...this.getCullingBoundary())
	}
}
