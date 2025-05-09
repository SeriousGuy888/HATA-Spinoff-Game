import { Server } from "socket.io"
import Game from "./entities/Game.ts"

let game: Game

export function startSocketListener(io: Server) {
	// Initialise the game
	game = new Game(io)
	game.init()

	// Listen for incoming connections from clients
	io.on("connection", (socket) => {
		console.log("Player connected:", socket.id)

		game.addPlayer(socket, "Player " + socket.id.substring(0, 5))

		socket.on("disconnect", () => {
			if (game.removePlayer(socket.id)) {
				console.log("Player disconnected:", socket.id, "and removed from game")
			} else {
				console.log("Player disconnected:", socket.id)
			}
		})
	})
}
