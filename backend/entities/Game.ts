import { Character } from "./Character"
import { Country } from "./Country"
import { Tile } from "./Tile"

import _characterData from "#shared/data/characters.json"
const CHARACTER_DATA: Record<
	string,
	{
		name: string
		portrait_frames: string[]
	}
> = _characterData as any

import _countryData from "#shared/data/countries.json"
const COUNTRY_DATA: Record<
	string,
	{
		name: string
		colour: string
		banner: string | null
		leader: string | null
	}
> = _countryData as any

import _tile_states from "#shared/data/tile_states.json"
const TILE_STATES: Record<string, ExportedTileState> = _tile_states as any

import { ExportedTileState, TileAxialCoordinateKey } from "#shared/types/tile_data_types.ts"
import { Player } from "./Player"
import GameAnnouncer from "./GameAnnouncer"
import { Server, Socket } from "socket.io"
import { GameData } from "#shared/types/entities.ts"

export default class Game {
	announcer: GameAnnouncer

	isInitialised: boolean
	clock: number = 0
	players: Record<string, Player> = {}
	characters: Record<string, Character> = {}
	tiles: Record<string, Tile> = {}
	countries: Record<string, Country> = {}

	constructor(io: Server) {
		this.announcer = new GameAnnouncer(io, this)
		this.isInitialised = false
		this.clock = 0
	}

	init() {
		this.loadCharacters()
		this.loadCountries()
		this.loadTiles()

		this.clock = 0
		this.isInitialised = true

		setInterval(() => this.tick(), 1000)
	}

	tick() {
		Object.values(this.tiles).forEach((tile) => {
			tile.tick()
		})

		this.clock++
		this.announcer.tick(this.clock)
	}

	addPlayer(socket: Socket, name: string): Player {
		const player = new Player(this, socket, socket.id, name)
		this.players[socket.id] = player

		this.announcer.sendFullGameState(player)
		this.announcer.youAre(player)
		this.announcer.announcePlayerJoined(player)

		this.assignAvailableCountryToPlayer(player)

		return player
	}

	removePlayer(playerId: string): boolean {
		if (playerId in this.players) {
			const player = this.players[playerId]
			player.setControlledCountry(null)
			delete this.players[playerId]
			this.announcer.announcePlayerLeft(player)
			return true
		}
		return false
	}

	getCharacter(id: string): Character | null {
		return this.characters[id] ?? null
	}

	getCountry(id: string): Country | null {
		return this.countries[id] ?? null
	}

	assignAvailableCountryToPlayer(player: Player): Country | null {
		const availableCountries = Object.values(this.countries).filter((c) => !c.controllingPlayer)
		if (!availableCountries.length) {
			return null
		}

		const chosenCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)]
		player.setControlledCountry(chosenCountry)

		return chosenCountry
	}

	/**
	 * Load characters from JSON data.
	 */
	loadCharacters() {
		for (const characterId in CHARACTER_DATA) {
			const char = new Character(
				characterId,
				CHARACTER_DATA[characterId].name,
				CHARACTER_DATA[characterId].portrait_frames,
			)

			this.characters[characterId] = char
		}
	}

	/**
	 * Load countries from JSON data.
	 */
	loadCountries() {
		for (const countryId in COUNTRY_DATA) {
			const country = new Country(
				this,
				countryId,
				COUNTRY_DATA[countryId].name,
				COUNTRY_DATA[countryId].colour,
				COUNTRY_DATA[countryId].banner ?? null,
				COUNTRY_DATA[countryId].leader,
			)
			this.countries[countryId] = country
		}
	}

	/**
	 * Load tiles from JSON data.
	 * 
	 * temporarily not loading from json data
	 */
	loadTiles() {
		const width = 100
		const height = 50

		for (let numStepsSoutheast = 0; numStepsSoutheast < width; numStepsSoutheast++) {
			// For each additional step to the southeast, we are moving...
			//   + 1   column right
			//   + 1/2 row    down
			for (let nthRowFromTheTop = 0; nthRowFromTheTop < height; nthRowFromTheTop++) {
				// After knowing which row of the current column, calculate the actual q-coord (vertical) of the
				// target row. The q-coord is the number of times to step south from the current p-coord (along the
				// current column).
				//
				// To clarify, since the p-axis isn't horizontal (rather 30° clockwise from the horizontal),
				// every other column is shifted 1 row up to compensate.
				// This creates a roughly rectangular game board, despite the hexagonal coordinates.
				const numStepsSouth = nthRowFromTheTop - Math.floor(numStepsSoutheast / 2)

				// Put the p,q coordinates into the required string format
				const key: TileAxialCoordinateKey = `${numStepsSoutheast},${numStepsSouth}`

				if (Object.hasOwn(this.tiles, key)) {
					console.warn("duplicate key", key)
					return
				}

				const storedState = TILE_STATES[key] ?? null
				if (!storedState) {
					console.warn(`Tile ${key} has no default state. Using empty state.`)
				}

				this.tiles[key] = new Tile(this, key, storedState)
			}
		}
	}

	toJson(): GameData {
		return {
			isInitialised: this.isInitialised,
			clock: this.clock,
			players: Object.fromEntries(
				Object.entries(this.players).map(([id, player]) => [id, player.toJson()]),
			),
			characters: Object.fromEntries(
				Object.entries(this.characters).map(([id, character]) => [id, character.toJson()]),
			),
			tiles: Object.fromEntries(
				Object.entries(this.tiles).map(([id, tile]) => [id, tile.toJson()]),
			),
			countries: Object.fromEntries(
				Object.entries(this.countries).map(([id, country]) => [id, country.toJson()]),
			),
		}
	}
}
