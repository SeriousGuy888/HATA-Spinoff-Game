<script>
	import { gameState, getPlayer } from "./state/game_state.svelte"
	import { exportTileStates } from "./state/map_state.svelte"
	import { TILE_TERRAINS } from "./entities/Tile.svelte"
	import { getSelectedTile } from "./state/ui_state.svelte"

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
				selectedTile.controller = getPlayer(event.currentTarget.value)
			}}
			id="controller-selector"
			class="rounded-md border px-1"
		>
			<option value="">(none)</option>
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
