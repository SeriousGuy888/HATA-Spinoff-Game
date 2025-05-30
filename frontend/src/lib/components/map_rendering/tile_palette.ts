import type { ClientTile } from "$lib/entities/ClientTile.svelte"

// The width and height of the source images (SVGs, which can be scaled up if needed)
const sourceWidth = 100
const sourceHeight = 87

// Each asset will be prerendered to each of these scales.
const spriteScales = [0.125, 0.25, 0.5, 1, 2, 4, 8]
const spritesheetGridWidth = sourceWidth * Math.max(...spriteScales)
const spritesheetGridGap = 3

export class TilePalette {
	/**
	 * The offscreen canvas is used to prerender the SVGs into raster images.
	 * This improves performance, since we can then just copy the prerendered versions onto the main canvas.
	 */
	private readonly stagingCanvas: OffscreenCanvas
	private readonly stagingCtx!: OffscreenCanvasRenderingContext2D

	/**
	 * After all the images have been drawn onto the staging canvas, the spritesheet is ready, and we put the
	 * contents of the canvas this bitmap. Then, we can just copy regions from this bitmap onto the main game canvas.
	 */
	private spritesheet: ImageBitmap | null = null

	/**
	 * Maps each sprite to another map.
	 *
	 * The inner map maps each available scale to the x,y coordinates on the spritesheet where the requested
	 * sprite at the specified scale can be found.
	 */
	private readonly spriteLocations: Map<SpriteId, Map<number, [number, number]>> = new Map()

	/**
	 * Because images don't load immediately, we have to wait for the images to resolve before drawing them onto
	 * the offscreen canvas (otherwise we would just be prerendering a blank image). We wait until this number goes
	 * back to zero before deciding that the prerendering is done and taking the snapshot of the spritesheet.
	 */
	private numImagesPending = 0

	constructor() {
		const spriteEntries = Object.values(SpriteId)

		const spritesheetWidth = (spritesheetGridWidth + spritesheetGridGap) * spriteEntries.length
		const spritesheetHeight = spriteScales.reduce(
			(acc, curr) => acc + curr * sourceHeight + spritesheetGridGap,
			0,
		)
		this.stagingCanvas = new OffscreenCanvas(spritesheetWidth, spritesheetHeight)

		const ctx = this.stagingCanvas.getContext("2d")
		if (ctx === null) {
			console.error("couldn't load offscreen canvas on to render tile sprites")
			return
		} else {
			ctx.imageSmoothingEnabled = false
			this.stagingCtx = ctx
		}

		this.preloadImages(spriteEntries)
	}

	private preloadImages(images: SpriteId[]) {
		for (let i = 0; i < images.length; i++) {
			// Create a image, and mark it as pending.
			const currImagePath = images[i]
			const image = new Image()
			image.src = currImagePath
			this.numImagesPending++

			// Go through each of the scales it has to be rendered at, and mark down where it should be drawn.
			const stagingX = i * (spritesheetGridWidth + spritesheetGridGap)
			const locationsPerScale = new Map()

			let alreadyOccupiedHeight = 0
			for (const scale of spriteScales) {
				const stagingY = alreadyOccupiedHeight
				alreadyOccupiedHeight += scale * sourceHeight + spritesheetGridGap

				locationsPerScale.set(scale, [stagingX, stagingY])
				this.spriteLocations.set(currImagePath, locationsPerScale)
			}

			image.onload = () => {
				console.log("loaded", currImagePath)

				const locationsPerScale = this.spriteLocations.get(currImagePath)
				if (!locationsPerScale) {
					console.error(
						`${currImagePath} was loaded successfully, but wasn't prerendered because the locations per scale were not correctly set.`,
					)
					this.numImagesPending--
					return
				}

				locationsPerScale.entries().forEach((entry) => {
					const [scale, positionOnSpritesheet] = entry
					const [destinationX, destinationY] = positionOnSpritesheet

					const renderWidth = sourceWidth * scale
					const renderHeight = sourceHeight * scale

					this.stagingCtx.drawImage(
						image,
						0,
						0,
						sourceWidth,
						sourceHeight,
						destinationX,
						destinationY,
						renderWidth,
						renderHeight,
					)
				})

				this.numImagesPending--

				if (this.numImagesPending === 0) {
					this.freezeSpritesheet()
				}
			}
			image.onerror = (e) => {
				console.error(`Failed to load sprite ${currImagePath}. Skipping.`, e)
				this.numImagesPending--
				if (this.numImagesPending === 0) {
					this.freezeSpritesheet()
				}
			}
		}
	}

	private freezeSpritesheet() {
		this.stagingCanvas.convertToBlob().then((blob) => {
			const url = URL.createObjectURL(blob)
			console.log(url)
		})
		this.spritesheet = this.stagingCanvas.transferToImageBitmap()
		console.log(
			`Rendered tiles to sprites at ${spriteScales.length} different scales. The generated spritesheet is ${this.spritesheet.width}x${this.spritesheet.height} in size.`,
		)
	}

	public paint(
		ctx: CanvasRenderingContext2D,
		sprite: SpriteId,
		x: number,
		y: number,
		targetWidth: number,
		targetHeight: number,
		spriteScale: number = 1,
	) {
		if (!this.spritesheet) {
			console.debug(
				"Skipped painting tile: the snapshot of prerendered sprites hasn't been taken yet.",
			)
			return
		}

		const locationsPerScale = this.spriteLocations.get(sprite)
		if (!locationsPerScale || locationsPerScale.size == 0) {
			console.warn(`image ${sprite} not loaded. can't draw`)
			return
		}

		ctx.drawImage(
			this.spritesheet,
			...locationsPerScale.get(spriteScale)!,
			sourceWidth * spriteScale,
			sourceHeight * spriteScale,
			x,
			y,
			targetWidth,
			targetHeight,
		)
	}

	public getClosestScale(desiredWidth: number) {
		const requestedScale = desiredWidth / sourceWidth

		let closestScale = spriteScales[0]
		let minDiff = Math.abs(requestedScale - closestScale)

		for (const scale of spriteScales) {
			const diff = Math.abs(requestedScale - scale)
			if (diff < minDiff) {
				closestScale = scale
				minDiff = diff
			}
		}

		return closestScale
	}
}

export function getTerrainSprite(tile: ClientTile): SpriteId {
	switch (tile.terrain) {
		case "grass":
			return SpriteId.GRASS
		case "sand":
			return SpriteId.SAND
		case "coastal_ocean":
			return SpriteId.SHALLOW_WATER
		case "deep_ocean":
			return SpriteId.DEEP_WATER
		default:
			return SpriteId.INVALID_TERRAIN
	}
}

export function getStructureSprite(tile: ClientTile): SpriteId {
	return SpriteId.HOUSE
}

enum SpriteId {
	GRASS = "/tiles/grass.svg",
	SAND = "/tiles/sand.svg",
	SHALLOW_WATER = "/tiles/shallow_water.svg",
	DEEP_WATER = "/tiles/deep_water.svg",
	INVALID_TERRAIN = "/tiles/invalid_terrain.svg",
	HOUSE = "/structures/house.svg",
}
