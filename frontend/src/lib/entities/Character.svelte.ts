export class Character {
	id: string
	name = $state<string>("Unnamed Character")
	portraitFrames = $state<string[]>([])

	constructor(id: string, name: string, portraitFrames: string[]) {
		this.id = id
		this.name = name
		this.portraitFrames = portraitFrames
	}
}
