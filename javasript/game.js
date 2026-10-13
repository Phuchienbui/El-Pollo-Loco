/** @type {HTMLCanvasElement|null} Canvas-Element, auf dem das Spiel gezeichnet wird. */
let canvas;
/** @type {World|undefined} Aktuelle Spielwelt, wird in init() erzeugt. */
let world;
/** @type {Keyboard} Zustand der Tastatur- und Touch-Eingaben. */
let keyboard = new Keyboard();
/** @type {boolean} Debug-Flag (Standard: false). */
let debugMode = false;

/** Erstellt das Level und die Spielwelt auf dem Canvas. */
function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/** Richtet nach dem Laden der Seite Startbutton, Mute-Icon und Touch-Buttons ein. */
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

/** Setzt beim Drücken von Pfeiltasten, Leertaste oder D das entsprechende Flag in keyboard. */
window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

/** Setzt beim Loslassen der Tasten das entsprechende Flag in keyboard zurück. */
window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});

/** Schaltet den Vollbildmodus des Spielcontainers um; auf Touch-Geräten ohne Wirkung. */
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

/** Zeigt den Game-Over-Bildschirm, stoppt die Animation, blendet die Touch-Steuerung aus und löscht alle Intervalle. */
function showGameOverScreen() {
    if (world && world.animationRequest) {
        cancelAnimationFrame(world.animationRequest);
    }
    document.getElementById('game-over-screen').classList.remove('d-none');
    hideTouchControls();
    clearAllIntervals();
}

/** Zeigt den Gewinn-Bildschirm, stoppt die Animation, blendet die Touch-Steuerung aus und löscht alle Intervalle. */
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

/** Startet das Spiel neu: blendet End-Screens aus, stoppt Sounds, spielt das Theme und initialisiert die Welt neu. */
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

/** Kehrt zum Startbildschirm zurück: stoppt Animation und Sounds und blendet die Spielelemente aus. */
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

/** Blendet die Touch-Steuerung ein. */
function showTouchControls() {
    document.getElementById('touch-controls').classList.remove('d-none');
}

/** Blendet die Touch-Steuerung aus. */
function hideTouchControls() {
    document.getElementById('touch-controls').classList.add('d-none');
}

/** Öffnet den Impressum-Dialog als Modal. */
function openImpressum() {
    document.getElementById('impressum-dialog').showModal();
}

/** Schließt den Impressum-Dialog. */
function closeImpressum() {
    document.getElementById('impressum-dialog').close();
}

/** Schaltet die Stummschaltung über GameAudio um und aktualisiert das Lautsprecher-Icon. */
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

/** Löscht alle Intervalle mit den IDs 1 bis 9998 über clearInterval. */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}