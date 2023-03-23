export let JavaScriptSupport = {
	id: "js",
	buildCommand: {
		import(imports, from){
			return `import {${imports.join(", ")}} from "${from}.js";\n`;
		}
	},
	comment: {
		single(content){
			return `//${content}\n`;
		},
		multi(content){
			return `/*${content}*/`;
		}
	},
	// Code functions must be stringified because of how data is passed to threads
	code: {
		variableSetup: "function(type, name){return `let ${name}`}",
		argumentSetup: "function(type, name){return name}",
		functionSetup: "function(type, name){return `function ${name}`}"
	}
};
