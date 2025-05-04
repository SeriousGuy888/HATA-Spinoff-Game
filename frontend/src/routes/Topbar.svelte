<script lang="ts">
	import { localState } from "$lib/state/local_state.svelte"
	import StatChip from "./StatChip.svelte"
</script>

<nav class="flex h-full w-full items-stretch justify-between bg-gray-300 p-4">
	<section class="flex h-full items-center justify-start gap-4">
		{#if localState.perspectivePlayer?.controlledCountry}
			{@const resources = localState.perspectivePlayer.controlledCountry.resources}
			{#if resources}
				<StatChip
					stat={resources.money.toFixed(2)}
					iconSrc="/ui_icons/money.png"
					description="Money"
				/>
				<StatChip stat={resources.wood} description="Wood" />
				<StatChip stat={resources.stone} description="Stone" />
				<StatChip stat={resources.coal} description="Coal" />
				<StatChip stat={resources.livestock} description="Livestock" />
			{/if}
		{/if}
	</section>
	<section class="flex h-full items-center justify-end gap-4">
		<div class="h-8 rounded-md bg-gray-200 px-2 py-1">
			<p>Clock: {localState.game ? localState.game.clock : "..."}</p>
		</div>
	</section>
</nav>
