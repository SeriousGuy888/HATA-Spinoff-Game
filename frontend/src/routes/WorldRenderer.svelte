<script lang="ts">
	import TileRenderer from "./TileRenderer.svelte"
	import { MAP_DIMENSIONS } from "$lib/state/map_state.svelte.ts"
	import { cameraState } from "$lib/state/ui_state.svelte.ts"
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
