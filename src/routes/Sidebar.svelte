<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import { gameState } from "./state/game_state.svelte"
	import TileMenu from "./TileMenu.svelte"
	import MapEditorMenu from "./MapEditorMenu.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<div class="p-4 w-full bg-gray-100 text-center rounded flex gap-4">
		<p>Clock: {gameState.clock}</p>
		{#if gameState.playerControlledByUser}
			 <p>Balance: {gameState.playerControlledByUser.controlledCountry?.balance}</p>
		{/if}
	</div>

	<TileMenu />
	<PlayerList />
	<MapEditorMenu />
</div>
