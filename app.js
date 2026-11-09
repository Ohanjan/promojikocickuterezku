/* One audio element lives outside both screens. Navigation never replaces it.
   Lyric cues and automatic transitions use audio.currentTime, not wall time. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), config=window.HEART_CONTENT, audio=$('audio');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let cues=[], opened=false, letterShown=false, transitionPending=false, typingTimer, objectURL, activeCue=-2, sample=config.sampleLyrics;
  const format=s=>Number.isFinite(s)?`${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`:'--:--';
  function validateCues(data){if(!Array.isArray(data))throw Error('Use an array of {start, end, text} cues.');const sorted=data.map(c=>({start:Number(c.start),end:Number(c.end),text:c.text})).sort((a,b)=>a.start-b.start);sorted.forEach((c,i)=>{if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||typeof c.text!=='string'||(i&&c.start<sorted[i-1].end))throw Error('Cues need valid seconds, text, and no overlaps.');});return sorted;}
  function parseLRC(text){const lines=[];for(const line of text.split(/\r?\n/)){const tags=[...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];const words=line.replace(/\[[^\]]*\]/g,'').trim();for(const tag of tags)lines.push({start:Number(tag[1])*60+Number(tag[2]),text:words});}lines.sort((a,b)=>a.start-b.start);if(!lines.length)throw Error('No LRC timestamps found.');return lines.map((c,i)=>({...c,end:lines[i+1]?.start??Math.max(c.start+8,Number.isFinite(audio.duration)?audio.duration:0)}));}
  try{cues=validateCues(config.lyrics);}catch(e){$('status').textContent=e.message;}
  audio.volume=config.volume??.65;$('volume').value=audio.volume;
  if(config.audioSrc){audio.src=config.audioSrc;$('audio-settings').textContent='Music settings';}
  Array.from('♡  Open my heart  ♡').forEach((char,i)=>{const s=document.createElement('span');s.textContent=char;s.style.setProperty('--x',`${Math.sin(i*7)*160}px`);s.style.setProperty('--y',`${Math.cos(i*3)*100}px`);s.style.setProperty('--delay',`${i*.065}s`);$('button-letters').append(s);});
  function showSettings(){if(!$('setup').open)$('setup').showModal();}
  $('settings').onclick=$('audio-settings').onclick=showSettings;
  async function play(){if(!audio.getAttribute('src')){showSettings();$('setup-status').textContent='Choose your authorized MP3 to start the soundtrack.';return;}try{await audio.play();$('status').textContent=sample?'Original demo captions · replace them with your timed lyrics.':'Let the world go quiet.';}catch{$('status').textContent='Could not play this file. Choose a supported audio file in music settings.';}}
  $('play').onclick=()=>audio.paused?play():audio.pause();
  $('open').onclick=()=>{opened=true;play();showLetter();sync();};
  $('audio-file').onchange=async event=>{const file=event.target.files[0];if(!file)return;audio.pause();if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(file);audio.src=objectURL;audio.load();activeCue=-2;$('audio-settings').textContent='Music settings';$('setup-status').textContent='Audio loaded. Use Play to listen.';$('status').textContent='Your soundtrack is ready.';if(opened){$('setup').close();await play();}};
  $('lyrics-file').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{const text=await file.text();cues=validateCues(file.name.toLowerCase().endsWith('.lrc')?parseLRC(text):JSON.parse(text));sample=false;activeCue=-2;sync();$('setup-status').textContent=`Loaded ${cues.length} timed lyric cues.`;}catch(e){$('setup-status').textContent=`Lyrics not loaded: ${e.message}`;}event.target.value='';};
  $('volume').oninput=e=>{audio.volume=Number(e.target.value);audio.muted=false;updateMute();};
  function updateMute(){$('mute').textContent=audio.muted?'×':'♪';$('mute').setAttribute('aria-label',audio.muted?'Unmute music':'Mute music');$('mute').setAttribute('aria-pressed',String(audio.muted));}
  $('mute').onclick=()=>{audio.muted=!audio.muted;updateMute();};
  $('seek').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(e.target.value)/100;sync();};
  function sync(){const time=audio.currentTime,duration=audio.duration;$('elapsed').textContent=format(time);$('duration').textContent=format(duration);$('seek').disabled=!Number.isFinite(duration)||duration<=0;$('seek').value=Number.isFinite(duration)&&duration>0?time/duration*100:0;$('seek').setAttribute('aria-valuetext',`${format(time)} of ${format(duration)}`);
    if(opened){const index=cues.findIndex(c=>time>=c.start&&time<c.end);if(index!==activeCue){activeCue=index;$('lyric').textContent=index<0?'':cues[index].text;$('caption').textContent=index<0?(cues.length?'Let the world go quiet.':'Your words belong here.'):cues[index].text;$('lyric').classList.remove('reveal');void $('lyric').offsetWidth;$('lyric').classList.add('reveal');$('lyric-caption').textContent=sample?'ORIGINAL DEMO WORDS · YOUR LYRICS GO HERE':'OUR SOUNDTRACK';}}}
  ['timeupdate','loadedmetadata','durationchange','seeked'].forEach(e=>audio.addEventListener(e,sync));
  audio.addEventListener('play',()=>{$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','Pause music');});
  ['pause','ended'].forEach(e=>audio.addEventListener(e,()=>{$('play').textContent='▶';$('play').setAttribute('aria-label','Play music');}));
  audio.addEventListener('ended',()=>{if(opened&&!letterShown)showLetter();});
  audio.addEventListener('error',()=>{$('status').textContent='Audio unavailable. Add your MP3 using Music settings.';});
  $('letter-title').textContent=config.title;$('letter-title').style.whiteSpace='pre-line';
  function finishLetter(){clearTimeout(typingTimer);$('letter-body').textContent=config.letter;$('letter-body').classList.remove('typing');$('signature').textContent=config.signature;$('finish-letter').hidden=true;}
  function typeLetter(){clearTimeout(typingTimer);if(reduced.matches){finishLetter();return;}const chars=Array.from(config.letter);let n=0;$('letter-body').textContent='';$('signature').textContent='';$('finish-letter').hidden=false;$('letter-body').classList.add('typing');function tick(){n++;$('letter-body').textContent=chars.slice(0,n).join('');if(n<chars.length)typingTimer=setTimeout(tick,config.typewriterSpeed);else finishLetter();}tick();}
  function showLetter(){if(transitionPending||!$('letter-screen').hidden)return;transitionPending=true;letterShown=true;$('garden').classList.add('leaving');setTimeout(()=>{$('garden').hidden=true;$('garden').classList.remove('leaving');$('letter-screen').hidden=false;transitionPending=false;typeLetter();$('letter-title').tabIndex=-1;$('letter-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});},reduced.matches?0:650);}
  $('read-letter').onclick=showLetter;$('finish-letter').onclick=finishLetter;
  $('back').onclick=()=>{clearTimeout(typingTimer);$('letter-screen').hidden=true;$('garden').hidden=false;$('open').focus({preventScroll:true});};
  $('status').textContent='I Love You · Fontaines D.C.';
  window.addEventListener('beforeunload' ,()=>{if(objectURL)URL.revokeObjectURL(objectURL);});
})();
