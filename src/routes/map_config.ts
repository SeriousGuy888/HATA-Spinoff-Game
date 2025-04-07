export interface MapRegionData {
	name: string
	description?: string
	coordinates: [number, number][] // Used to draw an SVG Path polygon
}

export const MAP_DIMENSIONS = {
	width: 10001,
	height: 10001,
}

// The map image is a map of a Minecraft world.
// This constant stores the *image* coordinates at which the *Minecraft* coordinates (0, 0) are located.
export const MAP_WORLD_ORIGIN_OFFSET: [number, number] = [5001, 5001]

// The location in the world that the camera should start centered on.
export const DEFAULT_WORLD_LOCATION: [number, number] = [200, 1200]

export const TILES: { [key: string]: MapRegionData } = {
	hawainot_province: {
		name: "Hawainot",
		description: "(testing region)",
		coordinates: [
			[-337, 1275],
			[-285, 1276],
			[-289, 1320],
			[-250, 1340],
			[-158, 1324],
			[-124, 1352],
			[-80, 1404],
			[-21, 1405],
			[13, 1448],
			[-23, 1542],
			[-104, 1568],
			[-119, 1610],
			[-129, 1630],
			[-243, 1595],
			[-253, 1527],
			[-324, 1534],
			[-402, 1520],
			[-424, 1436],
			[-480, 1414],
			[-489, 1366],
			[-353, 1307],
		],
	},
	sheapland: {
		name: "Sheapland",
		description: "testing",
		coordinates: [
			[-2, 1102],
			[37, 1091],
			[54, 1098],
			[71, 1095],
			[85, 1099],
			[101, 1113],
			[122, 1102],
			[138, 1108],
			[162, 1104],
			[180, 1108],
			[178, 1130],
			[206, 1130],
			[263, 1136],
			[299, 1122],
			[324, 1118],
			[349, 1120],
			[404, 1134],
			[420, 1145],
			[426, 1154],
			[424, 1169],
			[421, 1190],
			[415, 1195],
			[423, 1202],
			[422, 1214],
			[413, 1217],
			[402, 1218],
			[396, 1225],
			[401, 1241],
			[395, 1261],
			[404, 1283],
			[393, 1319],
			[394, 1347],
			[385, 1377],
			[367, 1397],
			[345, 1415],
			[321, 1439],
			[301, 1448],
			[306, 1458],
			[293, 1469],
			[273, 1473],
			[259, 1462],
			[239, 1459],
			[215, 1442],
			[200, 1417],
			[212, 1399],
			[211, 1375],
			[184, 1357],
			[183, 1342],
			[169, 1325],
			[147, 1320],
			[136, 1310],
			[135, 1289],
			[116, 1288],
			[101, 1271],
			[69, 1269],
			[48, 1263],
			[44, 1243],
			[22, 1239],
			[14, 1227],
			[-26, 1225],
			[-28, 1126],
		],
	},
}
