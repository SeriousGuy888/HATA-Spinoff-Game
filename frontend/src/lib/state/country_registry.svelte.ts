import { Country } from "$lib/entities/Country.svelte"

import _countryData from "$lib/data/countries.json"
import { gameState } from "./game_state.svelte"
const COUNTRY_DATA: Record<
	string,
	{
		name: string
		colour: string
		banner: string | null
		leader: string | null
	}
> = _countryData as any

export function loadCountries() {
	for (const countryId in COUNTRY_DATA) {
		const country = new Country(
			countryId,
			COUNTRY_DATA[countryId].name,
			COUNTRY_DATA[countryId].colour,
			COUNTRY_DATA[countryId].banner ?? null,
			COUNTRY_DATA[countryId].leader,
		)
		gameState.countries[countryId] = country
	}
}

export function getCountry(id: string): Country | null {
	return gameState.countries[id] ?? null
}
