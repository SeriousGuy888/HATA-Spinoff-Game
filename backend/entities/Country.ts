import { Character } from "./Character"
import Game from "./Game"
import { Player } from "./Player"

export class Country {
	game: Game
	id: string
	colour: string = "#333333"
	banner: string = "default"
	name: string = "Unnamed Country"
	leader: Character | null = null
	balance: number = 0

	controllingPlayer: Player | null = null

	constructor(
		game: Game,
		id: string,
		name: string,
		colour: string,
		banner: string | null,
		leaderId: string | null,
	) {
		this.id = id
		this.name = name
		this.colour = colour

		if (banner) {
			this.banner = banner
		}

		if (leaderId) {
			this.leader = game.getCharacter(leaderId)
		}
	}

	toString() {
		return this.name + " (" + this.id + ")"
	}
}
