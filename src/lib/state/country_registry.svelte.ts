import { Country } from "$lib/entities/Country.svelte"

import _countryData from "$lib/country_data/countries.json"
const COUNTRY_DATA: Record<
	string,
	{
		name: string
		colour: string
		leader: string | null
	}
> = _countryData as any

export const loadedCountries = $state<Record<string, Country>>({})

export function loadCountries() {
	for (const countryId in COUNTRY_DATA) {
		const country = new Country(
			countryId,
			COUNTRY_DATA[countryId].name,
			COUNTRY_DATA[countryId].colour,
			COUNTRY_DATA[countryId].leader,
		)
		loadedCountries[countryId] = country
	}
}

export function getCountry(id: string): Country | null {
	return loadedCountries[id] ?? null
}
