<script lang="ts">
	import { onDestroy, onMount } from "svelte"
	import { clientStateToScreenSpace } from "$lib/state/coordinates.svelte"
	import WorldRenderer from "./WorldRenderer.svelte"
	import {
		cameraState,
		changeZoom,
		mouseState,
	} from "$lib/state/ui_state.svelte"
	import Sidebar from "./Sidebar.svelte"
	import { socket } from "../lib/socket_handler.svelte.ts"
	import Topbar from "./Topbar.svelte"

	onDestroy(() => {
		if (socket) {
			socket.disconnect()
		}
	})


	let cameraWindow = $state<HTMLElement | null>(null)

	function handleWindowResize() {
		if (!cameraWindow) {
			console.error("Camera window is not defined")
			return
		}
		const boundingBox = cameraWindow.getBoundingClientRect()
		cameraState.clientLeft = boundingBox.left
		cameraState.clientTop = boundingBox.top
		cameraState.clientWidth = boundingBox.width
		cameraState.clientHeight = boundingBox.height
	}

	onMount(() => {
		handleWindowResize()

		// teleportToWorldSpace(
		// 	DEFAULT_WORLD_LOCATION[0],
		// 	DEFAULT_WORLD_LOCATION[1],
		// 	cameraState.clientWidth,
		// 	cameraState.clientHeight,
		// )
	})
</script>

<svelte:window onresize={handleWindowResize} />

<main class="grid h-screen grid-cols-[1fr_3fr] grid-rows-[1fr_11fr] overflow-hidden">
	<section class="col-span-2">
		<Topbar />
	</section>
	<section class="overflow-y-scroll p-4">
		<Sidebar />
	</section>
	<section
		bind:this={cameraWindow}
		class="overflow-hidden bg-blue-200"
	>
		<WorldRenderer />
	</section>
</main>
