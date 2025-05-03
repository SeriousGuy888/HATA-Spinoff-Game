import { ClientboundPacket } from "#shared/protocol/packet_names"
import type { PlayerData, GameData } from "#shared/types/entities"
import { io, Socket } from "socket.io-client"

export const socket: Socket = io("http://localhost:3000")

socket.on("connect", () => {
	console.log("Connected to server")
})

socket.on(ClientboundPacket.YOU_ARE, (pData: PlayerData) => {
	console.log("You are", pData)
})

socket.on(ClientboundPacket.FULL_GAME_STATE, (gameData: GameData) => {
	console.log("Full game state", gameData)
	// console.log(JSON.stringify(gameData, null, 2))
})
