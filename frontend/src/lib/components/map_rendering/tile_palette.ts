import type { ClientTile } from "$lib/entities/ClientTile.svelte"

// The width and height of the source images
const sourceWidth = 100
const sourceHeight = 87

// The width and height of the sprites when rendered onto the offscreen canvas
// (can be bigger than source when working with svgs)
const renderWidth = 500
const renderHeight = Math.round((Math.sqrt(3) * renderWidth) / 2)
const renderGap = 5 // How many pixels to leave between prerendered images on the offscreen canvas

export class TilePalette {
	// The offscreen canvas is used to prerender the SVGs into raster images.
	// This improves performance, since we can then just copy the prerendered versions onto the main canvas.
	private readonly offscreenCanvas: OffscreenCanvas
	private readonly ctx!: OffscreenCanvasRenderingContext2D

	// This map stores where on the offscreen canvas each sprite was rendered to.
	private readonly imageLocations: Map<TileSprite, [number, number]> = new Map()

	// After all the images have been prerendered onto the offscreen canvas, we store a copy of the offscreen
	// canvas's contents into this bitmap variable. Then, we can just copy regions from this bitmap onto the
	// main game canvas.
	private snapshot: ImageBitmap | null = null

	// Because images don't load immediately, we have to wait for the images to resolve before drawing them onto
	// the offscreen canvas (otherwise we would just be prerendering a blank image).
	// We wait until this number goes back to zero before deciding that the prerendering is done and
	// taking the snapshot to store in the bitmap variable.
	private numImagesPending = 0

	constructor() {
		const spriteEntries = Object.values(TileSprite)
		this.offscreenCanvas = new OffscreenCanvas(renderWidth * spriteEntries.length, renderHeight)

		const ctx = this.offscreenCanvas.getContext("2d")
		if (ctx === null) {
			console.error("couldn't load offscreen canvas on to render tile sprites")
			return
		} else {
			this.ctx = ctx
		}

		this.preloadImages(spriteEntries)
	}

	private preloadImages(spriteEntries: TileSprite[]) {
		for (let i = 0; i < spriteEntries.length; i++) {
			const spriteFileName = spriteEntries[i]

			const img = new Image()
			img.src = "/tiles/" + spriteFileName

			const x = i * (renderWidth + renderGap)
			const y = 0
			this.imageLocations.set(spriteFileName, [x, y])

			this.numImagesPending++
			img.onload = () => {
				console.log("loaded", spriteFileName)
				this.ctx.drawImage(img, 0, 0, sourceWidth, sourceHeight, x, y, renderWidth, renderHeight)
				this.numImagesPending--

				if (this.numImagesPending === 0) {
					this.takeSnapshot()
				}
			}
			img.onerror = (e) => {
				console.error("Failed to load sprite ", spriteFileName, " -- skipping.", e)
				this.numImagesPending--
				if (this.numImagesPending === 0) {
					this.takeSnapshot()
				}
			}
		}
	}

	private takeSnapshot() {
		// this.offscreenCanvas.convertToBlob().then((blob) => {
		// 	const url = URL.createObjectURL(blob)
		// 	console.log(url)
		// })
		this.snapshot = this.offscreenCanvas.transferToImageBitmap()
		console.log("Tile sprite prerendering done. Took snapshot of offscreen canvas.")
	}

	public paint(
		ctx: CanvasRenderingContext2D,
		tileAsset: TileSprite,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		if (!this.snapshot) {
			console.debug(
				"Skipped painting tile: the snapshot of prerendered sprites hasn't been taken yet.",
			)
			return
		}

		if (!this.imageLocations.has(tileAsset)) {
			console.warn(`image ${tileAsset} not loaded. can't draw`)
			return
		}

		ctx.drawImage(
			this.snapshot,
			...this.imageLocations.get(tileAsset)!,
			renderWidth,
			renderHeight,
			x,
			y,
			width,
			height,
		)
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
			default:
				return TileSprite.INVALID
		}
	}
}

enum TileSprite {
	GRASS = "grass.svg",
	SAND = "sand.svg",
	SHALLOW_WATER = "shallow_water.svg",
	DEEP_WATER = "deep_water.svg",
	INVALID = "invalid_terrain.svg",
}
