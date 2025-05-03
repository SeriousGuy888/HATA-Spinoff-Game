import { ClientboundPacket } from "#shared/protocol/packet_names"
import type { GameData } from "#shared/types/entities"
import { io, Socket } from "socket.io-client"
import { initGame, setPerspectivePlayer } from "./state/local_state.svelte"

export const socket: Socket = io("http://localhost:3000")

socket.on("connect", () => {
	console.log("Connected to server")
})

socket.on(ClientboundPacket.YOU_ARE, (playerId: string) => {
	console.log("You are", playerId)
	setPerspectivePlayer(playerId)
})

socket.on(ClientboundPacket.FULL_GAME_STATE, (gameData: GameData) => {
	console.log("Full game state", gameData)
	console.log("game state data size:", JSON.stringify(gameData).length)

	// runs twice because if we only run it once, svelte doesn't properly render tile controllers
	// i don't know why. todo: fix
	initGame(gameData)
	initGame(gameData)
})
