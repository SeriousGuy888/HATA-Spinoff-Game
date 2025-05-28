import { canvasState } from "$lib/state/ui_state.svelte.ts"

/**
 * Convert from clientspace coordinates (coordinates relative to viewport window)
 * to canvasspace coordinates (coordinates relative to the canvas element).
 */
export function clientSpaceToCanvasSpace(clientX: number, clientY: number): [number, number] {
	return [clientX - canvasState.clientLeft, clientY - canvasState.clientTop]
}

/**
 * Convert from canvasspace coordinates (coordinates relative to the canvas window)
 * to worldspace coordinates (coordinates relative to the map world origin).
 */
export function canvasSpaceToWorldSpace(canvasX: number, canvasY: number): [number, number] {
	return [
		(canvasX + canvasState.offsetX) / canvasState.zoom,
		(canvasY + canvasState.offsetY) / canvasState.zoom,
	]
}

export function worldSpaceToCanvasSpace(worldX: number, worldY: number): [number, number] {
	return [
		worldX * canvasState.zoom - canvasState.offsetX,
		worldY * canvasState.zoom - canvasState.offsetY,
	]
}
