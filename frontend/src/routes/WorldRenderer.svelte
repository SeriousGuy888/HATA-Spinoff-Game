<script lang="ts">
	import TileRenderer from "./TileRenderer.svelte"
	import { MAP_DIMENSIONS } from "$lib/state/map_state.svelte.ts"
	import { cameraState } from "$lib/state/ui_state.svelte.ts"
	import { onMount } from "svelte"
	import { GameCanvas } from "./game_canvas.ts"

	let canvasParent: HTMLDivElement
	let canvas: HTMLCanvasElement
	let gameCanvas: GameCanvas

	function updateCanvasDimensions() {
		canvas.width = canvasParent.clientWidth
		canvas.height = canvasParent.clientHeight
	}

	onMount(() => {
		let ctx = canvas.getContext("2d")
		if (ctx == null) {
			console.error("Canvas 2D context failed to load??")
		} else {
			gameCanvas = new GameCanvas(canvas, ctx)
		}

		// Make sure that the <canvas> element's width & height always match the actual space it has,
		// to avoid any issues with the image getting stretched (as would happen if I scaled the canvas using CSS)
		updateCanvasDimensions()
		window.addEventListener("resize", updateCanvasDimensions)

		// Cancel a bunch of stuff when unmounted
		return () => {
			window.removeEventListener("resize", updateCanvasDimensions)
			gameCanvas.destroy()
		}
	})
</script>

<div class="h-full w-full" bind:this={canvasParent}>
	<canvas bind:this={canvas}></canvas>
</div>
