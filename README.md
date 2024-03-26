# CodeVideo Backend Engine

_Any sufficiently advanced technology is indistinguishable from magic._ 😉

![NPM Version](https://img.shields.io/npm/v/@fullstackcraftllc/codevideo-backend-engine)
![Code Quality](https://img.shields.io/badge/Code_Quality-Spaghetti-blue)
![Code Coverage](https://img.shields.io/badge/Code_Quality-Minimal-blue)
![Moral](https://img.shields.io/badge/Code_Quality-High-blue)
![Tool Abilities](https://img.shields.io/badge/Tool_Abilities-Insane-blue)

Create shockingly realistic automated software videos!

## Quick Start - Programmatic Usage

Install this package:

```bash
npm install @fullstackcraft/codevideo-backend-engine
```

Use it in your project!

```typescript
import fs from 'fs'
import { generateVideoFromActions } from '@fullstackcraft/codevideo-backend-engine'
import { IAction } from '@fullstackcraft/codevideo-backend-engine/dist/types'

const actions: Array<IAction> = [
  {
    name: "speak-before",
    value: "I'm gonna type some code!"
  },
  {
    name: "type-editor",
    value: "console.log('Hello, world!');"
  },
]


// 'video' is a Buffer representing an mp4 video
const video = generateVideoFromActions(actions)

// for example, save the video to a file
fs.writeFileSync('hello-world.mp4', video)
```

## Quick Start - CLI Usage

Clone this repository:

```bash
git clone https://github.com/codevideo/codevideo-ai.git
```

Move into the repo:

```bash
cd codevideo-ai
```

Install dependencies:

```bash
npm install
```

Run the simple hello world example (creates a video on how to use the console.log function in JavaScript):

```bash
npm run start ./examples/hello-world.json
```

Let it run & have faith! A headless chrome browser is running in the background, creating your video. As long as you don't see errors on your console it will eventually finish and the video will be pop out in the `./video` directory.

There will be a variety of files created:

- `./audio/*.mp3` - the various speaking action audio files (generated before the video is made)
- `./audio/hello-world/combined.mp3` - the properly spaced speaking action audios combined and used to interleave into the editor video
- `./video/hello-world.mp4` - the final video with typing animation and audio

That's it! Create any automation you want by creating a new actions (either `.json` or `.ts`) and passing it to the `start` command. See the [defining actions section](#defining-actions) below for more information.

## Troubleshoot

On Windows you need to have Microsoft Speech Platform SDK or Runtime installed:
```
https://www.microsoft.com/en-us/download/details.aspx?id=14373
https://www.microsoft.com/en-us/download/details.aspx?id=27225
```

Any FFmpeg Problems? Install the latest version:
https://ffmpeg.org/download.html

## Other Examples

Looks like GitHub isn't very friendly for video embeds, you can see a few examples and a Web MVP [on our website at codevideo.ai](https://codevideo.io/ai).

Implementation of a Fibonacci function in TypeScript in a Monaco editor at `localhost`, driven by puppeteer:

- [TypeScript Fibonacci implementation](./video-examples/fibonacci.mp4)

Using the actual Visual Studio Code application, demonstrating how to use JavaScript's console.log function in Node.js, including opening the file and starting the script from the terminal. Driven by [`robotjs`](https://github.com/octalmage/robotjs) (cloned by CodeVideo and soon to be improved at [`robotts`](https://github.com/codevideo/robotts)):

- [JavaScript console.log in Node.js](./video-examples/console-log.mov)

## Other Text To Speech Engines

### Free

You can use say.js for free, but this will be a very robotic sounding voice.

### Paid

Currently, we support the following AI voices:

- Eleven Labs (including custom cloned voices*)
- OpenAI TTS (text-to-speech) 

*For inspiration on what to record to train a voice for Eleven Labs, we recommend recording yourself reading blog posts or other text that you find interesting - we had great results with just 45 minutes of recorded audio, when the 'optimum' amount recommended by Eleven Labs is supposed to be 3 hours or more.

To use Eleven Labs or OpenAI as the voice, you will need to set the `ELEVEN_LABS_API_KEY` + `ELEVEN_LABS_VOICE_ID` or `OPENAI_API_KEY` environment variables respectively.

Then pass as a second argument specifying if you want to use `elevenlabs` or `openai` respectively:

```bash
npm run start ./examples/hello-world.json elevenlabs
```

```bash
npm run start ./examples/hello-world.json openai
```

`sayjs` is also acceptable as an engine:

```bash
npm run start ./examples/hello-world.json sayjs
```

this is anyway the default and it doesn't need to be explicitely included.


## Defining Actions

The API works via an array of actions (type `IAction`), each represented by an object with a `name` and `value` property. These actions can be defined in a actions file. The actions file can be either a json file or a TypeScript file that contains an array of actions.

Here is an example of an action file, the very same one used to drive the hello-world example above:

```json
[
  {
    "name": "speak-before",
    "value": "To represent that this file is 'index.js', I'll just put a comment here"
  },
  {
    "name": "type-editor",
    "value": "// index.js"
  },
  {
    "name": "speak-before",
    "value": "Then, we'll add a simple console.log statement to the file."
  },
  {
    "name": "enter",
    "value": "1"
  },
  {
    "name": "type-editor",
    "value": "console.log('Hello, world!');"
  },
  {
    "name": "speak-before",
    "value": "For example, if I wanted to write the value of some variable, I could do that with console.log."
  },
  {
    "name": "backspace",
    "value": "29"
  },
  {
    "name": "type-editor",
    "value": "const myVariable = 'Important variable I want to keep track of';"
  },
  {
    "name": "enter",
    "value": "1"
  },
  {
    "name": "type-editor",
    "value": "console.log(myVariable);"
  },
  {
    "name": "speak-before",
    "value": "And that's it! We now know how to use the console.log function in JavaScript."
  }
]
```

Alternatively, you can define the actions directly in TypeScript. This is useful if you want to use the editor's Copilot / ChatGPT / intellisense to help you write the actions. The only important thing to note is that you must use `export default` syntax to export the actions. The equivalent TypeScript version of the above actions file would look like this:

```ts
const helloWorldActions: Array<IAction> = [
  {
    name: "speak-before",
    value: "To represent that this file is 'index.js', I'll just put a comment here"
  },
  {
    name: "type-editor",
    value: "// index.js"
  },
  {
    name: "speak-before",
    value: "Then, we'll add a simple console.log statement to the file."
  },
  {
    name: "enter",
    value: "1"
  },
  {
    name: "type-editor",
    value: "console.log('Hello, world!');"
  },
  {
    name: "speak-before",
    value: "For example, if I wanted to write the value of some variable, I could do that with console.log."
  },
  {
    name: "backspace",
    value: "29"
  },
  {
    name: "type-editor",
    value: "const myVariable = 'Important variable I want to keep track of';"
  },
  {
    name: "enter",
    value: "1"
  },
  {
    name: "type-editor",
    value: "console.log(myVariable);"
  },
  {
    name: "speak-before",
    value: "And that's it! We now know how to use the console.log function in JavaScript."
  }
]

// IMPORTANT!!! You must use the export default syntax here!!!
export default helloWorldActions
```

To see a list of all available actions, see the [action names as string directly in the codevideo-types repo](https://github.com/codevideo/codevideo-types/blob/main/src/constants/AllActionStrings.ts).

## Other Commands

### `clean`

```bash
npm run clean
```

This command cleans out the `./dist`, `./audio`, and `./video` directories. 

***Be careful! After running this, you'll have to regenerate everything again for each video made. This could get expensive if you are doing a lot of text to speech using a paid plan.

### `make-video`

```bash
npm run make-video ./examples/hello-world.json
```

Just an alias for `start`.

### `scripts-health-check`

It sometimes happens that the text to speech model produces artifacts in the audio. This command will run a health check on all audio files produced by an actions file by transcripting them and comparing their transcript to the original transcript using Levenshtein distance. If the transcripts are different, it will print out the file name and the transcript, and attempt to create a new audio file. This is most useful when using an AI generated voice, as the `say.js` library is a deterministic library and will always produce the same audio file for the same transcript.

Ex. check the accuracy of your Eleven Labs audio files:

```bash
npm run scripts-health-check ./examples/hello-world.json elevenlabs
```

Ex. check the accuracy of your OpenAI audio files:

```bash
npm run scripts-health-check ./examples/hello-world.json openai
```

### `scripts-character-count`

As is always the case with character or word based cost models, the amount of text that will be converted is always a question. This script prints out the character, word, and page count of all speaking-based actions in a given actions file.

```bash
npm run scripts-character-count ./examples/hello-world.json
```

### `code-health-check`

This command runs a health check of code after each `type` event, checking for any strange formatting or syntax errors. If it finds any, it will print out the file name and the error.

```bash
npm run code-health-check ./examples/hello-world.json
```

## Experimental: Visual Studio Code on Desktop Automation

Experimental: use a running instance of Visual Studio Code and `robotjs` to record in the desktop environment:

```bash
npm run visual-studio-code-driver ./examples/hello-world.json sayjs desktop
```

A few caveats are required to properly run desktop automation actions:

- Need exactly one 1920x1080 monitor
- The desktop to the right of where you issue the above script must be an empty instance of Visual Studio Code


## Patches!

Due to an ugly bug with `fluent-ffmpeg`, which is used by `puppeteer-screen-recorder`, the `fluent-ffmpeg` library has been patched with `patch-package`. For those interested, the patch is in `./patches/fluent-ffmpeg+2.1.2.patch`.