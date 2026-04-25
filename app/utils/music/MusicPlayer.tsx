'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Basic SVG Icons to keep dependencies minimal
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

type Track = {
  id: string;
  name: string;
  url: string;
  coverUrl?: string;
};

type Album = {
  id: string;
  name: string;
  tracks: Track[];
};

type Props = {
  initialAlbums: Album[];
};

export default function MusicPlayer({ initialAlbums }: Props) {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(initialAlbums.length > 0 ? initialAlbums[0] : null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [stopAfterValue, setStopAfterValue] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStopAfterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeRemaining(null);

    if (value) {
      const ms = parseInt(value, 10);
      if (!isNaN(ms)) {
        const targetTime = Date.now() + ms;
        setTimeRemaining(Math.ceil(ms / 1000));
        
        intervalRef.current = setInterval(() => {
          const remaining = targetTime - Date.now();
          if (remaining <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
          } else {
            setTimeRemaining(Math.ceil(remaining / 1000));
          }
        }, 1000);

        timerRef.current = setTimeout(() => {
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setStopAfterValue("");
          setTimeRemaining(null);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }, ms);
      }
    }
    setStopAfterValue(value);
  };

  const formatRemainingTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isRestoringTime = useRef(true);
  const lastSaveTime = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('musicPlayerState');
        if (savedState) {
          const { albumId, trackId } = JSON.parse(savedState);
          
          const foundAlbum = initialAlbums.find(a => a.id === albumId);
          if (foundAlbum) {
            setActiveAlbum(foundAlbum);
            const foundTrack = foundAlbum.tracks.find(t => t.id === trackId);
            if (foundTrack) {
              setCurrentTrack(foundTrack);
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse music player state', e);
      }
    }
  }, [initialAlbums]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Imperatively play immediately to prevent mobile background throttling
    if (audioRef.current) {
      const currentSrc = audioRef.current.getAttribute('src');
      // Update src imperatively if it changed so we can call play() synchronously
      // without waiting for React to re-render the <audio> element.
      if (currentSrc !== track.url && !currentSrc?.endsWith(track.url)) {
        audioRef.current.src = track.url;
        audioRef.current.load();
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Playback failed", e);
          }
        });
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack || !activeAlbum) return;
    const tracks = activeAlbum.tracks;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx !== -1 && idx < tracks.length - 1) {
      playTrack(tracks[idx + 1]);
    } else if (idx === tracks.length - 1) {
      const albumIdx = initialAlbums.findIndex(a => a.id === activeAlbum.id);
      if (albumIdx !== -1) {
        const nextAlbum = initialAlbums[(albumIdx + 1) % initialAlbums.length];
        if (nextAlbum && nextAlbum.tracks.length > 0) {
          setActiveAlbum(nextAlbum);
          playTrack(nextAlbum.tracks[0]);
        }
      }
    }
  };

  const handlePrev = () => {
    if (!currentTrack || !activeAlbum) return;
    const tracks = activeAlbum.tracks;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) {
      playTrack(tracks[idx - 1]);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name !== 'AbortError') {
              console.error("Playback failed", e);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  // Media Session API for background playback and OS lock screen controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name.replace(/\.mp3$/i, ''),
        artist: activeAlbum?.name || 'Unknown Artist',
        album: activeAlbum?.name || 'Unknown Album',
        artwork: currentTrack.coverUrl ? [
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/png' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/png' }
        ] : []
      });
    }
  }, [currentTrack, activeAlbum]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
        audioRef.current?.play().catch(e => console.error(e));
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, activeAlbum]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const p = (currentTime / duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
      setCurrentTimeSec(currentTime);
      setDurationSec(duration);

      if (currentTrack && activeAlbum) {
        if (Math.abs(currentTime - lastSaveTime.current) >= 1) {
          lastSaveTime.current = currentTime;
          localStorage.setItem('musicPlayerState', JSON.stringify({
            albumId: activeAlbum.id,
            trackId: currentTrack.id,
            currentTime: currentTime
          }));
        }
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      const newTime = (newProgress / 100) * audioRef.current.duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
        setCurrentTimeSec(newTime);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <>
      <header className="mb-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Image src="/music.png" alt="Music" width={32} height={32} className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">Music Player</h1>
        </div>
        <div className={`relative flex items-center gap-2 text-xs transition-all bg-gray-100/50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full ${
          timeRemaining !== null 
            ? 'text-green-600 dark:text-green-400 ring-1 ring-green-500/50 opacity-100' 
            : 'text-gray-500 dark:text-gray-400 opacity-60 hover:opacity-100'
        }`}>
          {timeRemaining !== null ? (
            <>
              <span className="font-medium whitespace-nowrap">⏱️</span>
              <span className="font-mono font-medium">{formatRemainingTime(timeRemaining)}</span>
            </>
          ) : (
            <span className="font-medium whitespace-nowrap flex items-center gap-1">⏱️ Timer</span>
          )}
          <select 
            id="stopAfter"
            value={stopAfterValue}
            onChange={handleStopAfterChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="">Off</option>
            <option value="30000">30 secs</option>
            <option value="900000">15 mins</option>
            <option value="1800000">30 mins</option>
            <option value="3600000">1 hour</option>
            <option value="7200000">2 hours</option>
          </select>
        </div>
      </header>

      <main className="flex-grow relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
        {/* Main Content Area */}
        <div className="flex-1 flex">
        
        {/* Sidebar - Albums */}
        <div className="w-1/3 md:w-64 border-r border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="px-2 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Albums
          </div>
          {initialAlbums.length === 0 && (
            <div className="px-2 py-3 text-sm text-gray-500 text-center mt-10">
              No albums found in public/songs directory.
            </div>
          )}
          <ul className="pb-20">
            {initialAlbums.map((album) => (
              <li key={album.id}>
                <button
                  onClick={() => setActiveAlbum(album)}
                  className={`w-full flex items-center gap-3 px-2 py-3 text-sm text-left transition-colors ${
                    activeAlbum?.id === album.id 
                      ? 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <FolderIcon />
                  <span className="truncate">{album.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tracklist Area */}
        <div className="flex-1 bg-gray-50/30 dark:bg-zinc-900/30">
          {activeAlbum ? (
            <div className="p-2 pb-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {activeAlbum.name}
              </h2>
              
              {activeAlbum.tracks.length > 0 ? (
                <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {activeAlbum.tracks.map((track) => (
                    <div 
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`group flex items-center justify-between p-1 rounded-lg cursor-pointer transition-all ${
                        currentTrack?.id === track.id 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                          : 'hover:bg-white dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {track.coverUrl ? (
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative bg-gray-100 dark:bg-zinc-800">
                            <Image src={track.coverUrl} alt="Cover" fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 text-gray-400">
                            <MusicIcon />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-md text-wrap">{track.name.replace(/\.mp3$/i, '')}</span>
                        </div>
                      </div>
                      {/* <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === track.id ? 'opacity-100' : ''}`}>
                        <MusicIcon />
                      </div> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No tracks found in this album.</div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm p-6 text-center">
              Select an album from the sidebar to view its tracks.
            </div>
          )}
        </div>
      </div>

      {/* Player Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col">
        
        {/* Progress Bar (Full Width Bottom) */}
        <div className="w-full pl-1 pr-2 md:px-8 mt-2 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">
            {formatTime(currentTimeSec)}
          </span>
          <div 
            className={`flex-1 h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden ${currentTrack ? 'cursor-pointer' : ''} group`}
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-red-600 dark:bg-red-600 transition-all duration-150 ease-linear group-hover:bg-blue-500 dark:group-hover:bg-blue-400" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10">
            -{formatTime(durationSec - currentTimeSec)}
          </span>
        </div>
        
        {/* Bottom section: Image + Controls/Info */}
        <div className="flex p-4 mb-4 gap-6 items-center">
          
          {/* Album Image */}
          <div className="w-28 h-28 md:w-28 md:h-28 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-400 shadow-sm">
            {currentTrack?.coverUrl ? (
              <Image src={currentTrack.coverUrl} alt="Cover" fill className="object-cover" unoptimized />
            ) : (
              <MusicIcon />
            )}
          </div>

          {/* Info and Controls */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between min-w-0 gap-4">
            
            {/* Current Track Info */}
            <div className="w-full md:w-1/3 flex flex-col justify-center min-w-0 text-center md:text-left">
              <h4 className="text-lg font-bold truncate text-gray-900 dark:text-gray-100">
                {currentTrack ? currentTrack.name.replace(/\.mp3$/i, '') : 'No track selected'}
              </h4>
              {/* <p className="text-sm text-gray-500 truncate">{activeAlbum?.name || '---'}</p> */}
            </div>

            {/* Playback Controls */}
            <div className="w-full md:w-1/3 flex items-center justify-center gap-6">
              <button 
                onClick={handlePrev} 
                disabled={!currentTrack}
                className="text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30 transition-colors [&>svg]:w-8 [&>svg]:h-8"
              >
                <PrevIcon />
              </button>
              <button 
                onClick={togglePlay}
                disabled={!currentTrack}
                className="w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-transform [&>svg]:w-8 [&>svg]:h-8"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button 
                onClick={handleNext}
                disabled={!currentTrack}
                className="text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30 transition-colors [&>svg]:w-8 [&>svg]:h-8"
              >
                <NextIcon />
              </button>
            </div>
            
            {/* Empty space for balance */}
            <div className="hidden md:block w-1/3"></div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        {currentTrack && (
          <audio 
            ref={audioRef}
            src={currentTrack.url}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDurationSec(audioRef.current.duration);
                setCurrentTimeSec(audioRef.current.currentTime);
              }
              if (isRestoringTime.current) {
                isRestoringTime.current = false;
                try {
                  const savedState = localStorage.getItem('musicPlayerState');
                  if (savedState) {
                    const { currentTime } = JSON.parse(savedState);
                    if (currentTime && isFinite(currentTime) && audioRef.current) {
                      audioRef.current.currentTime = currentTime;
                      const p = (currentTime / audioRef.current.duration) * 100;
                      setProgress(isNaN(p) ? 0 : p);
                      setCurrentTimeSec(currentTime);
                    }
                  }
                } catch {
                  // Ignore
                }
              }
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleTrackEnded}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}
      </div>
    </main>
    </>
  );
}
