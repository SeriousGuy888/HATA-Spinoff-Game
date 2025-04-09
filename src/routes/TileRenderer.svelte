<script lang="ts">
	import { cameraState, worldSpaceToImageSpace } from "./coordinates.svelte.ts"
	import { MAP_DIMENSIONS, TILES } from "./map_config.ts"

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
</script>

<svg
	class="absolute inset-0 bg-gray-50"
	viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
	role="none"
>
	{#each Object.entries(TILES) as [id, region]}
		<path
			d={polygonListToPath(region.polygons)}
			style:fill={"#" + id}
			style:stroke="#000"
			stroke-linejoin="round"
			style:stroke-width="1.5"
			class="cursor-pointer outline-0"
			role="button"
			tabindex="0"
		/>
	{/each}
</svg>
