<script>
	import { exportTileStates } from "$lib/state/map_state.svelte"
	import { TILE_TERRAINS } from "$lib/entities/ClientTile.svelte"
	import { getSelectedTile } from "$lib/state/ui_state.svelte"
	import { localState } from "$lib/state/local_state.svelte"
	let selectedTile = $derived(getSelectedTile())
	let selectedCountry = $derived(selectedTile ? selectedTile.controller : null)
</script>

{#if localState.game}
	<details class="rounded-md bg-gray-100 p-4">
		<summary class="select-none">Editor</summary>

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

			<label for="population-input">Population</label>
			<input
				id="population-input"
				type="number"
				class="rounded-md border px-1"
				bind:value={selectedTile.population}
				min="0"
				max="1000000"
			/>

			<br />

			<label for="industry-input">Industry</label>
			<input
				id="industry-input"
				type="number"
				class="rounded-md border px-1"
				bind:value={selectedTile.industry}
				min="0"
				max="1000000"
			/>
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
