'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { KeyRound, Sparkles, CheckCircle2, AlertCircle, RotateCcw, Volume2, VolumeX, ShieldCheck, Share2, HelpCircle } from 'lucide-react';
import { triggerMarvelousCelebration } from '@/utils/confetti';
import { playVictoryFanfare, playErrorBeep } from '@/utils/audio';

const SECRET_CODE = 'nehemiah';

export default function SecretCodePage() {
  const [code, setCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on initial mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toLowerCase();

    if (!cleanCode) {
      setIsError(true);
      setErrorMessage('Please enter a secret code first.');
      if (soundEnabled) playErrorBeep();
      setTimeout(() => setIsError(false), 800);
      return;
    }

    if (cleanCode === SECRET_CODE) {
      setIsSuccess(true);
      setIsError(false);
      setErrorMessage('');
      
      // Play marvelous celebration effects!
      triggerMarvelousCelebration();
      if (soundEnabled) {
        playVictoryFanfare();
      }
    } else {
      setIsError(true);
      setErrorMessage('Incorrect secret code. Try again!');
      if (soundEnabled) playErrorBeep();
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCode('');
    setIsError(false);
    setErrorMessage('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleReplayCelebration = () => {
    triggerMarvelousCelebration();
    if (soundEnabled) {
      playVictoryFanfare();
    }
  };

  const handleShare = () => {
    const text = '🏆 I unlocked the secret code "Nehemiah" at The Upper Room! ✨';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-20 overflow-hidden">
      
      {/* Sound Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 hover:bg-white text-foreground/80 hover:text-foreground border border-secondary/30 shadow-xs transition-all backdrop-blur-xs"
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-primary" />
              <span>Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-secondary" />
              <span>Sound Off</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">

        {!isSuccess ? (
          /* ========================================================================= */
          /* INITIAL STATE: CODE ENTRY CARD                                            */
          /* ========================================================================= */
          <div className={`transition-all duration-300 ${isError ? 'animate-shake' : ''}`}>
            
            {/* Logo and Brand Header */}
            <div className="text-center mb-8">
              <div className="inline-flex justify-center mb-5">
                <div className="bg-white p-3 rounded-full shadow-lg border-2 border-secondary overflow-hidden ring-4 ring-secondary/15 animate-float-gentle w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-full overflow-hidden">
                    <Image
                      src="/logo.jpg"
                      alt="The Upper Room Logo"
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                The Upper Room
              </h1>
              <p className="mt-2 text-sm sm:text-base text-foreground/75 font-medium">
                Enter the secret key to reveal the mystery
              </p>
            </div>

            {/* Secret Code Input Card */}
            <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-secondary/40 relative">
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Secret Code Challenge
                </h2>
              </div>

              {/* Error Alert */}
              {isError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center justify-center gap-2 animate-bounce">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage || 'Incorrect code. Try again!'}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="secretCode"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2"
                  >
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      id="secretCode"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Type the secret word..."
                      autoComplete="off"
                      spellCheck={false}
                      className={`block w-full px-4 py-3.5 text-base sm:text-lg font-medium text-foreground bg-background/50 border rounded-xl shadow-inner focus:outline-none focus:ring-2 transition-all placeholder:text-foreground/35 ${
                        isError
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-secondary/50 focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    {code && (
                      <button
                        type="button"
                        onClick={() => setCode('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/80 text-xs font-semibold px-2 py-1 rounded-md"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Unlock Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] shadow-md shadow-primary/20 transition-all cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-gold" />
                  <span>Unlock Mystery</span>
                </button>
              </form>

              {/* Hint Accordion */}
              <div className="mt-6 pt-5 border-t border-secondary/20 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-primary transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                </button>

                {showHint && (
                  <div className="mt-3 p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-xs text-foreground/85 leading-relaxed animate-fade-in">
                    🏛️ <em>He was the great cupbearer to King Artaxerxes who rebuilt the broken walls of Jerusalem in 52 days.</em>
                  </div>
                )}
              </div>

            </div>

            {/* Subtle Footer hint */}
            <p className="mt-6 text-center text-xs text-foreground/50">
              The Upper Room • AUC Community
            </p>

          </div>
        ) : (
          /* ========================================================================= */
          /* CELEBRATION & VICTORY STATE                                               */
          /* ========================================================================= */
          <div className="relative animate-victory-reveal">
            
            {/* Radiant Sunburst Background Glow */}
            <div className="absolute inset-0 -m-10 sm:-m-16 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-secondary/30 via-gold/40 to-primary/30 blur-2xl animate-spin-slow" />
            </div>

            {/* Victory Card */}
            <div className="relative bg-white/95 backdrop-blur-md py-10 px-6 sm:px-10 rounded-3xl shadow-2xl border-2 border-secondary animate-pulse-glow text-center">
              
              {/* Animated Floating Victory Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-primary via-secondary to-gold p-1 shadow-xl animate-victory-burst">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <ShieldCheck className="w-14 h-14 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-gold text-foreground p-1.5 rounded-full shadow-md animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Victory Banner */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-3">
                Mystery Unlocked
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                Congratulations!
              </h2>

              <p className="text-sm sm:text-base text-foreground/80 mb-6 font-medium">
                You entered the correct secret code:
              </p>

              {/* Shimmering Nehemiah Display */}
              <div className="my-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-primary/10 via-gold/20 to-secondary/10 border border-gold/40 shadow-inner">
                <span className="shimmer-text text-3xl sm:text-5xl font-black tracking-widest uppercase">
                  NEHEMIAH
                </span>
                <p className="text-xs font-semibold text-primary/80 mt-1 uppercase tracking-wider">
                  The Wall Builder • Man of Faith & Action
                </p>
              </div>

              {/* Scripture Inspiration Card */}
              <div className="my-6 p-4 sm:p-5 rounded-2xl bg-background/80 border border-secondary/30 text-left relative">
                <span className="text-3xl text-secondary/40 font-serif absolute top-2 left-3">“</span>
                <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed pt-2 pl-4">
                  The God of heaven Himself will prosper us; therefore we His servants will arise and build.
                </p>
                <p className="text-[11px] sm:text-xs text-primary font-bold text-right mt-2">
                  — Nehemiah 2:20
                </p>
                <div className="mt-3 pt-3 border-t border-secondary/15 flex items-center justify-between text-[11px] text-foreground/70">
                  <span>“The joy of the LORD is your strength”</span>
                  <span className="font-semibold text-secondary">Neh 8:10</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                
                {/* Replay Celebration Button */}
                <button
                  type="button"
                  onClick={handleReplayCelebration}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-gold animate-spin-slow" />
                  <span>Replay Celebration 🎆</span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-foreground bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-primary font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-secondary" />
                        <span>Share Victory</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-foreground/70" />
                    <span>Enter Another Code</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom branding */}
            <p className="mt-6 text-center text-xs text-foreground/60 font-medium">
              The Upper Room • Solved with wisdom and joy 🕊️
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
