var fs = require('fs'),
	child_process = require('child_process');

var files = fs.readdirSync(__dirname);

if (files.length === 3) {
	console.log(`-----------------------`);
	console.log(`No new files available.`);
	console.log(`-----------------------`);
	process.exit();
}

files = files.map(function (filename) {
	var nameWithoutSpaces = filename.replace(/ /g, '-');
	console.log(child_process.execSync(`ren "Upload\\${filename}" ${nameWithoutSpaces}`).toString());
	return nameWithoutSpaces;
});

files.forEach(function (file, index) {
	if (file !== 'parseAndUpload.js' && file !== 'Completed' && file !== 'npm-debug.log') {
		console.log(`Parsing file: ${file}`);
		try {
			console.log(child_process.execSync(`npm start Upload\\${file}`).toString());
			process.exit()
			// Process was successful move this file
			console.log(child_process.execSync(`move Upload\\${file} Upload\\Completed`).toString());
		} catch (e) {
			console.log(`---------------------------------`);
			console.log(`Error while parsing file: ${file}`);
			console.log(`---------------------------------`);
			console.log('Revert changes in MongoDB and debug.');
			console.log(`${index} file(s) were successfully uploaded.`);
			process.exit();
		}
	}
	// All files parsed, fix marks and ranks
	if (index == files.length - 1) {
		console.log(`Fixing subject names:`);
		console.log(child_process.execSync(`npm run marks`).toString());
		console.log(`Adding class ranks:`);
		console.log(child_process.execSync(`npm run ranks`).toString());
	}
});