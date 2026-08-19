class GameAudio {
    static THEME = new Audio('../assets/audio/openmindaudio-high-noon-duel-western-music-preview-545324.mp3');
    static JUMP = new Audio('../assets/audio/jump.mp3');
    static COIN = new Audio('../assets/audio/coin.mp3');
    static HURT = new Audio('../assets/audio/hurt.mp3');
    static THROW = new Audio('../assets/audio/throw.mp3');
    static WIN = new Audio('../assets/audio/win.mp3');
    static LOSE = new Audio('../assets/audio/lose.mp3');

    static ALL_SOUNDS = [
        GameAudio.THEME,
        GameAudio.JUMP,
        GameAudio.COIN,
        GameAudio.HURT,
        GameAudio.THROW,
        GameAudio.WIN,
        GameAudio.LOSE,
    ];

    static muted = false;

    static {
        GameAudio.THEME.loop = true;
        GameAudio.muted = localStorage.getItem('pepeMuted') === 'true';
    }

    static play(sound) {
        if (GameAudio.muted) {
            return;
        }
        if (sound !== GameAudio.THEME) {
            sound.currentTime = 0;
        }
        sound.play().catch(() => {});
    }

    static stop(sound) {
        sound.pause();
        if (sound !== GameAudio.THEME) {
            sound.currentTime = 0;
        }
    }

    static stopAll() {
        GameAudio.ALL_SOUNDS.forEach(s => {
            if (s !== GameAudio.THEME) {
                GameAudio.stop(s);
            }
        });
    }

    static toggleMute() {
        GameAudio.muted = !GameAudio.muted;
        localStorage.setItem('pepeMuted', GameAudio.muted);
        if (GameAudio.muted) {
            GameAudio.stopAll();
            GameAudio.THEME.pause();
        } else {
            GameAudio.play(GameAudio.THEME);
        }
    }

    static setVolume(value) {
        GameAudio.ALL_SOUNDS.forEach(s => s.volume = value);
    }
}