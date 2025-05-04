import type { CountryData, GameData, TileData } from "#shared/types/entities"
import { ClientCharacter } from "./ClientCharacter.svelte"
import { ClientCountry } from "./ClientCountry.svelte"
import { ClientPlayer } from "./ClientPlayer.svelte"
import { ClientTile } from "./ClientTile.svelte"

export default class ClientGame {
	isInitialised: boolean = $state(false)
	clock: number = $state(0)
	players: Record<string, ClientPlayer> = $state({})
	characters: Record<string, ClientCharacter> = $state({})
	tiles: Record<string, ClientTile> = $state({})
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

	getTotalPopulation(country: ClientCountry) {
		const controlledTiles = Object.values(this.tiles).filter(tile => tile.controller === country)
		return controlledTiles.reduce((acc, cur) => acc + cur.population, 0)
	}

	private loadTiles(tileIds2TileData: Record<string, TileData>) {
		for (const id in tileIds2TileData) {
			if (this.tiles[id]) {
				console.warn(`Tile ${id} is already loaded. Skipping.`)
				continue
			}

			const tileData = tileIds2TileData[id]
			this.tiles[id] = new ClientTile(this, id, tileData)
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
