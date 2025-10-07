const ALARM_SOUND = new Audio('assets/ding.mp3'); 
// --- Configuration ---
const MAGGI_TIMES = {
    simple: 180, // 3:00 minutes
    soupy: 300,  // 5:00 minutes
    veggies: 420 // 7:00 minutes
};

const COOKING_FRAMES = [
    'images/cooking1.png',
    'images/cooking2.png',
    'images/cooking3.png'
];

// Frame images for the two-frame steam animation on the Finished Screen
const FUME_FRAMES = {
    simple: ['images/simple maggi 1.png', 'images/simple maggi 2.png'],
    soupy: ['images/soupy maggi 1.png', 'images/soupy maggi 2.png'],
    veggies: ['images/veg maggi 1.png', 'images/veg maggi 2.png'],
  
};

// --- State Variables ---
let timerInterval;
let cookingAnimationInterval;
let fumeAnimationInterval;
let timeLeft;
let currentMaggiType;

// --- DOM Elements ---
const screens = {
    start: document.getElementById('startScreen'),
    selection: document.getElementById('selectionScreen'),
    timer: document.getElementById('timerScreen'),
    finished: document.getElementById('finishedScreen')
};

// --- Helper Functions ---

function displayScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active-screen');
        screen.style.display = 'none';
    });
    // Show the requested screen
    screens[screenName].classList.add('active-screen');
    screens[screenName].style.display = 'flex';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// --- Timer Flow Functions ---

function showSelectionScreen() {
    // Content for Desktop 2 in Figma
    screens.selection.innerHTML = `
        <h2>What are you making today?</h2>
        <div class="selection-options">
            <button class="maggi-type-button" onclick="startTimer('simple')">
                <img src="${FUME_FRAMES.simple[0]}" alt="Simple Maggi">
                <span>Simple Maggi (3 min)</span>
            </button>
            <button class="maggi-type-button" onclick="startTimer('soupy')">
                <img src="${FUME_FRAMES.soupy[0]}" alt="Soupy Maggi">
                <span>Soupy Maggi (5 min)</span>
            </button>
            <button class="maggi-type-button" onclick="startTimer('veggies')">
                <img src="${FUME_FRAMES.veggies[0]}" alt="Veggies Maggi (7 min)">
                <span>Veggies Maggi (7 min)</span>
            </button>
        </div>
    `;
    displayScreen('selection');
}

function startTimer(type) {
    currentMaggiType = type;
    timeLeft = MAGGI_TIMES[type];

    // Clear any previous intervals
    clearInterval(timerInterval);
    clearInterval(cookingAnimationInterval);
    clearInterval(fumeAnimationInterval);

    displayScreen('timer');
    
    // Content for Desktop 3 in Figma
    screens.timer.innerHTML = `
        <div class="timer-header main-text">Your Maggi is ready in...</div>
        <img id="cookingVisual" src="${COOKING_FRAMES[0]}" alt="Cooking Maggi" style="width: 300px; height: 300px;">
        <div id="timerDisplay">${formatTime(timeLeft)}</div>
    `;
    
    // Start the visual cooking animation loop
    startCookingAnimation();

    // Start the time countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timerDisplay').textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(cookingAnimationInterval);
            timerFinished();
        }
    }, 1000);
}

function startCookingAnimation() {
    let frameIndex = 0;
    const visualElement = document.getElementById('cookingVisual');

    // Cycle through the COOKING_FRAMES array slowly
    cookingAnimationInterval = setInterval(() => {
        frameIndex = (frameIndex + 1) % COOKING_FRAMES.length;
        visualElement.src = COOKING_FRAMES[frameIndex];
    }, 10000); // Change image every 10 seconds
}


function timerFinished() {
    // Clear any previous intervals just in case
    clearInterval(fumeAnimationInterval);
    
    displayScreen('finished');

    // Build the finished screen content...
    screens.finished.innerHTML = `
        <img id="finalVisual" src="${FUME_FRAMES[currentMaggiType][0]}" alt="Cooked Maggi" style="width: 250px; height: 250px;">
        <div class="timer-header main-text">Your Maggi is done!</div>
        <div class="finished-buttons">
            <button class="pixel-button" onclick="snoozeTimer()">SNOOZE</button>
            <button class="pixel-button" onclick="closeTimer()">CLOSE</button>
        </div>
    `;

    // Start the fume animation loop
    startFumeAnimation();

    // NEW: Play the alarm sound!
    ALARM_SOUND.volume = 1.0; // Set volume to 50%
    ALARM_SOUND.play(); 
}

    
function startFumeAnimation() {
    let frameIndex = 0;
    const visualElement = document.getElementById('finalVisual');
    const frames = FUME_FRAMES[currentMaggiType];

    // Cycle through the two fume frames quickly (300ms flicker)
    fumeAnimationInterval = setInterval(() => {
        frameIndex = (frameIndex === 0) ? 1 : 0;
        visualElement.src = frames[frameIndex];
    }, 300); 
}

function snoozeTimer() {
    alert("Snooze engaged! Maggi will get cold while you wait.");
    closeTimer(); 
}

function closeTimer() {
    // Clear all intervals and return to the start screen
    clearInterval(timerInterval);
    clearInterval(cookingAnimationInterval);
    clearInterval(fumeAnimationInterval);
    displayScreen('start');
}

// Initialize: Show the start screen on load
document.addEventListener('DOMContentLoaded', () => {
    displayScreen('start');
});