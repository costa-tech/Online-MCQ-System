import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingGeometry = ({ position, color, type = 'sphere' }: { 
  position: [number, number, number], 
  color: string, 
  type?: 'sphere' | 'box' | 'torus' 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const GeometryComponent = type === 'box' ? Box : type === 'torus' ? Torus : Sphere;

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <GeometryComponent
        ref={meshRef}
        position={position}
        args={type === 'torus' ? [1, 0.3, 8, 20] : [1, 1, 1]}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.6} 
          roughness={0.4}
          metalness={0.8}
        />
      </GeometryComponent>
    </Float>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color="#60a5fa" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#8b5cf6" intensity={0.5} />
        
        <FloatingGeometry position={[-4, 2, -2]} color="#8b5cf6" type="sphere" />
        <FloatingGeometry position={[4, -2, -3]} color="#06b6d4" type="box" />
        <FloatingGeometry position={[-2, -3, -4]} color="#f59e0b" type="torus" />
        <FloatingGeometry position={[5, 3, -1]} color="#ec4899" type="sphere" />
        <FloatingGeometry position={[-5, -1, -5]} color="#10b981" type="box" />
        <FloatingGeometry position={[2, 4, -2]} color="#3b82f6" type="torus" />
        
        <ParticleField />
      </Canvas>
    </div>
  );
};