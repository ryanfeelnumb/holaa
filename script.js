let hasUserInteracted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true; 

  
  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const themeMusic = document.getElementById('music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const equalizer = document.getElementById('equalizer');
  const backgroundVideo = document.getElementById('background');
  const themeOverlay = document.getElementById('overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');

  
  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchend', () => {
      cursor.style.display = 'none'; 
    });
  } else {

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }


  const startMessage = "click here";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);
  let startTriggered = false;

  function startExperience() {
    if (startTriggered) return;
    startTriggered = true;

    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music on start:", err);
    });
    setupAudioGraph();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(err => console.error("Failed to resume audio context:", err));
    }

    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    typeWriterBio();
  }

  startScreen.addEventListener('click', startExperience);
  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startExperience();
  });


  const name = "myosotis";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);


  const bioMessages = [
    "supp twins.",
    "don't know where i'm going, but i know i ain't going back, lost a few people, lost myself a couple times, still found reasona to keep moving!"
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  const isMuted = false;

  
  const EQ_BAR_COUNT = 24;
  const eqBars = [];
  for (let i = 0; i < EQ_BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'eq-bar';
    equalizer.appendChild(bar);
    eqBars.push(bar);
  }

  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  const connectedAudios = new WeakSet();

  function setupAudioGraph() {
    if (audioCtx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.8;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.connect(audioCtx.destination);

    [backgroundMusic, themeMusic, rainMusic, animeMusic, carMusic].forEach((audioEl) => {
      if (!audioEl || connectedAudios.has(audioEl)) return;
      try {
        const source = audioCtx.createMediaElementSource(audioEl);
        source.connect(analyser);
        connectedAudios.add(audioEl);
      } catch (err) {
        console.error('Failed to connect audio to equalizer:', err);
      }
    });
  }

  function updateEqualizerState() {
    if (currentAudio && !currentAudio.paused) {
      equalizer.classList.remove('paused');
    } else {
      equalizer.classList.add('paused');
    }
  }

  function renderEqualizer() {
    requestAnimationFrame(renderEqualizer);
    if (!analyser) return;
    const playing = currentAudio && !currentAudio.paused && !currentAudio.muted;
    analyser.getByteFrequencyData(dataArray);
    eqBars.forEach((bar, i) => {
      if (!playing) {
        bar.style.height = '8%';
        return;
      }
      const value = dataArray[i % dataArray.length] || 0;
      const heightPercent = Math.max(8, (value / 255) * 100);
      bar.style.height = heightPercent + '%';
    });
  }
  renderEqualizer();

  function toggleAudioPlayback() {
    setupAudioGraph();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.muted = false;
      currentAudio.play().catch(err => console.error('Failed to resume audio:', err));
    } else {
      currentAudio.pause();
    }
    updateEqualizerState();
  }

  equalizer.addEventListener('click', toggleAudioPlayback);
  equalizer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleAudioPlayback();
  });

  [backgroundMusic, themeMusic, rainMusic, animeMusic, carMusic].forEach((audioEl) => {
    if (!audioEl) return;
    audioEl.addEventListener('play', updateEqualizerState);
    audioEl.addEventListener('pause', updateEqualizerState);
  });


  function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
    let primaryColor;
    switch (themeClass) {
      case 'home-theme':
        primaryColor = '#FFFFFF';
        break;
      case 'theme':
        primaryColor = '#ffffff';
        break;
      case 'rain-theme':
        primaryColor = '#ffffff';
        break;
      case 'anime-theme':
        primaryColor = '#DC2626';
        break;
      case 'car-theme':
        primaryColor = '#EAB308';
        break;
      default:
        primaryColor = '#FFFFFF';
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    gsap.to(backgroundVideo, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        backgroundVideo.src = videoSrc;

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        currentAudio.volume = 0.3;
        currentAudio.muted = isMuted;
        currentAudio.play().catch(err => console.error("Failed to play theme music:", err));

        document.body.classList.remove('home-theme', 'theme', 'rain-theme', 'anime-theme', 'car-theme');
        document.body.classList.add(themeClass);

        themeOverlay.classList.add('hidden');
        snowOverlay.classList.add('hidden');
        profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        if (overlay) {
          overlay.classList.remove('hidden');
        }

        if (themeClass === 'theme') {
          resultsButtonContainer.classList.remove('hidden');
        } else {
          resultsButtonContainer.classList.add('hidden');
          skillsBlock.classList.add('hidden');
          resultsHint.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.to(profileBlock, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }

        gsap.to(backgroundVideo, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            profileContainer.classList.remove('orbit');
            void profileContainer.offsetWidth;
            profileContainer.classList.add('orbit');
          }
        });
      }
    });
  }
  
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
  skillsBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, skillsBlock);
  });

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  skillsBlock.addEventListener('mouseleave', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  skillsBlock.addEventListener('touchend', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });


  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

 
  let isShowingSkills = false;
  resultsButton.addEventListener('click', () => {
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });

  resultsButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });


  typeWriterStart();

  const instagramBtn = document.getElementById('instagram-btn');
  const igModalOverlay = document.getElementById('ig-modal-overlay');
  const igModalClose = document.getElementById('ig-modal-close');

  if (instagramBtn && igModalOverlay) {
    instagramBtn.addEventListener('click', (e) => {
      e.preventDefault();
      igModalOverlay.classList.remove('hidden');
    });
  }

  if (igModalClose && igModalOverlay) {
    igModalClose.addEventListener('click', () => {
      igModalOverlay.classList.add('hidden');
    });
  }

  if (igModalOverlay) {
    igModalOverlay.addEventListener('click', (e) => {
      if (e.target === igModalOverlay) {
        igModalOverlay.classList.add('hidden');
      }
    });
  }

  const DISCORD_USER_ID = 'discord id';
  const onlineStatusDot = document.querySelector('.online-status');
  const onlineTextEl = document.querySelector('.online-text');
  const spotifyWidget = document.getElementById('spotify-widget');
  const spotifyArt = document.getElementById('spotify-album-art');
  const spotifySong = document.getElementById('spotify-song');
  const spotifyArtist = document.getElementById('spotify-artist');
  const spotifyProgress = document.getElementById('spotify-progress');

  const STATUS_META = {
    online:  { color: '#43b581', label: 'Online' },
    idle:    { color: '#faa61a', label: 'Idle' },
    dnd:     { color: '#f04747', label: 'Do Not Disturb' },
    offline: { color: '#747f8d', label: 'Offline' },
  };

  let spotifyProgressTimer = null;

  function applyDiscordStatus(status) {
    const meta = STATUS_META[status] || STATUS_META.offline;
    if (onlineStatusDot) {
      onlineStatusDot.style.background = meta.color;
      onlineStatusDot.style.boxShadow = `0 0 8px ${meta.color}, 0 0 4px rgba(0,0,0,0.6)`;
      onlineStatusDot.title = meta.label;
    }
    if (onlineTextEl) {
      onlineTextEl.textContent = meta.label;
      onlineTextEl.style.color = meta.color;
      onlineTextEl.style.setProperty('--dot-color', meta.color);
      const beforeStyleId = 'dynamic-online-dot-color';
      let styleTag = document.getElementById(beforeStyleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = beforeStyleId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `.online-text::before { background: ${meta.color} !important; box-shadow: 0 0 6px ${meta.color} !important; }`;
    }
  }

  function updateSpotifyWidget(data) {
    const spotify = data.spotify;
    if (!spotify) {
      if (spotifyWidget) spotifyWidget.classList.add('hidden');
      if (spotifyProgressTimer) {
        clearInterval(spotifyProgressTimer);
        spotifyProgressTimer = null;
      }
      return;
    }

    if (spotifyWidget) spotifyWidget.classList.remove('hidden');
    if (spotifyArt) spotifyArt.src = spotify.album_art_url || '';
    if (spotifySong) spotifySong.textContent = spotify.song || '';
    if (spotifyArtist) spotifyArtist.textContent = spotify.artist || '';

    const start = spotify.timestamps?.start || Date.now();
    const end = spotify.timestamps?.end || Date.now();
    const total = Math.max(end - start, 1);

    if (spotifyProgressTimer) clearInterval(spotifyProgressTimer);
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
      if (spotifyProgress) spotifyProgress.style.width = pct + '%';
      if (elapsed >= total && spotifyProgressTimer) {
        clearInterval(spotifyProgressTimer);
        spotifyProgressTimer = null;
      }
    };
    tick();
    spotifyProgressTimer = setInterval(tick, 1000);
  }

  function handleLanyardData(data) {
    applyDiscordStatus(data.discord_status || 'offline');
    updateSpotifyWidget(data);
  }

  function connectLanyard() {
    let socket;
    let heartbeatInterval;

    try {
      socket = new WebSocket('wss://api.lanyard.rest/socket');
    } catch (err) {
      console.error('Lanyard WebSocket unavailable:', err);
      return;
    }

    socket.addEventListener('message', (event) => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch (err) {
        return;
      }

      const { op, t, d } = payload;

      if (op === 1) {
        const interval = d.heartbeat_interval;
        heartbeatInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, interval);

        socket.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_USER_ID }
        }));
      } else if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
        if (d) handleLanyardData(d);
      }
    });

    socket.addEventListener('close', () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      setTimeout(connectLanyard, 5000);
    });

    socket.addEventListener('error', (err) => {
      console.error('Lanyard WebSocket error:', err);
      socket.close();
    });
  }

  connectLanyard();
});
