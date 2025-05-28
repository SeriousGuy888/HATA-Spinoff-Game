<script lang="ts">
	import TileRenderer from "./TileRenderer.svelte"
	import { MAP_DIMENSIONS } from "$lib/state/map_state.svelte.ts"
	import { cameraState } from "$lib/state/ui_state.svelte.ts"
	import { onMount } from "svelte"

	const animationFrameInterval = 1000 / 60

	let canvasParent: HTMLDivElement
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D
	let previousAnimationFrameTimestamp = 0
	let nextAnimationFrameId: number

	function updateCanvasDimensions() {
		canvas.width = canvasParent.clientWidth
		canvas.height = canvasParent.clientHeight

		let context = canvas.getContext("2d")
		if (context == null) {
			console.error("Canvas 2D context failed to load??")
		} else {
			ctx = context
		}
	}

	onMount(() => {
		nextAnimationFrameId = requestAnimationFrame(draw)

		// Make sure that the <canvas> element's width & height always match the actual space it has,
		// to avoid any issues with the image getting stretched (as would happen if I scaled the canvas using CSS)
		updateCanvasDimensions()
		window.addEventListener("resize", updateCanvasDimensions)

		// Cancel a bunch of stuff when unmounted
		return () => {
			window.removeEventListener("resize", updateCanvasDimensions)
			window.cancelAnimationFrame(nextAnimationFrameId)
		}
	})

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

	function axialToWorldSpace(p: number, q: number): [number, number] {
		const x = p * (3 / 2) * sideLength
		const y = p * innerRadius + q * 2 * innerRadius
		return [x, y]
	}

	const hexagonVertexOffsets = Array.from({ length: 6 }, (_, i) => {
		const currAngle = i * (Math.PI / 3) // 60 degrees * i
		const x = Math.cos(currAngle) * sideLength
		const y = Math.sin(currAngle) * sideLength
		return [x, y]
	})

	function drawHexagonAt(centerX: number, centerY: number) {
		const vertices: [number, number][] = hexagonVertexOffsets.map((offset) => {
			const [x, y] = offset
			return [centerX + x, centerY + y]
		})

		ctx.strokeStyle = "black"
		ctx.beginPath()
		ctx.moveTo(...vertices[vertices.length - 1])
		for (let i = 0; i < vertices.length; i++) {
			ctx.lineTo(...vertices[i])
		}
		ctx.stroke()
	}

	function draw(currTimestamp: DOMHighResTimeStamp) {
		nextAnimationFrameId = window.requestAnimationFrame(draw)
		const deltaTime = currTimestamp - previousAnimationFrameTimestamp
		if (deltaTime < animationFrameInterval) {
			return
		}

		ctx.fillStyle = "#fff"
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		for (let p = 0; p < hexes.length; p++) {
			for (let q = 0; q < hexes[p].length; q++) {
				const [x, y] = axialToWorldSpace(p, q)
				drawHexagonAt(x, y)
			}
		}

		previousAnimationFrameTimestamp = currTimestamp
	}
</script>

<div class="h-full w-full" bind:this={canvasParent}>
	<canvas bind:this={canvas}></canvas>
</div>
