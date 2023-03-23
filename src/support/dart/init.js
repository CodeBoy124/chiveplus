export let DartSupport = {
	id: "dart",
	buildCommand: {
		import(imports, from){
			return `import '${from}.dart' show ${imports.join(", ")};\n`;
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
	// TODO: Code functions must be stringified because of how data is passed to threads
	code: {
		variableSetup: "function(type, name){return `${type} ${name}`}",
		argumentSetup: "function(type, name){return `${type} ${name}`}",
		functionSetup: "function(type, name){return `${type} ${name}`"
	}
};
