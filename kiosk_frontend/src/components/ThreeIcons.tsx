import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared wrapper for the icons ---
function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-16 h-16 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <PresentationControls global rotation={[0.13, 0.1, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]}>
          <Center>
            {children}
          </Center>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// --- Specific Icons ---

function Jar() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      {/* Glass Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.8, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.5} thickness={0.5} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.2, 32]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 0.05, 32]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Bottle() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      {/* Bottle Main Body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} thickness={0.5} />
      </mesh>
      {/* Bottle Neck Taper */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.7, 0.6, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} thickness={0.5} />
      </mesh>
      {/* Bottle Neck Straight */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} thickness={0.5} />
      </mesh>
      {/* Clasp Lid */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.5} roughness={0.1} />
      </mesh>
      {/* Metal wire clasp */}
      <mesh position={[0.35, 0.9, 0]} rotation={[0, 0, 0]}>
         <boxGeometry args={[0.05, 0.4, 0.1]} />
         <meshStandardMaterial color="#9ca3af" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function PaperRoll() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  const paperTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 512; i += 4) {
        context.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03 + 0.01})`;
        context.fillRect(0, i, 512, 1);
      }
      for (let i = 0; i < 10000; i++) {
        context.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03})`;
        context.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    return texture;
  }, []);

  const paperBumpMap = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#888888';
      context.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 512; i += 4) {
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        context.fillRect(0, i, 512, 2);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    return texture;
  }, []);

  return (
    <group ref={group} rotation={[Math.PI / 4, 0, 0]}>
      {/* Main Roll */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1.5, 64]} />
        <meshStandardMaterial map={paperTexture} bumpMap={paperBumpMap} bumpScale={0.02} color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Inner Hole (Cardboard tube) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.51, 32]} />
        <meshStandardMaterial color="#c2b280" roughness={1.0} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Straws() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  const createStripeTexture = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 128, 128);
      context.fillStyle = color;
      context.fillRect(0, 0, 64, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    // Rotate texture so stripes spiral
    texture.rotation = Math.PI / 4;
    return texture;
  };

  const texRed = React.useMemo(() => createStripeTexture('#ef4444'), []);
  const texBlue = React.useMemo(() => createStripeTexture('#3b82f6'), []);
  const texGreen = React.useMemo(() => createStripeTexture('#22c55e'), []);
  const texYellow = React.useMemo(() => createStripeTexture('#eab308'), []);

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial map={texRed} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0, 0.1]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial map={texBlue} roughness={0.4} />
      </mesh>
      <mesh position={[-0.15, 0, -0.1]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial map={texGreen} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0, -0.2]} rotation={[-0.15, 0, -0.1]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial map={texYellow} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Umbrella() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  const umbrellaTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#ec4899';
      context.fillRect(0, 0, 512, 512);
      // Draw alternating colored slices for the umbrella
      context.translate(256, 256);
      const colors = ['#ec4899', '#fdf2f8', '#ec4899', '#fdf2f8', '#ec4899', '#fdf2f8', '#ec4899', '#fdf2f8'];
      const sliceAngle = (Math.PI * 2) / colors.length;
      for (let i = 0; i < colors.length; i++) {
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, 300, i * sliceAngle, (i + 1) * sliceAngle);
        context.closePath();
        context.fillStyle = colors[i];
        context.fill();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  return (
    <group ref={group}>
      {/* Canopy */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[1.2, 0.6, 12]} />
        <meshStandardMaterial map={umbrellaTexture} roughness={0.6} />
      </mesh>
      {/* Top tip */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>
      {/* Stick */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.7} />
      </mesh>
    </group>
  );
}

function PetJar() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.8, 32]} />
        <meshPhysicalMaterial color="#cde3eb" transmission={0.95} opacity={1} transparent roughness={0.05} ior={1.33} thickness={0.2} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.2, 32]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.5} />
      </mesh>
    </group>
  );
}

function WaterBottle() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.0, 32]} />
        <meshPhysicalMaterial color="#bfdbfe" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.33} thickness={0.1} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.2, 0.6, 0.5, 32]} />
        <meshPhysicalMaterial color="#bfdbfe" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.33} thickness={0.1} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
        <meshPhysicalMaterial color="#bfdbfe" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.33} thickness={0.1} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
    </group>
  );
}

function JuiceBottle() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />
        <meshPhysicalMaterial color="#fcd34d" transmission={0.6} opacity={0.8} transparent roughness={0.2} ior={1.4} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.7, 0.3, 32]} />
        <meshPhysicalMaterial color="#fcd34d" transmission={0.6} opacity={0.8} transparent roughness={0.2} ior={1.4} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshPhysicalMaterial color="#fcd34d" transmission={0.6} opacity={0.8} transparent roughness={0.2} ior={1.4} thickness={0.5} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
    </group>
  );
}

function MilkBottle() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1.6, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.8, 0.6, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CardboardBox() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.01;
    if (group.current) group.current.rotation.x = Math.PI / 8;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      {/* Box flaps */}
      <mesh position={[0, 0.6, 0.75]} rotation={[-Math.PI / 4, 0, 0]}>
        <boxGeometry args={[1.5, 0.75, 0.05]} />
        <meshStandardMaterial color="#c2a47c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, -0.75]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[1.5, 0.75, 0.05]} />
        <meshStandardMaterial color="#c2a47c" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Exports
export const JarIcon = () => <IconWrapper><Jar /></IconWrapper>;
export const BottleIcon = () => <IconWrapper><Bottle /></IconWrapper>;
export const PaperRollIcon = () => <IconWrapper><PaperRoll /></IconWrapper>;
export const StrawsIcon = () => <IconWrapper><Straws /></IconWrapper>;
export const UmbrellaIcon = () => <IconWrapper><Umbrella /></IconWrapper>;
export const PetJarIcon = () => <IconWrapper><PetJar /></IconWrapper>;
export const WaterBottleIcon = () => <IconWrapper><WaterBottle /></IconWrapper>;
export const JuiceBottleIcon = () => <IconWrapper><JuiceBottle /></IconWrapper>;
export const MilkBottleIcon = () => <IconWrapper><MilkBottle /></IconWrapper>;
export const BoxIcon = () => <IconWrapper><CardboardBox /></IconWrapper>;
