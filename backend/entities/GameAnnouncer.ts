import { Server } from "socket.io"
import Game from "./Game"
import { Player } from "./Player"
import { EventName } from "#shared/protocol/events.ts"

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
	 * Send a player their own player data.
	 * @param player The player to send the event to.
	 */
	youAre(player: Player) {
		player.socket.emit(EventName.YOU_ARE, player.toJson())
	}
}
