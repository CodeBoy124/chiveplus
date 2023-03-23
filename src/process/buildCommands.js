import { AreaReadStatus } from "../enums.js";

import { defineBuildRunner } from "./buildRunners/define.js";
import { importBuildRunner } from "./buildRunners/import.js";

function seperateBuildCommands(areas){
	let buildCommandAreas = [];
	let otherAreas = [];
	for(let area of areas){
		if(area.type == AreaReadStatus.BuildCommand){
			buildCommandAreas.push(area);
			continue;
		}
		otherAreas.push(area);
	}
	return {buildCommandAreas, otherAreas};
}

function parseBuildCommand(area){
	let [name, ...info] = area.content.split(" ");
	return {name, info};
};

class BuildCommandRunner {
	constructor(name, callback){
		this.name = name;
		this.callback = callback;
	}
}
let buildCommandRunnerOptions = [
	new BuildCommandRunner("define", defineBuildRunner),
	new BuildCommandRunner("import", importBuildRunner)
];
function processBuildCommand(command, areas, line, supportData){
	return buildCommandRunnerOptions.find(option => option.name == command.name).callback(command.info, areas, line, supportData);
}

export function processBuildCommands(areas, supportData){
	let {buildCommandAreas, otherAreas} = seperateBuildCommands(areas);
	for(let buildCommandArea of buildCommandAreas){
		let parsedCommand = parseBuildCommand(buildCommandArea);
		otherAreas = processBuildCommand(parsedCommand, otherAreas, buildCommandArea.line, supportData);
	}
	return otherAreas;
}
