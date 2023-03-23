import {AreaReadStatus, AreaInitiator, AreaEnder} from "./enums.js";

function isEmpty(area){
	return area.length < 1;
}

function cleanAreaArray(areaArray){
	return areaArray.filter(area => !isEmpty(area.content));
}

export function findAreas(code){
	let output = [{
		type: AreaReadStatus.Code,
		content: "",
		line: 1
	}];
	let currentLine = 1;
	let readStatus = AreaReadStatus.Code;
	for(let charIndex = 0; charIndex < code.length; charIndex++){
		let currentChar = code[charIndex];
		currentLine += currentChar == '\n';

		// handle BuildCommand
		if(readStatus == AreaReadStatus.Code && currentChar == AreaInitiator.BuildCommand){
			readStatus = AreaReadStatus.BuildCommand;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			continue;
		}
		if(readStatus == AreaReadStatus.BuildCommand && currentChar == AreaEnder.BuildCommand){
			readStatus = AreaReadStatus.Code;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			continue;
		}

		let nextChar = code[charIndex+1];

		// handle single line comment
		if(readStatus == AreaReadStatus.Code && (currentChar + nextChar) == AreaInitiator.Comment.Single){
			readStatus = AreaReadStatus.Comment.Single;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			charIndex++;
			continue;
		}
		if(readStatus == AreaReadStatus.Comment.Single && currentChar == AreaEnder.Comment.Single){
			readStatus = AreaReadStatus.Code;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			continue;
		}

		// handle multi line comment
		if(readStatus == AreaReadStatus.Code && (currentChar + nextChar) == AreaInitiator.Comment.Multi){
			readStatus = AreaReadStatus.Comment.Multi;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			charIndex++;
			continue;
		}
		if(readStatus == AreaReadStatus.Comment.Multi && (currentChar + nextChar) == AreaEnder.Comment.Multi){
			readStatus = AreaReadStatus.Code;
			output.push({
				type: readStatus,
				content: "",
				line: currentLine
			});
			charIndex++;
			continue;
		}
		
		// add text to current area
		output[output.length-1].content += currentChar;
	}
	return cleanAreaArray(output);
}
