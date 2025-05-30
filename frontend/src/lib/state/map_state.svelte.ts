import type { ExportedTileState } from "#shared/types/tile_data_types"
import { localState } from "./local_state.svelte"

export const MAP_DIMENSIONS = {
	width: 10001,
	height: 10001,
}

// The location in the world that the camera should start centered on.
// export const DEFAULT_WORLD_LOCATION: [number, number] = [200, 1200]

export function exportTileStates(): Record<string, ExportedTileState> {
	const allTileStates: Record<string, ExportedTileState> = {}

	const allTiles = localState.game?.tiles
	if (!allTiles) {
		return {}
	}

	for (const [id, tile] of Object.entries(allTiles)) {
		allTileStates[id] = tile.exportState()
	}
	return allTileStates
}
