<script lang="ts">
	import { cameraState, mouseState, tileSelectionState } from "./ui_state.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<!-- <div>
		<p>{mouseState.isDragging}</p>
		<p>zoom: {cameraState.zoom.toFixed(2)}</p>
		<p>offset: {cameraState.offsetX.toFixed()}, {cameraState.offsetY.toFixed()}</p>
	</div> -->

	<div>
		{#if tileSelectionState.selectedTileId}
			<p>Selected Tile: {tileSelectionState.selectedTileId}</p>
		{:else}
			<p>No tile selected</p>
		{/if}
	</div>
</div>
