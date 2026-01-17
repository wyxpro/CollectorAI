// 增强的音频播放器Hook

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioService, AudioPlayerManager } from './audioService';
import { Podcast } from './podcastApi';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  isLoading: boolean;
  error: string | null;
  playbackMode: 'audio' | 'generated' | 'fallback';
}

export function useAudioPlayer(podcast: Podcast | null, playbackSpeed: number = 1.0) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isLoading: false,
    error: null,
    playbackMode: 'audio'
  });

  const playerRef = useRef<AudioPlayerManager | null>(null);
  const generatedAudioUrlRef = useRef<string | null>(null);
  const isGeneratingRef = useRef(false);

  // 初始化播放器
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new AudioPlayerManager();
      playerRef.current.setCallbacks({
        onTimeUpdate: (currentTime, duration) => {
          setState(prev => ({
            ...prev,
            currentTime,
            duration,
            progress: duration > 0 ? (currentTime / duration) * 100 : 0
          }));
        },
        onPlayStateChange: (isPlaying) => {
          setState(prev => ({ ...prev, isPlaying }));
        },
        onError: (error) => {
          console.debug('播放器错误（已处理）:', error);
          // 不显示底层错误到UI，直接进入兜底
          setState(prev => ({ ...prev, error: null, isLoading: false }));
          handleFallback();
        },
        onEnded: () => {
          setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, progress: 0 }));
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (generatedAudioUrlRef.current) {
        URL.revokeObjectURL(generatedAudioUrlRef.current);
        generatedAudioUrlRef.current = null;
      }
    };
  }, []);

  // 更新播放速度
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  // 生成音频
  const generateAudio = useCallback(async (podcast: Podcast): Promise<string> => {
    if (isGeneratingRef.current) {
      throw new Error('音频正在生成中');
    }

    isGeneratingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('开始生成音频...');
      
      // 使用audioService生成音频
      const result = await audioService.generatePodcastAudio(
        podcast.script,
        {
          voice: 'calm',
          rate: playbackSpeed,
          pitch: 1.0,
          volume: 1.0
        }
      );

      console.log('音频生成成功:', result);

      // 清理旧的URL
      if (generatedAudioUrlRef.current) {
        URL.revokeObjectURL(generatedAudioUrlRef.current);
      }

      generatedAudioUrlRef.current = result.audioUrl;
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        duration: result.duration,
        playbackMode: 'generated'
      }));

      return result.audioUrl;
    } catch (error: any) {
      console.error('音频生成失败:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    } finally {
      isGeneratingRef.current = false;
    }
  }, [playbackSpeed]);

  // Fallback到备用音频
  const handleFallback = useCallback(async () => {
    console.log('切换到备用音频...');
    setState(prev => ({ ...prev, playbackMode: 'fallback', isLoading: true }));

    try {
      const fallbackAudio = audioService.generateWavAudio(120, 440);
      
      if (playerRef.current) {
        await playerRef.current.loadAudio(fallbackAudio.audioUrl);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          duration: fallbackAudio.duration,
          error: null
        }));
      }
    } catch (error: any) {
      console.error('Fallback失败:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: '音频加载失败' 
      }));
    }
  }, []);

  // 加载音频
  const loadAudio = useCallback(async (podcast: Podcast) => {
    if (!playerRef.current) return;

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      currentTime: 0,
      progress: 0
    }));

    try {
      let audioUrl: string;

      // 检查是否是生成的音频
      if (podcast.audioUrl?.startsWith('generated://')) {
        // 生成新音频
        audioUrl = await generateAudio(podcast);
      } else if (podcast.audioUrl) {
        // 使用现有URL
        audioUrl = podcast.audioUrl;
        setState(prev => ({ ...prev, playbackMode: 'audio' }));
      } else {
        // 没有音频，生成新的
        audioUrl = await generateAudio(podcast);
      }

      // 加载音频
      await playerRef.current.loadAudio(audioUrl);
      setState(prev => ({ ...prev, isLoading: false }));
      
      console.log('音频加载成功');
    } catch (error: any) {
      console.error('音频加载失败:', error);
      // 尝试fallback
      await handleFallback();
    }
  }, [generateAudio, handleFallback]);

  // 播放/暂停
  const togglePlayPause = useCallback(async () => {
    if (!playerRef.current || !podcast) return;

    try {
      if (state.isPlaying) {
        playerRef.current.pause();
      } else {
        // 如果还没有加载音频，先加载
        if (state.duration === 0 && !state.isLoading) {
          await loadAudio(podcast);
        }
        await playerRef.current.play();
      }
    } catch (error: any) {
      console.error('播放失败:', error);
      setState(prev => ({ ...prev, error: error.message }));
      
      // 如果是NotAllowedError，不fallback，让用户再次点击
      if (error.name !== 'NotAllowedError') {
        await handleFallback();
      }
    }
  }, [state.isPlaying, state.duration, state.isLoading, podcast, loadAudio, handleFallback]);

  // 跳转
  const seek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seek(time);
    }
  }, []);

  // 快进
  const skipForward = useCallback((seconds: number = 10) => {
    if (playerRef.current) {
      const newTime = Math.min(
        playerRef.current.getCurrentTime() + seconds,
        playerRef.current.getDuration()
      );
      playerRef.current.seek(newTime);
    }
  }, []);

  // 快退
  const skipBackward = useCallback((seconds: number = 10) => {
    if (playerRef.current) {
      const newTime = Math.max(
        playerRef.current.getCurrentTime() - seconds,
        0
      );
      playerRef.current.seek(newTime);
    }
  }, []);

  // 停止
  const stop = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  }, []);

  // 当播客改变时，加载新音频
  useEffect(() => {
    if (podcast) {
      loadAudio(podcast);
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    };
  }, [podcast?.id]); // 只在podcast id改变时重新加载

  return {
    ...state,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    stop,
    reload: () => podcast && loadAudio(podcast)
  };
}
