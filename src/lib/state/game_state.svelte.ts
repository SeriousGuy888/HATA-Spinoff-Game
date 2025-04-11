import { Player } from "$lib/entities/Player.svelte.ts"
import type { Country } from "$lib/entities/Country.svelte.ts"
import type { Character } from "$lib/entities/Character.svelte.ts"
import { loadTiles } from "./map_state.svelte.ts"
import { loadCountries } from "./country_registry.svelte.ts"
import { loadCharacters } from "./character_registry.svelte.ts"
import type { Tile } from "$lib/entities/Tile.svelte.ts"

export const gameState = $state({
	isInitialised: false,
	clock: 0,
	playerControlledByUser: null as Player | null,
	players: {} as Record<string, Player>, // maps player id to player object
	characters: {} as Record<string, Character>,
	tiles: {} as Record<string, Tile>,
	countries: {} as Record<string, Country>,
})

export function initGame(playerCount: number) {
	gameState.players = {}

	for (let i = 0; i < playerCount; i++) {
		const id = `p${i + 1}`
		const name = `Player ${i + 1}`
		const player = createPlayer(id, name)

		if (!gameState.playerControlledByUser) {
			gameState.playerControlledByUser = player
		}
	}

	loadCharacters()
	loadCountries()
	loadTiles()

	const countries = Object.values(gameState.countries)
	const players = Object.values(gameState.players)
	for (let i = 0; i < players.length; i++) {
		if (i >= countries.length) {
			break
		}

		const player = players[i]
		const country = countries[i]

		player.setControlledCountry(country)
	}

	gameState.isInitialised = true
}


function createPlayer(id: string, name: string) {
	const player = new Player(id, name)
	gameState.players[id] = player
	return player
}

export function getPlayer(id: string): Player | null {
	return gameState.players[id] ?? null
}

export function setUserControlledPlayer(id: string) {
	const player = getPlayer(id)
	if (player) {
		gameState.playerControlledByUser = player
	} else {
		gameState.playerControlledByUser = null
	}
}

export function tickGame() {
	gameState.clock++

	Object.values(gameState.tiles).forEach((tile) => {
		tile.tick()
	})
}

export function upgradeTileIndustry(tile: Tile) {
	if (!tile.controller || gameState.playerControlledByUser?.controlledCountry != tile.controller) {
		return
	}

	tile.industry++
	tile.controller.balance -= 100
}