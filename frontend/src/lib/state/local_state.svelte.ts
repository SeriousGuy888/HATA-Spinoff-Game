import { ClientPlayer } from "$lib/entities/ClientPlayer.svelte.ts"
import type { ClientCountry } from "$lib/entities/ClientCountry.svelte.ts"
import type { ClientCharacter } from "$lib/entities/ClientCharacter.svelte.ts"
import { loadTiles } from "./map_state.svelte.ts"
import { loadCountries } from "./country_registry.svelte.ts"
import { loadCharacters } from "./character_registry.svelte.ts"
import type { ClientTile } from "$lib/entities/ClientTile.svelte.ts"

export const localState = $state({
	isInitialised: false,
	clock: 0,
	perspectivePlayer: null as ClientPlayer | null, // player whose perspective is rendered and checked for game actions
	players: {} as Record<string, ClientPlayer>, // maps player id to player object
	characters: {} as Record<string, ClientCharacter>,
	tiles: {} as Record<string, ClientTile>,
	countries: {} as Record<string, ClientCountry>,
})

export function initGame(playerCount: number) {
	localState.players = {}

	loadCharacters()
	loadCountries()
	loadTiles()

	const countries = Object.values(localState.countries)
	const players = Object.values(localState.players)
	for (let i = 0; i < players.length; i++) {
		if (i >= countries.length) {
			break
		}

		const player = players[i]
		const country = countries[i]

		player.setControlledCountry(country)
	}

	localState.isInitialised = true
}

export function getPlayer(id: string): ClientPlayer | null {
	return localState.players[id] ?? null
}

export function setPerspectivePlayer(id: string) {
	const player = getPlayer(id)
	if (player) {
		localState.perspectivePlayer = player
	} else {
		localState.perspectivePlayer = null
	}
}
