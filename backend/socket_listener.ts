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

		const player = game.addPlayer(socket, "Player " + socket.id)
		game.announcer.youAre(player)
		game.announcer.sendFullGameState(player)

		socket.on("disconnect", () => {
			console.log("Player disconnected:", socket.id)
		})
	})
}
