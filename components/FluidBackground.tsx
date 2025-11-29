
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getQualitySettings, FrameLimiter, prefersReducedMotion } from '../utils/performance';

const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get performance-based quality settings
    const quality = getQualitySettings();
    const reducedMotion = prefersReducedMotion();

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuration based on theme
    // We use vibrant colors that blend well together
    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

    const colors = isDark
      ? ['#4f46e5', '#7c3aed', '#db2777', '#0891b2'] // Dark mode: Indigo, Violet, Pink, Cyan
      : ['#60a5fa', '#a78bfa', '#f472b6', '#22d3ee']; // Light mode: Lighter pastel versions

    // Orb class
    class Orb {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.radius = Math.random() * 150 + 100; // Large radius for fluid look
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow, organic movement
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (reducedMotion) return; // Skip updates if reduced motion is preferred

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges with a buffer so they don't get stuck
        if (this.x < -100 || this.x > width + 100) this.vx *= -1;
        if (this.y < -100 || this.y > height + 100) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);

        // Convert hex to rgba for transparency
        const hex2rgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `${r}, ${g}, ${b}`;
        };

        const rgb = hex2rgb(this.color);
        gradient.addColorStop(0, `rgba(${rgb}, 0.6)`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create Orbs (Optimized count based on performance)
    const orbs: Orb[] = [];
    const orbCount = quality.fluidOrbs;
    for (let i = 0; i < orbCount; i++) {
      orbs.push(new Orb());
    }

    // Frame rate limiting
    const frameLimiter = new FrameLimiter(quality.targetFPS);

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Skip frame if not enough time has passed (60fps cap)
      if (!frameLimiter.shouldRender(currentTime)) {
        return;
      }

      // Clear canvas with slight fade for trails (optional, but clean clear is better for glass)
      ctx.clearRect(0, 0, width, height);

      // Draw all orbs
      // We use 'screen' or 'lighter' blend mode for glowing effect in dark mode
      ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';

      orbs.forEach(orb => {
        orb.update();
        orb.draw(ctx);
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    render(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Reduced blur for better performance (from blur-[80px] to blur-[60px])
  const blurClass = prefersReducedMotion() ? 'blur-[40px]' : 'blur-[60px]';

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full opacity-70 ${blurClass} saturate-150`}
      />
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};

export default FluidBackground;
