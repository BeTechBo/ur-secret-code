import confetti from 'canvas-confetti';

const UR_PALETTE = ['#D97746', '#416047', '#E5A93C', '#2E4034', '#F4A261', '#E76F51', '#FFD166'];

export function triggerMarvelousCelebration() {
  // 1. Initial Powerful Central Burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: UR_PALETTE,
    ticks: 300,
    gravity: 0.8,
    scalar: 1.2,
  });

  // 2. Stars & Shapes Burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: UR_PALETTE,
      shapes: ['star', 'circle'],
      scalar: 1.3,
      ticks: 350,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: UR_PALETTE,
      shapes: ['star', 'circle'],
      scalar: 1.3,
      ticks: 350,
    });
  }, 250);

  // 3. Fireworks Fountain Finale (left & right alternating cannons for 3.5 seconds)
  const duration = 3500;
  const animationEnd = Date.now() + duration;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 75,
      origin: { x: 0.05, y: 0.7 },
      colors: UR_PALETTE,
      startVelocity: 45,
    });

    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 75,
      origin: { x: 0.95, y: 0.7 },
      colors: UR_PALETTE,
      startVelocity: 45,
    });
  }, 250);
}
