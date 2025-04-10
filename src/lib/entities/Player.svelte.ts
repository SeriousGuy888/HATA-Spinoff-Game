export const POSSIBLE_PLAYER_COLOURS = ["#4f1868", "#001382", "#b7612f", "#80e031"]

export class Player {
	id: string
	colour: string
	name = $state<string>("Unnamed Player")

	constructor(id: string, name: string, colour: string) {
		this.id = id
		this.name = name
		this.colour = colour
	}

	toString() {
		return `${this.name} (${this.id})`
	}
}
