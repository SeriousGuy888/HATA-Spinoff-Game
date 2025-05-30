import type { CountryData, GameData, TileData } from "#shared/types/entities"
import type { TileAxialCoordinateKey } from "#shared/types/tile_data_types"
import { ClientCharacter } from "./ClientCharacter.svelte"
import { ClientCountry } from "./ClientCountry.svelte"
import { ClientPlayer } from "./ClientPlayer.svelte"
import { ClientTile } from "./ClientTile.svelte"

export default class ClientGame {
	isInitialised: boolean = $state(false)
	clock: number = $state(0)
	players: Record<string, ClientPlayer> = $state({})
	characters: Record<string, ClientCharacter> = $state({})
	tiles: Record<TileAxialCoordinateKey, ClientTile> = $state({})
	countries: Record<string, ClientCountry> = $state({})

	constructor(data: GameData) {
		this.isInitialised = data.isInitialised
		this.clock = data.clock

		// Round 1 of initialisations.
		// Create all the game entities.
		// If entities reference other game entities, these references are not yet guaranteed to exist.

		this.players = Object.fromEntries(
			Object.entries(data.players).map(([id, playerData]) => [
				id,
				new ClientPlayer(this, playerData),
			]),
		)
		this.characters = Object.fromEntries(
			Object.entries(data.characters).map(([id, characterData]) => [
				id,
				new ClientCharacter(characterData),
			]),
		)

		this.loadCountries(data.countries)
		this.loadTiles(data.tiles)

		// Round 2 of initialisations.
		// Resolve any pending references between game entities.

		Object.values(this.players).forEach((player) => {
			player.resolve(data.players[player.id])
		})
	}

	/**
	 * Get a tile by its axial coordinates.
	 * Return null if the tile does not exist.
	 */
	public getTile(p: number, q: number): ClientTile | null {
		const key: TileAxialCoordinateKey = `${p},${q}`
		return this.getTileByKey(key)
	}

	private getTileByKey(tileKey: TileAxialCoordinateKey): ClientTile | null {
		return this.tiles[tileKey] ?? null
	}

	private loadTiles(tileIds2TileData: Record<TileAxialCoordinateKey, TileData>) {
		for (const _id in tileIds2TileData) {
			const id = _id as TileAxialCoordinateKey
			if (this.tiles[id]) {
				console.warn(`Tile ${id} is already loaded. Skipping.`)
				continue
			}

			const [p, q] = id.split(",").map((v) => parseInt(v))

			const tileData = tileIds2TileData[id]
			this.tiles[id] = new ClientTile(this, id, p, q, tileData)
		}
	}

	private loadCountries(countryIds2CountryData: Record<string, CountryData>) {
		for (const countryId in countryIds2CountryData) {
			const countryData = countryIds2CountryData[countryId]
			const country = new ClientCountry(this, countryData)
			this.countries[countryId] = country
		}
	}

	getPlayer(id: string | null): ClientPlayer | null {
		if (id === null) return null
		return this.players[id] ?? null
	}

	getCharacter(id: string | null): ClientCharacter | null {
		if (id === null) return null
		return this.characters[id] ?? null
	}

	getCountry(id: string | null): ClientCountry | null {
		if (id === null) return null
		return this.countries[id] ?? null
	}
}
