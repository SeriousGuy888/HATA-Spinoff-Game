import { CharacterData } from "#shared/types/entities.ts"

export class Character {
	id: string
	name: string = "Unnamed Character"
	portraitFrames: string[] = []

	constructor(id: string, name: string, portraitFrames: string[]) {
		this.id = id
		this.name = name
		this.portraitFrames = portraitFrames
	}

	toJson(): CharacterData {
		return {
			id: this.id,
			name: this.name,
			portraitFrames: this.portraitFrames,
		}
	}
}
