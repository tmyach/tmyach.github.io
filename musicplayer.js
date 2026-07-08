var player, miniPlayer;
let currentTrack = 0;
let playerReady = false;
let miniPlayerReady = false;
let timer;


const videoIds = [
  "p_Yw0q8QVFQ", // Hikaru Utada - Automatic
  "UETz-QsfNl0", // Addison Rae - In The Rain
  "7nxWP9BhI7w", // Portishead - Roads
  "fXmEJLMgY8M", // Björk - Play Dead
  "nkzFnXEKs5Y", // Erykah Badu - Other Side Of The Game
  "g_BMBFR-0nI", // Lauryn Hill - Everything is Everything
  "4Syy0Zhcki8", // El Da Sensei, P Original - Course Of My Life
  "OBBlIfUH9bY", // Bob Marley & The Wailers - Misty Morning
  "GfG7DasXge8", // Peter Tosh - Peace Treaty
  "zIp7o53dfmY", // Thievery Corporation - Amerimacka
  "4TeshUpfml4", // Calle 13 - Latinoamérica
  "VC40Y6VosO0", // The Jimi Hendrix Experience - House Burning Down
  "pPrte-OhUh4", // Pink Floyd - Hey You
  "6GWWFfZfXp0", // Low - Dinosaur Act
  "x5GG_fr8WyM", // Smashing Pumpkins - Disarm
  "2maHkdezdEc", // Alice in Chains - Sunshine
  "11ImVzWeMHE", // Deftones - Deathblow
  "ikUrxI7g6BM", // Thrice - Cold Cash and Cold Hearts
  "m2Yhn6-jJPE", // A Perfect Circle - The Package
  "bndL7wwAj0U", // TOOL - Right In Two
  "K2p2lHawAJA", // Nick Cave - Girl In Amber
  "2EEu5P9rso8", // VanWyck - Push the Sky Away
  "aIaqTsCcWsw", // Mitski - Crack Baby
  "UWQT7fd8McI", // Sade - Morning Bird
  "IUHPsINf8rY", // Alicia Keys - Superwoman
];


const titles = [
  "Hikaru Utada - Automatic",
  "Addison Rae - In The Rain",
  "Portishead - Roads",
  "Björk - Play Dead",
  "Erykah Badu - Other Side Of The Game",
  "Lauryn Hill - Everything is Everything",
  "El Da Sensei, P Original - Course Of My Life",
  "Bob Marley & The Wailers - Misty Morning",
  "Peter Tosh - Peace Treaty",
  "Thievery Corporation - Amerimacka",
  "Calle 13 - Latinoamérica",
  "The Jimi Hendrix Experience - House Burning Down",
  "Pink Floyd - Hey You",
  "Low - Dinosaur Act",
  "Smashing Pumpkins - Disarm",
  "Alice in Chains - Sunshine",
  "Deftones - Deathblow",
  "Thrice - Cold Cash and Cold Hearts",
  "A Perfect Circle - The Package",
  "TOOL - Right In Two",
  "Nick Cave - Girl In Amber",
  "VanWyck - Push the Sky Away",
  "Mitski - Crack Baby",
  "Sade - Morning Bird",
  "Alicia Keys - Superwoman",
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
  const volumeSlider = document.getElementById("volume-slider");


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

  // Volume slider
  if (volumeSlider) {
    volumeSlider.addEventListener("input", function() {
      const vol = parseInt(this.value, 10);
      if (player && playerReady) {
        player.setVolume(vol);
      }
      if (miniPlayer && miniPlayerReady) {
        miniPlayer.setVolume(vol);
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

  // Sync volume slider with player volume
  const volumeSlider = document.getElementById("volume-slider");
  if (volumeSlider && player) {
    volumeSlider.value = player.getVolume() || 99;
  }

  updateTrackInfo();
}


function onMiniPlayerReady(event) {
  miniPlayerReady = true;

  // Sync volume slider with mini player volume
  const volumeSlider = document.getElementById("volume-slider");
  if (volumeSlider && miniPlayer) {
    volumeSlider.value = miniPlayer.getVolume() || 99;
  }

  updateMiniTrackInfo();
}


function onPlayerStateChange(event) {
  const playpauseBtn = document.getElementById("playpause-btn");
  
  if (event.data == YT.PlayerState.ENDED) {
    nextTrack();
  } else if (event.data == YT.PlayerState.PLAYING) {
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
  
  if (event.data == YT.PlayerState.ENDED) {
    nextTrack();
  } else if (event.data == YT.PlayerState.PLAYING) {
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