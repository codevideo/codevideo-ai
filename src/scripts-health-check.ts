import { preprocessStringForComparison } from "./utils/preprocessStringForComparison";
import { loadActions } from "./io/loadActions";
import { speechToText } from "./openai/speechToText";
import { levenshteinDistance } from "./utils/levenshteinDistance";
import { convertSpeakActionsToAudio } from "./audio/convertScriptPropertiesToAudio";
import { IAction, isSpeakAction } from "@fullstackcraftllc/codevideo-types";
import { sha256Hash } from "./utils/sha256Hash";

const distanceThreshold = 0;

const scriptsHealthCheck = async () => {
  // load in the actions file
  const { actions, actionsAudioDirectory } = loadActions('typescript');

  // for each script, generate the transcript with OpenAI whisper, 
  // then compare the original text with the resulting transcript using levenshtein distance
  for (let i = 0; i < actions.length; i++) {
    const textHash = sha256Hash(actions[i].value);
    const action = actions[i];

    if (isSpeakAction(action)) {
      await checkForArtifacts(textHash, action, actionsAudioDirectory);
    }
  }
};

const checkForArtifacts = async (
  textHash: string,
  action: IAction,
  stepsAudioPath: string
) => {
  // generate transcript
  const textToSpeak = action.value;
  const transcript = await speechToText(`${stepsAudioPath}/${textHash}.mp3`);
  if (!transcript) {
    console.log(
      `Script with hash ${textHash}: Error creating transcript from audio file (${stepsAudioPath}/${textHash}.mp3)`
    );
    return;
  }
  // first preprocess the texts (all to lowercase and removing any non a-z0-9 characters) compare with levenshtein distance
  const distance = levenshteinDistance(
    preprocessStringForComparison(textToSpeak),
    preprocessStringForComparison(transcript)
  );
  // if the levenshtein distance is greater than distanceThreshold, log the results
  if (distance > distanceThreshold) {
    console.log("WARNING - POTENTIAL ARTIFACTS DETECTED!");
    console.log(
      `Text hash: ${textHash}:\nOriginal: ${textToSpeak}\nTranscript: ${transcript}\nLevenshtein distance: ${distance}`
    );
    // and regenerate the audio for this step
    console.log(`Regenerating audio for step ${textHash}...`);
    if (isSpeakAction(action)) {
      await convertSpeakActionsToAudio([action], stepsAudioPath, true);
    }
  } else {
    console.log(
      `Text hash: ${textHash}: No artifacts detected. (Levenshtein distance: ${distance})`
    );
  }
};

scriptsHealthCheck();
