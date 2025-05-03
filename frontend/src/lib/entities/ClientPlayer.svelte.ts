import type { PlayerData } from "#shared/types/entities"
import { ClientCountry } from "./ClientCountry.svelte"
import type ClientGame from "./ClientGame.svelte"

export class ClientPlayer {
	id: string
	name = $state<string>("Unnamed Player")

	controlledCountry = $state<ClientCountry | null>(null)

	constructor(game: ClientGame, data: PlayerData) {
		this.id = data.id
		this.name = data.name ?? this.name
		this.controlledCountry = game.getCountry(data.countryId) ?? null
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
