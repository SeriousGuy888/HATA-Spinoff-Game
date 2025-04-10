import { Country } from "$lib/Country.svelte"

import _countryData from "$lib/country_data/countries.json"
const COUNTRY_DATA: Record<string, ExportedCountryData> = _countryData as any

interface ExportedCountryData {
	name: string,
	colour: string,
}

export const loadedCountries = $state<Record<string, Country>>({})

export function loadCountries() {
	for (const countryId in COUNTRY_DATA) {
		const country = new Country(countryId, COUNTRY_DATA[countryId].name, COUNTRY_DATA[countryId].colour)
		loadedCountries[countryId] = country
	}
}

export function getCountry(id: string): Country | null {
	return loadedCountries[id] ?? null
}