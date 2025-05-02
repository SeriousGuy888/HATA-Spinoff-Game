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
	perspectivePlayer: null as Player | null, // player whose perspective is rendered and checked for game actions
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

		if (!gameState.perspectivePlayer) {
			gameState.perspectivePlayer = player
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

export function setPerspectivePlayer(id: string) {
	const player = getPlayer(id)
	if (player) {
		gameState.perspectivePlayer = player
	} else {
		gameState.perspectivePlayer = null
	}
}

export function tickGame() {
	gameState.clock++

	Object.values(gameState.tiles).forEach((tile) => {
		tile.tick()
	})
}

export function upgradeTileIndustry(tile: Tile) {
	if (!tile.controller || gameState.perspectivePlayer?.controlledCountry != tile.controller) {
		return
	}

	tile.industry++
	tile.controller.balance -= 100
}
