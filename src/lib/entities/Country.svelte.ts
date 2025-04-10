export class Country {
	id: string
	name = $state<string>("Unnamed Country")
	colour: string = "#333333"

	constructor(id: string, name: string, colour: string) {
		this.id = id
		this.name = name
		this.colour = colour
	}
}
