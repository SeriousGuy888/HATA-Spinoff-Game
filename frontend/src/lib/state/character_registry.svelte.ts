import { Character } from "$lib/entities/Character.svelte"

import _characterData from "#shared/data/characters.json"
import { gameState } from "./game_state.svelte"
const CHARACTER_DATA: Record<
	string,
	{
		name: string
		portrait_frames: string[]
	}
> = _characterData as any

export function loadCharacters() {
	for (const characterId in CHARACTER_DATA) {
		const char = new Character(
			characterId,
			CHARACTER_DATA[characterId].name,
			CHARACTER_DATA[characterId].portrait_frames,
		)

		gameState.characters[characterId] = char
	}
}

export function getCharacter(id: string): Character | null {
	return gameState.characters[id] ?? null
}
