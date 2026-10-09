let canvas;
let world;
let keyboard = new Keyboard();
let debugMode = false;

function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('load', () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('btn-start');
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const gameTitle = document.querySelector('.game-title');

    canvas = document.getElementById('canvas');

    startButton.addEventListener('click', () => {
        startScreen.classList.add('d-none');
        fullscreenContainer.classList.remove('d-none');
        fullscreenBtn.classList.remove('d-none');
        gameTitle.classList.remove('d-none');
        showTouchControls();

        GameAudio.play(GameAudio.THEME);
        init();
    });

    let icon = document.getElementById('mute-icon');
    if (icon) {
        icon.src = GameAudio.muted ? '../assets/svg/volume-off.svg' : '../assets/svg/volume-on.svg';
    }

    document.getElementById('btn-left').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    document.getElementById('btn-left').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('btn-right').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    document.getElementById('btn-right').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById('btn-jump').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
        keyboard.UP = true;
    });
    document.getElementById('btn-jump').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
        keyboard.UP = false;
    });

    document.getElementById('btn-throw').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    document.getElementById('btn-throw').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
});

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});

function toggleFullscreen() {
    let fullscreenElement = document.getElementById('fullscreen-container');

    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        return;
    }

    if (!document.fullscreenElement) {
        fullscreenElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function showGameOverScreen() {
    if (world && world.animationRequest) {
        cancelAnimationFrame(world.animationRequest);
    }
    document.getElementById('game-over-screen').classList.remove('d-none');
    hideTouchControls();
    clearAllIntervals();
}

function showWinScreen() {
    if (world && world.animationRequest) {
        cancelAnimationFrame(world.animationRequest);
    }
    let winScreen = document.getElementById('win-screen');
    if (winScreen) {
        winScreen.classList.remove('d-none');
    }
    hideTouchControls();
    clearAllIntervals();
}

function restartGame() {
    if (world && world.animationRequest) {
        cancelAnimationFrame(world.animationRequest);
    }
    document.getElementById('game-over-screen').classList.add('d-none');
    let winScreen = document.getElementById('win-screen');
    if (winScreen) {
        winScreen.classList.add('d-none');
    }
    clearAllIntervals();
    GameAudio.stopAll();
    GameAudio.play(GameAudio.THEME);
    showTouchControls();
    init();
}

function goHome() {
    if (world && world.animationRequest) {
        cancelAnimationFrame(world.animationRequest);
    }
    clearAllIntervals();
    GameAudio.stopAll();
    
    document.getElementById('fullscreen-container').classList.add('d-none');
    document.getElementById('fullscreen-btn').classList.add('d-none');
    document.querySelector('.game-title').classList.add('d-none');
    document.getElementById('game-over-screen').classList.add('d-none');
    hideTouchControls();
    
    let winScreen = document.getElementById('win-screen');
    if (winScreen) {
        winScreen.classList.add('d-none');
    }
    
    document.getElementById('start-screen').classList.remove('d-none');
}

function showTouchControls() {
    document.getElementById('touch-controls').classList.remove('d-none');
}

function hideTouchControls() {
    document.getElementById('touch-controls').classList.add('d-none');
}

function openImpressum() {
    document.getElementById('impressum-dialog').showModal();
}

function closeImpressum() {
    document.getElementById('impressum-dialog').close();
}

function toggleMute() {
    GameAudio.toggleMute(); 
    
    let icon = document.getElementById('mute-icon');
    if (icon) {
        if (GameAudio.muted) {
            icon.src = '../assets/svg/volume-off.svg'; 
        } else {
            icon.src = '../assets/svg/volume-on.svg'; 
        }
    }
}

function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}