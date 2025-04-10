<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import { gameState } from "./state/game_state.svelte"
	import TileMenu from "./TileMenu.svelte"
	import TilePropertyEditorPane from "./TilePropertyEditorPane.svelte"
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Epic HATA Spinoff Game</h1>

	<div class="p-4 w-full bg-gray-100 text-center rounded">
		<p>Clock: {gameState.clock}</p>
	</div>

	<TileMenu />
	<PlayerList />
	<TilePropertyEditorPane />
</div>
