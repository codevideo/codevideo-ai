import say from "say";
import fs from "fs";
import os from "os";
import { convertWavToMp3AndDeleteWav } from "../audio/convertWavToMp3AndDeleteWav.js";

export const saveToFileSay = async (
  id: string,
  text: string,
  audioFolderPath: string,
  forceOverwrite: boolean
) => {
  console.log(`Writing audio file to ${audioFolderPath}`)
  return new Promise<void>((resolve, reject) => {
    const filePath = `${audioFolderPath}/${id}.mp3`;
    if (fs.existsSync(filePath) && !forceOverwrite) {
      console.log(`File with hash ${id} already exists. Skipping...`);
      resolve(); // Resolve immediately if file exists and no force overwrite
    } else {
      const wavFile = `${audioFolderPath}/${id}.wav`;
      const name = os.platform() === "win32" ? 'Microsoft David Desktop' : 'Daniel';
      say.export(text, name, 1, wavFile, async (err) => {
        if (err) {
          console.error(err);
          reject(err); // Reject promise if there's an error during export
        } else {
          try {
            await convertWavToMp3AndDeleteWav(wavFile, forceOverwrite);
            console.log(`Script for step ${id} converted to audio with say.`);
            resolve(); // Resolve promise after conversion and deletion
          } catch (error) {
            reject(error); // Reject promise if there's an error during conversion/deletion
          }
        }
      });
    }
  });
};
