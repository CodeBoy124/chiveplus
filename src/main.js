/*
 * 1. read file
 * 2. find areas (aka: code, build command, comment)
 * 3. process build command
 * 4. process code
 * 5. combine code and comments
 * 6. write to new file
 */

// imports
import {findAreas} from "./findAreas.js";
import {processBuildCommands} from "./process/buildCommands.js";
import {processComments} from "./process/comments.js";
import { seperateThreadGroups } from "./process/code/seperateThreadGroups.js";
import { createThreads } from "./process/code/createThreads.js";

// support imports
import {DartSupport} from "./support/dart/init.js";
import {JavaScriptSupport} from "./support/js/init.js";
import {AreaReadStatus} from "./enums.js";
let supports = [
	DartSupport,
	JavaScriptSupport
];

export async function compileCode(code, outputLanguage, threadAmount){
	let supportData = supports.find(support => support.id == outputLanguage);

	// seperate different kinds of areas in code, such as: regular code, build commands & comments
	let areas = findAreas(code);

	// process build commands
	let prebuildCode = processBuildCommands(areas, supportData);

	// process comments
	let outputAreas = processComments(prebuildCode, supportData);

	// seperate code areas into multiple groups for multithreading
	let codeAreasForThreads = seperateThreadGroups(outputAreas, threadAmount);
	// process code using mutlithreading
	let codeAreasOutput = await createThreads(threadAmount, codeAreasForThreads, supportData)
	// combine processed code areas and other areas
	for(let areaId = 0; areaId < outputAreas.length; areaId++){
		let area = outputAreas[areaId];
		if(area.type != AreaReadStatus.Code) continue;
		outputAreas[areaId] = codeAreasOutput.find(codeArea => codeArea.line == area.line);
		if(outputAreas[areaId] == undefined || outputAreas[areaId] == null) throw new Error(`Failed to transpile code area that starts at line ${area.line}`);
	}
	// combine all seperate areas
	let finalScript = outputAreas.map(area => area.content).join("");
	return finalScript;
}
