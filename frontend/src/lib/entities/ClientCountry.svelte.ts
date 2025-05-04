import type { CountryData } from "#shared/types/entities"
import type { ResourceMap } from "#shared/types/resources"
import { ClientCharacter } from "./ClientCharacter.svelte"
import type ClientGame from "./ClientGame.svelte"
import type { ClientPlayer } from "./ClientPlayer.svelte"

export class ClientCountry {
	id: string
	colour: string = "#333333"
	banner: string = "default"
	name = $state<string>("Unnamed Country")
	leader = $state<ClientCharacter | null>(null)
	controllingPlayer = $state<ClientPlayer | null>(null)
	resources = $state<ResourceMap>()

	constructor(game: ClientGame, data: CountryData) {
		const { id, name, colour, banner, leaderId, resources } = data

		this.id = id
		this.name = name
		this.colour = colour

		if (banner) {
			this.banner = banner
		}

		if (leaderId) {
			this.leader = game.getCharacter(leaderId)
		}

		this.resources = resources
	}

	toString() {
		return this.name + " (" + this.id + ")"
	}
}
