export type TileAxialCoordinateKey = `${number},${number}`

export interface ExportedTileState {
	terrain: TileTerrain
	controller?: string // the id of the country that controls this tile
	structure?: TileStructure
}

export const TILE_TERRAINS = ["grass", "sand", "coastal_ocean", "deep_ocean"] as const
export type TileTerrain = (typeof TILE_TERRAINS)[number]

export const TILE_STRUCTURE_TYPES = ["house"] as const
export type TileStructureType = (typeof TILE_STRUCTURE_TYPES)[number]
export interface TileStructure {
	type: TileStructureType
	level: number
}
