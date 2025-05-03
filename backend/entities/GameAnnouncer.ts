import { Server } from "socket.io"
import Game from "./Game"
import { Player } from "./Player"
import { ClientboundPacket } from "#shared/protocol/packet_names.ts"

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

	sendFullGameState(player: Player) {
		const gameData = this.game.toJson()
		player.socket.emit(ClientboundPacket.FULL_GAME_STATE, gameData)
	}
}
