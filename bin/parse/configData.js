import * as fs from "fs";
import * as path from "path";
export function readConfigData(cwd){
	// use either the config file or the default settings
	let configTxt = fs.existsSync(path.join(cwd, "chvconfig.json")) ?
		fs.readFileSync(path.join(cwd, "chvconfig.json"), "utf8") :
		`{"threads": 4, "outputLanguage": "js"}`;
	return JSON.parse(configTxt);
}
