<script lang="ts">
	import StatChip from "./StatChip.svelte"
	import { getSelectedTile } from "$lib/state/ui_state.svelte"

	let country = $derived(getSelectedTile()?.controller)
</script>

<details open class="rounded-md bg-gray-100 p-4">
	<summary class="select-none">{country ?? "No Country Selected"}</summary>
	{#if country}
		<div class="grid grid-cols-[60px_1fr] gap-2 mt-2">
			<div class="rounded overflow-clip outline-1 outline-black">
				<img
					src="/banners/{country.banner}.png"
					alt="Banner of {country.name}"
					class="aspect-[1/2] w-full"
					style:image-rendering="pixelated"
				/>
			</div>

			<ul class="ml-8 list-disc">
				<li>Controller:</li>
			</ul>
		</div>
	{/if}
</details>
