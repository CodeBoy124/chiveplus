import * as fs from "fs";
import * as path from "path";
export function readIgnoreData(cwd){
	// either read ignore file or use default
	let ignoreTxt = fs.existsSync(path.join(cwd, "chvignore")) ?
		fs.readFileSync(path.join(cwd, "chvignore"), "utf8") :
		".git/"
	return parseIgnoreData(ignoreTxt);
}

function isDirectoryDescriptor(line){
	return line.endsWith("/") || line.endsWith("\\");
}

function removeEmptyEntries(list){
	return list.filter(item => item != "");
}

function parseIgnoreData(txt){
	let lines = txt.split("\n").map(line => {
		// make sure no line ends in \r in order to make sure the program can detect wheter it is a folder
		return line.replaceAll("\r", "");
	});
	let ignores = {
		files: [],
		directories: []
	};
	for(let line of lines){
		if(isDirectoryDescriptor(line)){
			ignores.directories.push(line.slice(0, -1));
			continue;
		}
		ignores.files.push(line);
	}
	return {
		files: removeEmptyEntries(ignores.files),
		directories: removeEmptyEntries(ignores.directories),
	};
}
