<script lang="ts">
	import { cameraState, worldSpaceToImageSpace } from "./coordinates.svelte.ts"
	import { MAP_DIMENSIONS, TILES } from "./map_config.ts"

	function polygonListToPath(polygonList: [number, number][][]): string {
		let path = ""

		for (const polygon of polygonList) {
			for (let i = 0; i < polygon.length; i++) {
				const [x, y] = worldSpaceToImageSpace(...polygon[i])
				if (i === 0) {
					path += `M ${x} ${y} `
				} else {
					path += `L ${x} ${y} `
				}
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
			d={polygonListToPath(region.polygons)}
			style:fill={"#" + region.name}
			style:stroke="#f9c"
			style:stroke-width="2"
			class="cursor-pointer outline-0"
			role="button"
			tabindex="0"
		/>
	{/each}
</svg>
