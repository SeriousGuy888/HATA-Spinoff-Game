import { ClientCharacter } from "$lib/entities/ClientCharacter.svelte"

import _characterData from "#shared/data/characters.json"
import { localState } from "./local_state.svelte"
const CHARACTER_DATA: Record<
	string,
	{
		name: string
		portrait_frames: string[]
	}
> = _characterData as any

export function loadCharacters() {
	for (const characterId in CHARACTER_DATA) {
		const char = new ClientCharacter(
			characterId,
			CHARACTER_DATA[characterId].name,
			CHARACTER_DATA[characterId].portrait_frames,
		)

		localState.characters[characterId] = char
	}
}

export function getCharacter(id: string): ClientCharacter | null {
	return localState.characters[id] ?? null
}
