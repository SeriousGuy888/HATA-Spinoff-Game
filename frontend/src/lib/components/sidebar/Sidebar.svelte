<script lang="ts">
	import PlayerList from "./PlayerList.svelte"
	import TileMenu from "./TileMenu.svelte"
	import TileEditorMenu from "./TileEditorMenu.svelte"
	import CountryMenu from "./CountryMenu.svelte"
	import MapPainterMenu from "./MapPainterMenu.svelte"
</script>

<div class="flex flex-col gap-4">
	<MapPainterMenu />
	<CountryMenu />
	<TileMenu />
	<PlayerList />
	<TileEditorMenu />
</div>
