/* full javascript - replace your musicplayer.js + menu.js combined */

var player, miniPlayer;
let currentTrack = 0;
let playerReady = false;
let miniPlayerReady = false;

const videoIds = [
  "xFf809oDLdE",
  "LGrca9EK_qQ", 
  "fXmEJLMgY8M",
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

const titles = [
  "Björk - It's Oh So Quiet",
  "Strange Boutique - Drown", 
  "Björk - Play Dead",
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

  // nav menu
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
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

// youtube players
function onYouTubeIframeAPIReady() {
  // main player
  if (document.getElementById('video-player')) {
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
  
  // mini player
  if (document.getElementById('mini-video-player')) {
    miniPlayer = new YT.Player('mini-video-player', {
      height: '34',
      width: '54',
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
        'onReady': onMiniPlayerReady,
        'onStateChange': onMiniPlayerStateChange
      }
    });
  }
}

function onPlayerReady(event) {
  playerReady = true;
  updateTrackInfo();
}

function onMiniPlayerReady(event) {
  miniPlayerReady = true;
  updateMiniTrackInfo();
}

function onPlayerStateChange(event) {
  const playpauseBtn = document.getElementById("playpause-btn");
  
  if(event.data == YT.PlayerState.ENDED) {
    nextTrack();
  } else if(event.data == YT.PlayerState.PLAYING) {
    playpauseBtn.textContent = "❚❚";
    if (timer) clearInterval(timer);
    timer = setInterval(updateTime, 1000);
  } else {
    playpauseBtn.textContent = "▶";
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
}

function onMiniPlayerStateChange(event) {
  const miniPlaypauseBtn = document.getElementById("mini-playpause-btn");
  
  if(event.data == YT.PlayerState.ENDED) {
    nextTrack();
  } else if(event.data == YT.PlayerState.PLAYING) {
    miniPlaypauseBtn.textContent = "❚❚";
  } else {
    miniPlaypauseBtn.textContent = "▶";
  }
}

let timer;
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

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTrackInfo() {
  const nowplaying = document.getElementById("nowplaying");
  const info = document.getElementById("info");
  if (nowplaying) nowplaying.textContent = `playing ${currentTrack + 1} of ${videoIds.length}`;
  if (info) info.textContent = titles[currentTrack];
}

function updateMiniTrackInfo() {
  const miniTitle = document.getElementById("mini-track-title");
  if (miniTitle) miniTitle.textContent = titles[currentTrack];
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % videoIds.length;
  if (player && playerReady) player.loadVideoById(videoIds[currentTrack]);
  if (miniPlayer && miniPlayerReady) miniPlayer.loadVideoById(videoIds[currentTrack]);
  updateTrackInfo();
  updateMiniTrackInfo();
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + videoIds.length) % videoIds.length;
  if (player && playerReady) player.loadVideoById(videoIds[currentTrack]);
  if (miniPlayer && miniPlayerReady) miniPlayer.loadVideoById(videoIds[currentTrack]);
  updateTrackInfo();
  updateMiniTrackInfo();
}

// controls
document.addEventListener('DOMContentLoaded', function() {
  // main controls
  document.getElementById("playpause-btn")?.addEventListener("click", function() {
    if (player && playerReady) {
      if (player.getPlayerState() === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  });

  document.getElementById("next-btn")?.addEventListener("click", nextTrack);
  document.getElementById("prev-btn")?.addEventListener("click", prevTrack);
  
  document.getElementById("slider")?.addEventListener("input", function() {
    if (player && playerReady) {
      player.seekTo(parseFloat(this.value), true);
    }
  });

  // mini controls
  document.getElementById("mini-playpause-btn")?.addEventListener("click", function() {
    if (miniPlayer && miniPlayerReady) {
      if (miniPlayer.getPlayerState() === 1) {
        miniPlayer.pauseVideo();
      } else {
        miniPlayer.playVideo();
      }
    }
  });

  document.getElementById("mini-next-btn")?.addEventListener("click", nextTrack);
  document.getElementById("mini-prev-btn")?.addEventListener("click", prevTrack);
});

// shuffle title (unchanged)
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

    var pickRandomString = function() {
      var randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * strings.length);
      } while (randomIndex === lastIndex);
      return randomIndex;
    };

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

          setTimeout(function() {
            var nextRandomIndex = pickRandomString();
            iterateString(nextRandomIndex);
          }, delay);
        }
      };
      morpher(0);
    };

    setTimeout(function() {
      var firstRandomIndex = pickRandomString();
      iterateString(firstRandomIndex);
    }, delay);
  }
})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
  $('#shuffle-title').ShuffleText([
    "Hello!",
    "sudo apt-get install sl && sl 🚂💨",
    "That's not even funny, man!",
    "Transmitting live with the hardcore style!",
    "Pueblo unido, jamás será vencido.",
    "Born to CSS, forced to VANILLA JAVASCRIPT!!!",
    "T.M. Yachimovicz",
    "It's a Casio on a plastic beach!",
    "Nonagon infinity opens the door!",
    "Has it trickled down yet?",
    "Well I can comprehend these manmade horrors perfectly fine so idk maybe you have a skill issue or smth",
    "Forty six and two are just ahead of me!",
    "Makin' snacks on wax plates for DJs to scratch!",
    "Don't these talking monkeys know that Eden has enough to go around?",
    "You know the business!",
    "Keep it live!",
    "Let's mosey!",
    "I'm the thirty three degree!",
  ], {
    loop: true,
    delay: 10000,
    iterations: 60,
    shuffleSpeed: 25
  });
});
