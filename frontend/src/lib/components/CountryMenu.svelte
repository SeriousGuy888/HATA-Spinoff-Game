<script lang="ts">
	import StatChip from "./StatChip.svelte"
	import { getSelectedTile } from "$lib/state/ui_state.svelte"
	import CharacterPortrait from "./CharacterPortrait.svelte"

	let country = $derived(getSelectedTile()?.controller)
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{country ?? "No Country Selected"}</summary>
	{#if country}
		<div class="mt-2 grid grid-cols-[60px_1fr] gap-2">
			<section class="flex flex-col gap-2">
				<div class="overflow-clip rounded outline-1 outline-black">
					<img
						src="/banners/{country.banner}.png"
						alt="Banner of {country.name}"
						class="aspect-[1/2] w-full"
						style:image-rendering="pixelated"
					/>
				</div>

				{#if country.leader}
					<CharacterPortrait frames={country.leader.portraitFrames} name={country.leader.name} />
				{/if}
			</section>
			<section>
				<ul class="ml-8 list-disc">
					<li>information</li>
					<li>information</li>
					<li>information</li>
					<li>information</li>
				</ul>
			</section>
		</div>
	{/if}
</details>
