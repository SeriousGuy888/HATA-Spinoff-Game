import { ClientboundPacket } from "#shared/protocol/packet_names"
import type { GameData, PlayerData } from "#shared/types/entities"
import { io, Socket } from "socket.io-client"
import { initGame, localState, setPerspectivePlayer } from "./state/local_state.svelte"
import { ClientPlayer } from "./entities/ClientPlayer.svelte"

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

	initGame(gameData)
})

socket.on(ClientboundPacket.PLAYER_JOINED, (pData: PlayerData) => {
	if (!localState.game) {
		return
	}
	localState.game.players[pData.id] = new ClientPlayer(localState.game, pData)
})

socket.on(ClientboundPacket.PLAYER_LEFT, (playerId: string) => {
	if (!localState.game) {
		return
	}
	delete localState.game.players[playerId]
})
