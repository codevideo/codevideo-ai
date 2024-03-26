import { TextToSpeechOptions } from './../types/TextToSpeechOptions.js';
import path from "path";
import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";

export const loadActions = async (): Promise<{
  url: string;
  actions: Array<IAction>;
  videoFile: string;
  currentWorkingDirectory: string;
  actionsAudioDirectory: string;
  actionsVideoDirectory: string;
  textToSpeechOption: TextToSpeechOptions
}> => {
  // first argument to this script is the path to the actions file
  if (process.argv.length < 3) {
    console.error("Please provide a path to the actions file");
    process.exit(1);
  }

  // if we have a 4th argument, then we know we have a text to speech option
  let textToSpeechOption: TextToSpeechOptions = "sayjs";
  if (process.argv.length === 4) {
    textToSpeechOption = process.argv[3] as TextToSpeechOptions;
  }

  const inputStepsFilePath = process.argv[2];
  const actions: Array<IAction> = [];
  // copilot finished the next line for me:
  // look at me - i am the fully retarded javascript language that can't even get the current working directory without a regex
  const currentWorkingDirectory = process.cwd().replace(/\\/g, '/');

  // join the actions file path with the current working directory
  const actionsFilePath = path.join(
    currentWorkingDirectory,
    inputStepsFilePath
  );

  // ensure the file exist relative to the current working directory
  if (!fs.existsSync(actionsFilePath)) {
    console.error(`File not found: ${actionsFilePath}`);
    process.exit(1);
  }

  // try typescript first
  if (inputStepsFilePath.endsWith(".ts")) {
    // dynamically require the typescript file
    const {default: typeScriptActions} = await import(actionsFilePath);

    // if it's null, throw error that they need to use 'export default' syntax
    if (typeScriptActions === null) {
      console.error(
        "Failed to load TypeScript actions. Use 'export default' syntax in your typescript file to export the actions."
      );
      process.exit(1);
    }

    actions.push(...typeScriptActions);
  } else if (inputStepsFilePath.endsWith(".json")) {
    // we can safely require the actions file
    const {default: jsonActions} = await import(actionsFilePath, { assert: { type: "json" } });
    actions.push(...jsonActions);
  } else {
    console.error(
      "Please provide a path to a .ts or .json file with your actions"
    );
    process.exit(1);
  }

  console.log(`Found ${actions.length} actions in file ${actionsFilePath}`);
  const fileNameWithoutExtension = path.basename(
    actionsFilePath,
    path.extname(actionsFilePath)
  );
  const actionsAudioDirectory = `${currentWorkingDirectory}/audio/${fileNameWithoutExtension}`;
  const actionsVideoDirectory = `${currentWorkingDirectory}/video/${fileNameWithoutExtension}`;
  const url = `file://${currentWorkingDirectory}/editor.html`;
  const videoFile = `./video/${fileNameWithoutExtension}.mp4`;

  // if we see at least one 'type-terminal' action, then we know this has to run on a codespaces
  // if (actions.map((a) => a.name).includes("type-terminal")) {
  //   url = `https://prod.liveshare.vsengsaas.visualstudio.com/join?049AB4AD9BC16BE338A13263281272C72C49`;
  // }

  return {
    url,
    actions,
    currentWorkingDirectory,
    videoFile,
    actionsAudioDirectory,
    actionsVideoDirectory,
    textToSpeechOption
  };
};
