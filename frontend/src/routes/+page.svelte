<script lang="ts">
	import { onDestroy, onMount } from "svelte"
	import MapRenderer from "../lib/components/map_rendering/MapRenderer.svelte"
	import Sidebar from "../lib/components/sidebar/Sidebar.svelte"
	import { socket } from "../lib/socket_handler.svelte.ts"
	import Topbar from "../lib/components/Topbar.svelte"

	onDestroy(() => {
		if (socket) {
			socket.disconnect()
		}
	})
</script>

<main class="grid h-screen grid-cols-[1fr_3fr] grid-rows-[1fr_11fr] overflow-hidden">
	<section class="col-span-2">
		<Topbar />
	</section>
	<section class="overflow-y-scroll p-4">
		<Sidebar />
	</section>
	<section class="overflow-hidden bg-blue-200">
		<MapRenderer />
	</section>
</main>
