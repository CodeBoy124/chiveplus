export function defineBuildRunner([name, ...valueSeperated], areas){
	let value = valueSeperated.join(" ");
	for(let areaId = 0; areaId < areas.length; areaId++){
		areas[areaId].content = areas[areaId].content.replaceAll(name, value);
	}
	return areas;
}
