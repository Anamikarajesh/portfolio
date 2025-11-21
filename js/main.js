// main.js — cursor behavior and dynamic background
(function(){
  const cursor = document.getElementById('custom-cursor');
  const cursorImg = document.getElementById('cursor-img');
  const starsBg = document.getElementById('stars-bg');
  
  const openSrc = 'resources/cursor/cat_mouth_open.png';
  const closedSrc = 'resources/cursor/cat_mouth_close.png';

  // Fallback if image not found: use emoji (keeps app working)
  function ensureImage(el, src){
    const img = new Image();
    img.onload = ()=>{ el.src = src };
    img.onerror = ()=>{ /* leave as-is, maybe placeholder path */ };
    img.src = src;
  }
  ensureImage(cursorImg, openSrc);

  // Track pointer for cursor and parallax background
  window.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Update cursor position
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';

    // Parallax effect for stars
    // Move background slightly opposite to mouse direction
    const moveX = (window.innerWidth - x) / 50;
    const moveY = (window.innerHeight - y) / 50;
    
    if(starsBg) {
        starsBg.style.backgroundPosition = `${moveX}px ${moveY}px`;
    }
  }, {passive:true});

  // Mouse down => close mouth, add active class, play pop sound
  function closeMouth(){
    cursorImg.src = closedSrc;
    cursor.classList.add('cursor-active');
    
    // Play pop sound
    const popAudio = new Audio('resources/pop.mp3');
    popAudio.volume = 0.5; // Adjust volume if needed
    popAudio.play().catch(e => console.log("Audio play failed:", e));
  }
  
  // Mouse up => open mouth, remove active class
  function openMouth(){
    cursorImg.src = openSrc;
    cursor.classList.remove('cursor-active');
  }

  window.addEventListener('mousedown', closeMouth);
  window.addEventListener('mouseup', openMouth);
  
  // Touch support
  window.addEventListener('touchstart', e => {
      closeMouth();
      // Update position on touch start too
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
  }, {passive:true});
  
  window.addEventListener('touchend', openMouth);

  // Handle link hovering (make cursor react slightly)
  const links = document.querySelectorAll('a, button, .pixel-btn');
  links.forEach(link => {
      link.addEventListener('mouseenter', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1.2) rotate(0deg)';
      });
      link.addEventListener('mouseleave', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1) rotate(-15deg)';
      });
  });

  // --- Floating Balloon Cat Logic ---
  const balloonCat = document.getElementById('balloon-cat');
  if (balloonCat) {
      // Initial position
      let x = Math.random() * (window.innerWidth - 100);
      let y = window.innerHeight + 100; // Start below screen
      
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      // Mouse Events
      balloonCat.addEventListener('mousedown', (e) => {
          isDragging = true;
          const rect = balloonCat.getBoundingClientRect();
          dragOffsetX = e.clientX - x; // Calculate offset relative to current x
          dragOffsetY = e.clientY - y; // Calculate offset relative to current y
          balloonCat.style.cursor = 'grabbing';
          e.preventDefault(); // Prevent text selection
      });

      window.addEventListener('mousemove', (e) => {
          if (isDragging) {
              x = e.clientX - dragOffsetX;
              y = e.clientY - dragOffsetY;
          }
      });

      window.addEventListener('mouseup', () => {
          if (isDragging) {
              isDragging = false;
              balloonCat.style.cursor = 'grab';
          }
      });

      // Touch Events
      balloonCat.addEventListener('touchstart', (e) => {
          isDragging = true;
          const touch = e.touches[0];
          dragOffsetX = touch.clientX - x;
          dragOffsetY = touch.clientY - y;
          e.preventDefault();
      }, {passive: false});

      window.addEventListener('touchmove', (e) => {
          if (isDragging) {
              const touch = e.touches[0];
              x = touch.clientX - dragOffsetX;
              y = touch.clientY - dragOffsetY;
              e.preventDefault();
          }
      }, {passive: false});

      window.addEventListener('touchend', () => {
          isDragging = false;
      });

      function animateBalloon() {
          if (!isDragging) {
              // Float up
              y -= 1; 
              
              // Slight drift using sine wave based on y position
              x += Math.sin(y * 0.05) * 0.5;

              // Reset if goes off top
              if (y < -150) {
                  y = window.innerHeight + 50;
                  x = Math.random() * (window.innerWidth - 100);
              }
          }

          balloonCat.style.transform = `translate(${x}px, ${y}px)`;
          requestAnimationFrame(animateBalloon);
      }
      
      // Start animation
      requestAnimationFrame(animateBalloon);
  }

  // --- Interactive Terminal Logic ---
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  
  if (termInput && termOutput) {
      const commands = {
          'help': 'Available commands: help, about, projects, contact, date, clear, matrix-enable, matrix-disable',
          'about': 'Anamika Rajesh | Aspiring ML Engineer | IIT Bhilai',
          'projects': 'Check out the "Projects" section above for my latest work!',
          'contact': 'Email: anamikarajeshkollara@gmail.com | GitHub: @Anamikarajesh',
          'date': new Date().toString(),
          'clear': 'CLEAR',
          'matrix-enable': 'Wake up, Neo...',
          'matrix-disable': 'The Matrix has you...'
      };

      termInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
              const input = this.value.trim().toLowerCase();
              if (input) {
                  // Echo command
                  const cmdLine = document.createElement('div');
                  cmdLine.innerHTML = `<span class="text-green-400">anamika@cat:~$</span> ${this.value}`;
                  termOutput.appendChild(cmdLine);

                  // Process command
                  if (commands[input]) {
                      if (input === 'clear') {
                          termOutput.innerHTML = '<div class="mb-2"><span class="text-green-400">anamika@cat:~$</span></div>';
                      } else if (input === 'matrix-enable') {
                          enableMatrixMode();
                          const response = document.createElement('div');
                          response.className = 'mb-2 text-green-400';
                          response.textContent = 'Entering the Matrix...';
                          termOutput.appendChild(response);
                      } else if (input === 'matrix-disable') {
                          disableMatrixMode();
                          const response = document.createElement('div');
                          response.className = 'mb-2 text-green-400';
                          response.textContent = 'Exiting the Matrix...';
                          termOutput.appendChild(response);
                      } else {
                          const response = document.createElement('div');
                          response.className = 'mb-2 text-gray-300';
                          response.textContent = commands[input];
                          termOutput.appendChild(response);
                      }
                  } else {
                      const error = document.createElement('div');
                      error.className = 'mb-2 text-red-400';
                      error.textContent = `Command not found: ${input}. Type 'help' for list.`;
                      termOutput.appendChild(error);
                  }
                  
                  // Auto scroll to bottom
                  termOutput.scrollTop = termOutput.scrollHeight;
              }
              this.value = '';
          }
      });
  }

  function enableMatrixMode() {
      if (!document.body.classList.contains('matrix-mode')) {
          document.body.classList.add('matrix-mode');
          const canvas = document.getElementById('matrix-canvas');
          startMatrixRain(canvas);
      }
  }

  function disableMatrixMode() {
      if (document.body.classList.contains('matrix-mode')) {
          document.body.classList.remove('matrix-mode');
          stopMatrixRain();
      }
  }

  let matrixInterval;
  function startMatrixRain(canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
      const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nums = '0123456789';
      const alphabet = katakana + latin + nums;

      const fontSize = 16;
      const columns = canvas.width / fontSize;
      const drops = [];

      for (let x = 0; x < columns; x++) {
          drops[x] = 1;
      }

      const draw = () => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#0F0';
          ctx.font = fontSize + 'px monospace';

          for (let i = 0; i < drops.length; i++) {
              const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
              ctx.fillText(text, i * fontSize, drops[i] * fontSize);

              if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                  drops[i] = 0;
              }
              drops[i]++;
          }
      };
      
      clearInterval(matrixInterval);
      matrixInterval = setInterval(draw, 30);
  }

  function stopMatrixRain() {
      clearInterval(matrixInterval);
      const canvas = document.getElementById('matrix-canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --- Skill Filtering ---
  const skillTags = document.querySelectorAll('.skill-tag');
  const projectCards = document.querySelectorAll('.project-card');
  const resetBtn = document.getElementById('reset-filter');

  skillTags.forEach(tag => {
      tag.addEventListener('click', () => {
          const filter = tag.getAttribute('data-filter');
          
          // Toggle active class
          skillTags.forEach(t => t.classList.remove('active-filter'));
          tag.classList.add('active-filter');
          resetBtn.classList.remove('hidden');

          projectCards.forEach(card => {
              const tags = card.getAttribute('data-tags');
              if (tags.includes(filter)) {
                  card.classList.remove('hidden-project');
              } else {
                  card.classList.add('hidden-project');
              }
          });
      });
  });

  if(resetBtn) {
      resetBtn.addEventListener('click', () => {
          skillTags.forEach(t => t.classList.remove('active-filter'));
          projectCards.forEach(c => c.classList.remove('hidden-project'));
          resetBtn.classList.add('hidden');
      });
  }

  // --- Music Player ---
  const musicToggle = document.getElementById('music-toggle');
  const musicStatus = document.getElementById('music-status');
  const bgm = document.getElementById('bgm-audio');
  
  if(musicToggle && bgm) {
      musicToggle.addEventListener('click', () => {
          if (bgm.paused) {
              bgm.play().then(() => {
                  musicStatus.textContent = 'ON';
                  musicToggle.textContent = '❚❚';
              }).catch(e => {
                  console.log("Audio play failed (user interaction needed first):", e);
              });
          } else {
              bgm.pause();
              musicStatus.textContent = 'OFF';
              musicToggle.textContent = '▶';
          }
      });
  }

  // --- Nyan Cat Trail Generation ---
  const trailContainer = document.getElementById('rainbow-trail');
  if (trailContainer) {
      const colors = ['r-red', 'r-orange', 'r-yellow', 'r-green', 'r-blue', 'r-violet'];
      const segmentCount = 40; // Longer trail

      for (let i = 0; i < segmentCount; i++) {
          const segment = document.createElement('div');
          segment.className = 'trail-segment';
          
          colors.forEach(color => {
              const stripe = document.createElement('div');
              stripe.className = `rainbow-stripe ${color}`;
              segment.appendChild(stripe);
          });
          
          trailContainer.appendChild(segment);
      }
  }

})();
