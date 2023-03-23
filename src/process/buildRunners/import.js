import { InfoReadStatus, AreaReadStatus } from "../../enums.js";

function parseInfo(info){
	let imports = [];
	let from = [];

	let readStatus = InfoReadStatus.Import;
	
	for(let item of info){
		if(item == "from"){
			readStatus = InfoReadStatus.From
			continue;
		}
		if(readStatus == InfoReadStatus.Import){
			imports.push(item);
			continue;
		}
		from.push(item);
	}
	return { imports, from: from.join(" ") };
}
function findInsertingIndex(line, areas){
	for(let areaId = 0; areaId < areas.length; areaId++){
		let prevLine = areas[areaId].line;
		if(line < prevLine) continue;
		if(areaId+1 > areas.length-1) return areaId;
		let nextLine = areas[areaId+1].line;
		if(line > nextLine) continue;
		return areaId;
	}
	return 0;
}
export function importBuildRunner(info, areas, line, supportData){
	let importInfo = parseInfo(info);
	if(importInfo.from.startsWith("package:")) console.warn(`Using a package starting with 'package:' usually is dart specific and therefor might not work with other output languages (line ${line})`);
	if(importInfo.from.startsWith("dart:")) console.warn(`Using a package starting with 'dart:' usually is dart specific and therefor might not work with other output languages (line ${line})`);
	if(importInfo.from.startsWith("node:")) console.warn(`Using a package starting with 'node:' usually is js specific and therefor might not work with other output languages (line ${line})`);
	let importOutputLine = supportData.buildCommand.import(importInfo.imports, importInfo.from);
	let indexToImportAt = findInsertingIndex(line, areas) + 1;
	areas.splice(indexToImportAt, 0, {
		type: AreaReadStatus.Out,
		content: importOutputLine,
		line
	});
	return areas;
}
