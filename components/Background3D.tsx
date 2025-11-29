
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';
import { getQualitySettings, FrameLimiter, prefersReducedMotion } from '../utils/performance';

const Background3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // Get performance-based quality settings
    const quality = getQualitySettings();
    const reducedMotion = prefersReducedMotion();

    // SCENE SETUP
    const scene = new THREE.Scene();
    // Light Mode: Pure White | Dark Mode: Deep Space Black
    const bgColor = theme === 'dark' ? 0x0D0D15 : 0xffffff;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.035);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: quality.antialias,
      alpha: true,
      powerPreference: 'high-performance' // Hint to use discrete GPU if available
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(quality.pixelRatio); // Capped pixel ratio for performance

    mountRef.current.appendChild(renderer.domElement);

    // COLORS
    const primaryColor = 0x6C5CE7; // Violet
    const secondaryColor = 0x00D1B2; // Teal

    // OBJECTS

    // 1. The "Tech Sphere" (Wireframe Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshBasicMaterial({
      color: theme === 'dark' ? primaryColor : primaryColor,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.3 : 0.15 // Lower opacity in light mode to keep text readable
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 2. Inner Glow Sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.5 : 0.3
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // 3. Starfield Particles (Optimized count based on device performance)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = quality.backgroundParticles;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // In light mode, particles need to be darker to be seen against white
    const particleColor = theme === 'dark' ? 0x49D3FF : 0xa0aec0;

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: particleColor,
      transparent: true,
      opacity: theme === 'dark' ? 0.6 : 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // INTERACTION (Mouse Parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };

    if (!reducedMotion) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }

    // ANIMATION LOOP with Frame Rate Limiting
    const frameLimiter = new FrameLimiter(quality.targetFPS);
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip frame if not enough time has passed (60fps cap)
      if (!frameLimiter.shouldRender(currentTime)) {
        return;
      }

      if (!reducedMotion && quality.enableAnimations) {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Optimized rotation calculations
        const rotationSpeed = 0.002;
        const parallaxFactor = 0.05;

        sphere.rotation.y += rotationSpeed;
        sphere.rotation.x += rotationSpeed * 0.5;
        sphere.rotation.y += parallaxFactor * (targetX - sphere.rotation.y);
        sphere.rotation.x += parallaxFactor * (targetY - sphere.rotation.x);

        innerSphere.rotation.y -= rotationSpeed;
        innerSphere.rotation.x -= rotationSpeed * 0.5;

        particlesMesh.rotation.y = -mouseX * 0.0001;
        particlesMesh.rotation.x = -mouseY * 0.0001;
      }

      renderer.render(scene, camera);
    };

    animate(0);

    // RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (!reducedMotion) {
        document.removeEventListener('mousemove', onDocumentMouseMove);
      }
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700"
      // Gradient override for extra polish in CSS
      style={{
        background: theme === 'dark'
          ? 'radial-gradient(circle at 50% 50%, #1a1b26 0%, #0D0D15 100%)'
          : 'linear-gradient(to bottom, #ffffff, #f9fafb)'
      }}
    />
  );
};

export default Background3D;
