// Function to detect mobile devices using user agent string
function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileUserAgents = [
      'android', 'iphone', 'ipod', 'ipad', 'windows phone',
      'blackberry', 'mobile', 'kindle', 'silk', 'opera mini'
  ];
  return mobileUserAgents.some(agent => userAgent.includes(agent));
}
// Path to M3U8 file
var hlsUrl = 'master.m3u8'; // Replace with the actual path to your .m3u8 file

var video = document.getElementById('my-video');
// Initialize Video.js player
var player = videojs('my-video', {
techOrder: ['html5'],  // Make sure the HTML5 tech is the first choice
html5: {
hls: {
overrideNative: true  // Enable HLS.js for browser compatibility (important for older browsers)
}
}
});

document.addEventListener('keydown', function(event) {
switch (event.key.toLowerCase()) {
case 'f': // F key - Toggle fullscreen
if (player.isFullscreen()) {
player.exitFullscreen();
} else {
player.requestFullscreen();
}
break;
case 'm': // M key - Mute/unmute the video
player.muted(!player.muted());
break;
case 'j': // J key - Rewind 10 seconds
player.currentTime(player.currentTime() - 10);
break;
case 'l': // L key - Fast forward 10 seconds
player.currentTime(player.currentTime() + 10);
break;
case 'k': // K key - Pause/play the video
if (player.paused()) {
player.play();
} else {
player.pause();
}
break;
case 'c': // C key - Enable/disable captions
var textTracks = player.textTracks();
// Loop through all text tracks (subtitles, captions)
for (var i = 0; i < textTracks.length; i++) {
var track = textTracks[i];
// Toggle caption visibility (activate/deactivate)
track.mode = (track.mode === 'showing') ? 'disabled' : 'showing';
}
break;
default:
break;
}
});


if (Hls.isSupported()) {
// Initialize HLS.js
var hls = new Hls();
hls.loadSource(hlsUrl);
hls.attachMedia(video);
console.log("On browser that doesn't natively support HLS - using HLS.js with MSE")
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
// Fallback for Safari (natively supports HLS)
video.src = hlsUrl;
console.log("On Safari - natively loading HLS manifest")
} else {
video.src = "h264.mp4";
console.log("MSE and HLS not supported - loading traditional stream")
}
// Show the button only on mobile devices
function checkFileAndShowAlert() {
// Assuming the file is being fetched via a request
fetch('master.m3u8')
.then(response => {
if (!response.ok) {
// File not found or some error occurred, show the alert
alert("The server is having some technical difficulties or is unavailable - The video could not be streamed, you can still download the video by right-clicking and selecting Download Video");
} else {
// Proceed with streaming the video
// You can handle video playback logic here
}
})
.catch(error => {
// Handle network error, alert the user
alert("The server is having some technical difficulties or is unavailable - The video could not be streamed, you can still download the video by right-clicking and selecting Download Video");
});
}


// Custom context menu
$(document).ready(function () {
$('#context-area').on('contextmenu', function (e) {
e.preventDefault();
$('#custom-menu')
  .css({
      top: e.pageY + 'px',
      left: e.pageX + 'px'
  })
  .show();
});

$(document).on('click', function () {
$('#custom-menu').hide();
});

$('#custom-menu li').on('click', function () {
if ($(this).text() === "Download Video") {
  $('#download-dialog').show(); // Show the "download ready" dialog

} else if ($(this).text() === "Get sharable link") {
  window.open("https://drive.google.com/file/d/1o0f-588dCsI1WMxriHEfmtulyq70JrCt/view?usp=sharing");
} else if ($(this).text() === "Enable video looping") {
  var loopElement = document.getElementById("menu-item-4")
  const videoElement = videojs('my-video');
  videoElement.loop(true);
  loopElement.innerText = "Disable video looping"
  console.log("Looping enabled");
} else if ($(this).text() === "Disable video looping") {
  var loopElement = document.getElementById("menu-item-4")
  const videoElement = videojs('my-video');
  videoElement.loop(false);
  loopElement.innerText = "Enable video looping"
  console.log("Looping disabled");
} else if ($(this).text() === "Close Menu") {
  $('#custom-menu').hide();
}
});
});


function closeDownloadDialog() {
$('#download-dialog').hide(); // Show the "download ready" dialog 
}
function downloadVideo() {
window.open("h264.mp4")
}

function downloadHLSVideo() {
window.open("master.m3u8")
}

function downloadVP9Video() {
window.open("vp9.webm")
}

window.onload = function () {
window.scrollTo(0, document.body.scrollHeight);
};

let pressTimer;

var contextMenu = document.getElementById("custom-menu")

if (isMobileDevice()) {
$('#menu-item-7').show(); // Show the "download ready" dialog 
// Detect long press on the context menu div
contextMenu.addEventListener('touchstart', function(e) {
// Start a timer to detect long press
pressTimer = setTimeout(function() {
// Trigger the dialog to open after long press
$('#custom-menu').show(); // Show the "download ready" dialog 
}, 1000); // 1000ms (1 second) for long press
});

// If the touch ends before 1 second, cancel the action
contextMenu.addEventListener('touchend', function(e) {
clearTimeout(pressTimer); // Clear the timer if the press was too short
});

}

document.addEventListener('DOMContentLoaded', () => {
      const tipMessage = document.getElementById('tipMessage');
      const tipShown = localStorage.getItem('tipShown');

      if (isMobileDevice()) {
      if (!tipShown) {
        // Show the tip message after a slight delay
        setTimeout(() => {
          tipMessage.classList.add('show');
        }, 100); // 1-second delay

        // Hide the tip message after a longer delay
        setTimeout(() => {
          tipMessage.classList.remove('show');
        }, 4000); // 10 seconds display duration

        // Store in localStorage to prevent re-showing
        localStorage.setItem('tipShown', 'true');
      }
    }});
