import { Server } from "socket.io"

export function startSocketListener(io: Server) {
	io.on("connection", (socket) => {
		console.log("Player connected:", socket.id)

		socket.on("disconnect", () => {
			console.log("Player disconnected:", socket.id)
		})
	})
}
