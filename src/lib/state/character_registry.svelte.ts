import { Character } from "$lib/entities/Character.svelte"

import _characterData from "$lib/data/characters.json"
const CHARACTER_DATA: Record<
	string,
	{
		name: string
		portrait_frames: string[]
	}
> = _characterData as any

export const loadedCharacters = $state<Record<string, Character>>({})

export function loadCharacters() {
	for (const characterId in CHARACTER_DATA) {
		const char = new Character(
			characterId,
			CHARACTER_DATA[characterId].name,
			CHARACTER_DATA[characterId].portrait_frames,
		)

		loadedCharacters[characterId] = char
	}
}

export function getCharacter(id: string): Character | null {
	return loadedCharacters[id] ?? null
}
