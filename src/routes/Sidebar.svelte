<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import { gameState } from "./state/game_state.svelte"
	import TileMenu from "./TileMenu.svelte"
	import MapEditorMenu from "./MapEditorMenu.svelte"
	import StatChip from "./StatChip.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<div class="flex w-full gap-4 rounded bg-gray-100 p-4 text-center">
		<p>Clock: {gameState.clock}</p>
		{#if gameState.playerControlledByUser?.controlledCountry?.balance}
			<StatChip
				stat={gameState.playerControlledByUser.controlledCountry?.balance.toFixed(2)}
				iconSrc="/ui_icons/money.png"
				description="Money"
			/>
		{/if}
	</div>

	<TileMenu />
	<PlayerList />
	<MapEditorMenu />
</div>
