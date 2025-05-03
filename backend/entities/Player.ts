import { Socket } from "socket.io"
import { Country } from "./Country"
import { PlayerData } from "#shared/types/entity_types.ts"

export class Player {
	socket: Socket
	id: string
	name: string = "Unnamed Player"

	controlledCountry: Country | null = null

	constructor(socket: Socket, id: string, name: string) {
		this.socket = socket
		this.id = id
		this.name = name
	}

	setControlledCountry(country: Country | null) {
		this.controlledCountry = country
		if (country) {
			country.controllingPlayer = this
		}
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
