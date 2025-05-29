<script lang="ts">
	import { localState } from "$lib/state/local_state.svelte"
	import { MAP_DIMENSIONS } from "$lib/state/map_state.svelte.ts"
	import { mouseState, tileSelectionState } from "$lib/state/ui_state.svelte.ts"


	const sideLength = 100
	const innerRadius = (sideLength * Math.sqrt(3)) / 2

	function axialToWorldSpace(p: number, q: number): [number, number] {
		const x = p * (3 / 2) * sideLength
		const y = p * innerRadius + q * 2 * innerRadius
		return [x, y]
	}

	const hexagonVertexOffsets = Array.from({ length: 6 }, (_, i) => {
		const currAngle = i * (Math.PI / 3) // 60 degrees * i
		const x = Math.cos(currAngle) * sideLength
		const y = Math.sin(currAngle) * sideLength
		return [x, y]
	})

	function getPathForHexagon(centerX: number, centerY: number): string {
		const hexagonVertices = hexagonVertexOffsets.map((offset) => {
			const [x, y] = offset
			return `${centerX + x} ${centerY + y}`
		})
		return `M ${hexagonVertices.join(" L ")} Z`
	}
</script>

<svg
	class="absolute inset-0 bg-gray-50"
	viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
	role="none"
>
	{#each Array.from({ length: 50 }) as _, p}
		{#each Array.from({ length: 50 }) as _, q}
			{@const [x, y] = axialToWorldSpace(p, q)}
			<path
				d={getPathForHexagon(x, y)}
				stroke-linejoin="round"
				style:fill="#ddd"
				style:stroke="#d22"
				style:stroke-width="0.5"
				class="hover:brightness-175 cursor-pointer outline-0"
				role="button"
				tabindex="0"
				onkeypress={null}
				onclick={() => {
					if (mouseState.isDragging) {
						return
					}
				}}
			/>
		{/each}
	{/each}
</svg>
