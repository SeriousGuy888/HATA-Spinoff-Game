<script lang="ts">
	import TileRenderer from "./TileRenderer.svelte"
	import { cameraState } from "./coordinates.svelte"
	import { MAP_DIMENSIONS } from "./map_config"
</script>

<div
	class="relative"
	style:width={`${MAP_DIMENSIONS.width * cameraState.zoom}px`}
	style:height={`${MAP_DIMENSIONS.height * cameraState.zoom}px`}
	style:left="{-cameraState.offsetX}px"
	style:top="{-cameraState.offsetY}px"
>
	<TileRenderer />
</div>
