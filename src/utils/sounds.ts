export type SoundType = 'click' | 'success' | 'error' | 'achievement' | 'victory' | 'defeat' | 'money' | 'notification';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
  bgmEnabled: boolean;
  bgmVolume: number; // 0-1
  soundPack: 'beep' | 'classic' | 'modern';
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private settings: SoundSettings;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private bgmGainNode: GainNode | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private currentBgm: 'menu' | 'game' | 'victory' | 'defeat' | null = null;
  private bgmLoopTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.settings = this.loadSettings();
    this.initializeAudioContext();
  }

  private loadSettings(): SoundSettings {
    try {
      const saved = localStorage.getItem('economicStrategy_soundSettings');
      if (saved) {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('음향 설정 불러오기 실패:', error);
    }
    return this.getDefaultSettings();
  }

  private getDefaultSettings(): SoundSettings {
    return {
      enabled: true,
      volume: 0.5,
      bgmEnabled: true,
      bgmVolume: 0.3,
      soundPack: 'beep'
    };
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext 초기화 실패:', error);
      this.settings.enabled = false;
    }
  }

  public updateSettings(newSettings: Partial<SoundSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('economicStrategy_soundSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('음향 설정 저장 실패:', error);
    }
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  public play(soundType: SoundType): void {
    if (!this.settings.enabled || !this.audioContext) return;

    // AudioContext가 suspended 상태면 resume
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    try {
      this.playBeepSound(soundType);
    } catch (error) {
      console.error('사운드 재생 실패:', error);
    }
  }

  private playBeepSound(soundType: SoundType): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // 사운드 타입별 주파수 및 설정
    const soundConfig = this.getSoundConfig(soundType);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = soundConfig.type;
    oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
    
    // 볼륨 설정 (설정값과 사운드별 볼륨 조합)
    const volume = this.settings.volume * soundConfig.volume;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + soundConfig.duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + soundConfig.duration);

    // 정리
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  private getSoundConfig(soundType: SoundType): {
    frequency: number;
    duration: number;
    type: OscillatorType;
    volume: number;
  } {
    switch (soundType) {
      case 'click':
        return { frequency: 800, duration: 0.1, type: 'square', volume: 0.3 };
      case 'success':
        return { frequency: 523, duration: 0.2, type: 'sine', volume: 0.5 }; // C5
      case 'error':
        return { frequency: 200, duration: 0.3, type: 'sawtooth', volume: 0.4 };
      case 'achievement':
        return { frequency: 659, duration: 0.5, type: 'sine', volume: 0.6 }; // E5
      case 'victory':
        return { frequency: 784, duration: 0.8, type: 'sine', volume: 0.7 }; // G5
      case 'defeat':
        return { frequency: 147, duration: 1.0, type: 'triangle', volume: 0.5 }; // D3
      case 'money':
        return { frequency: 1047, duration: 0.15, type: 'sine', volume: 0.4 }; // C6
      case 'notification':
        return { frequency: 440, duration: 0.2, type: 'sine', volume: 0.3 }; // A4
      default:
        return { frequency: 440, duration: 0.1, type: 'sine', volume: 0.3 };
    }
  }

  public playSequence(soundTypes: SoundType[], interval: number = 100): void {
    soundTypes.forEach((soundType, index) => {
      setTimeout(() => {
        this.play(soundType);
      }, index * interval);
    });
  }

  public playMelody(notes: { frequency: number; duration: number }[]): void {
    if (!this.settings.enabled || !this.audioContext) return;

    let currentTime = this.audioContext.currentTime;
    
    notes.forEach((note) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, currentTime);
      
      const volume = this.settings.volume * 0.3;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration - 0.01);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
      
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  // 승리 멜로디
  public playVictoryMelody(): void {
    const victoryNotes = [
      { frequency: 523, duration: 0.2 }, // C5
      { frequency: 659, duration: 0.2 }, // E5
      { frequency: 784, duration: 0.2 }, // G5
      { frequency: 1047, duration: 0.4 } // C6
    ];
    this.playMelody(victoryNotes);
  }

  // 패배 멜로디
  public playDefeatMelody(): void {
    const defeatNotes = [
      { frequency: 392, duration: 0.3 }, // G4
      { frequency: 349, duration: 0.3 }, // F4
      { frequency: 311, duration: 0.3 }, // D#4
      { frequency: 262, duration: 0.6 }  // C4
    ];
    this.playMelody(defeatNotes);
  }

  // 성취 달성 멜로디
  public playAchievementMelody(): void {
    const achievementNotes = [
      { frequency: 659, duration: 0.15 }, // E5
      { frequency: 784, duration: 0.15 }, // G5
      { frequency: 1047, duration: 0.15 }, // C6
      { frequency: 1319, duration: 0.3 }   // E6
    ];
    this.playMelody(achievementNotes);
  }

  // ============ 배경음 관련 메서드들 ============

  public playBGM(bgmType: 'menu' | 'game' | 'victory' | 'defeat'): void {
    if (!this.settings.bgmEnabled || !this.audioContext) return;

    // 이미 같은 BGM이 재생 중이면 리턴
    if (this.currentBgm === bgmType) return;

    // 기존 BGM 정지
    this.stopBGM();

    // AudioContext가 suspended 상태면 resume
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.currentBgm = bgmType;
    const bgmData = this.getBGMData(bgmType);
    
    // BGM 전용 Gain Node 생성
    this.bgmGainNode = this.audioContext.createGain();
    this.bgmGainNode.connect(this.audioContext.destination);
    this.bgmGainNode.gain.setValueAtTime(this.settings.bgmVolume * 0.4, this.audioContext.currentTime);

    this.playBGMLoop(bgmData);
  }

  private playBGMLoop(bgmData: { notes: { frequency: number; duration: number }[]; tempo: number }): void {
    if (!this.audioContext || !this.bgmGainNode || !this.settings.bgmEnabled) return;

    const { notes, tempo } = bgmData;
    let currentTime = this.audioContext.currentTime;
    const totalDuration = notes.reduce((sum, note) => sum + note.duration, 0) * tempo;

    notes.forEach((note) => {
      const oscillator = this.audioContext!.createOscillator();
      const noteGain = this.audioContext!.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(this.bgmGainNode!);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, currentTime);
      
      const noteDuration = note.duration * tempo;
      noteGain.gain.setValueAtTime(0, currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + noteDuration - 0.01);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + noteDuration);
      
      this.bgmOscillators.push(oscillator);
      currentTime += noteDuration;
      
      oscillator.onended = () => {
        const index = this.bgmOscillators.indexOf(oscillator);
        if (index > -1) {
          this.bgmOscillators.splice(index, 1);
        }
        oscillator.disconnect();
        noteGain.disconnect();
      };
    });

    // 루프를 위한 타이머 설정
    this.bgmLoopTimeout = setTimeout(() => {
      if (this.currentBgm && this.settings.bgmEnabled) {
        this.playBGMLoop(bgmData);
      }
    }, totalDuration * 1000);
  }

  public stopBGM(): void {
    if (this.bgmLoopTimeout) {
      clearTimeout(this.bgmLoopTimeout);
      this.bgmLoopTimeout = null;
    }

    this.bgmOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {
        // 이미 정지된 oscillator일 수 있음
      }
    });
    this.bgmOscillators = [];

    if (this.bgmGainNode) {
      this.bgmGainNode.disconnect();
      this.bgmGainNode = null;
    }

    this.currentBgm = null;
  }

  public updateBGMVolume(): void {
    if (this.bgmGainNode && this.audioContext) {
      this.bgmGainNode.gain.setValueAtTime(
        this.settings.bgmVolume * 0.4, 
        this.audioContext.currentTime
      );
    }
  }

  private getBGMData(bgmType: 'menu' | 'game' | 'victory' | 'defeat'): {
    notes: { frequency: number; duration: number }[];
    tempo: number;
  } {
    switch (bgmType) {
      case 'menu':
        return {
          notes: [
            { frequency: 440, duration: 0.5 }, // A4
            { frequency: 523, duration: 0.5 }, // C5
            { frequency: 659, duration: 0.5 }, // E5
            { frequency: 523, duration: 0.5 }, // C5
            { frequency: 392, duration: 0.5 }, // G4
            { frequency: 440, duration: 1.0 }, // A4
          ],
          tempo: 1.2
        };
      
      case 'game':
        return {
          notes: [
            { frequency: 262, duration: 0.4 }, // C4
            { frequency: 294, duration: 0.4 }, // D4
            { frequency: 330, duration: 0.4 }, // E4
            { frequency: 349, duration: 0.4 }, // F4
            { frequency: 392, duration: 0.4 }, // G4
            { frequency: 349, duration: 0.4 }, // F4
            { frequency: 330, duration: 0.4 }, // E4
            { frequency: 294, duration: 0.8 }, // D4
          ],
          tempo: 0.8
        };
      
      case 'victory':
        return {
          notes: [
            { frequency: 523, duration: 0.3 }, // C5
            { frequency: 659, duration: 0.3 }, // E5
            { frequency: 784, duration: 0.3 }, // G5
            { frequency: 1047, duration: 0.6 }, // C6
            { frequency: 784, duration: 0.3 }, // G5
            { frequency: 659, duration: 0.3 }, // E5
            { frequency: 523, duration: 0.6 }, // C5
          ],
          tempo: 1.0
        };
      
      case 'defeat':
        return {
          notes: [
            { frequency: 392, duration: 0.6 }, // G4
            { frequency: 349, duration: 0.6 }, // F4
            { frequency: 311, duration: 0.6 }, // D#4
            { frequency: 262, duration: 1.2 }, // C4
          ],
          tempo: 1.5
        };
      
      default:
        return { notes: [], tempo: 1.0 };
    }
  }
}

