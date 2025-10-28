// utils/audio.ts

// Use a single AudioContext for performance.
let audioContext: AudioContext | null = null;
// Master gain to control all audio output, including music and SFX.
let masterGainNode: GainNode | null = null;

let isMuted = false;

try {
  const savedMuteState = localStorage.getItem('englishPlaygroundMuted');
  isMuted = savedMuteState === 'true';
} catch(e) {
  // ignore
}

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
    masterGainNode.connect(audioContext.destination);
  }
  // Resume context on user gesture if needed
  if (audioContext.state === 'suspended') {
      audioContext.resume();
  }
  return audioContext;
};


export const getMuteState = (): boolean => isMuted;

export const toggleMuteState = (): boolean => {
  isMuted = !isMuted;
  try {
    localStorage.setItem('englishPlaygroundMuted', String(isMuted));
  } catch(e) {
    // ignore
  }

  const ctx = getAudioContext();
  if (masterGainNode) {
    masterGainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 1, ctx.currentTime + 0.1);
  }

  return isMuted;
};


export type SoundType = 'click' | 'correct' | 'incorrect' | 'levelUp' | 'gameOver' | 'flip' | 'start' | 'swoosh';

export const playSound = (sound: SoundType) => {
  // Ensure audio context is initialized on first interaction
  const ctx = getAudioContext();

  if (isMuted) return;

  try {
    const now = ctx.currentTime;
    
    // All SFX will now be routed through the masterGainNode
    if (!masterGainNode) return;
    
    switch (sound) {
      case 'click': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;
      }
      
      case 'start': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.linearRampToValueAtTime(698.46, now + 0.1); // F5
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
      }
      
      case 'correct': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(783.99, now); // G5
        oscillator.frequency.linearRampToValueAtTime(1046.50, now + 0.05); // C6
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
      }
        
      case 'incorrect': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
      }
        
      case 'levelUp': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'triangle';
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        gainNode.gain.setValueAtTime(0.1, now);
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        frequencies.forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(freq, now + i * 0.1);
        });
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;
      }

      case 'gameOver': {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'triangle';
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        gainNode.gain.setValueAtTime(0.1, now);
        const frequencies = [392.00, 329.63, 261.63]; // G4, E4, C4
        frequencies.forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(freq, now + i * 0.15);
        });
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        oscillator.start(now);
        oscillator.stop(now + 0.6);
        break;
      }
      
      case 'swoosh':
      case 'flip': {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(800, now);
        bandpass.frequency.exponentialRampToValueAtTime(4000, now + 0.15);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        
        noise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(masterGainNode); // Connect to master gain
        noise.start(now);
        noise.stop(now + 0.15);
        break;
      }
    }
  } catch (e) {
    console.error("Could not play sound", e);
  }
};