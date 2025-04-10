import { Country } from "./Country.svelte"

export class Player {
	id: string
	name = $state<string>("Unnamed Player")

	controlledCountry = $state<Country | null>(null)

	constructor(id: string, name: string) {
		this.id = id
		this.name = name
	}

	toString() {
		return `${this.name} (${this.id})`
	}
}
