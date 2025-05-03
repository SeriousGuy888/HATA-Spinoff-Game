export interface TileGeometryData {
	// an array of possibly multiple polygons. all are drawn together in one svg <path> element.
	// Each coordinate pair is a vertex in the polygon.
	polygons: [number, number][][]
}

export interface ExportedTileState {
	name: string
	terrain: TileTerrain
	controller: string | null // the id of the country that controls this tile, or null if no one does
	population: number
	industry: number
}

export type TileTerrain = "land" | "impassable" | "water"
