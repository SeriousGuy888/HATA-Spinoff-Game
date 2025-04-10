<script lang="ts">
	import { getSelectedTile } from "./state/ui_state.svelte"

	let tile = $derived(getSelectedTile())
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{tile ?? "No Tile Selected"}</summary>
	{#if tile}
		<ul class="ml-8 list-disc">
			<li>Controller: {tile.controller}</li>
			<li>Terrain: {tile.terrain}</li>
		</ul>
		<div class="mt-2 flex gap-2">
			<button
				class="h-8 cursor-pointer rounded-md bg-gray-200 px-2 py-1"
				onclick={() => (tile.population += 1)}
			>
				<span>{tile.population}</span>
				<img
					class="inline h-full"
					src="/ui_icons/population.png"
					alt="Population"
					title="Population"
				/>
			</button>
			<button
				class="h-8 cursor-pointer rounded-md bg-gray-200 px-2 py-1"
				onclick={() => (tile.industry += 1)}
			>
				<span>{tile.industry}</span>
				<img class="inline h-full" src="/ui_icons/industry.png" alt="Industry" title="Industry" />
			</button>
		</div>
	{/if}
</details>
