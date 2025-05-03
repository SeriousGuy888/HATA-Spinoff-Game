import { ClientPlayer } from "$lib/entities/ClientPlayer.svelte.ts"
import type { ClientCountry } from "$lib/entities/ClientCountry.svelte.ts"
import type { ClientCharacter } from "$lib/entities/ClientCharacter.svelte.ts"
import { loadCountries } from "./country_registry.svelte.ts"
import { loadCharacters } from "./character_registry.svelte.ts"
import ClientGame from "$lib/entities/ClientGame.svelte.ts"
import type { GameData } from "#shared/types/entities.ts"

export const localState = $state({
	game: null as ClientGame | null,
	perspectivePlayer: null as ClientPlayer | null, // player whose perspective is rendered and checked for game actions
	characters: {} as Record<string, ClientCharacter>,
	countries: {} as Record<string, ClientCountry>,
})

export function initGame(gameData: GameData) {
	localState.game = new ClientGame(gameData)

	loadCharacters()
	loadCountries()

	const countries = Object.values(localState.countries)
	const players = Object.values(localState.game.players)
	for (let i = 0; i < players.length; i++) {
		if (i >= countries.length) {
			break
		}

		const player = players[i]
		const country = countries[i]

		player.setControlledCountry(country)
	}
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
