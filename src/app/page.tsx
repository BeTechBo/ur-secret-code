'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, RotateCcw, Share2, Check } from 'lucide-react';
import { triggerMarvelousCelebration } from '@/utils/confetti';
import { playVictoryFanfare, playErrorBeep } from '@/utils/audio';

const SECRET_CODE = 'NEHEMIAH';
const CODE_LENGTH = 8;

export default function SecretCodePage() {
  const [cells, setCells] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first empty cell on mount
    inputRefs.current[0]?.focus();
  }, []);

  const triggerWin = () => {
    setIsSuccess(true);
    setIsError(false);
    setErrorMessage('');
    triggerMarvelousCelebration();
    if (soundEnabled) {
      playVictoryFanfare();
    }
  };

  const triggerFail = (msg = 'Incorrect code, try again') => {
    setIsError(true);
    setErrorMessage(msg);
    if (soundEnabled) playErrorBeep();
    setTimeout(() => setIsError(false), 700);
  };

  const handleCellChange = (index: number, value: string) => {
    // Keep only letters, take the latest character
    const sanitized = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const char = sanitized.slice(-1);

    const next = [...cells];
    next[index] = char;
    setCells(next);

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all cells are filled, check automatically
    const combined = next.join('');
    if (combined.length === CODE_LENGTH && !next.includes('')) {
      if (combined === SECRET_CODE) {
        setTimeout(triggerWin, 150);
      } else {
        setTimeout(() => triggerFail(), 200);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!cells[index] && index > 0) {
        // Move back and clear previous
        const next = [...cells];
        next[index - 1] = '';
        setCells(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...cells];
        next[index] = '';
        setCells(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = [...cells];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setCells(next);

    const targetFocus = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[targetFocus]?.focus();

    if (next.join('') === SECRET_CODE) {
      setTimeout(triggerWin, 150);
    } else if (pasted.length === CODE_LENGTH) {
      setTimeout(() => triggerFail(), 200);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = cells.join('');
    if (code.length < CODE_LENGTH) {
      triggerFail('Please enter all 8 letters');
      // focus first empty
      const emptyIdx = cells.findIndex((c) => !c);
      if (emptyIdx !== -1) inputRefs.current[emptyIdx]?.focus();
      return;
    }

    if (code === SECRET_CODE) {
      triggerWin();
    } else {
      triggerFail('Incorrect code, try again');
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCells(Array(CODE_LENGTH).fill(''));
    setIsError(false);
    setErrorMessage('');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleShare = () => {
    navigator.clipboard.writeText('Solved the secret code at The Upper Room! 🎉');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-10 sm:py-16">
      
      {/* Sound toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-foreground/70 hover:text-foreground border border-secondary/30 shadow-xs transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-primary" />
              <span>Sound on</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-secondary" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-xl mx-auto relative z-10">

        {!isSuccess ? (
          /* ========================================================================= */
          /* DEFAULT STATE: SEPARATE CHARACTER CELLS                                   */
          /* ========================================================================= */
          <div className="text-center">

            {/* Logo */}
            <div className="inline-flex justify-center mb-5">
              <div className="bg-white p-2 sm:p-2.5 rounded-full shadow-md border-2 border-secondary overflow-hidden w-20 h-20 sm:w-24 sm:h-24 relative">
                <Image
                  src="/logo.jpg"
                  alt="The Upper Room"
                  fill
                  sizes="96px"
                  className="object-cover rounded-full"
                  priority
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              The Upper Room
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Enter the 8-letter secret code
            </p>

            {/* Card */}
            <div className="mt-7 bg-white/95 backdrop-blur-md py-7 sm:py-9 px-4 sm:px-8 rounded-2xl shadow-lg border border-secondary/35">
              
              <form onSubmit={handleSubmit}>
                {/* 8 Character Cells */}
                <div
                  className={`flex items-center justify-center gap-1.5 sm:gap-2.5 my-4 ${
                    isError ? 'animate-shake' : ''
                  }`}
                  onPaste={handlePaste}
                >
                  {cells.map((char, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="text"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleCellChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoComplete="off"
                      spellCheck={false}
                      className={`w-9 h-12 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold uppercase rounded-lg sm:rounded-xl border-2 transition-all outline-none select-none ${
                        isError
                          ? 'border-red-400 bg-red-50/50 text-red-600'
                          : char
                          ? 'border-primary bg-primary/5 text-foreground shadow-xs'
                          : 'border-secondary/40 bg-background/50 text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Error message */}
                {errorMessage && (
                  <p className="mt-3 text-xs sm:text-sm font-medium text-red-600 transition-opacity">
                    {errorMessage}
                  </p>
                )}

                {/* Action Button */}
                <div className="mt-7 flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-w-[200px] px-8 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] shadow-sm transition-all cursor-pointer"
                  >
                    Submit Code
                  </button>

                  {cells.some((c) => c !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCells(Array(CODE_LENGTH).fill(''));
                        setErrorMessage('');
                        inputRefs.current[0]?.focus();
                      }}
                      className="text-xs text-foreground/50 hover:text-foreground/80 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </form>

            </div>

            <p className="mt-6 text-xs text-foreground/50">
              The Upper Room • AUC Community
            </p>

          </div>
        ) : (
          /* ========================================================================= */
          /* CELEBRATION & WIN STATE                                                   */
          /* ========================================================================= */
          <div className="relative animate-victory-reveal text-center">
            
            {/* Ambient golden glow */}
            <div className="absolute inset-0 -m-8 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-secondary/40 via-gold/40 to-primary/40 blur-2xl animate-spin-slow" />
            </div>

            {/* Victory Card */}
            <div className="relative bg-white/95 backdrop-blur-md py-8 sm:py-11 px-5 sm:px-10 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-secondary animate-pulse-glow">
              
              <div className="text-4xl sm:text-5xl mb-3">🎉</div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                You Got It!
              </h2>

              <p className="text-sm text-foreground/75 mt-1 mb-6">
                The code was correct:
              </p>

              {/* Solved 8 Cells Display */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-6">
                {'NEHEMIAH'.split('').map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-12 sm:w-12 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-black rounded-lg sm:rounded-xl border-2 border-primary bg-primary/10 text-primary shadow-sm"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {/* Bible Verse */}
              <div className="my-6 p-4 sm:p-5 rounded-xl bg-background/90 border border-secondary/30 text-left">
                <p className="text-sm sm:text-base text-foreground font-medium italic">
                  “The joy of the LORD is your strength.”
                </p>
                <p className="text-xs text-primary font-bold mt-1 text-right">
                  — Nehemiah 8:10
                </p>
              </div>

              {/* Controls */}
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerMarvelousCelebration();
                    if (soundEnabled) playVictoryFanfare();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
                >
                  Celebrate again 🎆
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-sm text-foreground bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-primary font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-secondary" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-sm text-foreground/75 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try again</span>
                </button>
              </div>

            </div>

            <p className="mt-5 text-xs text-foreground/50">
              The Upper Room • Solved with joy 🕊️
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
