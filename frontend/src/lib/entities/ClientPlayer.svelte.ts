import type { PlayerData } from "#shared/types/entities"
import { ClientCountry } from "./ClientCountry.svelte"
import type ClientGame from "./ClientGame.svelte"

export class ClientPlayer {
	id: string
	name = $state<string>("Unnamed Player")
	controlledCountry = $state<ClientCountry | null>(null)

	game: ClientGame
	/**
	 * Indicates whether some attributes of this object might be missing
	 * because some attributes, which depend on other game entities,
	 * might not be initialised until `resolve()` is called.
	 */
	partial: boolean

	constructor(game: ClientGame, data: PlayerData) {
		this.game = game
		this.partial = true

		this.id = data.id
		this.name = data.name ?? this.name
		this.controlledCountry = null
	}

	/**
	 * Run the second round of initialisations on this player, this time resolving
	 * properties like `countrolledCountry`, because the game has now had a chance
	 * to initialise the country objects.
	 */
	resolve(data: PlayerData) {
		this.controlledCountry = this.game.getCountry(data.countryId)
		this.partial = false
	}

	setControlledCountry(country: ClientCountry | null) {
		this.controlledCountry = country
		if (country) {
			country.controllingPlayer = this
		}
	}

	toString() {
		return this.name
	}
}
