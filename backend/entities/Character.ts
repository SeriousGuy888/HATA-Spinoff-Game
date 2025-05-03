export class Character {
	id: string
	name: string = "Unnamed Character"
	portraitFrames: string[] = []

	constructor(id: string, name: string, portraitFrames: string[]) {
		this.id = id
		this.name = name
		this.portraitFrames = portraitFrames
	}
}
