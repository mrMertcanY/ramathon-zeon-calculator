import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Stars, Center } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedLogo() {
  const groupRef = useRef();
  
  // Load the logo texture. Assuming the public directory is served at root.
  const texture = useLoader(THREE.TextureLoader, '/logo/faviconremovebg.png');

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very slow rotation to make it feel premium and ambient
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <Center>
          <mesh>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial 
              map={texture} 
              transparent={true} 
              side={THREE.DoubleSide} 
              roughness={0.4} 
              metalness={0.5} 
              emissive={"#1a0505"}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Center>
      </Float>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        {/* The background color is a very dark red/black to fit the theme */}
        <color attach="background" args={['#0a0505']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, 0, -5]} intensity={1} color="#ef4444" />
        
        {/* Space dust / stars for depth */}
        <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <AnimatedLogo />
        </Suspense>
      </Canvas>
    </div>
  );
}
