import type { TileAxialCoordinateKey, TileTerrain } from "#shared/types/tile_data_types"
import type { ClientTile } from "$lib/entities/ClientTile.svelte"
import { localState } from "$lib/state/local_state.svelte"
import { canvasSpaceToWorldSpace } from "$lib/util/coordinates.svelte"
import { worldSpaceToAxialInt } from "./game_canvas"

export const MAP_PAINTER_TOOLS = ["brush", "paint_bucket"] as const
export type MapPainterTool = (typeof MAP_PAINTER_TOOLS)[number]

export class MapPainter {
	enabled = $state(false)
	tool = $state<MapPainterTool>("brush")
	selectedTerrain = $state<TileTerrain>("grass")
	thickBrush = $state(false)

	// Used to keep track of which hex coordinates have already been visited.
	// One for the whole class instance, since we usually only need one of these at a time anyway.
	alreadyVisited = new Set<TileAxialCoordinateKey>()

	public handleDrag(newX: number, newY: number, oldX: number, oldY: number) {
		const [x, y] = canvasSpaceToWorldSpace(newX, newY)
		const [p, q] = worldSpaceToAxialInt(x, y)
		if (this.tool == "brush") {
			this.paint(p, q)
		} else if (this.tool == "paint_bucket") {
			const tile = localState.game?.getTile(p, q)
			if (!tile?.terrain) {
				return
			}

			this.alreadyVisited.clear()
			this.floodfill(p, q, tile.terrain, 0)
		}
	}

	private paint(p: number, q: number) {
		this.alreadyVisited.clear()

		this.alreadyVisited.add(`${p},${q}`)
		this.paintTile(p, q)

		if (this.thickBrush) {
			this.getNeighbouringCoords(p, q).forEach(([pp, qq]) => {
				const key: TileAxialCoordinateKey = `${pp},${qq}`
				if (this.alreadyVisited.has(key)) {
					return
				}
				this.alreadyVisited.add(key)
				this.paintTile(pp, qq)
			})
		}
	}

	private floodfill(
		p: number,
		q: number,
		filterFor: TileTerrain,
		depth: number,
		maxDepth: number = 1000,
	) {
		this.paintTile(p, q)

		if (depth >= maxDepth) {
			return
		}

		this.getNeighbouringCoords(p, q).forEach(([pp, qq]) => {
			const tile = this.getTile(pp, qq)
			if (tile?.terrain != filterFor || tile.terrain == this.selectedTerrain) {
				return
			}

			const key: TileAxialCoordinateKey = `${pp},${qq}`
			if (this.alreadyVisited.has(key)) {
				return
			}

			this.alreadyVisited.add(key)
			this.floodfill(pp, qq, filterFor, depth + 1, maxDepth)
		})
	}

	private paintTile(p: number, q: number) {
		const tile = this.getTile(p, q)
		if (tile) {
			tile.terrain = this.selectedTerrain
		}
	}

	private getTile(p: number, q: number): ClientTile | null {
		return localState.game?.getTile(p, q) ?? null
	}

	private getNeighbouringCoords(p: number, q: number): [number, number][] {
		return [
			[p + 1, q],
			[p - 1, q],
			[p, q + 1],
			[p, q - 1],
			[p + 1, q - 1],
			[p - 1, q + 1],
		]
	}
}
