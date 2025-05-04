import type {
	PlayerSwitchedCountriesPayload,
	TickPayload,
} from "#shared/protocol/packet_payloads.ts"
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

socket.on(ClientboundPacket.TICK, (tickData: TickPayload) => {
	if (!localState.game) {
		console.error("Received game tick while client has no active game")
		return
	}

	const oldClockTime = localState.game.clock
	const newClockTime = tickData.currClockTime
	if (newClockTime != oldClockTime + 1) {
		console.error(
			`Expected new clock time to be one tick after old clock time, but received new=${newClockTime}; old=${oldClockTime}.`,
		)
	}

	localState.game.clock = newClockTime
	console.debug("tick", newClockTime, "// last received tick:", oldClockTime)
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

socket.on(
	ClientboundPacket.PLAYER_SWITCHED_COUNTRIES,
	(payload: PlayerSwitchedCountriesPayload) => {
		if (!localState.game) {
			return
		}

		const { playerId, oldCountryId, newCountryId } = payload
		const player = localState.game.getPlayer(playerId)
		const oldCountry = localState.game.getCountry(oldCountryId)
		const newCountry = localState.game.getCountry(newCountryId)
		if (!player) {
			console.error(`Server sent PLAYER_SWITCHED_COUNTRIES for unknown player id ${playerId}`)
			return
		}
		player.controlledCountry = newCountry
		if (oldCountry) {
			oldCountry.controllingPlayer = null
		}
		if (newCountry) {
			newCountry.controllingPlayer = player
		}

		console.log(`'${player}' is now controlling '${newCountry}'.`)
	},
)
