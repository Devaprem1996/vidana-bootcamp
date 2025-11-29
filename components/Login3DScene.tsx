
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';
import { getQualitySettings, FrameLimiter, prefersReducedMotion } from '../utils/performance';

interface Login3DSceneProps {
  activeField: 'email' | 'password' | null;
  formState: 'idle' | 'loading' | 'success' | 'error';
}

const Login3DScene: React.FC<Login3DSceneProps> = ({ activeField, formState }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // We use refs to pass reactive state into the animation loop without re-triggering init
  const stateRef = useRef({ activeField, formState, theme });

  useEffect(() => {
    stateRef.current = { activeField, formState, theme };
  }, [activeField, formState, theme]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Get performance-based quality settings
    const quality = getQualitySettings();
    const reducedMotion = prefersReducedMotion();

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: quality.antialias,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(quality.pixelRatio); // Capped pixel ratio
    mountRef.current.appendChild(renderer.domElement);

    // --- OBJECTS ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Determines visibility based on background
    const isDark = theme === 'dark';

    // 1. The Core (Glowing Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x6C5CE7, // Primary Violet
      roughness: 0.1,
      metalness: 0.8,
      wireframe: true,
      emissive: 0x6C5CE7,
      emissiveIntensity: isDark ? 0.5 : 0.8 // Brighter emissive in light mode
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(core);

    // Core Inner Glow
    const coreInnerGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreInnerMat = new THREE.MeshBasicMaterial({
      color: 0x00D1B2, // Teal
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.5
    });
    const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    mainGroup.add(coreInner);

    // 2. Orbiting Modules
    const orbitGroup = new THREE.Group();
    mainGroup.add(orbitGroup);

    // Email Module
    const emailGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const emailMat = new THREE.MeshStandardMaterial({
      color: 0x00D1B2,
      roughness: 0.2,
      metalness: 0.8
    });
    const emailOrb = new THREE.Mesh(emailGeo, emailMat);
    emailOrb.position.set(2, 1, 0);
    orbitGroup.add(emailOrb);

    // Password Module
    const passGeo = new THREE.TorusGeometry(0.25, 0.08, 16, 32);
    const passMat = new THREE.MeshStandardMaterial({
      color: 0xF472B6,
      roughness: 0.2,
      metalness: 0.8
    });
    const passOrb = new THREE.Mesh(passGeo, passMat);
    passOrb.position.set(-2, 0.5, 1);
    passOrb.rotation.x = Math.PI / 2;
    orbitGroup.add(passOrb);

    // Code Module (Octahedron) - needs to be dark in light mode
    const codeGeo = new THREE.OctahedronGeometry(0.3);
    const codeMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xFFFFFF : 0x333333, // White in dark mode, Dark Grey in light mode
      roughness: 0.2,
      metalness: 0.9
    });
    const codeOrb = new THREE.Mesh(codeGeo, codeMat);
    codeOrb.position.set(0, -2, -0.5);
    orbitGroup.add(codeOrb);

    // Particles (Optimized count)
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = quality.loginParticles;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.02,
      color: isDark ? 0x7A5CFF : 0x6C5CE7, // Violet
      transparent: true,
      opacity: isDark ? 0.4 : 0.6 // More visible in light mode
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particles);


    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6C5CE7, 2, 10);
    pointLight1.position.set(2, 2, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00D1B2, 2, 10);
    pointLight2.position.set(-2, -2, 3);
    scene.add(pointLight2);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = mountRef.current.clientWidth / 2;
    const windowHalfY = mountRef.current.clientHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    if (!reducedMotion) {
      document.addEventListener('mousemove', onMouseMove);
    }

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    const frameLimiter = new FrameLimiter(quality.targetFPS);
    let animationFrameId: number;

    // Reusable Vector3 for lerp to avoid garbage collection
    const targetScale = new THREE.Vector3(1, 1, 1);

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip frame if not enough time has passed (60fps cap)
      if (!frameLimiter.shouldRender(currentTime)) {
        return;
      }

      const time = clock.getElapsedTime();
      const { activeField, formState } = stateRef.current; // Read ref values

      if (!reducedMotion && quality.enableAnimations) {
        // 1. Idle Rotation
        const rotationSpeed = 0.002;
        core.rotation.y += rotationSpeed;
        core.rotation.x += rotationSpeed * 0.5;
        coreInner.rotation.y -= rotationSpeed * 1.5;

        // 2. Parallax (optimized)
        const parallaxFactor = 0.05;
        mainGroup.rotation.y += (mouseX - mainGroup.rotation.y) * parallaxFactor;
        mainGroup.rotation.x += (mouseY - mainGroup.rotation.x) * parallaxFactor;

        // 3. Orbiting
        orbitGroup.rotation.z = time * 0.1;
        orbitGroup.rotation.x = Math.sin(time * 0.2) * 0.2;

        // 4. Focus Reactions (optimized lerp)
        const lerpFactor = 0.05;

        if (activeField === 'email') {
          targetScale.set(1.5, 1.5, 1.5);
          emailOrb.scale.lerp(targetScale, lerpFactor * 2); // Faster lerp for active state
          passOrb.scale.lerp(new THREE.Vector3(1, 1, 1), lerpFactor);
          emailOrb.position.y += (Math.sin(time * 2) * 0.01);
          coreMat.emissive.setHex(0x00D1B2);
        }
        else if (activeField === 'password') {
          targetScale.set(1.5, 1.5, 1.5);
          emailOrb.scale.lerp(new THREE.Vector3(1, 1, 1), lerpFactor);
          passOrb.scale.lerp(targetScale, lerpFactor * 2);
          passOrb.rotation.y += 0.05;
          coreMat.emissive.setHex(0xF472B6);
        }
        else {
          targetScale.set(1, 1, 1);
          emailOrb.scale.lerp(targetScale, lerpFactor);
          passOrb.scale.lerp(targetScale, lerpFactor);
          coreMat.emissive.setHex(0x6C5CE7);
        }

        // 5. Form State Reactions
        if (formState === 'loading') {
          core.rotation.y += 0.1;
          coreInner.rotation.y -= 0.15;
          orbitGroup.rotation.z += 0.05;
        } else if (formState === 'error') {
          mainGroup.position.x = Math.sin(time * 50) * 0.05;
        } else {
          mainGroup.position.x = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (!reducedMotion) {
        document.removeEventListener('mousemove', onMouseMove);
      }
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Disposals
      coreGeo.dispose(); coreMat.dispose();
      emailGeo.dispose(); emailMat.dispose();
      passGeo.dispose(); passMat.dispose();
      codeGeo.dispose(); codeMat.dispose();
      coreInnerGeo.dispose(); coreInnerMat.dispose();
      particlesGeo.dispose(); particlesMat.dispose();
      renderer.dispose();
    };
  }, [theme]); // Re-run when theme changes to update materials

  return <div ref={mountRef} className="w-full h-full absolute inset-0 z-0" />;
};

export default Login3DScene;
