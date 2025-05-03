import { ClientCountry } from "$lib/entities/ClientCountry.svelte"
import { localState } from "./local_state.svelte"

export function getCountry(id: string): ClientCountry | null {
	if (!localState.game) {
		return null
	}
	
	return localState.game.countries[id] ?? null
}
