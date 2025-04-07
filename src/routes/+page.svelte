<script lang="ts">
	import { onMount } from "svelte"
	import {
		cameraState,
		changeZoom,
		clientStateToScreenSpace,
		teleportToWorldSpace,
	} from "./coordinates.svelte"
	import WorldRenderer from "./WorldRenderer.svelte"
	import { DEFAULT_WORLD_LOCATION } from "./map_config"

	let isDragging = $state(false)
	let lastDragPosition = $state([0, 0])

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

<main class="grid h-screen grid-cols-[1fr_3fr] gap-4 overflow-clip">
	<section class="p-4">
		<h1>Epic</h1>

		<div>
			<p>{isDragging}</p>
			<p>zoom: {cameraState.zoom.toFixed(2)}</p>
			<p>offset: {cameraState.offsetX.toFixed()}, {cameraState.offsetY.toFixed()}</p>
		</div>
	</section>
	<section
		bind:this={cameraWindow}
		class="overflow-hidden bg-blue-200"
		onmousedown={(e) => {
			isDragging = true
			lastDragPosition = clientStateToScreenSpace(e.clientX, e.clientY)
		}}
		onmousemove={(e) => {
			if (isDragging) {
				const [newX, newY] = clientStateToScreenSpace(e.clientX, e.clientY)

				cameraState.offsetX -= newX - lastDragPosition[0]
				cameraState.offsetY -= newY - lastDragPosition[1]
				lastDragPosition = [newX, newY]
			}
		}}
		onmouseup={() => {
			isDragging = false
		}}
		onwheel={(e) => {
			e.preventDefault()
			const [mouseX, mouseY] = clientStateToScreenSpace(e.clientX, e.clientY)
			changeZoom(e.deltaY > 0 ? "out" : "in", mouseX, mouseY)
			console.log(mouseX, mouseY)
		}}
		role="button"
		tabindex="0"
	>
		<WorldRenderer />
	</section>
</main>
