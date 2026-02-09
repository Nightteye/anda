// --- Configuration ---
const maxClicks = 5; 

// --- Variables ---
let clickCount = 0;
let isCracked = false;
let musicStarted = false;

// --- Elements ---
const eggImg = document.getElementById('egg-img');
const instructionText = document.getElementById('instruction-text');
const chickContainer = document.getElementById('chick-container');
const footerMsg = document.getElementById('footer-msg');
const shadow = document.querySelector('.pedestal-shadow'); 
const marquee = document.getElementById('marquee'); 

// --- Audio ---
const crackSound = new Audio('assets/audio/crack.mp3'); 
const cheerSound = new Audio('assets/audio/cheer.mp3');
const bgm = document.getElementById('bgm'); 
bgm.volume = 0.3; // Soft background volume

// --- Interaction ---
eggImg.addEventListener('click', function() {
    
    // 1. Play BGM on first tap (Autoplay policy fix)
    if (!musicStarted) {
        bgm.play().catch(e => console.log("BGM autoplay prevented"));
        musicStarted = true;
    }

    if (isCracked) return; 

    // Reset Animations for click effect
    eggImg.style.animation = 'none'; 
    eggImg.offsetHeight; 
    eggImg.style.animation = null; 
    
    // Add Shake
    eggImg.classList.remove('shake'); 
    void eggImg.offsetWidth; 
    eggImg.classList.add('shake');

    if (navigator.vibrate) navigator.vibrate(50); 

    clickCount++;
    handleEggState(clickCount);
});

function handleEggState(count) {
    if (count === 1) {
        instructionText.innerText = "Hey! Be gentle! 🥚";
        changeImage("assets/images/egg-crack-1.png");
        playSound(crackSound);
    } 
    else if (count === 3) {
        instructionText.innerText = "Stop! It's gonna break! 😱";
        changeImage("assets/images/egg-crack-2.png");
        if (navigator.vibrate) navigator.vibrate(100);
        playSound(crackSound);
    } 
    else if (count >= maxClicks) {
        isCracked = true; 
        triggerFinale();
    }
}

function triggerFinale() {
    // 1. Break Egg
    changeImage("assets/images/egg-shell.png"); 
    instructionText.style.opacity = '0';
    shadow.style.opacity = '0'; // Hide shadow
    
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]); 
    playSound(cheerSound);

    // 2. Confetti
    fireConfetti();

    // 3. Text Fly Out (Timed Sequence)
    setTimeout(() => {
        const w1 = document.getElementById('word1');
        w1.classList.add('visible', 'pos-left');
    }, 600); 

    setTimeout(() => {
        const w2 = document.getElementById('word2');
        w2.classList.add('visible', 'pos-center');
    }, 1400); 

    setTimeout(() => {
        const w3 = document.getElementById('word3');
        w3.classList.add('visible', 'pos-right');
        
        // SHOW MARQUEE HERE
        marquee.style.opacity = '1'; 
        
        fireConfetti(); 
    }, 2200); 

    // 4. Chick Reveal
    setTimeout(() => {
        chickContainer.style.display = 'block';
        chickContainer.classList.add('fly-in');
        
        setTimeout(() => {
            chickContainer.classList.remove('fly-in'); 
            chickContainer.classList.add('chick-hovering');
            footerMsg.classList.add('show');
        }, 1200); 
        
    }, 3000); 
}

function changeImage(path) { eggImg.src = path; }

function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed"));
    }
}

function fireConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']
    });
}