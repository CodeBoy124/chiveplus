#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";
import * as path from "path";

import { compileCode } from "../src/main.js";
import { readIgnoreData } from "./parse/ignoreData.js";
import {readConfigData} from "./parse/configData.js";
import {isUndefined} from "./util.js";

yargs(hideBin(process.argv))
	.command("compile", "compile chive+ files", yargs => {
		return yargs;
	}, argv => {
		let ignoreData = readIgnoreData(process.cwd());

		let configData = readConfigData(process.cwd());

		// if no file is specified enable directory mode
		let directoryMode = isUndefined(argv.file);
		if(!directoryMode){
			let fileName = path.join(process.cwd(), argv.file) + "." + argv.extension;
			convertFile(fileName, configData);
			return;
		}
		let fileNames = scanDirForFiles(process.cwd(), "." + argv.extension, ignoreData);
		for(let fileName of fileNames){
			convertFile(fileName, configData);
		}
	})
	.option("file", {
		alias: "f",
		describe: "Only compile specific file. DO NOT USE FILE EXTENSION",
		type: "string"
	})
	.option("extension", {
		alias: "ext",
		describe: "File extension to search for",
		type: "string",
		demandOption: true,
		default: "chv"
	})
	.command("init", "initialize chive in cwd", yargs => {
		return yargs;
	}, () => {
		fs.writeFileSync(path.join(process.cwd(), "chvignore"), ".git/")
		console.log("created 'chvignore' file");
		fs.writeFileSync(path.join(process.cwd(), "chvconfig.json"), JSON.stringify({
			threads: 4,
			outputLanguage: "js"
		}, null, 2));
		console.log("created 'chvconfig.json' file");

	})
	.parse();

function shouldIgnoreFile(ignoreData, fileName){
	for(let ignoreFile of ignoreData.files){
		if(fileName.endsWith(ignoreFile)) return true;
	}
	return false;
}

function shouldIgnoreDirectory(ignoreData, directoryName){
	for(let ignoreDirectory of ignoreData.directories){
		if(directoryName.endsWith(ignoreDirectory)) return true;
	}
	return false;
}

async function convertFile(fileName, configData){
	let fileContent = fs.readFileSync(fileName, "utf8");
	let output = await compileCode(fileContent, configData.outputLanguage, configData.threads);
	let newFileName = fileName.split(".").slice(0, -1).join(".") + "." + configData.outputLanguage;
	fs.writeFileSync(newFileName, output);
}

function isFile(file){
  	let stat = fs.lstatSync(file);
       	return stat.isFile();
}

function isDirectory(file){
	let stat = fs.lstatSync(file);
	return stat.isDirectory();
}

function scanDirForFiles(directory, extension, ignoreData){
	let fileNames = [];
	let directoryContent = fs.readdirSync(directory);
	for(let file of directoryContent){
		if(isDirectory(path.join(directory, file))){
			if(shouldIgnoreDirectory(ignoreData, path.join(directory, file))) continue;
			fileNames = [...fileNames, ...scanDirForFiles(path.join(directory, file), extension, ignoreData)];
			continue;
		}
		if(!isFile(path.join(directory, file))) continue;
		if(!file.endsWith(extension)) continue;
		if(shouldIgnoreFile(ignoreData, path.join(directory, file))) continue;
		fileNames.push(path.join(directory, file));
	}
	return fileNames;
}

/*
 * action arguments
 *
 * actions
 * 	compile
 * 	init
 *
 * arguments
 * 	-f (compile single file NO EXTENSION, otherwise scan for files)
 * 	--ext (chive+ file extension. default is .chv)
 * */
