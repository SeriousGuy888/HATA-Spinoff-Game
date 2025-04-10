import { loadTiles } from "./map_state.svelte.ts"
import { Player, POSSIBLE_PLAYER_COLOURS } from "$lib/entities/Player.ts"
import { loadCountries } from "./country_registry.svelte.ts"
import { loadCharacters } from "./character_registry.svelte.ts"

export const gameState = $state({
	isInitialised: false,
	players: {} as Record<string, Player>, // maps player id to player object
})

export function initGame(playerCount: number) {
	gameState.players = {}

	for (let i = 0; i < playerCount; i++) {
		const id = `player${i}`
		const name = `Player ${i + 1}`
		const colour = POSSIBLE_PLAYER_COLOURS[i % POSSIBLE_PLAYER_COLOURS.length]
		createPlayer(id, name, colour)
	}

	loadCharacters()
	loadCountries()
	loadTiles()

	gameState.isInitialised = true
}

function createPlayer(id: string, name: string, colour: string) {
	const player = new Player(id, name, colour)
	gameState.players[id] = player
	return player
}

export function getPlayer(id: string): Player | null {
	return gameState.players[id] ?? null
}
