import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiActivity,
  FiCpu,
  FiPackage,
  FiCreditCard,
  FiVideo,
  FiArrowRight,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const ECOSYSTEM_STEPS = [
  {
    id: "ehr",
    nodeIndex: 0,
    title: "1. Patient Registration & Longitudinal EHR",
    shortTitle: "Patient Check-in",
    tagline: "Centralized Clinical Identity & Baseline Vitals",
    icon: FiUsers,
    role: "Receptionist / Doctor",
    color: "#3b82f6", // Blue
    hexColor: 0x3b82f6,
    pos: [-5.2, 2.0, 0.5],
    howItWorks:
      "Patient arrives at OPD desk. System generates unique atomic ID (PT-000001), logs demographics, scans CNIC, and displays previous longitudinal visit history in under 15 seconds.",
    techBadge: "MongoDB Indexed • 0.05s Search",
    flowTo: "Doctor Consultation",
  },
  {
    id: "doctor",
    nodeIndex: 1,
    title: "2. Doctor Consultation & EHR Diagnosis",
    shortTitle: "Doctor Exam",
    tagline: "Vital Signs, Diagnosis & Digital Prescription",
    icon: FiActivity,
    role: "Attending Physician",
    color: "#10b981", // Emerald
    hexColor: 0x10b981,
    pos: [-2.2, 4.4, -0.8],
    howItWorks:
      "Doctor reviews past allergy alerts, measures systolic/diastolic blood pressure, pulse, and temperature. Clinical diagnoses and medicines are typed with instant autocompletion.",
    techBadge: "Multi-parameter Vitals • BMI Auto-Calc",
    flowTo: "Gemini AI Engine",
  },
  {
    id: "ai",
    nodeIndex: 2,
    title: "3. Google Gemini AI & Trilingual Slips",
    shortTitle: "Gemini AI Hub",
    tagline: "Multilingual Intelligence & Clinical Audit",
    icon: FiCpu,
    role: "AI Co-pilot / Admin",
    color: "#06b6d4", // Cyan
    hexColor: 0x06b6d4,
    pos: [3.4, 3.8, 0.8],
    howItWorks:
      "Prescription is processed by Google Gemini (or offline Heuristic Fail-safe). Generates trilingual instructions in English, Roman Urdu, and authentic Sindhi (سنڌي script with RTL alignment).",
    techBadge: "Gemini 1.5/2.0 Flash • 3-Tier Fallback",
    flowTo: "Pharmacy Counter",
  },
  {
    id: "pharmacy",
    nodeIndex: 3,
    title: "4. Smart Pharmacy & Barcode FEFO POS",
    shortTitle: "Pharmacy FEFO",
    tagline: "First-Expiry-First-Out Inventory Protection",
    icon: FiPackage,
    role: "Pharmacist",
    color: "#8b5cf6", // Purple
    hexColor: 0x8b5cf6,
    pos: [5.4, -1.0, -0.5],
    howItWorks:
      "Pharmacist scans medicine barcode using USB gun or device camera with 880Hz beep confirmation. System automatically allocates stock from earliest expiring batches first.",
    techBadge: "FEFO Depletion • Barcode Web Audio",
    flowTo: "Billing POS",
  },
  {
    id: "billing",
    nodeIndex: 4,
    title: "5. Split-Payment Invoicing & Receipt POS",
    shortTitle: "Billing POS",
    tagline: "Multi-Gateway Reconciliation & Thermal Print",
    icon: FiCreditCard,
    role: "Billing Desk",
    color: "#f59e0b", // Amber
    hexColor: 0xf59e0b,
    pos: [1.8, -4.2, 0.6],
    howItWorks:
      "System aggregates doctor consultation fee + pharmacy total into an itemized bill. Supports split payments (Cash, Card, JazzCash, EasyPaisa) and outputs 80mm thermal slips.",
    techBadge: "Split Payments • Overpayment Guard",
    flowTo: "WhatsApp & Telemedicine",
  },
  {
    id: "telemedicine",
    nodeIndex: 5,
    title: "6. WhatsApp Slip & WebRTC Telemedicine",
    shortTitle: "Alerts & Telemedicine",
    tagline: "Remote Patient Follow-Up & Real-time Alerts",
    icon: FiVideo,
    role: "Doctor / Patient",
    color: "#f43f5e", // Rose
    hexColor: 0xf43f5e,
    pos: [-4.2, -3.2, -0.7],
    howItWorks:
      "Patient receives a 1-click WhatsApp message with appointment reminder or digital discharge slip. Rural patients join high-definition WebRTC video consults with in-call EHR notes sync.",
    techBadge: "WebRTC P2P • WhatsApp Deep Links",
    flowTo: "EHR Patient Record",
  },
];

