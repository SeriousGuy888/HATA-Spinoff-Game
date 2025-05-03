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
		this.players = Object.fromEntries(
			Object.entries(data.players).map(([id, playerData]) => [id, new ClientPlayer(playerData)]),
		)
		// this.characters = data.characters

		this.loadCountries(data.countries)
		this.loadTiles(data.tiles)
	}

	loadTiles(tileIds2TileData: Record<string, TileData>) {
		for (const id in tileIds2TileData) {
			if (this.tiles[id]) {
				console.warn(`Tile ${id} is already loaded. Skipping.`)
				continue
			}

			const tileData = tileIds2TileData[id]
			this.tiles[id] = new ClientTile(id, tileData)
		}
	}

	loadCountries(countryIds2CountryData: Record<string, CountryData>) {
		for (const countryId in countryIds2CountryData) {
			const { name, colour, banner, leaderId } = countryIds2CountryData[countryId]
			const country = new ClientCountry(countryId, name, colour, banner ?? null, leaderId)
			this.countries[countryId] = country
		}
	}
}
