import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app)

// After svelte frontend build, this will serve the static files
// on the same port as the Express server. Doesn't work in dev mode.
try {
	const { handler } = await import("./frontend/build/handler.js")
	app.use(handler)
} catch (e) {
	console.error("No frontend build found:", e.message)
}

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173",
	},
})

io.on("connection", (socket) => {
	console.log("Player connected:", socket.id)

	socket.on("disconnect", () => {
		console.log("Player disconnected:", socket.id)
	})
})

httpServer.listen(3000, () => {
	console.log("HTTP server listening at http://localhost:3000")
})
