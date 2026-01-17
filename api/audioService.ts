// 音频生成和管理服务

export interface AudioGenerationOptions {
  text: string;
  voice?: 'calm' | 'energetic' | 'deep';
  rate?: number; // 0.5 - 2.0
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
}

export interface GeneratedAudio {
  audioUrl: string;
  duration: number;
  format: 'wav' | 'mp3' | 'ogg';
  size: number;
  cached: boolean;
}

// 音频缓存管理（使用IndexedDB）
class AudioCacheManager {
  private dbName = 'PodcastAudioCache';
  private storeName = 'audios';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveAudio(id: string, audioBlob: Blob, metadata: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const data = {
        id,
        audioBlob,
        metadata,
        timestamp: Date.now()
      };

      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAudio(id: string): Promise<{ audioBlob: Blob; metadata: any } | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve({
            audioBlob: request.result.audioBlob,
            metadata: request.result.metadata
          });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAudio(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();

    const cutoffTime = Date.now() - maxAge;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getCacheSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const totalSize = request.result.reduce((sum, item) => {
          return sum + (item.audioBlob?.size || 0);
        }, 0);
        resolve(totalSize);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// 音频生成服务
class AudioGenerationService {
  private cacheManager: AudioCacheManager;
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    this.cacheManager = new AudioCacheManager();
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // 检查浏览器支持
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // 获取可用的语音列表
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // 选择合适的语音
  private selectVoice(voiceType: 'calm' | 'energetic' | 'deep'): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    
    // 优先选择中文语音
    const chineseVoices = voices.filter(v => 
      v.lang.startsWith('zh') || v.lang.startsWith('cmn')
    );

    if (chineseVoices.length === 0) {
      // 如果没有中文语音，使用英文
      return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
    }

    // 根据类型选择语音
    switch (voiceType) {
      case 'calm':
        // 选择女声或柔和的声音
        return chineseVoices.find(v => v.name.includes('Female') || v.name.includes('女')) || chineseVoices[0];
      case 'energetic':
        // 选择活力的声音
        return chineseVoices.find(v => v.name.includes('Male') || v.name.includes('男')) || chineseVoices[0];
      case 'deep':
        // 选择低沉的声音
        return chineseVoices.find(v => v.name.includes('Male') || v.name.includes('男')) || chineseVoices[0];
      default:
        return chineseVoices[0];
    }
  }

  // 使用Web Speech API生成音频
  async generateWithWebSpeech(options: AudioGenerationOptions): Promise<GeneratedAudio> {
    if (!this.synthesis) {
      throw new Error('Web Speech API not supported');
    }

    const { text, voice = 'calm', rate = 1.0, pitch = 1.0, volume = 1.0 } = options;

    // 检查缓存
    const cacheKey = `speech_${voice}_${rate}_${pitch}_${text.substring(0, 50)}`;
    const cached = await this.cacheManager.getAudio(cacheKey);
    
    if (cached) {
      console.log('使用缓存的音频');
      return {
        audioUrl: URL.createObjectURL(cached.audioBlob),
        duration: cached.metadata.duration,
        format: 'wav',
        size: cached.audioBlob.size,
        cached: true
      };
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoice = this.selectVoice(voice);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = 'zh-CN';

      // 使用MediaRecorder录制音频
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // 计算时长（估算）
        const duration = text.length / (rate * 10); // 粗略估算

        // 保存到缓存
        try {
          await this.cacheManager.saveAudio(cacheKey, audioBlob, { duration });
        } catch (error) {
          console.warn('缓存保存失败:', error);
        }

        resolve({
          audioUrl,
          duration,
          format: 'wav',
          size: audioBlob.size,
          cached: false
        });
      };

      utterance.onend = () => {
        mediaRecorder.stop();
        audioContext.close();
      };

      utterance.onerror = (event) => {
        mediaRecorder.stop();
        audioContext.close();
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      // 开始录制和朗读
      mediaRecorder.start();
      this.synthesis!.speak(utterance);
    });
  }

  // 生成WAV格式的音频（备用方案）
  generateWavAudio(durationSec: number = 2, frequency: number = 440): GeneratedAudio {
    const sampleRate = 44100;
    const numberOfSamples = Math.max(1, Math.floor(durationSec * sampleRate));
    const bytesPerSample = 2;
    const dataSize = numberOfSamples * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // WAV文件头
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerSample, true);
    view.setUint16(32, bytesPerSample, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // 生成音频数据（正弦波）
    const fadeSamples = Math.floor(sampleRate * 0.02);
    const amp = 0.25;
    
    for (let i = 0; i < numberOfSamples; i++) {
      const t = i / sampleRate;
      const raw = Math.sin(2 * Math.PI * frequency * t) * amp;
      const fadeIn = fadeSamples > 0 ? Math.min(1, i / fadeSamples) : 1;
      const fadeOut = fadeSamples > 0 ? Math.min(1, (numberOfSamples - 1 - i) / fadeSamples) : 1;
      const fade = Math.min(fadeIn, fadeOut);
      const sample = Math.max(-1, Math.min(1, raw * fade));
      view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(blob);

    return {
      audioUrl,
      duration: durationSec,
      format: 'wav',
      size: buffer.byteLength,
      cached: false
    };
  }

  // 从脚本生成完整播客音频
  async generatePodcastAudio(
    script: Array<{ role: string; text: string }>,
    options: Partial<AudioGenerationOptions> = {}
  ): Promise<GeneratedAudio> {
    try {
      // 合并所有文本
      const fullText = script.map(s => s.text).join(' ');
      
      // 使用Web Speech API生成
      if (this.isSupported()) {
        return await this.generateWithWebSpeech({
          text: fullText,
          voice: options.voice || 'calm',
          rate: options.rate || 1.0,
          pitch: options.pitch || 1.0,
          volume: options.volume || 1.0
        });
      } else {
        // 降级到WAV生成
        console.warn('Web Speech API不支持，使用备用音频');
        return this.generateWavAudio(120, 440);
      }
    } catch (error) {
      console.error('音频生成失败:', error);
      // 返回备用音频
      return this.generateWavAudio(120, 440);
    }
  }

  // 清理缓存
  async clearCache(): Promise<void> {
    await this.cacheManager.clearOldCache();
  }

  // 获取缓存大小
  async getCacheSize(): Promise<number> {
    return await this.cacheManager.getCacheSize();
  }
}

// 导出单例
export const audioService = new AudioGenerationService();

// 音频播放器管理类
export class AudioPlayerManager {
  private audio: HTMLAudioElement;
  private onTimeUpdate?: (currentTime: number, duration: number) => void;
  private onPlayStateChange?: (isPlaying: boolean) => void;
  private onError?: (error: Error) => void;
  private onEnded?: () => void;

  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = 'metadata';
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime, this.audio.duration);
      }
    });

    this.audio.addEventListener('play', () => {
      if (this.onPlayStateChange) {
        this.onPlayStateChange(true);
      }
    });

    this.audio.addEventListener('pause', () => {
      if (this.onPlayStateChange) {
        this.onPlayStateChange(false);
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.onEnded) {
        this.onEnded();
      }
    });

    this.audio.addEventListener('error', () => {
      if (this.onError) {
        // 使用中性错误，避免浏览器底层FFmpeg错误直接暴露到UI
        this.onError(new Error('Failed to load audio'));
      }
    });
  }

  setCallbacks(callbacks: {
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onPlayStateChange?: (isPlaying: boolean) => void;
    onError?: (error: Error) => void;
    onEnded?: () => void;
  }): void {
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onPlayStateChange = callbacks.onPlayStateChange;
    this.onError = callbacks.onError;
    this.onEnded = callbacks.onEnded;
  }

  async loadAudio(url: string): Promise<void> {
    this.audio.src = url;
    return new Promise((resolve, reject) => {
      const onCanPlay = () => {
        this.audio.removeEventListener('canplay', onCanPlay);
        this.audio.removeEventListener('error', onError);
        resolve();
      };
      const onError = () => {
        this.audio.removeEventListener('canplay', onCanPlay);
        this.audio.removeEventListener('error', onError);
        reject(new Error('Failed to load audio'));
      };
      this.audio.addEventListener('canplay', onCanPlay);
      this.audio.addEventListener('error', onError);
      this.audio.load();
    });
  }

  async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (error) {
      throw new Error(`Failed to play audio: ${error}`);
    }
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  seek(time: number): void {
    this.audio.currentTime = time;
  }

  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }

  destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audio.remove();
  }
}
