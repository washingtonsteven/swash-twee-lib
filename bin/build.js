#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import fs from "fs";
import path from "path";
import glob from "glob";
import { TweeParser, StoryFormatParser, HTMLWriter } from "extwee";

const { project, output = "./build/index.html" } = yargs(hideBin(process.argv)).argv;

if (!project) {
	console.error("Please provide required --project option.");
	process.exit(1);
}

const projectDir = path.resolve(project);

if (!fs.existsSync(projectDir)) {
	console.error(`Project \`${project}\` does not exist.`);
	process.exit(1);
}

console.log(`Loading project ${project}...`);


const projectPackageJSON = (() => {
	try {
		const jsonString = fs.readFileSync(path.resolve(projectDir, "package.json"));
		return JSON.parse(jsonString.toString());
	} catch(e) {
		console.error(`Error loading package.json in ${projectDir}`);
		throw e;
	}
})();

const source = projectPackageJSON?.tweeConfig?.source;

if (!source) {
	console.error(`Please include tweeConfig.source in your project's package.json`);
} else {
	console.log(`Finding files in ${projectDir} matching pattern ${source}`);
}

glob(source, { cwd: projectDir }, (err, files) => {
	if (err) {
		console.error(`There was a problem loading source files from: ${source}`);
		throw err;
	} else {
		console.log(`Found ${files.length} file(s):`);
		files.slice(0, 10).map(f => console.log(`\t - ${f}`));
		if (files.length > 10) {
			console.log("...");
		}
	}

	const fileContents = files.map((file) => {
		const fileContentsBuffer = fs.readFileSync(path.resolve(projectDir, file));
		return fileContentsBuffer.toString();
	});

	const tweeSource = fileContents.join("\n\n");

	const story = TweeParser.parse(tweeSource);

	const storyFormatFile = path.resolve("story-formats", `${story.format.toLowerCase()}-${story.formatVersion?.charAt(0)}`, "format.js");

	if (!fs.existsSync(storyFormatFile)) {
		console.error(`Tried to load ${story.format} v${story.formatVersion} from ${storyFormatFile}, but it doesn't exist.`);
		console.log(`If the story format version is missing, try using \`formatVersion\` in your \`StoryData\` passage (this is not part of the Twee spec, but is what extwee expects).`);
		process.exit(1);
	}

	const storyFormatSource = fs.readFileSync(storyFormatFile);
	const parsedStoryFormat = StoryFormatParser.parse(storyFormatSource.toString());

	const destination = path.resolve(projectDir, output);
	HTMLWriter.write(destination, story, parsedStoryFormat);

	console.log(`Successfully wrote ${project} to ${destination}`);
})
