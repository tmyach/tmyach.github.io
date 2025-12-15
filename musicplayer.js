/* full javascript - replace your musicplayer.js + menu.js + shuffle */

var player, miniPlayer;
let currentTrack = 0;
let playerReady = false;
let miniPlayerReady = false;
let timer;

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

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      toggleBtn.textContent = isDark ? 'light mode' : 'dark mode';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // nav menu - fixed hamburger
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });

  // year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mini player collapse
  const miniPlayerContainer = document.getElementById('mini-player');
  const collapseBtn = document.getElementById('collapse-btn');
  
  if (collapseBtn && miniPlayerContainer) {
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      miniPlayerContainer.classList.toggle('collapsed');
      collapseBtn.textContent = miniPlayerContainer.classList.contains('collapsed') ? '+' : '−';
    });
  }

  // main player controls
  const playpauseBtn = document.getElementById("playpause-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const slider = document.getElementById("slider");

  if (playpauseBtn) {
    playpauseBtn.addEventListener("click", function() {
      if (player && playerReady) {
        if (player.getPlayerState() === 1) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }
    });
  }

  if (nextBtn) nextBtn.addEventListener("click", nextTrack);
  if (prevBtn) prevBtn.addEventListener("click", prevTrack);
  
  if (slider) {
    slider.addEventListener("input", function() {
      if (player && playerReady) {
        player.seekTo(parseFloat(this.value), true);
      }
    });
  }

  // mini player controls
  const miniPlaypauseBtn = document.getElementById("mini-playpause-btn");
  const miniNextBtn = document.getElementById("mini-next-btn");
  const miniPrevBtn = document.getElementById("mini-prev-btn");

  if (miniPlaypauseBtn) {
    miniPlaypauseBtn.addEventListener("click", function() {
      if (miniPlayer && miniPlayerReady) {
        if (miniPlayer.getPlayerState() === 1) {
          miniPlayer.pauseVideo();
        } else {
          miniPlayer.playVideo();
        }
      }
    });
  }

  if (miniNextBtn) miniNextBtn.addEventListener("click", nextTrack);
  if (miniPrevBtn) miniPrevBtn.addEventListener("click", prevTrack);

  // load yt api
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // shuffle title
  if ($ && $('#shuffle-title').length) {
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
  }
});

// youtube players
function onYouTubeIframeAPIReady() {
  // main player (if exists)
  const mainPlayerEl = document.getElementById('video-player');
  if (mainPlayerEl) {
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
  
  // mini player (if exists)
  const miniPlayerEl = document.getElementById('mini-video-player');
  if (miniPlayerEl) {
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
    if (playpauseBtn) playpauseBtn.textContent = "❚❚";
    if (timer) clearInterval(timer);
    timer = setInterval(updateTime, 1000);
  } else {
    if (playpauseBtn) playpauseBtn.textContent = "▶";
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
    if (miniPlaypauseBtn) miniPlaypauseBtn.textContent = "❚❚";
  } else {
    if (miniPlaypauseBtn) miniPlaypauseBtn.textContent = "▶";
  }
}

function updateTime() {
  if (player && playerReady) {
    const current = player.getCurrentTime();
    const duration = player.getDuration();
    
    if (!isNaN(current) && !isNaN(duration)) {
      const slider = document.getElementById("slider");
      const currentTimeEl = document.getElementById("current-time");
      const durationEl = document.getElementById("duration");
      
      if (slider) {
        slider.value = current;
        slider.max = duration;
      }
      if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
      if (durationEl) durationEl.textContent = formatTime(duration);
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
  updateMiniTrackInfo();
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
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + videoIds.length) % videoIds.length;
  if (player && playerReady) player.loadVideoById(videoIds[currentTrack]);
  if (miniPlayer && miniPlayerReady) miniPlayer.loadVideoById(videoIds[currentTrack]);
  updateTrackInfo();
}

// shuffle text plugin (unchanged)
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
