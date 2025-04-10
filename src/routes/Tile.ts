export class Tile {
	id: string
	controller: string | null = null // id of the player who controls this tile, or null if no one does
	terrain: TileTerrain = "land" // type of terrain on this tile
	polygons: [number, number][][] = [] // an array of possibly multiple polygons. all are drawn together in one svg <path> element.

	constructor(id: string, polygons: [number, number][][]) {
		this.id = id
		this.polygons = polygons

		if (polygons.length === 0) {
			console.warn(`Tile ${id} has no polygons.`)
		}
	}
}

export type TileTerrain = "land" | "impassable" | "water"
