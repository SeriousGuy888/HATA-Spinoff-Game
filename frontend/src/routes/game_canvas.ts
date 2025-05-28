import { worldSpaceToScreenSpace } from "$lib/state/coordinates.svelte"
import { cameraState, changeZoom } from "$lib/state/ui_state.svelte.ts"

const animationFrameInterval = 1000 / 60

const hexes = Array.from({ length: 20 }, () => Array(20).fill(1))

const sideLength = 100
const innerRadius = (sideLength * Math.sqrt(3)) / 2

const hexagonVertexOffsets = Array.from({ length: 6 }, (_, i) => {
	const currAngle = i * (Math.PI / 3) // 60 degrees * i
	const x = Math.cos(currAngle) * sideLength
	const y = Math.sin(currAngle) * sideLength
	return [x, y]
})

function axialToWorldSpace(p: number, q: number): [number, number] {
	const x = p * (3 / 2) * sideLength
	const y = p * innerRadius + q * 2 * innerRadius
	return [x, y]
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

	destroy() {
		cancelAnimationFrame(this.nextAnimationFrameId)
	}

	private drawHexagon(centerWorldX: number, centerWorldY: number, label?: string) {
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
		this.ctx.stroke()

		if (label) {
			this.ctx.fillStyle = "black"
			this.ctx.textBaseline = "middle"
			this.ctx.textAlign = "center"
			this.ctx.font = `${48 * cameraState.zoom}px monospace`
			this.ctx.fillText(label, ...worldSpaceToScreenSpace(centerWorldX, centerWorldY))
		}
	}

	private draw(currTimestamp: DOMHighResTimeStamp) {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		for (let p = 0; p < hexes.length; p++) {
			for (let q = 0; q < hexes[p].length; q++) {
				const [x, y] = axialToWorldSpace(p, q)
				this.drawHexagon(x, y, `${p},${q}`)
			}
		}
	}
}
