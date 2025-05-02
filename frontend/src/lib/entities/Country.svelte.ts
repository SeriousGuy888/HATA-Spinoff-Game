import { getCharacter } from "../state/character_registry.svelte"
import { Character } from "./Character.svelte"
import type { Player } from "./Player.svelte"

export class Country {
	id: string
	colour: string = "#333333"
	banner: string = "default"
	name = $state<string>("Unnamed Country")
	leader = $state<Character | null>(null)
	balance = $state<number>(0)

	controllingPlayer = $state<Player | null>(null)

	constructor(id: string, name: string, colour: string, banner: string | null, leaderId: string | null) {
		this.id = id
		this.name = name
		this.colour = colour

		if (banner) {
			this.banner = banner
		}

		if (leaderId) {
			this.leader = getCharacter(leaderId)
		}
	}

	toString() {
		return this.name + " (" + this.id + ")"
	}
}
