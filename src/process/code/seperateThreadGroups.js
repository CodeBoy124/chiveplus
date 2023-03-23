import {AreaReadStatus} from "../../enums.js";

export function seperateThreadGroups(areas, amountOfThreads){
	let groups = [];
	let pointer = 0;

	for(let i = 0; i < amountOfThreads; i++){
		groups.push([]);
	}

	for(let area of areas.filter(area => area.type == AreaReadStatus.Code)){
		groups[pointer].push(area);
		pointer = (pointer + 1) % groups.length;
	}
	return groups;
}
