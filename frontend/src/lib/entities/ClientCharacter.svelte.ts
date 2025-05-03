import type { CharacterData } from '#shared/types/entities'
export class ClientCharacter {
	id: string
	name = $state<string>("Unnamed Character")
	portraitFrames = $state<string[]>([])

	constructor(characterData: CharacterData) {
		this.id = characterData.id
		this.name = characterData.name
		this.portraitFrames = characterData.portraitFrames
	}
}
