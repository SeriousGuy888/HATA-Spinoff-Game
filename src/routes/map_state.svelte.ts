import _tile_geometries from "$lib/tile_data/tile_geometry.json"
import { gameState } from "./game_state.svelte"
import { Tile } from "./Tile.svelte"

const TILE_GEOMETRIES: { [key: string]: TileGeometryData } = _tile_geometries as any

export const MAP_DIMENSIONS = {
	width: 10001,
	height: 10001,
}

// The map image is a map of a Minecraft world.
// This constant stores the *image* coordinates at which the *Minecraft* coordinates (0, 0) are located.
export const MAP_WORLD_ORIGIN_OFFSET: [number, number] = [5001, 5001]

// The location in the world that the camera should start centered on.
export const DEFAULT_WORLD_LOCATION: [number, number] = [200, 1200]

export interface TileGeometryData {
	// an array of possibly multiple polygons. all are drawn together in one svg <path> element.
	// Each coordinate pair is a vertex in the polygon.
	polygons: [number, number][][]
}

export const loadedTiles = $state<Record<string, Tile>>({})

export function loadTiles() {
	const tileIds = Object.keys(TILE_GEOMETRIES)
	for (const id of tileIds) {
		if (loadedTiles[id]) {
			console.warn(`Tile ${id} is already loaded. Skipping.`)
			continue
		}
		const tile = new Tile(id, TILE_GEOMETRIES[id].polygons)
		tile.controller = gameState.players["player0"]
		loadedTiles[id] = tile
	}
	return loadedTiles
}
