import { GameCanvas } from "$lib/components/map_rendering/game_canvas"
import { worldSpaceToCanvasSpace } from "../util/coordinates.svelte"
import { localState } from "./local_state.svelte"

const MIN_ZOOM = 1 / 16
const MAX_ZOOM = 16
const ZOOM_STEP_FACTOR = 9 / 8

export const canvasState = $state({
	canvas: null as HTMLCanvasElement | null,
	gameCanvas: null as GameCanvas | null,
	offsetX: 0, // where the camera has been panned to
	offsetY: 0,
	zoom: 1, // zoom level of the camera
	millisecondsElapsedForPreviousFrame: 0,
})

export const mouseState = $state({
	isDragging: false,
	lastDragPosition: [0, 0],
})

let selectedTileCoords = $state<[number, number] | null>(null)

export function deselectTile() {
	selectedTileCoords = null
}

export function selectTile(p: number, q: number) {
	selectedTileCoords = [p, q]
}

export function getSelectedTileCoords(): [number, number] | null {
	return selectedTileCoords
}

export function getSelectedTile() {
	if (!selectedTileCoords) {
		return null
	}

	if (!localState.game) {
		return null
	}

	return localState.game.getTile(...selectedTileCoords)
}

/**
 * @param direction Zoom in or zoom out?
 * @param centerX Screenspace x coordinate around which zooming should occur.
 * @param centerY Screenspace y coordinate around which zooming should occur.
 */
export function changeZoom(direction: "in" | "out", centerX: number, centerY: number) {
	const oldZoom = canvasState.zoom

	if (direction == "in") {
		canvasState.zoom = Math.min(canvasState.zoom * ZOOM_STEP_FACTOR, MAX_ZOOM)
	} else if (direction == "out") {
		canvasState.zoom = Math.max(canvasState.zoom / ZOOM_STEP_FACTOR, MIN_ZOOM)
	}

	// Adjust offset to make sure that the zooming is happening around the cursor location.
	canvasState.offsetX =
		canvasState.zoom *
		(canvasState.offsetX / oldZoom + centerX / oldZoom - centerX / canvasState.zoom)
	canvasState.offsetY =
		canvasState.zoom *
		(canvasState.offsetY / oldZoom + centerY / oldZoom - centerY / canvasState.zoom)
}

/**
 * Center the camera on a given worldspace coordinate.
 */
export function teleportToWorldSpace(
	worldX: number,
	worldY: number,
	screenWidth: number,
	screenHeight: number,
) {
	const [screenX, screenY] = worldSpaceToCanvasSpace(worldX, worldY)
	canvasState.offsetX = screenX - screenWidth / 2
	canvasState.offsetY = screenY - screenHeight / 2
}
