import { ClientCharacter } from "$lib/entities/ClientCharacter.svelte"
import { localState } from "./local_state.svelte"

export function getCharacter(id: string): ClientCharacter | null {
	if (!localState.game) {
		return null
	}
	return localState.game.characters[id] ?? null
}
