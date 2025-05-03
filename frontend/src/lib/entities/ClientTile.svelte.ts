import type { ExportedTileState, TileGeometryData } from "#shared/types/tile_data_types"
import type { ClientCountry } from "$lib/entities/ClientCountry.svelte"
import { getCountry } from "../state/country_registry.svelte"

import _tile_geometries from "#shared/data/tile_geometry.json"
import type { TileData } from "#shared/types/entities"
const TILE_GEOMETRIES: Record<string, TileGeometryData> = _tile_geometries as any

export class ClientTile {
	id: string
	polygons: [number, number][][] = [] // an array of possibly multiple polygons. all are drawn together in one svg <path> element.

	name = $state<string>("") // name of the tile, used for display purposes
	terrain = $state<TileTerrain>("land") // type of terrain on this tile

	controller = $state<ClientCountry | null>(null) // the player who controls this tile, or null if no one does
	population = $state<number>(0)
	industry = $state<number>(0)

	constructor(id: string, tileData: TileData) {
		this.id = id

		// Load the tile geometry from the JSON file
		// This is not given by the server, but instead loaded statically on the client.
		this.polygons = TILE_GEOMETRIES[id]?.polygons ?? []
		if (this.polygons.length === 0) {
			console.warn(`Tile ${id} has no polygons.`)
		}

		if (tileData) {
			this.name = tileData.name
			this.terrain = tileData.terrain
			this.controller = tileData.controllerId ? getCountry(tileData.controllerId) : null
			this.population = tileData.population
			this.industry = tileData.industry
		} else {
			this.name = id
		}
	}

	tick() {
		if (this.controller) {
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
