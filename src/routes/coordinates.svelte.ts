import { MAP_WORLD_ORIGIN_OFFSET } from "./map_config.ts"

const MIN_ZOOM = 1 / 16
const MAX_ZOOM = 16
const ZOOM_STEP_FACTOR = 9 / 8

export const cameraState = $state({
	clientLeft: 0, // where the camera element is in the viewport window
	clientTop: 0,
	clientWidth: 0, // size of the camera element in the viewport window
	clientHeight: 0,
	offsetX: 0, // where the camera has been panned to
	offsetY: 0,
	zoom: 1, // zoom level of the camera
})

/**
 * @param direction Zoom in or zoom out?
 * @param centerX Screenspace x coordinate around which zooming should occur.
 * @param centerY Screenspace y coordinate around which zooming should occur.
 */
export function changeZoom(direction: "in" | "out", centerX: number, centerY: number) {
	const oldZoom = cameraState.zoom

	if (direction == "in") {
		cameraState.zoom = Math.min(cameraState.zoom * ZOOM_STEP_FACTOR, MAX_ZOOM)
	} else if (direction == "out") {
		cameraState.zoom = Math.max(cameraState.zoom / ZOOM_STEP_FACTOR, MIN_ZOOM)
	}

	// Adjust offset to make sure that the zooming is happening around the cursor location.
	cameraState.offsetX =
		cameraState.zoom *
		(cameraState.offsetX / oldZoom + centerX / oldZoom - centerX / cameraState.zoom)
	cameraState.offsetY =
		cameraState.zoom *
		(cameraState.offsetY / oldZoom + centerY / oldZoom - centerY / cameraState.zoom)
}

/**
 * Center the camera on a given worldspace coordinate.
 */
export function teleportToWorldSpace(worldX: number, worldY: number, screenWidth: number, screenHeight: number) {
	const [screenX, screenY] = worldSpaceToScreenSpace(worldX, worldY)
	cameraState.offsetX = screenX - screenWidth / 2
	cameraState.offsetY = screenY - screenHeight / 2
}

/**
 * Convert from "clientspace coordinates" (coordinates relative to viewport window)
 * to "screenspace coordinates" (coordinates relative to the map camera window).
 */
export function clientStateToScreenSpace(clientX: number, clientY: number): [number, number] {
	return [clientX - cameraState.clientLeft, clientY - cameraState.clientTop]
}

/**
 * Convert from screenspace coordinates (coordinates relative to the map camera window)
 * to worldspace coordinates (coordinates relative to the map world origin).
 */
export function screenSpaceToWorldSpace(screenX: number, screenY: number): [number, number] {
	return [screenX - MAP_WORLD_ORIGIN_OFFSET[0], screenY - MAP_WORLD_ORIGIN_OFFSET[1]]
}


export function worldSpaceToScreenSpace(worldX: number, worldY: number): [number, number] {
	return [worldX + MAP_WORLD_ORIGIN_OFFSET[0], worldY + MAP_WORLD_ORIGIN_OFFSET[1]]
}

export function worldSpaceToImageSpace(worldX: number, worldY: number): [number, number] {
	return [worldX + MAP_WORLD_ORIGIN_OFFSET[0], worldY + MAP_WORLD_ORIGIN_OFFSET[1]]
}
