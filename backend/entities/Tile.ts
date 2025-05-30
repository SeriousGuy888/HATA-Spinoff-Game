import { TileData } from "#shared/types/entities.ts"
import { ExportedTileState, TileTerrain } from "#shared/types/tile_data_types.ts"
import { Country } from "./Country"
import Game from "./Game"

export class Tile {
	id: string
	terrain: TileTerrain = "deep_ocean" // TILE_TERRAINS[~~(Math.random() * TILE_TERRAINS.length)]
	controller: Country | null = null // the player who controls this tile, or null if no one does

	constructor(game: Game, id: string, defaultState: ExportedTileState | null = null) {
		this.id = id

		if (defaultState) {
			this.terrain = defaultState.terrain
			this.controller = defaultState.controller ? game.getCountry(defaultState.controller) : null
		}
	}

	tick() {
		// do nothing
	}

	/**
	 * Export the tile data to a format that can be saved to a file.
	 */
	exportState(): ExportedTileState {
		return {
			terrain: this.terrain,
			controller: this.controller?.id ?? null,
		}
	}

	toString() {
		return this.id
	}

	toJson(): TileData {
		return {
			id: this.id,
			terrain: this.terrain,
			controllerId: this.controller?.id ?? null,
		}
	}
}
