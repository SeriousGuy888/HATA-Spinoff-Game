import type { PlayerData } from "#shared/types/entities"
import { getCountry } from "$lib/state/country_registry.svelte"
import { ClientCountry } from "./ClientCountry.svelte"

export class ClientPlayer {
	id: string
	name = $state<string>("Unnamed Player")

	controlledCountry = $state<ClientCountry | null>(null)

	constructor(data: PlayerData) {
		this.id = data.id
		this.name = data.name ?? this.name
		this.controlledCountry = (data.countryId ? getCountry(data.countryId) : null) ?? null
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
