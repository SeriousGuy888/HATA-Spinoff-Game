export interface TickPayload {
	currClockTime: number
}


export interface PlayerSwitchedCountriesPayload {
	playerId: string
	oldCountryId: string | null
	newCountryId: string | null
}
