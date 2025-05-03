<script lang="ts">
	import { onDestroy, onMount } from "svelte"
	import { clientStateToScreenSpace } from "$lib/state/coordinates.svelte"
	import WorldRenderer from "./WorldRenderer.svelte"
	import { DEFAULT_WORLD_LOCATION } from "$lib/state/map_state.svelte"
	import {
		cameraState,
		changeZoom,
		mouseState,
		teleportToWorldSpace,
	} from "$lib/state/ui_state.svelte"
	import Sidebar from "./Sidebar.svelte"
	import { socket } from "../lib/socket_handler.svelte.ts"

	onDestroy(() => {
		if (socket) {
			socket.disconnect()
		}
	})

	const DRAGGING_THRESHOLD = 5 // pixels that the mouse must move to start dragging
	// This prevents the user from accidentally dragging the camera when they just want to click.

	let cameraWindow = $state<HTMLElement | null>(null)

	onMount(() => {
		if (!cameraWindow) {
			console.error("Camera window is not defined")
			return
		}
		const boundingBox = cameraWindow.getBoundingClientRect()
		cameraState.clientLeft = boundingBox.left
		cameraState.clientTop = boundingBox.top
		cameraState.clientWidth = boundingBox.width
		cameraState.clientHeight = boundingBox.height

		teleportToWorldSpace(
			DEFAULT_WORLD_LOCATION[0],
			DEFAULT_WORLD_LOCATION[1],
			cameraState.clientWidth,
			cameraState.clientHeight,
		)
	})
</script>

<main class="grid h-screen grid-cols-[1fr_3fr] overflow-hidden">
	<section class="overflow-y-scroll p-4">
		<Sidebar />
	</section>
	<section
		bind:this={cameraWindow}
		class="overflow-hidden bg-blue-200"
		onmousedown={(e) => {
			mouseState.lastDragPosition = clientStateToScreenSpace(e.clientX, e.clientY)
		}}
		onmousemove={(e) => {
			const [newX, newY] = clientStateToScreenSpace(e.clientX, e.clientY)
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
				cameraState.offsetX -= newX - mouseState.lastDragPosition[0]
				cameraState.offsetY -= newY - mouseState.lastDragPosition[1]
				mouseState.lastDragPosition = [newX, newY]
			}
		}}
		onmouseup={() => {
			setTimeout(() => {
				mouseState.isDragging = false
			}, 0) // Reset the dragging state after the next event loop
		}}
		onwheel={(e) => {
			e.preventDefault()
			const [mouseX, mouseY] = clientStateToScreenSpace(e.clientX, e.clientY)
			changeZoom(e.deltaY > 0 ? "out" : "in", mouseX, mouseY)
		}}
		role="button"
		tabindex="0"
	>
		<WorldRenderer />
	</section>
</main>
