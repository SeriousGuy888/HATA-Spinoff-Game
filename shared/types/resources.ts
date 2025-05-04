export enum ResourceType {
	MONEY = "money",
	WOOD = "wood",
	STONE = "stone",
	COAL = "coal",
	LIVESTOCK = "livestock",
}

export type ResourceMap = Record<ResourceType, number>