const Ecosystem3D = ({ onSelectModule, activeExternalIndex = null }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Sync external card hover/selection if provided
  useEffect(() => {
    if (
      activeExternalIndex !== null &&
      activeExternalIndex >= 0 &&
      activeExternalIndex < ECOSYSTEM_STEPS.length
    ) {
      setActiveStep(activeExternalIndex);
      setIsPlaying(false);
    }
  }, [activeExternalIndex]);

  // Auto-tour rotation interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ECOSYSTEM_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Setup Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 16.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Central SmartClinic Core Hub Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Inner Glowing Core (Icosahedron)
    const centralGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const centralMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x2563eb : 0x0284c7,
      emissive: isDark ? 0x1d4ed8 : 0x0369a1,
      emissiveIntensity: isDark ? 0.7 : 0.5,
      roughness: 0.15,
      metalness: 0.7,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.85 : 0.7,
    });
    const centralMesh = new THREE.Mesh(centralGeo, centralMat);
    rootGroup.add(centralMesh);

    // Core Pulsing Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isDark ? 0.9 : 0.75,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    rootGroup.add(nucleusMesh);

    // Orbiting Golden Ring around Central Core
    const coreRingGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 80);
    const coreRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing.rotation.x = Math.PI / 2.5;
    rootGroup.add(coreRing);

    // 4. Satellite Nodes Construction
    const nodeMeshes = [];
    const nodeGlowMeshes = [];
    const raycastTargets = [];

    ECOSYSTEM_STEPS.forEach((step, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...step.pos);
      rootGroup.add(nodeGroup);

      // Node Geometry variant per module
      let geo;
      switch (idx) {
        case 0:
          geo = new THREE.OctahedronGeometry(0.7, 1);
          break; // EHR
        case 1:
          geo = new THREE.IcosahedronGeometry(0.65, 0);
          break; // Doctor
        case 2:
          geo = new THREE.TorusKnotGeometry(0.42, 0.14, 64, 8);
          break; // AI
        case 3:
          geo = new THREE.CylinderGeometry(0.45, 0.45, 0.9, 16);
          break; // Pharmacy
        case 4:
          geo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
          break; // Billing
        default:
          geo = new THREE.DodecahedronGeometry(0.65, 0);
          break; // Telemedicine
      }

      const mat = new THREE.MeshStandardMaterial({
        color: step.hexColor,
        emissive: step.hexColor,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const nodeMesh = new THREE.Mesh(geo, mat);
      nodeMesh.userData = { stepIndex: idx, stepData: step };
      nodeGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
      raycastTargets.push(nodeMesh);

      // Outer Glow Aura Sphere
      const glowGeo = new THREE.SphereGeometry(1.05, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: step.hexColor,
        transparent: true,
        opacity: 0.18,
        wireframe: true,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      nodeGroup.add(glowMesh);
      nodeGlowMeshes.push(glowMesh);

      // Orbital Halo Ring around the node
      const haloGeo = new THREE.RingGeometry(0.9, 0.98, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: step.hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      nodeGroup.add(halo);
    });

    // 5. Curved Interconnected Data Pipelines (Catmull-Rom Spline Closed Loop)
    const loopPoints = ECOSYSTEM_STEPS.map((s) => new THREE.Vector3(...s.pos));
    const cycleCurve = new THREE.CatmullRomCurve3(loopPoints, true); // closed cycle

    // Pipeline tube
    const cycleTubeGeo = new THREE.TubeGeometry(
      cycleCurve,
      120,
      0.035,
      8,
      true,
    );
    const cycleTubeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25,
    });
    const cycleTube = new THREE.Mesh(cycleTubeGeo, cycleTubeMat);
    rootGroup.add(cycleTube);

    // Spokes connecting Central Core to each satellite node
    ECOSYSTEM_STEPS.forEach((step) => {
      const spokePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          step.pos[0] * 0.5,
          step.pos[1] * 0.5,
          step.pos[2] * 0.5,
        ),
        new THREE.Vector3(...step.pos),
      ];
      const spokeCurve = new THREE.CatmullRomCurve3(spokePoints);
      const spokeGeo = new THREE.TubeGeometry(spokeCurve, 24, 0.02, 6, false);
      const spokeMat = new THREE.MeshBasicMaterial({
        color: step.hexColor,
        transparent: true,
        opacity: 0.25,
      });
      const spokeMesh = new THREE.Mesh(spokeGeo, spokeMat);
      rootGroup.add(spokeMesh);
    });

    // 6. Flowing Animated Data Packets (Traveling luminous spheres along the cycle curve)
    const PACKET_COUNT = 14;
    const packetGeos = new THREE.SphereGeometry(0.14, 12, 12);
    const packets = [];

    for (let i = 0; i < PACKET_COUNT; i++) {
      const stepForPacket = ECOSYSTEM_STEPS[i % ECOSYSTEM_STEPS.length];
      const packetMat = new THREE.MeshBasicMaterial({
        color: stepForPacket.hexColor,
        transparent: true,
        opacity: 0.9,
      });
      const pMesh = new THREE.Mesh(packetGeos, packetMat);
      rootGroup.add(pMesh);
      packets.push({
        mesh: pMesh,
        offset: i / PACKET_COUNT,
        speed: 0.065,
      });
    }

    // 7. Ambient Particle Field (Cloud of clinic data points)
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 7 + Math.random() * 5.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pPositions[i] = r * Math.sin(ph) * Math.cos(th);
      pPositions[i + 1] = r * Math.sin(ph) * Math.sin(th);
      pPositions[i + 2] = r * Math.cos(ph);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      size: 0.09,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(pGeo, pMat);
    scene.add(particleField);

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xffffff, 2.5, 50);
    mainLight.position.set(5, 8, 10);
    scene.add(mainLight);

    const cyanBacklight = new THREE.PointLight(0x06b6d4, 2.2, 40);
    cyanBacklight.position.set(-6, -6, 8);
    scene.add(cyanBacklight);

    // 9. Interactive Raycaster & Mouse Parallax
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      targetRotY = mouse.x * 0.35;
      targetRotX = -mouse.y * 0.25;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        container.style.cursor = "pointer";
        const hitStep = intersects[0].object.userData.stepIndex;
        setHoveredNode(hitStep);
      } else {
        container.style.cursor = "default";
        setHoveredNode(null);
      }
    };

    const handlePointerDown = (e) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const hitStep = intersects[0].object.userData.stepIndex;
        setActiveStep(hitStep);
        setIsPlaying(false);
        if (onSelectModule) {
          onSelectModule(hitStep);
        }
      }
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);

    // 10. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const dt = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse rotation lerp
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      // Central core gentle rotation
      centralMesh.rotation.y += 0.35 * dt;
      centralMesh.rotation.x = Math.sin(elapsedTime * 0.4) * 0.15;
      coreRing.rotation.z += 0.5 * dt;

      // Pulse nucleus
      const nScale = 0.9 + Math.sin(elapsedTime * 2.2) * 0.08;
      nucleusMesh.scale.set(nScale, nScale, nScale);

      // Spin and highlight nodes
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += 0.8 * dt;
        mesh.rotation.x += 0.4 * dt;

        const isCurrentActive = activeStep === idx;
        const isCurrentHovered = hoveredNode === idx;

        const targetScale = isCurrentActive
          ? 1.45
          : isCurrentHovered
            ? 1.25
            : 1.0;
        mesh.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.1,
        );

        const glowMesh = nodeGlowMeshes[idx];
        if (glowMesh) {
          const glowTargetScale = isCurrentActive
            ? 1.6
            : isCurrentHovered
              ? 1.3
              : 1.0;
          glowMesh.scale.lerp(
            new THREE.Vector3(
              glowTargetScale,
              glowTargetScale,
              glowTargetScale,
            ),
            0.1,
          );
          glowMesh.material.opacity = isCurrentActive
            ? 0.45
            : isCurrentHovered
              ? 0.35
              : 0.15;
        }

        // Increase emissive on active
        if (isCurrentActive) {
          mesh.material.emissiveIntensity =
            1.2 + Math.sin(elapsedTime * 4.0) * 0.4;
        } else {
          mesh.material.emissiveIntensity = 0.45;
        }
      });

      // Move data packets along the cycle curve
      packets.forEach((p) => {
        p.offset = (p.offset + p.speed * dt) % 1;
        const pt = cycleCurve.getPoint(p.offset);
        p.mesh.position.copy(pt);
      });

      // Subtle particle swirl
      particleField.rotation.y = elapsedTime * 0.03;
      particleField.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    renderLoop();

    // 11. Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      ro.disconnect();

      centralGeo.dispose();
      centralMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      coreRingGeo.dispose();
      coreRingMat.dispose();
      cycleTubeGeo.dispose();
      cycleTubeMat.dispose();
      packetGeos.dispose();
      pGeo.dispose();
      pMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark, activeStep, hoveredNode]);

  const currentStepData = ECOSYSTEM_STEPS[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="relative w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl overflow-hidden my-10">
      {/* Top Banner Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wide text-slate-100 flex items-center gap-2">
              <span>Interactive 3D Clinic Lifecycle</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Data Pipeline
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Click any node in 3D or select a step below to inspect how data
              coordinates between staff roles.
            </p>
          </div>
        </div>

        {/* Play/Pause & Reset Tour Controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-3d-tour-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title={isPlaying ? "Pause Automatic Tour" : "Resume Automatic Tour"}
          >
            {isPlaying ? (
              <FiPause size={13} className="text-amber-400" />
            ) : (
              <FiPlay size={13} className="text-emerald-400" />
            )}
            <span>{isPlaying ? "Pause Tour" : "Play Tour"}</span>
          </button>

          <button
            id="reset-3d-tour-btn"
            onClick={() => {
              setActiveStep(0);
              setIsPlaying(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Restart Workflow from Step 1"
          >
            <FiRefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Interactive Floating HUD */}
      <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px]">
        {/* Three.js Canvas Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          aria-label="3D Interactive Ecosystem Canvas"
        />

        {/* Central Watermark / Hint */}
        <div className="absolute top-4 left-6 pointer-events-none z-10 hidden sm:block">
          <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400/80 bg-slate-900/70 border border-cyan-500/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            ✦ WebGL 3D Data Flow • Rotate & Click Nodes
          </span>
        </div>

        {/* Floating Glassmorphic Workflow Inspector HUD */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-20 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-slate-700/80 bg-slate-950/85 backdrop-blur-xl p-5 shadow-2xl space-y-3"
            >
              {/* Card Header with Subsystem Color Pill */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <StepIcon size={18} />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${currentStepData.color}20`,
                        color: currentStepData.color,
                        border: `1px solid ${currentStepData.color}40`,
                      }}
                    >
                      {currentStepData.role}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight mt-0.5">
                      {currentStepData.title}
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {activeStep + 1}/6
                </span>
              </div>

              {/* Tagline & Mechanism */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-semibold text-slate-200">
                  {currentStepData.tagline}
                </p>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  {currentStepData.howItWorks}
                </p>
              </div>

              {/* Technical Badge & Next Step Pointer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-mono text-emerald-400">
                  <FiCheckCircle size={12} /> {currentStepData.techBadge}
                </span>

                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span>Feeds to</span>
                  <strong className="text-slate-200 font-semibold">
                    {currentStepData.flowTo}
                  </strong>
                  <FiArrowRight size={11} className="text-blue-400" />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Central Core Label Pill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[11px] font-mono text-blue-300 backdrop-blur-sm shadow-lg">
            <FiZap className="text-cyan-400 animate-pulse" size={12} />
            <span>SmartClinic Core Bus</span>
          </div>
        </div>
      </div>

      {/* Bottom Step Pills Selector Bar */}
      <div className="relative z-10 px-4 sm:px-6 py-4 bg-slate-950/90 border-t border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ECOSYSTEM_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                id={`ecosystem-step-${step.id}`}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                  if (onSelectModule) onSelectModule(idx);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all border ${
                  isActive
                    ? "bg-slate-800 text-white shadow-lg scale-[1.02]"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800/60"
                }`}
                style={{
                  borderColor: isActive ? step.color : undefined,
                  boxShadow: isActive ? `0 0 16px ${step.color}25` : undefined,
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: step.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-slate-400 truncate">
                    Step 0{idx + 1}
                  </p>
                  <p
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {step.shortTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Ecosystem3D;
