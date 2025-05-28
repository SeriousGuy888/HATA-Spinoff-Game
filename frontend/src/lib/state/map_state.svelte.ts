import type { ExportedTileState } from "#shared/types/tile_data_types"
import { localState } from "./local_state.svelte"

export const MAP_DIMENSIONS = {
	width: 10001,
	height: 10001,
}

// The map image is a map of a Minecraft world.
// This constant stores the *image* coordinates at which the *Minecraft* coordinates (0, 0) are located.
export const MAP_WORLD_ORIGIN_OFFSET: [number, number] = [5001, 5001]

// The location in the world that the camera should start centered on.
// export const DEFAULT_WORLD_LOCATION: [number, number] = [200, 1200]

export function exportTileStates(): Record<string, ExportedTileState> {
	const allTileStates: Record<string, ExportedTileState> = {}
	for (const id in localState.game?.tiles) {
		const tile = localState.game?.tiles[id]
		allTileStates[id] = tile.exportState()
	}
	return allTileStates
}
