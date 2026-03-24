import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Nights (AI Mix)",
    artist: "CyberSynth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "Digital Horizon",
    artist: "Neural Network",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "Quantum Leap",
    artist: "Algorithmic Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(255,0,255,0.15)] relative overflow-hidden">
      {/* Neon Glow Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.4)]">
          <Music className="text-white drop-shadow-md" size={32} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold text-lg truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400 text-sm truncate font-mono">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10 group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 hover:accent-fuchsia-400 transition-all"
        />
        <div 
          className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg pointer-events-none shadow-[0_0_8px_rgba(255,0,255,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-3 text-gray-300 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-4 bg-fuchsia-600 rounded-full text-white shadow-[0_0_15px_rgba(255,0,255,0.5)] hover:bg-fuchsia-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,255,0.8)] transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-3 text-gray-300 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
}
