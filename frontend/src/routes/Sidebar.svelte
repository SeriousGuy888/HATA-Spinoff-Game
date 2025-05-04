<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import TileMenu from "./TileMenu.svelte"
	import MapEditorMenu from "./MapEditorMenu.svelte"
	import CountryMenu from "./CountryMenu.svelte"
</script>

<div class="flex flex-col gap-4">

	<CountryMenu />
	<TileMenu />
	<PlayerList />
	<MapEditorMenu />
</div>
