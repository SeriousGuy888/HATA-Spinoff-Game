import { TileData } from "#shared/types/entities.ts"
import { ExportedTileState, TileTerrain } from "#shared/types/tile_data_types.ts"
import { Country } from "./Country"
import Game from "./Game"

export class Tile {
	id: string
	name: string = "" // name of the tile, used for display purposes
	terrain: TileTerrain = "land" // type of terrain on this tile
	controller: Country | null = null // the player who controls this tile, or null if no one does
	population: number = 0
	industry: number = 0

	constructor(game: Game, id: string, defaultState: ExportedTileState | null = null) {
		this.id = id

		if (defaultState) {
			this.name = defaultState.name
			this.terrain = defaultState.terrain
			this.controller = defaultState.controller ? game.getCountry(defaultState.controller) : null
			this.population = defaultState.population
			this.industry = defaultState.industry
		} else {
			this.name = id
		}
	}

	tick() {
		// do nothing
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

	toJson(): TileData {
		return {
			id: this.id,
			name: this.name,
			terrain: this.terrain,
			controllerId: this.controller?.id ?? null,
			population: this.population,
			industry: this.industry,
		}
	}
}
