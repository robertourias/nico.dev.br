let audioContext: AudioContext | null = null;
let hasUserInteraction = false;

// Initialize audio context on first user interaction
function initializeAudioContext(): void {
  if (hasUserInteraction) return;

  if (typeof window !== 'undefined' && !audioContext) {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext = context;
      hasUserInteraction = true;
    } catch (error) {
      console.warn('Failed to initialize AudioContext:', error);
    }
  }
}

// Call this on first user interaction (button click, etc)
export function initAudioOnFirstInteraction(): void {
  if (!hasUserInteraction) {
    initializeAudioContext();
  }
}

export function playNotificationSound(): void {
  if (!audioContext) {
    initializeAudioContext();
  }

  if (!audioContext) {
    console.warn('AudioContext not available');
    return;
  }

  try {
    const ctx = audioContext;
    const now = ctx.currentTime;
    const duration = 0.5; // 500ms

    // Create oscillator for beep sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Set frequency (A5 = 880 Hz)
    osc.frequency.value = 880;

    // Envelope: attack and decay
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch (error) {
    console.warn('Failed to play notification sound:', error);
  }
}

// Alternative: Play sound from file (fallback)
export function playNotificationSoundFromFile(soundUrl: string): void {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn('Failed to play audio file:', error);
    });
  } catch (error) {
    console.warn('Failed to create audio element:', error);
  }
}
