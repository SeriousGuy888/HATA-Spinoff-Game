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
			case "grass":
				return TileSprite.GRASS
			case "sand":
				return TileSprite.SAND
			case "coastal_ocean":
				return TileSprite.SHALLOW_WATER
			case "deep_ocean":
				return TileSprite.DEEP_WATER
		}
	}
}

export enum TileSprite {
	GRASS = "grass.svg",
	SAND = "sand.svg",
	SHALLOW_WATER = "shallow_water.svg",
	DEEP_WATER = "deep_water.svg",
}
