<script lang="ts">
	import StatChip from "./StatChip.svelte"
	import { getSelectedTile } from "$lib/state/ui_state.svelte"
	import { localState } from "$lib/state/local_state.svelte"
	let tile = $derived(getSelectedTile())
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{tile ?? "No Tile Selected"}</summary>
	{#if tile}
		{@const tileIsOwnedByPlayer =
			tile.controller === localState.perspectivePlayer?.controlledCountry}
		<p>{tile.terrain}</p>
		<div class="mt-2 flex gap-2">
			<StatChip
				stat={tileIsOwnedByPlayer ? tile.population : "?"}
				iconSrc="/ui_icons/population.png"
				description="Population"
				onclick={() => (tile.population += 1)}
			/>
			<StatChip
				stat={tileIsOwnedByPlayer ? tile.industry : "?"}
				iconSrc="/ui_icons/industry.png"
				description="Industry"
				onclick={() => console.log(tile)}
			/>
			<p>a</p>
		</div>
	{/if}
</details>
