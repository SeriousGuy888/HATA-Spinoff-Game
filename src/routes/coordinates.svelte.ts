import { MAP_WORLD_ORIGIN_OFFSET } from "./map_state.svelte.ts"
import { cameraState } from "./ui_state.svelte.ts"



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
