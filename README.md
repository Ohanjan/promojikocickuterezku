# A garden for you — GitHub Pages edition

Vanilla HTML, CSS and JavaScript, editable in VS Code. No build or installation needed.

## Put it on GitHub
The downloaded ZIP contains `index.html`, `styles.css`, `ascii.js`, `app.js`, `content.js`, and `assets/` at the top level of its project folder.
1. Extract the ZIP and open the project folder in VS Code.
2. Personalize the letter and signature in `content.js`.
3. Upload the contents of that folder to your GitHub repository, with `index.html` at the repository root. Do not upload only the ZIP.
4. Enable GitHub Pages for your publishing branch and its root folder. Send her the Pages website URL after publication, not the repository URL.

For the Sites-managed source repository, the same web files are under `dist/`; the downloadable ZIP flattens this folder for GitHub Pages.

## Included song
The uploaded MP3 is included as `assets/i-love-you.mp3`, trimmed to start at **0:18** of the original. The remaining duration is about **5:30**. Spotify has been removed; no account or separate file selection is needed.

**Open my heart** starts the included song and switches directly to the letter screen. One audio element remains mounted during navigation. Play/pause, seek, mute and volume controls remain available. Include the assets folder when uploading the project.

## Your letter
Edit `title`, `letter`, and `signature` in `content.js`. The letter is an editable sample. Preserve the backticks around it; escape any literal backtick as \` and any literal ${ sequence as \${. Blank lines create paragraphs.

`typewriterSpeed` is milliseconds per character. The show-whole-letter button skips typing. Reduced-motion preferences disable the typing and decorative motion.

## Your lyrics
No full song lyrics are included. The opening romantic words are original placeholder text. Supply the lyrics you want to display and their timestamps in `content.js`:

```js
lyrics: [
  { start: 0, end: 4.5, text: 'Your first line' },
  { start: 4.5, end: 10, text: 'Your next line' }
],
sampleLyrics: false
```

Times are seconds in the selected recording. Cue ranges must not overlap. Captions appear above the persistent player while the letter is visible. Timing uses audio.currentTime. Since the first 18 seconds have been removed, subtract 18 seconds from timestamps referring to the original song. Clip any cue crossing the trim point to start at zero and omit cues ending before it.

Settings also accept JSON arrays in the above format (strict JSON with quoted keys and no comments) and LRC:

```text
[00:00.00]Your first line
[00:04.50]Your next line
[00:10.00]
```

A final blank timestamp clears the last LRC line. Offset metadata is not applied. Imported lyrics and selected local audio last only for the current tab. Put permanent content into content.js/assets before uploading to GitHub.

## Structure
- index.html: two screens and persistent players.
- styles.css: responsive layout and animations.
- ascii.js: character-rendered heart, flowers and particles (canvas fillText, no raster artwork).
- app.js: transitions, audio, Spotify adapter, caption timing and typewriter.
- content.js: personal text and configuration.
- assets/: optional authorized audio.

## Verification
Syntax checks passed. The trimmed file is approximately 18 seconds shorter than the original (330.53 versus 348.53 seconds including MP3 container padding). Browser testing confirmed one audio element, no Spotify iframe, active playback on the letter screen, and a duration of approximately 5:30. Lyrics are not yet supplied.
