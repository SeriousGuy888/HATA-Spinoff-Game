import { getCharacter } from "../../routes/state/character_registry.svelte"
import { Character } from "./Character.svelte"
import type { Player } from "./Player.svelte"

export class Country {
	id: string
	colour: string = "#333333"
	name = $state<string>("Unnamed Country")
	leader = $state<Character | null>(null)
	balance = $state<number>(0)

	controllingPlayer = $state<Player | null>(null)

	constructor(id: string, name: string, colour: string, leaderId: string | null) {
		this.id = id
		this.name = name
		this.colour = colour

		if (leaderId) {
			this.leader = getCharacter(leaderId)
		}
	}

	toString() {
		return this.name + " (" + this.id + ")"
	}
}
