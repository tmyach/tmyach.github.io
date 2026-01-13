var player, miniPlayer;
let currentTrack = 0;
let playerReady = false;
let miniPlayerReady = false;
let timer;

const videoIds = [
  "f6KopItCEf8",
  "xFf809oDLdE",
  "LGrca9EK_qQ", 
  "fXmEJLMgY8M",
  "cCgxqqxE9Y0",
  "OBBlIfUH9bY",
  "4Syy0Zhcki8",
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
  "Bob Moses - Nothing At All",
  "Björk - It's Oh So Quiet",
  "Strange Boutique - Drown", 
  "Björk - Play Dead",
  "Thievery Corporation - 33 Degree",
  "Bob Marley & The Wailers - Misty Morning",
  "El Da Sensei, P Original - Course Of My Life",
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
  // mini player collapse
  const miniPlayerContainer = document.getElementById('mini-player');
  const miniCollapseBtn = document.getElementById('mini-collapse');
  
  if (miniCollapseBtn && miniPlayerContainer) {
    miniCollapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      miniPlayerContainer.classList.toggle('minimized');
      miniCollapseBtn.textContent = miniPlayerContainer.classList.contains('minimized') ? '+' : '−';
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
  if (typeof $ !== 'undefined' && $('#shuffle-title').length) {
    $('#shuffle-title').ShuffleText([
      "Hello!",
      "sudo apt-get install sl && sl 🚂💨",
      "That's not even funny, man!",
      "Transmitting live with the hardcore style!",
      "Optimal performance in all browsers!",
      "Corporate accounts payable, Tesia speaking... just a moment!",
      "Born to CSS, forced to VANILLA JAVASCRIPT!!!",
      "T.M. Yachimovicz",
      "It's a Casio on a plastic beach!",
      "Nonagon infinity opens the door!",
      "Has it trickled down yet?",
      "WHAT?!",
      "Forty six and two are just ahead of me!",
      "Makin' snacks on wax plates for DJs to scratch!",
      "Leverage back-end models! Orchestrate synergistic portals! Deploy my brain uah hhuahu",
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

// youtube player
function onYouTubeIframeAPIReady() {
  // main player
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
  
  // mini player
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
  // currentTrack in range
  if (currentTrack >= videoIds.length || currentTrack >= titles.length) {
    currentTrack = 0;
  }

  const nowplaying = document.getElementById("nowplaying");
  const info = document.getElementById("info");
  if (nowplaying) nowplaying.textContent = `playing ${currentTrack + 1} of ${videoIds.length}`;
  if (info && titles[currentTrack]) info.textContent = titles[currentTrack];
  updateMiniTrackInfo();
}

function updateMiniTrackInfo() {
  const miniTitle = document.getElementById("mini-track-title");
  if (miniTitle && titles[currentTrack]) {
    miniTitle.textContent = titles[currentTrack];
  }
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

// shuffle text
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
