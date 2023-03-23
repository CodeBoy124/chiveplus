export let AreaReadStatus = {
	Comment: {
		Single: 0,
		Multi: 1
	},
	BuildCommand: 2,
	Code: 3,
	Out: 4
};

export let AreaInitiator = {
	BuildCommand: '#',
	Comment: {
		Single: "//",
		Multi: "/*"
	}
};

export let AreaEnder = {
	BuildCommand: '\n',
	Comment: {
		Single: '\n',
		Multi: "*/"
	}
};

export let InfoReadStatus = {
	Import: 0,
	From: 1
};
