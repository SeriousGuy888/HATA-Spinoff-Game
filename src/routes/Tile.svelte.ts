import type { Player } from "./Player"

export class Tile {
	id: string
	terrain: TileTerrain = "land" // type of terrain on this tile
	polygons: [number, number][][] = [] // an array of possibly multiple polygons. all are drawn together in one svg <path> element.
	
	controller = $state<Player | null>(null) // the player who controls this tile, or null if no one does

	constructor(id: string, polygons: [number, number][][]) {
		this.id = id
		this.polygons = polygons

		if (polygons.length === 0) {
			console.warn(`Tile ${id} has no polygons.`)
		}
	}
}

export type TileTerrain = "land" | "impassable" | "water"
