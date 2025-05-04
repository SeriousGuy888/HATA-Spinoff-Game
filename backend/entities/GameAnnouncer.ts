import { Server } from "socket.io"
import Game from "./Game"
import { Player } from "./Player"
import { ClientboundPacket } from "#shared/protocol/packet_names.ts"
import { Country } from "./Country"
import { PlayerSwitchedCountriesPayload, TickPayload } from "#shared/protocol/packet_payloads.ts"

/**
 * GameAnnouncer handles broadcasting game events to all connected
 * clients, keeping all clients up to date, via Socket.IO.
 */
export default class GameAnnouncer {
	private io: Server
	private game: Game

	constructor(io: Server, game: Game) {
		this.io = io
		this.game = game
	}

	/**
	 * Send a player the id of the player they are controlling.
	 * This is for the client to know whose perspective to display.
	 * @param player The player to send the event to.
	 */
	youAre(player: Player) {
		player.socket.emit(ClientboundPacket.YOU_ARE, player.id)
	}

	/**
	 * Send to this player a copy of the entire up to date game state.
	 * @param player The player to send it to.
	 */
	sendFullGameState(player: Player) {
		const gameData = this.game.toJson()
		player.socket.emit(ClientboundPacket.FULL_GAME_STATE, gameData)
	}

	tick(currClockTime: number) {
		const payload: TickPayload = { currClockTime }
		this.io.emit(ClientboundPacket.TICK, payload)
	}

	/**
	 * Announce to all players except the player that joined,
	 * that a new player has joined.
	 * @param player The player that joined.
	 */
	announcePlayerJoined(player: Player) {
		player.socket.broadcast.emit(ClientboundPacket.PLAYER_JOINED, player.toJson())
	}

	/**
	 * Announce to all other players that a player has left the game.
	 * @param player The player that left.
	 */
	announcePlayerLeft(player: Player) {
		player.socket.broadcast.emit(ClientboundPacket.PLAYER_LEFT, player.id)
	}

	playerSwitchedCountries(player: Player, oldCountry: Country | null, newCountry: Country | null) {
		const payload: PlayerSwitchedCountriesPayload = {
			playerId: player.id,
			oldCountryId: oldCountry?.id ?? null,
			newCountryId: newCountry?.id ?? null,
		}
		this.io.emit(ClientboundPacket.PLAYER_SWITCHED_COUNTRIES, payload)
	}
}
