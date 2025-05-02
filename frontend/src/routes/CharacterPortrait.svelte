<script lang="ts">
	const { frames, name }: { frames: string[]; name: string } = $props()

	let frameCount = frames.length
	let frameIndex = $state(0)
	let frame = $derived(frames[frameIndex])

	setInterval(() => {
		frameIndex = (frameIndex + 1) % frameCount
	}, 1000)
</script>

<img
	src="/character_sprites/{frame}"
	alt="Portrait of {name}"
	title="Portrait of {name}"
	style:image-rendering="pixelated"
/>
