// small setup stuff
var player;
let currentTrack = 0;
let playerReady = false;

// video list
const videoIds = [
  "xFf809oDLdE",
  "YeasVBuBCtU",
  "LGrca9EK_qQ", 
  "cCgxqqxE9Y0",
  "0clbtaXhtEw",
  "XfIVH3Q803c",
  "zIp7o53dfmY",
  "tz-QNii79lI",
  "pPrte-OhUh4",
  "6GWWFfZfXp0",
  "2maHkdezdEc",
  "11ImVzWeMHE",
  "m2Yhn6-jJPE",
  "bndL7wwAj0U",
  "_JfDU2Vj6k0",
];

// track titles
const titles = [
  "Björk - It's Oh So Quiet",
  "Saint Entienne - Only Love Can Break Your Heart",
  "Strange Boutique - Drown", 
  "Thievery Corporation - 33 Degree",
  "Eyedea & Abilities - Red Wiped in Blue",
  "Doctor Becket, El Da Sensei, P Original - Funky",
  "Thievery Corporation - Amerimacka",
  "Portishead - Western Eyes",
  "Pink Floyd - Hey You",
  "Low - Dinosaur Act",
  "Alice in Chains - Sunshine",
  "Deftones - Deathblow",
  "A Perfect Circle - The Package",
  "TOOL - Right In Two",
  "Nick Cave - Magneto",
];

document.addEventListener('DOMContentLoaded', function() {
  // theme toggle
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = 'light mode';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = isDark ? 'light mode' : 'dark mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // nav stuff
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // load yt api
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// build player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-player', {
    height: '42',
    width: '68',
    videoId: videoIds[0],
    playerVars: {
      'controls': 0,
      'disablekb': 1,
      'enablejsapi': 1,
      'rel': 0,
      'modestbranding': 2,
      'showinfo': 0,
      'playsinline': 1,
      'fs': 0,
      'iv_load_policy': 3,
      'autohide': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// when ready
function onPlayerReady(event) {
  playerReady = true;
  updateTrackInfo();
}

let timer;
// handle play state
function onPlayerStateChange(event) {
  const playpauseBtn = document.getElementById("playpause-btn");
  
  if(event.data == YT.PlayerState.ENDED) {
    nextTrack();
  } else if(event.data == YT.PlayerState.PLAYING) {
    playpauseBtn.textContent = "⏸";
    if (!timer) timer = setInterval(updateTime, 1000);
  } else {
    playpauseBtn.textContent = "▶";
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
}

// update time display
function updateTime() {
  if (player && playerReady) {
    const current = player.getCurrentTime();
    const duration = player.getDuration();
    
    if (!isNaN(current) && !isNaN(duration)) {
      document.getElementById("slider").value = current;
      document.getElementById("slider").max = duration;
      document.getElementById("current-time").textContent = formatTime(current);
      document.getElementById("duration").textContent = formatTime(duration);
    }
  }
}

// format seconds
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// update song name
function updateTrackInfo() {
  const nowplaying = document.getElementById("nowplaying");
  const info = document.getElementById("info");
  nowplaying.textContent = `playing ${currentTrack + 1} of ${videoIds.length}`;
  info.textContent = titles[currentTrack];
}

// next song
function nextTrack() {
  currentTrack = (currentTrack + 1) % videoIds.length;
  player.loadVideoById(videoIds[currentTrack]);
  updateTrackInfo();
}

// previous song
function prevTrack() {
  currentTrack = (currentTrack - 1 + videoIds.length) % videoIds.length;
  player.loadVideoById(videoIds[currentTrack]);
  updateTrackInfo();
}

// control buttons
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("playpause-btn").addEventListener("click", function() {
    if (player && playerReady) {
      if (player.getPlayerState() === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  });

  document.getElementById("next-btn").addEventListener("click", nextTrack);
  document.getElementById("prev-btn").addEventListener("click", prevTrack);
  
  document.getElementById("slider").addEventListener("input", function() {
    if (player && playerReady) {
      player.seekTo(parseFloat(this.value), true);
    }
  });
});

// shuffle title text
(function($) {
    $.fn.ShuffleText = function(strings, options) {
        function striphtml(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        var self = this;
        if (typeof strings !== 'object') { 
            throw new TypeError('need an array');
        }

        $(self).html(strings[0]);

        var loop = options.loop || true,
            iterations = options.iterations || 60,
            delay = options.delay || 10000,
            shuffleSpeed = options.shuffleSpeed || 25,
            step = options.step || function() {};

        var currentIndex = 0;
        var lastIndex = 0;

        // pick random line
        var pickRandomString = function() {
            var randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * strings.length);
            } while (randomIndex === lastIndex);
            return randomIndex;
        };

        // animate shuffle
        var iterateString = function(index) {
            currentIndex = index;
            $(self).html(strings[index]);

            var morpher = function(i) {
                var string = '';
                var mask = striphtml(strings[lastIndex] + strings[index]).split('');
                var diffLength = Math.floor((striphtml(strings[index]).length - striphtml(strings[lastIndex]).length) / iterations * i);
                var last = striphtml(strings[lastIndex]).length;

                for (var j = 0; j < last + diffLength; j++) {
                    var rand = Math.floor(Math.random() * mask.length),
                        randomLetter = mask[rand];
                    string += randomLetter;
                }
                $(self).html(string);

                if (i !== iterations) {
                    setTimeout(function() {
                        morpher(i + 1);
                    }, shuffleSpeed);
                } else {
                    $(self).html(strings[index]);
                    step(strings[index]);
                    lastIndex = currentIndex;

                    // keep looping
                    setTimeout(function() {
                        var nextRandomIndex = pickRandomString();
                        iterateString(nextRandomIndex);
                    }, delay);
                }
            };
            morpher(0);
        };

        // start it
        setTimeout(function() {
            var firstRandomIndex = pickRandomString();
            iterateString(firstRandomIndex);
        }, delay);
    }
})(jQuery);

// start shuffle
document.addEventListener('DOMContentLoaded', function() {
  $('#shuffle-title').ShuffleText([
    "Hello!",
    "sudo apt-get install sl && sl 🚂💨",
    "That's not even funny, man!",
    "Transmitting live with the hardcore style!", 
    "Born to CSS, forced to VANILLA JAVASCRIPT!!!",
    "T.M. Yachimovicz",
    "It's a Casio on a plastic beach!",
    "Nonagon infinity opens the door!",
    "Have the benefits of tax cuts trickled down yet??",
    "Well I can comprehend these manmade horrors perfectly fine so idk maybe you have a skill issue or smth",
    "¡Ay <s>cabron!</s> Lebron!",
    "Forty six and two are just ahead of me!",
    "Makin' snacks on wax plates for DJs to scratch!",
    "You know the business!",
    "Keep it live!",
    "Let's mosey!",
    "Hungry for life.",
  ], {
    loop: true,
    delay: 10000,
    iterations: 60,
    shuffleSpeed: 25
  });
});
