import { loadTiles } from "./map_state.svelte.ts"
import { Player } from "$lib/entities/Player.svelte.ts"
import { loadCountries, loadedCountries } from "./country_registry.svelte.ts"
import { loadCharacters } from "./character_registry.svelte.ts"

export const gameState = $state({
	isInitialised: false,
	players: {} as Record<string, Player>, // maps player id to player object
	playerControlledByUser: null as Player | null,
	clock: 0,
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

	const countries = Object.values(loadedCountries)
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
}
