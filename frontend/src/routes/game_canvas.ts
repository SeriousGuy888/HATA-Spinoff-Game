import type { TileAxialCoordinateKey } from "#shared/types/tile_data_types"
import { canvasSpaceToWorldSpace, worldSpaceToCanvasSpace } from "$lib/state/coordinates.svelte"
import { localState } from "$lib/state/local_state.svelte"
import { canvasState, tileSelectionState } from "$lib/state/ui_state.svelte.ts"

const sideLength = 100 // This is also the hexagon's circumcircle radius
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
	private nextAnimationFrameId: number

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.ctx = ctx

		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))
	}

	public destroy() {
		cancelAnimationFrame(this.nextAnimationFrameId)
	}

	public click(canvasX: number, canvasY: number) {
		const [worldX, worldY] = canvasSpaceToWorldSpace(canvasX, canvasY)
		const [p, q] = worldSpaceToAxialInt(worldX, worldY)
		tileSelectionState.selectedHex = [p, q]
	}

	private drawHexagon(
		centerWorldX: number,
		centerWorldY: number,
		label?: string,
		isSelected: boolean = false,
	) {
		const vertices: [number, number][] = hexagonVertexOffsets.map((offset) => {
			const [x, y] = offset
			return worldSpaceToCanvasSpace(centerWorldX + x, centerWorldY + y)
		})

		this.ctx.strokeStyle = "black"
		this.ctx.beginPath()
		this.ctx.moveTo(...vertices[vertices.length - 1])
		for (const vert of vertices) {
			this.ctx.lineTo(...vert)
		}

		if (isSelected) {
			this.ctx.fillStyle = "#aad"
			this.ctx.fill()
		}

		this.ctx.stroke()

		if (label) {
			this.ctx.fillStyle = "black"
			this.ctx.textBaseline = "middle"
			this.ctx.textAlign = "center"
			this.ctx.font = `${48 * canvasState.zoom}px monospace`
			this.ctx.fillText(label, ...worldSpaceToCanvasSpace(centerWorldX, centerWorldY))
		}
	}

	private draw() {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		const selectedP = tileSelectionState.selectedHex?.[0]
		const selectedQ = tileSelectionState.selectedHex?.[1]

		const game = localState.game
		if (!game) {
			return
		}

		for (const _key in game.tiles) {
			const key = _key as TileAxialCoordinateKey

			const [p, q] = key.split(",").map((v) => parseInt(v))
			const [x, y] = axialToWorldSpace(p, q)
			this.drawHexagon(x, y, `${p},${q}`, p == selectedP && q == selectedQ)
		}
	}
}
