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

import { ExportedTileState } from "#shared/types/tile_data_types.ts"
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
	}

	tick() {
		Object.values(this.tiles).forEach((tile) => {
			tile.tick()
		})

		this.clock++
	}

	addPlayer(socket: Socket, name: string): Player {
		const player = new Player(socket, socket.id, name)
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
			this.announcer.announcePlayerLeft(player)
			delete this.players[playerId]
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

		const oldCountry = player.controlledCountry

		const newCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)]
		newCountry.controllingPlayer = player
		player.controlledCountry = newCountry

		this.announcer.playerSwitchedCountries(player, oldCountry, newCountry)

		return newCountry
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
	 * Does not include tile geometry, which is only needed on the client side.
	 */
	loadTiles() {
		const tileIds = Object.keys(TILE_STATES)
		for (const id of tileIds) {
			if (this.tiles[id]) {
				console.warn(`Tile ${id} is already loaded. Skipping.`)
				continue
			}

			const defaultState = TILE_STATES[id] ?? null
			if (!defaultState) {
				console.warn(`Tile ${id} has no default state. Using empty state.`)
			}

			const tile = new Tile(this, id, defaultState)
			this.tiles[id] = tile
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
