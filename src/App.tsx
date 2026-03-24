/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col items-center justify-between p-4 md:p-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center z-10 mb-8">
        <div className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-1 md:px-6 md:py-2 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-md">
            SNAKE
          </h1>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-sm text-cyan-500 font-mono tracking-widest uppercase mb-1">High Score</p>
          <div className="relative">
            <p 
              className="text-5xl md:text-6xl font-normal text-fuchsia-400 drop-shadow-[0_0_12px_rgba(255,0,255,0.8)] font-digital glitch-text"
              data-text={highScore}
            >
              {highScore}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10">
        {/* Game Container */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Music Player Container */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <MusicPlayer />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-8 z-10">
        <p className="text-gray-600 text-xs font-mono tracking-widest">
          SYSTEM ONLINE // AESTHETIC: DARK NEON
        </p>
      </footer>
    </div>
  );
}
