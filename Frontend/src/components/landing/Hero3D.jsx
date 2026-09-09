import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const Hero3D = () => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Medical Hologram Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Torus Knot — representing interconnected medical neural network / DNA loop
    const knotGeometry = new THREE.TorusKnotGeometry(3.2, 0.85, 120, 16, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x2563eb : 0x0284c7,
      emissive: isDark ? 0x1e40af : 0x0369a1,
      emissiveIntensity: isDark ? 0.6 : 0.4,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.65,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    coreGroup.add(knotMesh);

    // Inner Glowing Core Sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2.1, 3);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x0891b2,
      emissive: isDark ? 0x0891b2 : 0x0e7490,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    coreGroup.add(sphereMesh);

    // Outer Orbiting Energy Ring
    const ringGeometry = new THREE.TorusGeometry(5.2, 0.06, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Medical Emerald
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
    });
    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ringMesh2.rotation.y = Math.PI / 3;
    ringMesh2.material.color.setHex(0x38bdf8);
    coreGroup.add(ringMesh2);

    // 3. Floating Data Node Particles
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      scales[i / 3] = Math.random();
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x67e8f9 : 0x0284c7,
      size: 0.12,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3, 30);
    cyanPoint.position.set(6, 6, 6);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0x818cf8, 2.5, 30);
    purplePoint.position.set(-6, -6, 6);
    scene.add(purplePoint);

    // 5. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 1.5;
      targetY = -(y / rect.height) * 1.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. Animation loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      coreGroup.rotation.y += 0.4 * delta;
      coreGroup.rotation.x = Math.sin(time * 0.3) * 0.2 + mouseY * 0.6;
      coreGroup.rotation.z = Math.cos(time * 0.2) * 0.15 + mouseX * 0.6;

      ringMesh1.rotation.z += 0.8 * delta;
      ringMesh2.rotation.x -= 0.6 * delta;

      particleSystem.rotation.y = time * 0.05;
      particleSystem.rotation.x = time * 0.02;

      // Subtle breathing scale
      const pulse = 1 + Math.sin(time * 1.5) * 0.03;
      sphereMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      knotGeometry.dispose();
      knotMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] flex items-center justify-center pointer-events-none"
      aria-label="3D Holographic Medical Core"
    />
  );
};

export default Hero3D;
