import { cameraState } from "$lib/state/ui_state.svelte.ts"

const animationFrameInterval = 1000 / 60

const hexes = [
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
]

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

	private previousAnimationFrameTimestamp = 0
	private nextAnimationFrameId: number

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.canvas = canvas
		this.ctx = ctx

		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))
	}

	destroy() {
		cancelAnimationFrame(this.nextAnimationFrameId)
	}

	private drawHexagonAt(centerWorldX: number, centerWorldY: number) {
		const vertices: [number, number][] = hexagonVertexOffsets.map((offset) => {
			const [x, y] = offset
			return [
				(centerWorldX + x) * cameraState.zoom - cameraState.offsetX,
				(centerWorldY + y) * cameraState.zoom - cameraState.offsetY,
			]
		})

		this.ctx.strokeStyle = "black"
		this.ctx.beginPath()
		this.ctx.moveTo(...vertices[vertices.length - 1])
		for (const vert of vertices) {
			this.ctx.lineTo(...vert)
		}
		this.ctx.stroke()
	}

	private draw(currTimestamp: DOMHighResTimeStamp) {
		this.nextAnimationFrameId = requestAnimationFrame(this.draw.bind(this))
		// const deltaTime = currTimestamp - this.previousAnimationFrameTimestamp

		this.ctx.fillStyle = "#fff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		for (let p = 0; p < hexes.length; p++) {
			for (let q = 0; q < hexes[p].length; q++) {
				const [x, y] = axialToWorldSpace(p, q)
				this.drawHexagonAt(x, y)
			}
		}

		// console.log(deltaTime)

		this.previousAnimationFrameTimestamp = currTimestamp
	}
}
