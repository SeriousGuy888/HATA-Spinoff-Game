import { canvasState } from "$lib/state/ui_state.svelte.ts"

/**
 * Convert from clientspace coordinates (coordinates relative to viewport window)
 * to canvasspace coordinates (coordinates relative to the canvas element).
 */
export function clientSpaceToCanvasSpace(clientX: number, clientY: number): [number, number] {
	const boundingBox = canvasState.canvas?.getBoundingClientRect()
	if (!boundingBox) {
		console.error("Attempted to convert client space to canvas space, but was unable to retrieve the canvas bounding box, possibly because the canvas is currently undefined. Using 0,0 for the offset instead.")
	}
	
	const offsetLeft = boundingBox?.left ?? 0
	const offsetTop = boundingBox?.top ?? 0

	return [clientX - offsetLeft, clientY - offsetTop]
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
