/*var context = new AudioContext();
var gainNode = context.createGain ? context.createGain():
context.createGainNode();
gainNode.connect(context.destination);
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET',url,true);
    request.responseType = 'arraybufer';
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            playSound(buffer);
        });
    };
    request.send();
}

function playSound(buffer) {
    var sound = context.createBufferSource();
    sound.buffer = buffer;
    sound.connect(gainNode);
    sound.loop = false;
    gainNode.gain.value = 0.2;
    sound.start(0);
}
*/

var soundManager = {
    clips:{},
    context: null,
    gainNode: null,
    loaded: false,
    init: function () {    },
    load:function (path, callback) {    },
    loadArray: function (array) {    },
    play: function (path, settings) {    },
};

function init() {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain ?
        this.context.createGain():this.context.createGainNode();
    this.gainNode.connect(this.context.destination);
};

function load(path, callback) {
    if(this.clips[path]){
        callback(this.clips[path]);
        return;
    };
    var clip = {path: path, buffer: null, loaded:false};
    clip.play = function (volume, loop) {
        soundManager.play(this.path, {looping:loop?loop:false, volume:volume?volume:1});
    };
    this.clips[path] = clip;
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = function (buffer) {
        soundManager.context.decodeAudioData(request.response,function (buffer) {
            clip.buffer = buffer;
            clip.loaded = true;
            callback(clip);
        });

    };
    request.send();
}

function loadArray(array) {
    for (var i = 0; i<array.length; i++){
        if(array.length===Object.keys(soundManager.clips).length){
            for(sd in soundManager.clips)
                if(!soundManager.clips[sd].loaded) return;
            soundManager.loaded = true;
        }
    }
}


function play(path, settings) {
    if (!soundManager.loaded){
        setTimeout(function () {soundManager.play(path,settings);},1000);
        return;
    }
    var looping = false;
    var volume = 1;
    if (settings){
        if (settings.looping)
            looping = false;
        if (settings.volume)
            volume = 1;
        }
    var sd = this.clips[path];
    if (sd === null)
        return false;
    var sound = new soundManager.context.createBufferSource();
    sound.buffer = sd.buffer;
    sound.connect(soundManager.gainNode);
    sound.loop = looping;
    soundManager.gainNode.gain.value = volume;
    sound.start(0);
    return true;
}

