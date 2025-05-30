<script lang="ts">
	import { getSelectedTile } from "$lib/state/ui_state.svelte"
	let tile = $derived(getSelectedTile())
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{tile ?? "No Tile Selected"}</summary>
	{#if tile}
		<p>{tile.terrain}</p>
	{/if}
</details>
