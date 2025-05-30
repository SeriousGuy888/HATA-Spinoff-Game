import type { ExportedTileState, TileStructure, TileTerrain } from "#shared/types/tile_data_types"
import type { ClientCountry } from "$lib/entities/ClientCountry.svelte"

import type { TileData } from "#shared/types/entities"
import type ClientGame from "./ClientGame.svelte"

export class ClientTile {
	id: string
	coordinates: { p: number; q: number }

	terrain = $state<TileTerrain>("grass") // type of terrain on this tile
	controller = $state<ClientCountry | null>(null)
	structure = $state<TileStructure | null>(null)

	constructor(game: ClientGame, id: string, p: number, q: number, tileData: TileData) {
		this.id = id
		this.coordinates = { p, q }

		if (tileData) {
			this.terrain = tileData.terrain
			this.controller = tileData.controllerId ? game.getCountry(tileData.controllerId) : null
			this.structure = tileData.structure
		}
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
}
