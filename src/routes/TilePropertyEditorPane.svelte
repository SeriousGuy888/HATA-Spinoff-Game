<script>
	import { exportTileStates } from "./state/map_state.svelte"
	import { TILE_TERRAINS } from "$lib/entities/Tile.svelte"
	import { getSelectedTile } from "./state/ui_state.svelte"
	import { getCountry, loadedCountries } from "./state/country_registry.svelte"
	import CharacterPortrait from "./CharacterPortrait.svelte"

	let selectedTile = $derived(getSelectedTile())
	let selectedCountry = $derived(selectedTile ? selectedTile.controller : null)
</script>

<div class="rounded-md bg-gray-100 p-4">
	<h2 class="font-bold">Tile Properties</h2>
	{#if !selectedTile}
		<p>No tile selected.</p>
	{:else}
		<p>Tile ID: {selectedTile.id}</p>

		<label for="tile-name-input">Name:</label>
		<input
			id="tile-name-input"
			type="text"
			class="rounded-md border px-1"
			bind:value={selectedTile.name}
		/>

		<br />

		<label for="terrain-type-selector">Terrain Type:</label>
		<select
			id="terrain-type-selector"
			class="rounded-md border px-1"
			bind:value={selectedTile.terrain}
		>
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
				selectedTile.controller = getCountry(event.currentTarget.value)
			}}
			id="controller-selector"
			class="rounded-md border px-1"
		>
			<option value="">(none)</option>
			{#each Object.keys(loadedCountries) as countryId}
				<option value={countryId} selected={selectedTile.controller?.id === countryId}>
					{getCountry(countryId)?.name}
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
</div>

{#if selectedCountry}
	<div class="rounded-md bg-gray-100 p-4">
		<h2 class="font-bold">Country Properties</h2>

		<label for="country-name-input">Name:</label>
		<input
			id="country-name-input"
			type="text"
			class="rounded-md border px-1"
			bind:value={selectedCountry.name}
		/>

		{#if selectedCountry.leader}
			<CharacterPortrait
				frames={selectedCountry.leader.portraitFrames}
				name={selectedCountry.leader.name}
			/>
		{/if}
	</div>
{/if}
