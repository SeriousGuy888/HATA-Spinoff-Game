import { Socket } from "socket.io"
import { Country } from "./Country"
import { PlayerData } from "#shared/types/entities.ts"
import Game from "./Game"

export class Player {
	game: Game
	socket: Socket
	id: string
	name: string = "Unnamed Player"

	controlledCountry: Country | null = null

	constructor(game: Game, socket: Socket, id: string, name: string) {
		this.game = game
		this.socket = socket
		this.id = id
		this.name = name
	}

	setControlledCountry(newCountry: Country | null) {
		const oldCountry = this.controlledCountry
		this.controlledCountry = newCountry
		if (oldCountry) {
			oldCountry.controllingPlayer = null
		}
		if (newCountry) {
			newCountry.controllingPlayer = this
		}
		this.game.announcer.playerSwitchedCountries(this, oldCountry, newCountry)
	}

	toString() {
		return `${this.name} (${this.id})`
	}

	toJson(): PlayerData {
		return {
			id: this.id,
			name: this.name,
			countryId: this.controlledCountry?.id ?? null,
		}
	}
}
