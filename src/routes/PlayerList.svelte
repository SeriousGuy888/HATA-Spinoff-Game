<script lang="ts">
	import { gameState, setUserControlledPlayer } from "$lib/state/game_state.svelte.ts"
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">Player List</summary>
	<ul class="mt-2 flex flex-col gap-2">
		{#each Object.values(gameState.players) as player}
			<li class="block">
				<button
					class="block w-full text-left cursor-pointer rounded border-blue-600 bg-gray-200 p-2"
					class:border-r-6={gameState.playerControlledByUser?.id === player.id}
					tabindex="0"
					onclick={() => {
						setUserControlledPlayer(player.id)
					}}
				>
					<p class="font-bold">{player}</p>
					{#if player.controlledCountry}
						<p>{player.controlledCountry}</p>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</details>
