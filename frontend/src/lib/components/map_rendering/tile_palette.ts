import type { ClientTile } from "$lib/entities/ClientTile.svelte"

export class TilePalette {
	private readonly images: Map<TileSprite, HTMLImageElement> = new Map()

	constructor() {
		for (const [, fileName] of Object.entries(TileSprite)) {
			const img = new Image()
			img.src = "/tiles/" + fileName
			this.images.set(fileName, img)
		}
	}

	paint(
		ctx: CanvasRenderingContext2D,
		tileAsset: TileSprite,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		const image = this.images.get(tileAsset)
		if (!image) {
			console.warn(`image ${tileAsset} not loaded. can't draw`)
			return
		}
		ctx.drawImage(image, x, y, width, height)
	}

	getTileSprite(tile: ClientTile): TileSprite {
		switch (tile.terrain) {
			case "land":
				return TileSprite.GRASS
			case "water":
			case "impassable":
				return TileSprite.WATER
		}
	}
}

export enum TileSprite {
	GRASS = "grass.svg",
	WATER = "water.svg",
}
