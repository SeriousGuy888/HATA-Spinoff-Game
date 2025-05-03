import type { ClientCharacter } from "./ClientCharacter.svelte"
import type { ClientCountry } from "./ClientCountry.svelte"
import type { ClientPlayer } from "./ClientPlayer.svelte"
import type { ClientTile } from "./ClientTile.svelte"

export default class ClientGame {
	isInitialised: boolean = $state(false)
	clock: number = $state(0)
	players: Record<string, ClientPlayer> = $state({})
	characters: Record<string, ClientCharacter> = $state({})
	tiles: Record<string, ClientTile> = $state({})
	countries: Record<string, ClientCountry> = $state({})
}
