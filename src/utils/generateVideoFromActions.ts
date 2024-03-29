import fs from "fs";
import os from "os";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { addAudioToVideo } from "../audio/addAudioToVideo.js";
import { buildAudioFile } from "../audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "../audio/convertScriptPropertiesToAudio.js";
import { runPuppeteerAutomation } from "../puppeteer/runPuppeteerAutomation.js";
import { TextToSpeechOptions } from "../types/TextToSpeechOptions.js";

// TODO: using VideoGenerator class?
// export const generateVideoFromActions = async (actions: Array<IAction>): Promise<Buffer> => {
//   const videoGenerator = new VideoGenerator();
//   await videoGenerator.makeVideo();
//   return videoGenerator.getVideoAsBuffer();
// };

// using series of functions
export const generateVideoFromActions = async (actions: Array<IAction>, textToSpeechOption: TextToSpeechOptions): Promise<Buffer> => {
  const fileNameWithoutExtension = "tmp";
  const currentWorkingDirectory = process.cwd();
  
  if (os.platform() === "linux" && textToSpeechOption === "sayjs") {
    console.log("sayjs is only supported on windows and mac, using festival instead");
    textToSpeechOption = "festival";
  }

  // the editor.html file is copied into the dist folder of the package itself, and thus must be loaded from there for any 3rd party call
  // TODO: this will now break local usages, we'll make a better solution for this later
  const directoryOfPackageDistItself = `${currentWorkingDirectory}/node_modules/@fullstackcraftllc/codevideo-backend-engine/dist`;
  const editorUrl = `file://${directoryOfPackageDistItself}/editor.html`;

  // create all folders as needed if they don't exist
  fs.mkdirSync(`${currentWorkingDirectory}/tmp`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/video`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`, { recursive: true });

  const audioDirectory = `${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`;
  const videoDirectory = `${currentWorkingDirectory}/tmp/video`;
  const videoFile = `${currentWorkingDirectory}/tmp/video/${fileNameWithoutExtension}.mp4`;

  // first convert scripts to audio
  const audioFiles = await convertSpeakActionsToAudio(
    actions,
    audioDirectory,
    false,
    textToSpeechOption
  );

  // then run the puppeteer automation, which records the video and returns the start times of each audio
  const audioStartTimes = await runPuppeteerAutomation(
    editorUrl,
    videoFile,
    actions,
    audioDirectory
  );

  // now that we have the offset delays for each audio, build the audio file
  await buildAudioFile(audioDirectory, audioFiles, audioStartTimes);

  // then combine the audio and video files
  await addAudioToVideo(videoDirectory, videoFile, audioDirectory);

  // finally load the video and return it as a buffer
  return fs.promises.readFile(videoFile);
};

