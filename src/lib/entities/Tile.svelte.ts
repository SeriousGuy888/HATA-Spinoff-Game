import type { Country } from "$lib/entities/Country.svelte"
import { getCountry } from "../state/country_registry.svelte"

export class Tile {
	id: string
	polygons: [number, number][][] = [] // an array of possibly multiple polygons. all are drawn together in one svg <path> element.

	name = $state<string>("") // name of the tile, used for display purposes
	terrain = $state<TileTerrain>("land") // type of terrain on this tile

	controller = $state<Country | null>(null) // the player who controls this tile, or null if no one does
	population = $state<number>(0)
	industry = $state<number>(0)

	constructor(
		id: string,
		polygons: [number, number][][],
		defaultState: ExportedTileState | null = null,
	) {
		this.id = id
		this.polygons = polygons

		if (polygons.length === 0) {
			console.warn(`Tile ${id} has no polygons.`)
		}

		if (defaultState) {
			this.name = defaultState.name
			this.terrain = defaultState.terrain
			this.controller = defaultState.controller ? getCountry(defaultState.controller) : null
			this.population = defaultState.population
			this.industry = defaultState.industry
		} else {
			this.name = id
		}
	}

	tick() {
		if(this.controller) {
			const revenue = this.industry * this.population * 0.01
			this.controller.balance += revenue
		}
	}

	/**
	 * Export the tile data to a format that can be saved to a file.
	 * This data includes only the game state data -- not the tile geometry, as that is handled elsewhere.
	 */
	exportState(): ExportedTileState {
		return {
			name: this.name,
			terrain: this.terrain,
			controller: this.controller?.id ?? null,
			population: this.population,
			industry: this.industry,
		}
	}

	toString() {
		return this.name
	}
}

export const TILE_TERRAINS = ["land", "impassable", "water"] as const
export type TileTerrain = (typeof TILE_TERRAINS)[number]

export interface ExportedTileState {
	name: string
	terrain: TileTerrain
	controller: string | null // the id of the country that controls this tile, or null if no one does
	population: number
	industry: number
}
