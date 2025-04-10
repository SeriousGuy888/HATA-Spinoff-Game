<script>
	import { gameState } from "./game_state.svelte"
	import { exportTileStates } from "./map_state.svelte"
	import { getSelectedTile } from "./ui_state.svelte"

	let selectedTile = $derived(getSelectedTile())
</script>

<div class="rounded-md bg-gray-100 p-4">
	<h2 class="font-bold">Tile Properties</h2>
	{#if !selectedTile}
		<p>No tile selected.</p>
	{:else}
		<p>Tile ID: {selectedTile.id}</p>

		<label for="name-input">Name:</label>
		<input
			id="name-input"
			type="text"
			class="mt-1 mb-2 block w-full rounded-md border p-1"
			bind:value={selectedTile.name}
		/>

		<p>Terrain Type: {selectedTile.terrain}</p>
		<label for="controller-selector">Controller:</label>
		<select
			onchange={(event) => {
				selectedTile.controller = gameState.players[event.currentTarget.value]
				console.log(event.currentTarget.value)
			}}
			id="controller-selector"
			class="mt-1 mb-2 block w-full rounded-md border p-1"
		>
			{#each Object.keys(gameState.players) as playerId}
				<option value={playerId} selected={selectedTile.controller?.id === playerId}>
					{gameState.players[playerId].name}
				</option>
			{/each}
		</select>
	{/if}
</div>

<div class="rounded-md bg-gray-100 p-4">
	<button
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
		onclick={() => {
			const allTiles = exportTileStates()
			console.log(JSON.stringify(allTiles))
			alert("Exported all tile states to console.")
		}}
	>
		Export All Tile States
	</button>
</div>
