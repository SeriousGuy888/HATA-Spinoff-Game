<script lang="ts">
	import { gameState, initGame } from "./state/game_state.svelte.ts"
	import { tileSelectionState } from "./state/ui_state.svelte.ts"
	import TilePropertyEditorPane from "./TilePropertyEditorPane.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<div>
		{#if tileSelectionState.selectedTileId}
			<p>Selected Tile: {tileSelectionState.selectedTileId}</p>
		{:else}
			<p>No tile selected</p>
		{/if}
	</div>

	<div class="rounded-md bg-gray-100 p-4">
		<div class="flex items-center justify-between">
			<h2 class="font-bold">Game State</h2>
			<button
				class="cursor-pointer hover:underline"
				onclick={() => {
					initGame(4)
				}}>Init</button
			>
		</div>

		<ul>
			{#each Object.values(gameState.players) as player}
				<li>
					{player.id}; {player.name}; {player.colour}
				</li>
			{/each}
		</ul>
	</div>

	<TilePropertyEditorPane />
</div>
