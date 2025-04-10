import { Player, POSSIBLE_PLAYER_COLOURS } from "./Player.ts"

export const gameState = $state({
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
}

function createPlayer(id: string, name: string, colour: string) {
	const player = new Player(id, name, colour)
	gameState.players[id] = player
	return player
}