// 싱글톤 인스턴스
const soundManager = new SoundManager();

// 편의 함수들
export const playSound = (soundType: SoundType) => {
  soundManager.play(soundType);
};

export const playSoundSequence = (soundTypes: SoundType[], interval?: number) => {
  soundManager.playSequence(soundTypes, interval);
};

export const playVictoryMelody = () => {
  soundManager.playVictoryMelody();
};

export const playDefeatMelody = () => {
  soundManager.playDefeatMelody();
};

export const playAchievementMelody = () => {
  soundManager.playAchievementMelody();
};

export const updateSoundSettings = (settings: Partial<SoundSettings>) => {
  soundManager.updateSettings(settings);
  // BGM 볼륨이 변경되면 업데이트
  if (settings.bgmVolume !== undefined) {
    soundManager.updateBGMVolume();
  }
  // BGM 비활성화되면 정지
  if (settings.bgmEnabled === false) {
    soundManager.stopBGM();
  }
};

export const getSoundSettings = (): SoundSettings => {
  return soundManager.getSettings();
};

// BGM 관련 함수들
export const playBGM = (bgmType: 'menu' | 'game' | 'victory' | 'defeat') => {
  soundManager.playBGM(bgmType);
};

export const stopBGM = () => {
  soundManager.stopBGM();
};

export default soundManager;
