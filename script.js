// --- Configuration ---
const maxClicks = 5; // Taps to break the egg

// --- State Variables ---
let clickCount = 0;
let isCracked = false;

// --- Elements ---
const eggImg = document.getElementById('egg-img');
const instructionText = document.getElementById('instruction-text');
const chickContainer = document.getElementById('chick-container');
const footerMsg = document.getElementById('footer-msg');

// --- Audio Setup (Safe-play) ---
// Renamed to standard: crack.mp3 and cheer.mp3
const crackSound = new Audio('assets/audio/crack.mp3'); 
const cheerSound = new Audio('assets/audio/cheer.mp3');

// --- Main Interaction ---
eggImg.addEventListener('click', function() {
    
    if (isCracked) return; // Stop clicks after it breaks

    // 1. Remove Heartbeat & Add Shake
    eggImg.style.animation = 'none'; // Stop heartbeat
    eggImg.offsetHeight; // Trigger reflow
    eggImg.style.animation = null; // Clear manual style so CSS takes over
    
    eggImg.classList.remove('shake'); 
    void eggImg.offsetWidth; // Trigger reflow
    eggImg.classList.add('shake');

    // 2. Vibrate Phone (Android only)
    if (navigator.vibrate) navigator.vibrate(50); 

    clickCount++;

    // 3. Game Logic
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
        // --- THE BIG REVEAL ---
        isCracked = true; 
        triggerFinale();
    }
}

function triggerFinale() {
    // 1. Break the Egg
    changeImage("assets/images/egg-shell.png"); 
    instructionText.style.opacity = '0'; // Hide text
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]); 
    playSound(cheerSound);

    // 2. Confetti Explosion
    fireConfetti();

    // 3. Text Fly Out Sequence
    // "ALL"
    setTimeout(() => {
        const w1 = document.getElementById('word1');
        w1.classList.add('visible', 'pos-left');
    }, 600); 

    // "THE"
    setTimeout(() => {
        const w2 = document.getElementById('word2');
        w2.classList.add('visible', 'pos-center');
    }, 1400); 

    // "BEST"
    setTimeout(() => {
        const w3 = document.getElementById('word3');
        w3.classList.add('visible', 'pos-right');
        fireConfetti(); 
    }, 2200); 

    // 4. THE CHICK REVEAL
    setTimeout(() => {
        chickContainer.style.display = 'block';
        chickContainer.classList.add('fly-in'); // Start Fly Up
        
        // Wait 1.5s (duration of fly-in), then lock it in place
        setTimeout(() => {
            chickContainer.classList.remove('fly-in'); 
            chickContainer.classList.add('chick-hovering'); // Permanently stays
            
            footerMsg.classList.add('show');
        }, 1500); 
        
    }, 3000); 
}

// Helper: Change Image Source safely
function changeImage(path) {
    eggImg.src = path;
}

// Helper: Play Sound safely
function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed: User interaction required first"));
    }
}

// Helper: Confetti Cannon
function fireConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']
    });
}