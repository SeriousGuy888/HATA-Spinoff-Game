export type TileAxialCoordinateKey = `${number},${number}`

export interface ExportedTileState {
	name: string
	terrain: TileTerrain
	controller: string | null // the id of the country that controls this tile, or null if no one does
	population: number
	industry: number
}

export const TILE_TERRAINS = ["grass", "sand", "coastal_ocean", "deep_ocean"] as const
export type TileTerrain = (typeof TILE_TERRAINS)[number]