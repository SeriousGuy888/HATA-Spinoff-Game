<script lang="ts">
	const {
		stat,
		iconSrc,
		description,
		onclick, // If undefined, the button will not be clickable
	}: { stat: number | string; iconSrc?: string; description: string; onclick?: () => void } =
		$props()
</script>

<button
	{onclick}
	disabled={!onclick}
	style:cursor={onclick ? "pointer" : "default"}
	class="h-8 rounded-md bg-gray-200 px-2 py-1"
	title={description}
>
	{#if iconSrc}
		<img class="inline h-full" src={iconSrc} alt={description} />
	{/if}
	<span>{stat}</span>
</button>
