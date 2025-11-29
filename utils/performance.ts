/**
 * Performance utilities for 3D animations
 */

/**
 * Detects if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Detects device performance tier
 */
export const getPerformanceTier = (): 'low' | 'medium' | 'high' => {
    if (typeof navigator === 'undefined') return 'medium';

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4; // GB

    if (isMobile || cores <= 2 || memory <= 2) {
        return 'low';
    } else if (cores <= 4 || memory <= 4) {
        return 'medium';
    }
    return 'high';
};

/**
 * Get quality settings based on performance tier
 */
export const getQualitySettings = () => {
    const tier = getPerformanceTier();
    const reducedMotion = prefersReducedMotion();

    return {
        // Particle counts
        backgroundParticles: reducedMotion ? 0 : tier === 'low' ? 400 : tier === 'medium' ? 600 : 800,
        loginParticles: reducedMotion ? 0 : tier === 'low' ? 100 : tier === 'medium' ? 150 : 200,
        fluidOrbs: reducedMotion ? 0 : tier === 'low' ? 5 : tier === 'medium' ? 6 : 8,

        // Render settings
        pixelRatio: Math.min(window.devicePixelRatio, tier === 'low' ? 1 : 1.5),
        antialias: tier !== 'low',

        // Animation settings
        enableAnimations: !reducedMotion,
        targetFPS: 60,
    };
};

/**
 * Frame rate limiter for smooth 60fps animations
 */
export class FrameLimiter {
    private targetFPS: number;
    private frameInterval: number;
    private lastFrameTime: number;

    constructor(targetFPS: number = 60) {
        this.targetFPS = targetFPS;
        this.frameInterval = 1000 / targetFPS;
        this.lastFrameTime = 0;
    }

    /**
     * Check if enough time has passed to render the next frame
     * @param currentTime - Current timestamp from requestAnimationFrame
     * @returns true if frame should be rendered
     */
    shouldRender(currentTime: number): boolean {
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime < this.frameInterval) {
            return false;
        }

        // Adjust for any drift
        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
        return true;
    }

    reset() {
        this.lastFrameTime = 0;
    }
}

/**
 * Optimized lerp that reuses objects to avoid garbage collection
 */
export const createLerpHelper = () => {
    const tempVector = { x: 0, y: 0, z: 0 };

    return {
        lerp: (current: any, target: any, factor: number) => {
            tempVector.x = current.x + (target.x - current.x) * factor;
            tempVector.y = current.y + (target.y - current.y) * factor;
            tempVector.z = current.z + (target.z - current.z) * factor;
            return tempVector;
        }
    };
};
