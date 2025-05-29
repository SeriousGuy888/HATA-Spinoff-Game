import type { ExportedTileState } from "#shared/types/tile_data_types"
import type { ClientCountry } from "$lib/entities/ClientCountry.svelte"

import type { TileData } from "#shared/types/entities"
import type ClientGame from "./ClientGame.svelte"

export class ClientTile {
	id: string

	name = $state<string>("") // name of the tile, used for display purposes
	terrain = $state<TileTerrain>("land") // type of terrain on this tile

	controller = $state<ClientCountry | null>(null) // the player who controls this tile, or null if no one does
	population = $state<number>(0)
	industry = $state<number>(0)

	constructor(game: ClientGame, id: string, tileData: TileData) {
		this.id = id

		if (tileData) {
			this.name = tileData.name
			this.terrain = tileData.terrain
			this.controller = tileData.controllerId ? game.getCountry(tileData.controllerId) : null
			this.population = tileData.population
			this.industry = tileData.industry
		} else {
			this.name = id
		}
	}

	/**
	 * Export the tile data to a format that can be saved to a file.
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
