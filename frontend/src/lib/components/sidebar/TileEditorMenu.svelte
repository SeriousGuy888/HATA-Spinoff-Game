<script lang="ts">
	import { exportTileStates } from "$lib/state/map_state.svelte"
	import { getSelectedTile } from "$lib/state/ui_state.svelte"
	import { localState } from "$lib/state/local_state.svelte"
	import { TILE_STRUCTURE_TYPES, TILE_TERRAINS } from "#shared/types/tile_data_types"
	let selectedTile = $derived(getSelectedTile())
	let selectedCountry = $derived(selectedTile ? selectedTile.controller : null)
</script>

{#if localState.game}
	<details class="rounded-md bg-gray-100 p-4">
		<summary class="select-none">Tile Property Editor</summary>

		{#if !selectedTile}
			<p>No tile selected.</p>
		{:else}
			<p>Tile ID: {selectedTile.id}</p>

			<br />

			<label for="terrain-type-selector">Terrain Type:</label>
			<select
				id="terrain-type-selector"
				class="rounded-md border px-1"
				bind:value={selectedTile.terrain}
				>localState
				{#each TILE_TERRAINS as terrain}
					<option value={terrain}>
						{terrain}
					</option>
				{/each}
			</select>

			<br />

			<label for="controller-selector">Controller:</label>
			<select
				onchange={(event) => {
					selectedTile.controller = localState.game?.getCountry(event.currentTarget.value) ?? null
				}}
				id="controller-selector"
				class="rounded-md border px-1"
			>
				<option value="">(none)</option>
				{#each Object.keys(localState.game.countries) as countryId}
					<option value={countryId} selected={selectedTile.controller?.id === countryId}>
						{localState.game.getCountry(countryId)?.name}
					</option>
				{/each}
			</select>
			<br />

			<label for="structure-type-selector">Structure:</label>
			<select
				onchange={(event) => {
					if (!event.currentTarget.value) {
						selectedTile.structure = null
					} else {
						if (!selectedTile.structure) {
							// @ts-ignore
							selectedTile.structure = {}
						}
						// @ts-ignore
						selectedTile.structure.type = event.currentTarget.value
					}
				}}
				id="structure-type-selector"
				class="rounded-md border px-1"
				
			>
				<option value="" selected={!selectedTile.structure}>(none)</option>
				{#each TILE_STRUCTURE_TYPES as type}
					<option value={type} selected={selectedTile.structure?.type === type}>
						{type.toUpperCase()}
					</option>
				{/each}
			</select>
		{/if}

		<button
			class="mt-2 cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
			onclick={() => {
				const allTiles = exportTileStates()
				console.log(JSON.stringify(allTiles))
				alert("Exported all tile states to console.")
			}}
		>
			Export All Tile States
		</button>

		{#if selectedCountry}
			<hr class="my-4" />

			<h2 class="font-bold">Country Properties</h2>

			<label for="country-name-input">Name:</label>
			<input
				id="country-name-input"
				type="text"
				class="rounded-md border px-1"
				bind:value={selectedCountry.name}
			/>
		{/if}
	</details>
{/if}
