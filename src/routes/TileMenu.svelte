<script lang="ts">
	import { getSelectedTile } from "./state/ui_state.svelte"

	let tile = $derived(getSelectedTile())
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{tile}</summary>
	{#if tile}
		<ul class="list-disc ml-8">
			<li>Controller: {tile.controller}</li>
			<li>Terrain: {tile.terrain}</li>
		</ul>
	{/if}
</details>
