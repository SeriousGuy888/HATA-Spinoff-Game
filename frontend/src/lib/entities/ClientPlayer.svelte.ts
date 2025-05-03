import { ClientCountry } from "./ClientCountry.svelte"

export class ClientPlayer {
	id: string
	name = $state<string>("Unnamed Player")

	controlledCountry = $state<ClientCountry | null>(null)

	constructor(id: string, name: string) {
		this.id = id
		this.name = name
	}

	setControlledCountry(country: ClientCountry | null) {
		this.controlledCountry = country
		if (country) {
			country.controllingPlayer = this
		}
	}

	toString() {
		return `${this.name} (${this.id})`
	}
}
