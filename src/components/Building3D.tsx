import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

export default function Building3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Position camera further back and higher to perfectly frame the whole building
    camera.position.set(35, 25, 35);
    camera.lookAt(0, 12, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable pointer events on the canvas itself
    renderer.domElement.style.pointerEvents = 'auto';
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 100;

    // 2. Lighting (Studio Architectural Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0x34d399, 2.5); // Emerald main light
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.5); // Blue fill light
    fillLight.position.set(-20, 20, -20);
    scene.add(fillLight);

    // 3. Building Construction (Pro Architectural Style)
    const sceneGroup = new THREE.Group();
    // Move the whole group down so it's centered on screen
    sceneGroup.position.y = -8;
    scene.add(sceneGroup);

    // Materials
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.2, metalness: 0.1 });
    const glassMat = new THREE.MeshStandardMaterial({ 
      color: 0x10b981, 
      transparent: true, 
      opacity: 0, // Starts invisible for the animation
      roughness: 0.1,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0 });

    // A. Core (Elevator shaft/Structural core)
    const coreGeo = new THREE.BoxGeometry(6, 28, 6);
    coreGeo.translate(0, 14, 0); // Set origin to bottom so it scales upwards
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.scale.y = 0.001; // Start collapsed
    sceneGroup.add(core);

    // B. Podium (Wide Base)
    const podiumGeo = new THREE.BoxGeometry(20, 3, 20);
    podiumGeo.translate(0, 1.5, 0);
    const podium = new THREE.Mesh(podiumGeo, floorMat);
    podium.scale.set(0.001, 0.001, 0.001); // Start collapsed
    sceneGroup.add(podium);

    // C. Floors (Slabs)
    const floors: THREE.Mesh[] = [];
    const floorCount = 12;
    const floorGeo = new THREE.BoxGeometry(14, 0.5, 14);
    for (let i = 0; i < floorCount; i++) {
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.y = 4 + (i * 2); // Stack them above the podium
      floor.scale.set(0.001, 1, 0.001); // Start collapsed on X/Z axes
      sceneGroup.add(floor);
      floors.push(floor);
    }

    // D. Glass Facade
    const glassGeo = new THREE.BoxGeometry(14.2, 24, 14.2);
    glassGeo.translate(0, 16, 0);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    
    // E. Wireframe edges for that "Blueprint/Tech" look
    const edges = new THREE.EdgesGeometry(glassGeo);
    const glassLines = new THREE.LineSegments(edges, wireMat);
    glass.add(glassLines);
    sceneGroup.add(glass);

    // F. Ground Grid
    const grid = new THREE.GridHelper(80, 80, 0x10b981, 0xffffff);
    (grid.material as THREE.Material).opacity = 0.1;
    (grid.material as THREE.Material).transparent = true;
    sceneGroup.add(grid);

    // 4. Pro GSAP Animation Timeline
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Sequence 1: Podium pops up
      tl.to(podium.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)" })
      
      // Sequence 2: Structural core shoots up
      .to(core.scale, { y: 1, duration: 1.5, ease: "power3.inOut" }, "-=0.5")
      
      // Sequence 3: Floors expand outwards from the core (staggered bottom to top)
      .to(floors.map(f => f.scale), {
        x: 1, z: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)"
      }, "-=1.0")
      
      // Sequence 4: Glass facade and glowing wireframes fade in smoothly
      .to(glassMat, { opacity: 0.25, duration: 1.5, ease: "power2.inOut" }, "-=0.2")
      .to(wireMat, { opacity: 0.8, duration: 1.5, ease: "power2.inOut" }, "<");
    });

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 5. Render Loop
    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      controls.update(); // Required for damping
      sceneGroup.rotation.y += 0.002; // Elegant slow rotation
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      controls.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
}
