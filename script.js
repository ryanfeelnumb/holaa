const CONFIG = {
  name: 'name',
  bioMessages: [
    "bio.",
    "long text"
  ],
  bioMessagesLateNight: [
    "bio night",
    "long text"
  ],
  discordUserId: 'id discord',
  namespace: 'name',
  skills: {
    python: 87,
    cpp: 75,
    csharp: 80
  },
  referrerGreetings: {
    'discord.com': 'found me through discord, huh?',
    'instagram.com': 'coming in from instagram \u2014 welcome.',
    'github.com': 'a fellow dev, i see.'
  }
};

let hasUserInteracted = false;

let sfxCtx = null;
function playSfx(freq = 440, duration = 0.06, type = 'sine', volume = 0.05) {
  try {
    if (!sfxCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      sfxCtx = new AudioCtx();
    }
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, sfxCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, sfxCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(sfxCtx.destination);
    osc.start();
    osc.stop(sfxCtx.currentTime + duration);
  } catch (err) {
    console.error('SFX unavailable:', err);
  }
}

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
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const equalizer = document.getElementById('equalizer');
  const backgroundVideo = document.getElementById('background');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const pythonPercentEl = document.getElementById('python-percent');
  const cppPercentEl = document.getElementById('cpp-percent');
  const csharpPercentEl = document.getElementById('csharp-percent');
  if (pythonPercentEl) pythonPercentEl.textContent = CONFIG.skills.python + '%';
  if (cppPercentEl) cppPercentEl.textContent = CONFIG.skills.cpp + '%';
  if (csharpPercentEl) csharpPercentEl.textContent = CONFIG.skills.csharp + '%';
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  badges.forEach((badge) => {
    badge.addEventListener('mouseenter', () => playSfx(700, 0.05, 'triangle', 0.035));
  });

  
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


  
  (function initParallax() {
    const bgVideo = document.getElementById('background');
    if (!bgVideo) return;

    const MAX_SHIFT = 14; 
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function applyParallax() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      bgVideo.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(applyParallax);
    }
    applyParallax();

    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) - 0.5;
        const ny = (e.clientY / window.innerHeight) - 0.5;
        targetX = -nx * MAX_SHIFT;
        targetY = -ny * MAX_SHIFT;
      });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma === null || e.beta === null) return;
        const nx = Math.max(-1, Math.min(1, e.gamma / 30));
        const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        targetX = -nx * MAX_SHIFT;
        targetY = -ny * MAX_SHIFT;
      });
    }
  })();


  const startMessages = ["click here"];
  let startTextContent = '';
  let startIndex = 0;
  let startMessageIndex = 0;
  let isStartDeleting = false;
  let startCursorVisible = true;
  let startDone = false;

  function typeWriterStart() {
    const current = startMessages[startMessageIndex];
    if (!isStartDeleting && startIndex < current.length) {
      startTextContent = current.slice(0, startIndex + 1);
      startIndex++;
    } else if (isStartDeleting && startIndex > 0) {
      startTextContent = current.slice(0, startIndex - 1);
      startIndex--;
    } else if (!isStartDeleting && startIndex === current.length) {
      if (startMessageIndex >= startMessages.length - 1) {
        startDone = true;
        startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
        return;
      }
      isStartDeleting = true;
      setTimeout(typeWriterStart, 700);
      return;
    } else if (isStartDeleting && startIndex === 0) {
      isStartDeleting = false;
      startMessageIndex++;
      startText.classList.add('glitch');
      setTimeout(() => startText.classList.remove('glitch'), 200);
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, isStartDeleting ? 40 : 90);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);


  const NAMESPACE = CONFIG.namespace;

  function revealTextValue(el, text) {
    if (!el) return;
    el.classList.remove('skeleton-text');
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.35s ease';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });

    const targetNum = typeof text === 'number' ? text : parseInt(text, 10);
    if (isNaN(targetNum)) {
      el.textContent = text;
      return;
    }

    const duration = 900;
    const startTime = performance.now();
    function tickCount(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetNum);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(tickCount);
    }
    requestAnimationFrame(tickCount);
  }

  (function initVisitorCounter() {
    if (!visitorCount) return;
    const KEY = 'visits';
    const START_VALUE = 366;

    fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('hit request failed: ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log('Visitor counter response:', data);
        revealTextValue(visitorCount, typeof data.value === 'number' ? data.value : START_VALUE);
      })
      .catch(err => {
        console.error('Visitor counter unavailable, showing static value:', err);
        revealTextValue(visitorCount, START_VALUE);
      });
  })();

  (function initLastSeen() {
    const lastSeenText = document.getElementById('last-seen-text');
    if (!lastSeenText) return;
    const KEY = 'last_seen_ts';

    function formatAgo(ms) {
      const diff = Math.max(Date.now() - ms, 0);
      const sec = Math.floor(diff / 1000);
      if (sec < 60) return 'Last seen: just now';
      const min = Math.floor(sec / 60);
      if (min < 60) return `Last seen: ${min}m ago`;
      const hr = Math.floor(min / 60);
      if (hr < 24) return `Last seen: ${hr}h ago`;
      const day = Math.floor(hr / 24);
      return `Last seen: ${day}d ago`;
    }

    fetch(`https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('get request failed: ' + res.status);
        return res.json();
      })
      .then(data => {
        const prevTs = typeof data.value === 'number' && data.value > 0 ? data.value : null;
        revealTextValue(lastSeenText, prevTs ? formatAgo(prevTs) : 'Last seen: first visitor');
        return fetch(`https://abacus.jasoncameron.dev/set/${NAMESPACE}/${KEY}/${Date.now()}`);
      })
      .catch(err => {
        console.error('Last seen unavailable:', err);
        revealTextValue(lastSeenText, 'Last seen: —');
      });
  })();

  (function initLiveClock() {
    const clockText = document.getElementById('live-clock-text');
    if (!clockText) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const now = new Date();
      const h = pad(now.getHours());
      const m = pad(now.getMinutes());
      const s = pad(now.getSeconds());
      clockText.textContent = `${h}:${m}:${s}`;
      clockText.classList.remove('skeleton-text');
    }

    tick();
    setInterval(tick, 1000);
  })();

  (function initVisitorGreeting() {
    const greetingEl = document.getElementById('visitor-greeting');
    if (!greetingEl) return;

    let greeting = '';

    try {
      const ref = document.referrer;
      if (ref) {
        const host = new URL(ref).hostname.replace(/^www\./, '');
        const matchKey = Object.keys(CONFIG.referrerGreetings).find(key => host.includes(key));
        if (matchKey) greeting = CONFIG.referrerGreetings[matchKey];
      }
    } catch (err) {
      console.error('Referrer parse failed:', err);
    }

    if (!greeting) {
      const visitorHour = new Date().getHours();
      const visitorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (visitorHour >= 0 && visitorHour < 5) {
        greeting = `it's ${visitorTime} where you are \u2014 up late too?`;
      } else if (visitorHour >= 5 && visitorHour < 11) {
        greeting = `morning, it's ${visitorTime} for you.`;
      } else {
        greeting = `it's ${visitorTime} on your end.`;
      }
    }

    greetingEl.textContent = greeting;
  })();


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


  const name = CONFIG.name;
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


  const currentHour = new Date().getHours();
  const isLateNight = currentHour >= 0 && currentHour < 5;
  const bioMessages = isLateNight ? CONFIG.bioMessagesLateNight : CONFIG.bioMessages;
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

    [backgroundMusic].forEach((audioEl) => {
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
        bar.style.background = 'var(--primary-color, #FFFFFF)';
        return;
      }
      const value = dataArray[i % dataArray.length] || 0;
      const amp = value / 255;
      const heightPercent = Math.max(8, amp * 100);
      bar.style.height = heightPercent + '%';
      const lightness = 55 + amp * 45;
      bar.style.background = amp > 0.15
        ? `hsl(0, 0%, ${lightness}%)`
        : 'var(--primary-color, #FFFFFF)';
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
      playSfx(520, 0.07, 'sine', 0.05);
    } else {
      currentAudio.pause();
      playSfx(320, 0.07, 'sine', 0.05);
    }
    updateEqualizerState();
  }

  equalizer.addEventListener('click', toggleAudioPlayback);
  equalizer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleAudioPlayback();
  });

  [backgroundMusic].forEach((audioEl) => {
    if (!audioEl) return;
    audioEl.addEventListener('play', updateEqualizerState);
    audioEl.addEventListener('pause', updateEqualizerState);
  });



  

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
    playSfx(600, 0.08, 'triangle', 0.045);
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
          gsap.to(pythonBar, { width: CONFIG.skills.python + '%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: CONFIG.skills.cpp + '%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: CONFIG.skills.csharp + '%', duration: 2, ease: 'power2.out' });
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
    playSfx(600, 0.08, 'triangle', 0.045);
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
          gsap.to(pythonBar, { width: CONFIG.skills.python + '%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: CONFIG.skills.cpp + '%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: CONFIG.skills.csharp + '%', duration: 2, ease: 'power2.out' });
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

  
  const DISCORD_USER_ID = CONFIG.discordUserId;

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
      if (spotifyWidget && !spotifyWidget.classList.contains('hidden')) {
        spotifyWidget.classList.add('fade-out');
        setTimeout(() => {
          spotifyWidget.classList.add('hidden');
          spotifyWidget.classList.remove('fade-out');
        }, 300);
      }
      if (spotifyProgressTimer) {
        clearInterval(spotifyProgressTimer);
        spotifyProgressTimer = null;
      }
      return;
    }

    const isNewlyShown = spotifyWidget && spotifyWidget.classList.contains('hidden');
    if (spotifyWidget) {
      spotifyWidget.classList.remove('hidden');
      if (isNewlyShown) {
        spotifyWidget.classList.add('fade-out');
        requestAnimationFrame(() => spotifyWidget.classList.remove('fade-out'));
      }
    }
    if (spotifyArt) {
      spotifyArt.onerror = () => { spotifyArt.onerror = null; spotifyArt.src = 'assets/profile.gif'; };
      spotifyArt.src = spotify.album_art_url || 'assets/profile.gif';
    }
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

  function buildDiscordImageUrl(activity, key) {
    const assets = activity.assets;
    if (!assets || !assets[key]) return null;
    const img = assets[key];
    if (img.startsWith('mp:external/')) {
      return `https://media.discordapp.net/${img.replace('mp:', '')}`;
    }
    if (img.startsWith('mp:')) {
      return `https://media.discordapp.net/${img.slice(3)}`;
    }
    if (img.startsWith('spotify:')) {
      return `https://i.scdn.co/image/${img.replace('spotify:', '')}`;
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }

  const ACTIVITY_TYPE_LABEL = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    4: '...',
    5: 'Competing in',
  };

  function formatElapsed(startMs) {
    if (!startMs) return '';
    const diff = Math.max(Date.now() - startMs, 0);
    const totalMin = Math.floor(diff / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}m elapsed` : `${m}m elapsed`;
  }

  let discordActivitiesLoaded = false;

  function updateDiscordActivities(data) {
    const container = document.getElementById('discord-activities');
    const skeleton = document.getElementById('discord-activities-skeleton');
    if (!container) return;

    if (!discordActivitiesLoaded) {
      discordActivitiesLoaded = true;
      if (skeleton) {
        skeleton.style.transition = 'opacity 0.3s ease';
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.remove(), 300);
      }
    }

    container.innerHTML = '';

    const activities = (data.activities || []).filter(a => a.name !== 'Spotify' && a.type !== undefined);

    activities.forEach(activity => {
      const card = document.createElement('div');
      card.className = 'activity-card fade-out';

      const artWrap = document.createElement('div');
      artWrap.className = 'activity-art-wrap';

      const largeUrl = buildDiscordImageUrl(activity, 'large_image');
      const smallUrl = buildDiscordImageUrl(activity, 'small_image');

      const img = document.createElement('img');
      img.className = 'activity-art';
      img.src = largeUrl || 'assets/profile.gif';
      img.alt = activity.name || 'Activity';
      img.onerror = () => { img.onerror = null; img.src = 'assets/profile.gif'; };
      artWrap.appendChild(img);

      if (smallUrl) {
        const smallImg = document.createElement('img');
        smallImg.className = 'activity-art-small';
        smallImg.src = smallUrl;
        smallImg.alt = '';
        smallImg.onerror = () => { smallImg.remove(); };
        artWrap.appendChild(smallImg);
      }

      const info = document.createElement('div');
      info.className = 'activity-info';

      if (activity.type === 4) {
        const label = document.createElement('div');
        label.className = 'activity-name';
        label.textContent = activity.state || '';
        info.appendChild(label);
      } else {
        const typeLabel = document.createElement('div');
        typeLabel.className = 'activity-type-label';
        typeLabel.textContent = ACTIVITY_TYPE_LABEL[activity.type] || '';
        info.appendChild(typeLabel);

        const name = document.createElement('div');
        name.className = 'activity-name';
        name.textContent = activity.name || '';
        info.appendChild(name);

        if (activity.details) {
          const details = document.createElement('div');
          details.className = 'activity-detail';
          details.textContent = activity.details;
          info.appendChild(details);
        }

        if (activity.state) {
          const state = document.createElement('div');
          state.className = 'activity-detail';
          state.textContent = activity.state;
          info.appendChild(state);
        }

        if (activity.timestamps?.start) {
          const elapsed = document.createElement('div');
          elapsed.className = 'activity-elapsed';
          elapsed.textContent = formatElapsed(activity.timestamps.start);
          info.appendChild(elapsed);
        }
      }

      card.appendChild(artWrap);
      card.appendChild(info);
      container.appendChild(card);
      requestAnimationFrame(() => card.classList.remove('fade-out'));
    });
  }

  function handleLanyardData(data) {
    applyDiscordStatus(data.discord_status || 'offline');
    updateSpotifyWidget(data);
    updateDiscordActivities(data);
    const skeleton = document.getElementById('discord-activities-skeleton');
    if (skeleton && !discordActivitiesLoaded) {
      discordActivitiesLoaded = true;
      skeleton.style.transition = 'opacity 0.3s ease';
      skeleton.style.opacity = '0';
      setTimeout(() => skeleton.remove(), 300);
    }
  }

  const connectionStatus = document.getElementById('connection-status');
  const connectionStatusText = document.getElementById('connection-status-text');
  let hasConnectedOnce = false;

  function showReconnecting() {
    if (!connectionStatus) return;
    connectionStatus.classList.add('visible');
    if (connectionStatusText) connectionStatusText.textContent = 'reconnecting...';
  }

  function hideReconnecting() {
    if (!connectionStatus) return;
    connectionStatus.classList.remove('visible');
  }

  function connectLanyard() {
    let socket;
    let heartbeatInterval;

    try {
      socket = new WebSocket('wss://api.lanyard.rest/socket');
    } catch (err) {
      console.error('Lanyard WebSocket unavailable:', err);
      showReconnecting();
      setTimeout(connectLanyard, 5000);
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
        hasConnectedOnce = true;
        hideReconnecting();
        if (d) handleLanyardData(d);
      }
    });

    socket.addEventListener('close', () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (hasConnectedOnce) showReconnecting();
      setTimeout(connectLanyard, 5000);
    });

    socket.addEventListener('error', (err) => {
      console.error('Lanyard WebSocket error:', err);
      socket.close();
    });
  }

  connectLanyard();

  (function initEasterEgg() {
    const overlay = document.getElementById('easter-egg-overlay');
    let emptyClickCount = 0;
    let resetTimer = null;
    let hideTimer = null;

    function hideOverlay() {
      if (overlay) overlay.classList.remove('visible');
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        clearTimeout(hideTimer);
        hideOverlay();
      });
    }

    document.addEventListener('click', (e) => {
      const isEmptyArea = e.target === document.body || e.target.classList.contains('container');
      if (!isEmptyArea) return;

      emptyClickCount++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { emptyClickCount = 0; }, 2000);

      if (emptyClickCount >= 5) {
        emptyClickCount = 0;
        if (overlay) overlay.classList.add('visible');
        playSfx(880, 0.12, 'square', 0.06);
        setTimeout(() => playSfx(1200, 0.15, 'square', 0.05), 90);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hideOverlay, 3000);
      }
    });
  })();
});
