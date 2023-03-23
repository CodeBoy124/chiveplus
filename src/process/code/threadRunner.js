import { workerData, parentPort } from "worker_threads";
import {AreaReadStatus} from "../../enums.js";
let output = [];
let warnings = [];
let errors = [];
const variableSetupRegex = /^(int|double|String|bool|List|void) [A-Za-z$]+[ ,)]/g
const functionSetupRegex = /^(int|double|String|bool|List|void) [A-Za-z$]+ ?\(/g
function runStrConvertFunction(strFunction, type, name){
	return eval(`(${strFunction})("${type}", "${name}")`);
}

function truncateString(str, num) {
	if (str.length <= num) {
		return str;
	}
	return str.slice(0, num) + '...';
}
for(let area of workerData.areas){
	let content = area.content;
	let lastChar = "\n";

	let currentLine = area.line;
	let currentCharOfLine = 1;

	let inString = false;
	let insideNParentheses = 0;

	// process variable declarations and 
	for(let charIndex = 0; charIndex < content.length; charIndex++){
		let currentLastChar = lastChar;
		lastChar = content[charIndex];

		let currentCurrentCharOfLine = currentCharOfLine;
		if(content[charIndex] == '\n'){
			currentLine++;
			currentCharOfLine = 1;
			currentCurrentCharOfLine = currentCharOfLine;
		} else {
			currentCharOfLine++;
		}

		if(content[charIndex] == "("){
			insideNParentheses++;
		}
		if(content[charIndex] == ")"){
			insideNParentheses--;
		}

		if(content[charIndex] == "\"" && inString == false){
			inString = "\"";
			continue;
		}
		if(content[charIndex] == "\'" && inString == false){
			inString = "\'";
			continue;
		}
		if(content[charIndex] == "\"" && inString == "\""){
			inString = false;
			continue;
		}
		if(content[charIndex] == "\'" && inString == "\'"){
			inString = false;
			continue;
		}
		if(inString != false) continue;

		if("abcdefghijklmnopqrstuvwxyz0123456789$_.".split("").includes(currentLastChar.toLowerCase())) continue;

		let correctlySplitContent = content.slice(charIndex).split('\n')[0];

		let variableSetupMatch = correctlySplitContent.match(variableSetupRegex);
		if(variableSetupMatch != null){
			let matchFound = variableSetupMatch[0];
			matchFound = matchFound.slice(0, -1);
			let [type, name] = matchFound.split(" ");
			let isArgumentDefinition = insideNParentheses > 0;
			let newText = runStrConvertFunction(isArgumentDefinition ? workerData.supportData.argumentSetup : workerData.supportData.variableSetup, type, name);
			content = content.slice(0, charIndex) + newText + content.slice(charIndex + matchFound.length, content.length);
			continue;
		}
		
		let functionSetupMatch = correctlySplitContent.match(functionSetupRegex);
		if(functionSetupMatch != null){
			let matchFound = functionSetupMatch[0];
			matchFound = matchFound.endsWith(" (") ? matchFound.slice(0, -2) : matchFound.slice(0, -1);
			let [type, name] = matchFound.split(" ");
			let newText = runStrConvertFunction(workerData.supportData.functionSetup, type, name);
			content = content.slice(0, charIndex) + newText + content.slice(charIndex + matchFound.length, content.length);
			continue;
		}

		let isJsDocumentWarning = correctlySplitContent.startsWith("document.");
		if(isJsDocumentWarning){
			warnings.push(`The document object usually is used in js specific code and therfor might not work with other build languages (line ${currentLine}, char ${currentCurrentCharOfLine})`);
			continue;
		}
		let isJsWindowWarning = correctlySplitContent.startsWith("window.");
		if(isJsWindowWarning){
			warnings.push(`The window object usually is used in js specific code and therfor might not work with other build languages (line ${currentLine}, char ${currentCurrentCharOfLine})`);
			continue;
		}
		let isClassKeyword = correctlySplitContent.startsWith("new ");
		if(isClassKeyword){
			errors.push(`Classes are not supported (line ${currentLine}, char ${currentCurrentCharOfLine}), "${truncateString(correctlySplitContent, 19)}"`);
			continue;
		}
	}
	output.push({
		type: AreaReadStatus.Out,
		content: content,
		line: area.line
	});
}
parentPort.postMessage({output, warnings, errors});
