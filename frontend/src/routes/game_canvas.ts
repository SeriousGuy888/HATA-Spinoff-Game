import { screenSpaceToWorldSpace, worldSpaceToScreenSpace } from "$lib/state/coordinates.svelte"
import { cameraState, tileSelectionState } from "$lib/state/ui_state.svelte.ts"

const hexes = Array.from({ length: 20 }, () => Array(20).fill(1))

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
 * Converts from the p,q axial coordinate system of the hexagonal gameboard to
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
 * Converts from the x,y cartesian coordinate system of worldspace to the axial
 * coordinate system of the hexagonal gameboard.
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

function worldSpaceToAxialInt(x: number, y: number): [number, number] {
	const [p, q] = worldSpaceToAxial(x, y)
	return [Math.round(p), Math.round(q)]
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
		const [worldX, worldY] = screenSpaceToWorldSpace(canvasX, canvasY)
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
			return worldSpaceToScreenSpace(centerWorldX + x, centerWorldY + y)
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
			this.ctx.font = `${48 * cameraState.zoom}px monospace`
			this.ctx.fillText(label, ...worldSpaceToScreenSpace(centerWorldX, centerWorldY))
		}
	}

	private draw() {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		const selectedP = tileSelectionState.selectedHex?.[0]
		const selectedQ = tileSelectionState.selectedHex?.[1]

		for (let p = 0; p < hexes.length; p++) {
			for (let q = 0; q < hexes[p].length; q++) {
				const [x, y] = axialToWorldSpace(p, q)
				this.drawHexagon(x, y, `${p},${q}`, p == selectedP && q == selectedQ)
			}
		}
	}
}
