<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import { localState } from "$lib/state/local_state.svelte"
	import TileMenu from "./TileMenu.svelte"
	import MapEditorMenu from "./MapEditorMenu.svelte"
	import StatChip from "./StatChip.svelte"
	import CountryMenu from "./CountryMenu.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<div class="flex w-full gap-4 rounded bg-gray-100 p-4 text-center">
		<p>Clock: {localState.game ? localState.game.clock : "..."}</p>
		{#if localState.perspectivePlayer?.controlledCountry?.balance}
			<StatChip
				stat={localState.perspectivePlayer.controlledCountry?.balance.toFixed(2)}
				iconSrc="/ui_icons/money.png"
				description="Money"
			/>
		{/if}
	</div>

	<CountryMenu />
	<TileMenu />
	<PlayerList />
	<MapEditorMenu />
</div>
