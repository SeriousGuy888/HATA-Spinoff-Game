import type { ResourceMap } from "./resources"
import type { TileTerrain } from "./tile_data_types"

export type GameData = {
	isInitialised: boolean
	clock: number
	players: Record<string, PlayerData>
	characters: Record<string, CharacterData>
	tiles: Record<string, TileData>
	countries: Record<string, CountryData>
}

export type PlayerData = {
	id: string
	name: string
	countryId: string | null
}

export type CharacterData = {
	id: string
	name: string
	portraitFrames: string[]
}

export type TileData = {
	id: string
	name: string
	terrain: TileTerrain
	controllerId: string | null // id of the country that controls this tile
	population: number
	industry: number
}

export type CountryData = {
	id: string
	colour: string
	banner: string
	name: string
	leaderId: string | null // id of the character that is the leader of this country
	controllingPlayerId: string | null // id of the player that controls this country
	resources: ResourceMap
}
