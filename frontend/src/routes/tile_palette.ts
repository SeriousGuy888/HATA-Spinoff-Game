export class TilePalette {
	private readonly images: Map<TileAsset, HTMLImageElement> = new Map()

	constructor() {
		for (const [, assetKey] of Object.entries(TileAsset)) {
			const img = new Image()
			img.src = "/tiles/" + assetKey
			this.images.set(assetKey, img)
		}
	}

	paint(
		ctx: CanvasRenderingContext2D,
		tile: TileAsset,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		const image = this.images.get(tile)
		if (!image) {
			console.warn(`image ${tile} not loaded. can't draw`)
			return
		}
		ctx.drawImage(image, x, y, width, height)
	}
}

export enum TileAsset {
	GRASS = "grass.svg",
	WATER = "water.svg",
}
