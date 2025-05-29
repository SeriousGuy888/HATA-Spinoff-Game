export interface ExportedTileState {
	name: string
	terrain: TileTerrain
	controller: string | null // the id of the country that controls this tile, or null if no one does
	population: number
	industry: number
}

export type TileTerrain = "land" | "impassable" | "water"
