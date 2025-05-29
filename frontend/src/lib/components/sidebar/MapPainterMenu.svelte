<script lang="ts">
	import { TILE_TERRAINS } from "$lib/entities/ClientTile.svelte"
	import { canvasState } from "$lib/state/ui_state.svelte"
	import { MAP_PAINTER_TOOLS } from "../map_rendering/MapPainter.svelte"
</script>

<details open class="rounded-md bg-gray-100 p-4">
	{#if canvasState.gameCanvas}
		{@const mapPainter = canvasState.gameCanvas.mapPainter}

		<summary class="select-none">
			<span>Map Painter</span>
			<input type="checkbox" bind:checked={mapPainter.enabled} class="ml-4" />
		</summary>

		<select bind:value={mapPainter.tool}>
			{#each MAP_PAINTER_TOOLS as tool}
				<option value={tool}>{tool.toUpperCase()}</option>
			{/each}
		</select>
		<select bind:value={mapPainter.terrainType}>
			{#each TILE_TERRAINS as terrain}
				<option value={terrain}>{terrain.toUpperCase()}</option>
			{/each}
		</select>

		<!-- <button
			class="mt-2 cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
			onclick={() => {mapPainterState.enabled = !mapPainterState.enabled}}
		>
			Export All Tile States
		</button> -->
	{/if}
</details>
