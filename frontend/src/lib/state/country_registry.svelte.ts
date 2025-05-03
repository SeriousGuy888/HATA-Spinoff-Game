import { ClientCountry } from "$lib/entities/ClientCountry.svelte"

import _countryData from "#shared/data/countries.json"
import { localState } from "./local_state.svelte"
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
		const country = new ClientCountry(
			countryId,
			COUNTRY_DATA[countryId].name,
			COUNTRY_DATA[countryId].colour,
			COUNTRY_DATA[countryId].banner ?? null,
			COUNTRY_DATA[countryId].leader,
		)
		localState.countries[countryId] = country
	}
}

export function getCountry(id: string): ClientCountry | null {
	return localState.countries[id] ?? null
}
