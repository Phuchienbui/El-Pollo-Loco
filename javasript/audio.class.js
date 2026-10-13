/**
 * Statische Verwaltung aller Sounds des Spiels (Abspielen, Stoppen, Stummschalten, Lautstärke).
 */
class GameAudio {
    static THEME = new Audio('../assets/audio/openmindaudio-high-noon-duel-western-music-preview-545324.mp3');
    static JUMP = new Audio('../assets/audio/jump.mp3');
    static COIN = new Audio('../assets/audio/coin.mp3');
    static HURT = new Audio('../assets/audio/hurt.mp3');
    static THROW = new Audio('../assets/audio/throw.mp3');
    static WIN = new Audio('../assets/audio/win.mp3');
    static LOSE = new Audio('../assets/audio/lose.mp3');
    static BOTTLE = new Audio('../assets/audio/bottle.wav');
    static SNORE = new Audio('../assets/audio/snore.wav');
    static CHICKEN = new Audio('../assets/audio/chicken.wav');
    static BOSS_HIT = new Audio('../assets/audio/boss-hit.wav');
    static BOSS_ALERT = new Audio('../assets/audio/boss-alert.wav');

    static ALL_SOUNDS = [
        GameAudio.THEME,
        GameAudio.JUMP,
        GameAudio.COIN,
        GameAudio.HURT,
        GameAudio.THROW,
        GameAudio.WIN,
        GameAudio.LOSE,
        GameAudio.BOTTLE,
        GameAudio.SNORE,
        GameAudio.CHICKEN,
        GameAudio.BOSS_HIT,
        GameAudio.BOSS_ALERT,
    ];

    static muted = false;

    static {
        GameAudio.THEME.loop = true;
        GameAudio.SNORE.loop = true;
        GameAudio.muted = localStorage.getItem('pepeMuted') === 'true';
    }

    /**
     * Spielt einen Sound ab, sofern nicht stummgeschaltet. Außer dem Theme wird er vorher an den Anfang gesetzt.
     * @param {HTMLAudioElement} sound - Das abzuspielende Audio-Objekt.
     */
    static play(sound) {
        if (GameAudio.muted) {
            return;
        }
        if (sound !== GameAudio.THEME) {
            sound.currentTime = 0;
        }
        sound.play().catch(() => {});
    }

    /**
     * Pausiert einen Sound. Außer dem Theme wird die Wiedergabeposition auf 0 zurückgesetzt.
     * @param {HTMLAudioElement} sound - Das zu stoppende Audio-Objekt.
     */
    static stop(sound) {
        sound.pause();
        if (sound !== GameAudio.THEME) {
            sound.currentTime = 0;
        }
    }

    /** Stoppt alle Sounds außer dem Hintergrund-Theme. */
    static stopAll() {
        GameAudio.ALL_SOUNDS.forEach(s => {
            if (s !== GameAudio.THEME) {
                GameAudio.stop(s);
            }
        });
    }

    /** Schaltet die Stummschaltung um und speichert sie im localStorage; beim Stummschalten werden alle Sounds gestoppt, beim Einschalten startet das Theme. */
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

    /**
     * Setzt die Lautstärke aller Sounds.
     * @param {number} value - Lautstärke zwischen 0 und 1.
     */
    static setVolume(value) {
        GameAudio.ALL_SOUNDS.forEach(s => s.volume = value);
    }
}