<script lang="ts">
	import { canvasState, changeZoom, mouseState } from "$lib/state/ui_state.svelte.ts"
	import { onMount } from "svelte"
	import { GameCanvas } from "./game_canvas.ts"
	import { clientSpaceToCanvasSpace } from "$lib/util/coordinates.svelte.ts"

	const DRAGGING_THRESHOLD = 5 // pixels that the mouse must move to start dragging
	// This prevents the user from accidentally dragging the camera when they just want to click.

	let canvasParent: HTMLDivElement

	function updateCanvasDimensions() {
		if (!canvasState.canvas) {
			console.error("Canvas is not defined??")
			return
		}

		canvasState.canvas.width = canvasParent.clientWidth
		canvasState.canvas.height = canvasParent.clientHeight

		if(!canvasState.gameCanvas) {
			console.error("Game canvas not initialised??")
			return
		}
		canvasState.gameCanvas.handleResize()
	}

	onMount(() => {
		const { canvas } = canvasState
		if (canvas) {
			let ctx = canvas.getContext("2d")
			if (ctx == null) {
				console.error("Canvas 2D context failed to load??")
			} else {
				canvasState.gameCanvas = new GameCanvas(canvas, ctx)
			}

			updateCanvasDimensions()
		} else {
			console.error("Canvas is not defined??")
		}

		return () => {
			canvasState.gameCanvas?.destroy()
		}
	})

	$effect(() => {
		canvasState.zoom
		canvasState.offsetX
		canvasState.offsetY
		canvasState.gameCanvas?.handleZoomAndPan()
	})
</script>

<!--
 Make sure that the <canvas> element's width & height always match the actual space it has,
 to avoid any issues with the image getting stretched (as would happen if I scaled the canvas using CSS)
-->
<svelte:window onresize={updateCanvasDimensions} />

<div class="h-full w-full" bind:this={canvasParent}>
	<canvas
		bind:this={canvasState.canvas}
		onmousedown={(e) => {
			mouseState.lastDragPosition = clientSpaceToCanvasSpace(e.clientX, e.clientY)
		}}
		onmousemove={(e) => {
			const [newX, newY] = clientSpaceToCanvasSpace(e.clientX, e.clientY)
			const movedX = Math.abs(newX - mouseState.lastDragPosition[0])
			const movedY = Math.abs(newY - mouseState.lastDragPosition[1])
			const dragThresholdMet = movedX > DRAGGING_THRESHOLD || movedY > DRAGGING_THRESHOLD

			if (e.buttons & 0b101 && dragThresholdMet) {
				// Require that the left or middle mouse button is pressed
				// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons

				// Start dragging if the user pressed the mouse button *and* moved the mouse.
				// This prevents trouble with other mouse events like click detection, and how
				// I want to not detect a click if the user is dragging the mouse.
				mouseState.isDragging = true
			}
			if (mouseState.isDragging) {
				canvasState.gameCanvas?.handleDrag(
					newX,
					newY,
					mouseState.lastDragPosition[0],
					mouseState.lastDragPosition[1],
					e.buttons
				)

				mouseState.lastDragPosition = [newX, newY]
			}
		}}
		onmouseup={(e) => {
			if (mouseState.isDragging) {
				setTimeout(() => {
					mouseState.isDragging = false
				}, 0) // Reset the dragging state after the next event loop
			} else {
				const [screenX, screenY] = clientSpaceToCanvasSpace(e.clientX, e.clientY)
				canvasState.gameCanvas?.click(screenX, screenY)
			}
		}}
		onwheel={(e) => {
			e.preventDefault()
			const [mouseX, mouseY] = clientSpaceToCanvasSpace(e.clientX, e.clientY)
			changeZoom(e.deltaY > 0 ? "out" : "in", mouseX, mouseY)
		}}
	></canvas>
</div>
