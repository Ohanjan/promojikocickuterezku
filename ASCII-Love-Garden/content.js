/* PERSONALIZE HERE. No build tools or dependencies are needed.
   Use an audio file you are authorized to use. Paths are relative to index.html. */
window.HEART_CONTENT = {
  musicSource: 'local', // 'local' uses your hosted MP3 instead.
  audioSrc: 'assets/i-love-you.mp3', // Example: 'assets/i-love-you.mp3'
  volume: 0.65,
  letterDelay: 24, // Retained for compatibility; the button now opens the letter immediately.
  typewriterSpeed: 32, // Milliseconds per character.
  title: 'My favourite place\nis with you.',
  // Replace this sample letter with your own words. Keep the surrounding backticks.
  letter: `My love,\n\nI wanted to make you something that felt a little like the way you make the world feel to me. Softer. Brighter. Full of small things worth noticing.\n\nSo I made you a garden that never stops blooming, and a heart that keeps turning towards you. Every little character on this page is here for the same reason: you.\n\nThis is where your own letter goes. Tell her about the moment you knew, your favourite ordinary day together, and the things you’re looking forward to. The words don’t have to be perfect. They just have to be yours.\n\nIf you ever forget how loved you are, come back here. I’ll leave the garden growing.`,
  signature: 'Always yours,\n[Your name]',
  // Add your supplied lyrics as {start: seconds, end: seconds, text: 'line'}.
  // Spotify does not supply lyrics through its embed API.
  lyrics: [],
  sampleLyrics: false
};
