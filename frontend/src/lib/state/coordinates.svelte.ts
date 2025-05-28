import { cameraState } from "$lib/state/ui_state.svelte.ts"

/**
 * Convert from "clientspace coordinates" (coordinates relative to viewport window)
 * to "screenspace coordinates" (coordinates relative to the map camera window).
 */
export function clientSpaceToScreenSpace(clientX: number, clientY: number): [number, number] {
	return [clientX - cameraState.clientLeft, clientY - cameraState.clientTop]
}

/**
 * Convert from screenspace coordinates (coordinates relative to the map camera window)
 * to worldspace coordinates (coordinates relative to the map world origin).
 */
export function screenSpaceToWorldSpace(screenX: number, screenY: number): [number, number] {
	return [
		(screenX + cameraState.offsetX) / cameraState.zoom,
		(screenY + cameraState.offsetY) / cameraState.zoom,
	]
}

export function worldSpaceToScreenSpace(worldX: number, worldY: number): [number, number] {
	return [
		worldX * cameraState.zoom - cameraState.offsetX,
		worldY * cameraState.zoom - cameraState.offsetY,
	]
}
