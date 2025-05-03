import { ClientPlayer } from "$lib/entities/ClientPlayer.svelte.ts"
import ClientGame from "$lib/entities/ClientGame.svelte.ts"
import type { GameData } from "#shared/types/entities.ts"

export const localState = $state({
	game: null as ClientGame | null,
	perspectivePlayer: null as ClientPlayer | null, // player whose perspective is rendered and checked for game actions
})

export function initGame(gameData: GameData) {
	localState.game = new ClientGame(gameData)
}

export function getPlayer(id: string): ClientPlayer | null {
	return localState.game?.players[id] ?? null
}

export function setPerspectivePlayer(id: string) {
	const player = getPlayer(id)
	if (player) {
		localState.perspectivePlayer = player
	} else {
		localState.perspectivePlayer = null
	}
}
