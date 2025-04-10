import _tiles from "$lib/tile_data/tile_geometry.json"
export const TILES: { [key: string]: TileGeometryData } = _tiles as any

export interface TileGeometryData {
	// an array of possibly multiple polygons. all are drawn together in one svg <path> element.
	// Each coordinate pair is a vertex in the polygon.
	polygons: [number, number][][]
}

export const MAP_DIMENSIONS = {
	width: 10001,
	height: 10001,
}

// The map image is a map of a Minecraft world.
// This constant stores the *image* coordinates at which the *Minecraft* coordinates (0, 0) are located.
export const MAP_WORLD_ORIGIN_OFFSET: [number, number] = [5001, 5001]

// The location in the world that the camera should start centered on.
export const DEFAULT_WORLD_LOCATION: [number, number] = [200, 1200]
