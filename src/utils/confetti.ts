import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  confetti({
    particleCount: 75,
    spread: 60,
    origin: { y: 0.75 },
    colors: ['#10b981', '#34d399', '#6366f1', '#f59e0b', '#ec4899'],
    disableForReducedMotion: true
  });
}

export function fireFrogConfetti() {
  // Extra big explosion when completing the daily Frog
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#10b981', '#059669', '#34d399', '#fcd34d'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
