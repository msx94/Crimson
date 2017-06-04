

var currentFile = "";
function playAudio() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio');
            var btn = document.getElementById('play');
            var audioURL = document.getElementById('audiofile');

            //Skip loading if current file hasn't changed.
            if (audioURL.innerHTML !== currentFile) {
                oAudio.src = audioURL.innerHTML;
                currentFile = audioURL.innerHTML;
            }

            // Tests the paused attribute and set state.
            if (oAudio.paused) {
                oAudio.play();
                btn.textContent = "Pause";
            }
            else {
                oAudio.pause();
                btn.textContent = "Play";
            }
        }
        catch (e) {
            // Fail silently but show in F12 developer tools console
            if(window.console && console.error("Error:" + e));
        }
    }
}
// Rewinds the audio file by 30 seconds.

function rewindAudio() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio');
            oAudio.currentTime -= 30.0;
        }
        catch (e) {
            // Fail silently but show in F12 developer tools console
            if(window.console && console.error("Error:" + e));
        }
    }
}

// Fast forwards the audio file by 30 seconds.

function forwardAudio() {

    // Check for audio element support.
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio');
            oAudio.currentTime += 30.0;
        }
        catch (e) {
            // Fail silently but show in F12 developer tools console
            if(window.console && console.error("Error:" + e));
        }
    }
}

// Restart the audio file to the beginning.

function restartAudio() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio');
            oAudio.currentTime = 0;
        }
        catch (e) {
            // Fail silently but show in F12 developer tools console
            if(window.console && console.error("Error:" + e));
        }
    }
}

// Put the audio track in the player

function putAudio(obj) {
    document.getElementById("audiofile").value = obj.value;
}
