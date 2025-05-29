<script lang="ts">
	import { localState, setPerspectivePlayer } from "$lib/state/local_state.svelte.ts"
</script>

<details class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">Player List</summary>
	<ul class="mt-2 flex flex-col gap-2">
		{#each localState.game ? Object.values(localState.game.players) : [] as player}
			<li class="block">
				<button
					class="block w-full cursor-pointer rounded border-blue-600 bg-gray-200 p-2 text-left"
					class:border-r-6={localState.perspectivePlayer?.id === player.id}
					tabindex="0"
					onclick={() => {
						setPerspectivePlayer(player.id)
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
