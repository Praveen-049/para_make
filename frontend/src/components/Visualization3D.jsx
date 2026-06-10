import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Visualization3D({ design }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.08);

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const point = new THREE.PointLight(0x67e8f9, 1);
    point.position.set(5, 10, 10);
    scene.add(ambient, point);

    const geometry = new THREE.SphereGeometry(design?.diameter ? design.diameter / 4 : 1.2, 32, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.1, opacity: 0.85, transparent: true });
    const canopy = new THREE.Mesh(geometry, material);
    canopy.rotation.x = Math.PI * 0.45;
    scene.add(canopy);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.8 });
    const lines = new THREE.Group();
    for (let i = 0; i < 10; i += 1) {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.sin(i) * 1.2, -1.2, Math.cos(i) * 1.2)];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
      lines.add(line);
    }
    scene.add(lines);

    const animate = () => {
      canopy.rotation.y += 0.002;
      lines.rotation.y -= 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [design]);

  return <canvas ref={canvasRef} className='h-full w-full rounded-3xl border border-slate-800/80 bg-slate-950/80' />;
}
