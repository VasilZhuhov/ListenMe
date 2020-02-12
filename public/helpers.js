let context = new AudioContext();
let buff;
let mainSource;
let currSong = null;
let isRunning = false;
let offset = 0;
let lastPlayed = [];
let lastArray = {};

function playByteArray( byteArray, song, duration ) {
    lastPlayed = [byteArray.slice(0), song, duration];
    let arrayBuffer = new ArrayBuffer(byteArray.length);
    let bufferView = new Uint8Array(arrayBuffer);
    for (i = 0; i < byteArray.length; i++) {
      bufferView[i] = byteArray[i];
    }
    context.decodeAudioData(byteArray, function(buffer) {
        buff = buffer;
        play(song, duration);
    });
}

function changeVolume(val){
    let volume = val;
    let fraction = parseInt(volume) / 100;
    gainNode.gain.value = fraction * fraction;
}

function play(song, duration) {
    if (isRunning === true){
        stop();
    }
    changeButton(isRunning);
    prepareProgressBar(duration);
    if (!context.createGain){
        context.createGain = context.createGainNode;
    }
      gainNode = context.createGain();
      let source = context.createBufferSource();
      source.buffer = buff;
      source.connect(gainNode);
      gainNode.connect(context.destination);
      // source.loop = true;
      if (!source.start)
        source.start = source.noteOn;
      source.start(0, offset);
      isRunning = true;
      mainSource = source;
}

function changeButton(paused){
  if(paused){
    document.getElementsByClassName('stoper')[0].classList.remove('fa-pause');
    document.getElementsByClassName('stoper')[0].classList.add('fa-play');
  }else{
    document.getElementsByClassName('stoper')[0].classList.remove('fa-play');
    document.getElementsByClassName('stoper')[0].classList.add('fa-pause');
  }
}

function pause(){
  document.getElementById("in").style['animation-play-state'] = 'paused';
  if(!isRunning){
    playByteArray.apply(null, lastPlayed);
  }
  changeButton(isRunning);
  isRunning = false;
  if (!mainSource.stop)
        mainSource.stop = mainSource.noteOff;
    offset = context.currentTime;
    mainSource.stop(0);
}

function stop(){
    cleanUpBar();
    offset = 0;
    isRunning = false;
    currSong = null;
    if (!mainSource.stop)
        mainSource.stop = mainSource.noteOff;
    mainSource.stop(0);
}

function cleanUpBar(){
  document.getElementById("in").style.animation = ``;
  document.getElementById("in").style.backgroundColor = ' ';
}

function prepareProgressBar(duration){
  let [mins, secs] = duration.split(':');
  let seconds = mins*60 + parseInt(secs);
  document.getElementById("in").style.animation = `fill ${seconds}s linear 1`;
  document.getElementById("in").style.backgroundColor = 'green';
}
