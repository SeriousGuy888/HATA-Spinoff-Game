import { TileData } from "#shared/types/entities.ts"
import { ExportedTileState, TileStructure, TileTerrain } from "#shared/types/tile_data_types.ts"
import { Country } from "./Country"
import Game from "./Game"

export class Tile {
	id: string
	terrain: TileTerrain = "deep_ocean" // TILE_TERRAINS[~~(Math.random() * TILE_TERRAINS.length)]
	controller: Country | null = null // the player who controls this tile, or null if no one does
	structure: TileStructure | null = null

	constructor(game: Game, id: string, storedState: ExportedTileState | null = null) {
		this.id = id

		if (storedState) {
			this.terrain = storedState.terrain
			this.controller = storedState.controller ? game.getCountry(storedState.controller) : null
			this.structure = storedState.structure ?? null
		}
	}

	tick() {
		// do nothing
	}

	toString() {
		return this.id
	}

	toJson(): TileData {
		return {
			id: this.id,
			terrain: this.terrain,
			controllerId: this.controller?.id ?? null,
			structure: this.structure ?? null,
		}
	}
}
