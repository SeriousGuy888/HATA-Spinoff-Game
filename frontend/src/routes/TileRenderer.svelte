<script lang="ts">
	import { worldSpaceToImageSpace } from "$lib/state/coordinates.svelte.ts"
	import { localState } from "$lib/state/local_state.svelte"
	import { MAP_DIMENSIONS } from "$lib/state/map_state.svelte.ts"
	import { mouseState, tileSelectionState } from "$lib/state/ui_state.svelte.ts"

	function polygonListToPath(polygonList: [number, number][][]): string {
		let path = ""

		for (const polygon of polygonList) {
			const [firstPolygonX, firstPolygonY] = worldSpaceToImageSpace(...polygon[0])
			path += `M ${firstPolygonX} ${firstPolygonY} `

			for (let i = 1; i < polygon.length; i++) {
				const [x, y] = worldSpaceToImageSpace(...polygon[i])
				path += `L ${x} ${y} `
			}

			// Close the polygon by connecting to the first point
			// Otherwise there's a bit of a weird gap in the polygon's edge
			path += `L ${firstPolygonX} ${firstPolygonY} `
		}
		path += "Z"
		return path
	}

	function selectTile(id: string) {
		if (tileSelectionState.selectedTileId === id) {
			tileSelectionState.selectedTileId = null
		} else {
			tileSelectionState.selectedTileId = id
		}
	}
</script>

<svg
	class="absolute inset-0 bg-gray-50"
	viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
	role="none"
>
	{#each Object.entries(localState.tiles) as [id, tile]}
		{@const colour = tile.controller?.colour ?? "#ddd"}
		<path
			d="{polygonListToPath(tile.polygons)}localState"
			stroke-linejoin="round"
			style:fill={colour}
			style:stroke={colour}
			style:stroke-width="0.5"
			class="hover:brightness-175 cursor-pointer outline-0"
			class:brightness-150={tileSelectionState.selectedTileId === id}
			role="button"
			tabindex="0"
			onkeypress={() => selectTile(id)}
			onclick={() => {
				if (mouseState.isDragging) {
					return
				}
				selectTile(id)
			}}
		/>
	{/each}
</svg>
