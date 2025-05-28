import { worldSpaceToCanvasSpace } from "./coordinates.svelte"
import { localState } from "./local_state.svelte"

const MIN_ZOOM = 1 / 16
const MAX_ZOOM = 16
const ZOOM_STEP_FACTOR = 9 / 8

export const canvasState = $state({
	canvas: null as HTMLCanvasElement | null,
	offsetX: 0, // where the camera has been panned to
	offsetY: 0,
	zoom: 1, // zoom level of the camera
})

export const mouseState = $state({
	isDragging: false,
	lastDragPosition: [0, 0],
})

export const tileSelectionState = $state({
	selectedTileId: null as string | null, // legacy
	selectedHex: null as [number, number] | null, // new
})

export function getSelectedTile() {
	if (!tileSelectionState.selectedTileId) {
		return null
	}

	if (!localState.game) {
		return null
	}

	return localState.game.tiles[tileSelectionState.selectedTileId] ?? null
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
