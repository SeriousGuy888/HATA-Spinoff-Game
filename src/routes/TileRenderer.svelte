<script lang="ts">
	import { cameraState, worldSpaceToImageSpace } from "./coordinates.svelte.ts"
	import { MAP_DIMENSIONS, TILES } from "./map_config.ts"

	function coordsListToPath(coordsList: [number, number][]): string {
		let path = ""
		for (let i = 0; i < coordsList.length; i++) {
			const [x, y] = worldSpaceToImageSpace(...coordsList[i])
			if (i === 0) {
				path += `M ${x} ${y} `
			} else {
				path += `L ${x} ${y} `
			}
		}
		path += "Z"
		return path
	}
</script>

<svg
	class="absolute inset-0 bg-blue-100"
	viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
	role="none"
>
	{#each Object.entries(TILES) as [id, region]}
		<path
			d={coordsListToPath(region.coordinates)}
			style:fill="#f98"
			style:stroke="#f9c"
			style:stroke-width="2"
			class="cursor-pointer outline-0"
			role="button"
			tabindex="0"
		/>
	{/each}
</svg>
