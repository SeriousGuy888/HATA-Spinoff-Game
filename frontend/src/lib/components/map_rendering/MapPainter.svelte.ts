import type { TileTerrain } from "#shared/types/tile_data_types"
import { localState } from "$lib/state/local_state.svelte"
import { canvasSpaceToWorldSpace } from "$lib/util/coordinates.svelte"
import { worldSpaceToAxialInt } from "./game_canvas"

export const MAP_PAINTER_TOOLS = ["brush", "eraser"] as const
export type MapPainterTool = (typeof MAP_PAINTER_TOOLS)[number]

export class MapPainter {
	enabled = $state(true)
	tool = $state<MapPainterTool>("brush")
	terrainType = $state<TileTerrain>("water")

	public handleDrag(newX: number, newY: number, oldX: number, oldY: number) {
		if (this.tool == "brush") {
			const [x1, y1] = canvasSpaceToWorldSpace(oldX, oldY)
			const [x2, y2] = canvasSpaceToWorldSpace(newX, newY)
			const [p1, q1] = worldSpaceToAxialInt(x1, y1)
			const [p2, q2] = worldSpaceToAxialInt(x2, y2)

			const numberOfHexes = (~~(p1 - p2) + ~~(q1 - q2)) / 2
			for (let i = 0; i < numberOfHexes + 1; i++) {
				const x = this.lerp(x1, x2, i / (numberOfHexes + 1))
				const y = this.lerp(y1, y2, i / (numberOfHexes + 1))
				const [p, q] = worldSpaceToAxialInt(x, y)

				const tile = localState.game?.getTile(p, q)
				// console.log(tile, p, q, x, y)
				if (tile) {
					tile.terrain = this.terrainType
					// console.log(tile.terrain)
				}
			}

		}
	}

	private lerp(a: number, b: number, t: number) {
		return a + (b - a) * t
	}
}
