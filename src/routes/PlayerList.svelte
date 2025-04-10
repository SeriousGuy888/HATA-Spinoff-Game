<script lang="ts">
	import { gameState } from "./state/game_state.svelte.ts"
</script>

<div class="rounded-md bg-gray-100 p-4">
	<details open>
		<summary class="mr-4 font-bold">Player List</summary>
		<ul class="mt-2 flex flex-col gap-2">
			{#each Object.values(gameState.players) as player}
				<li class="block rounded bg-gray-200 p-2">
					<p class="font-bold">{player}</p>
					{player.colour}
				</li>
			{/each}
		</ul>
	</details>
</div>
