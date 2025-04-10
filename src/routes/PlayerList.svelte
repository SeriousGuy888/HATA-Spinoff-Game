<script lang="ts">
	import { gameState, setUserControlledPlayer } from "./state/game_state.svelte.ts"
</script>

<div class="rounded-md bg-gray-100 p-4">
	<details open>
		<summary class="mr-4 font-bold">Player List</summary>
		<ul class="mt-2 flex flex-col gap-2">
			{#each Object.values(gameState.players) as player}
				<li
					class="block rounded border-blue-600 bg-gray-200 p-2"
					class:border-r-6={gameState.playerControlledByUser?.id === player.id}
				>
					<p class="font-bold">{player}</p>
					{#if player.controlledCountry}
						<p>Controls {player.controlledCountry}</p>
					{/if}
					{#if gameState.playerControlledByUser?.id === player.id}
						<p>You</p>
					{:else}
						<button
							class="cursor-pointer hover:underline"
							onclick={() => {
								setUserControlledPlayer(player.id)
							}}
						>
							Take Control
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	</details>
</div>
