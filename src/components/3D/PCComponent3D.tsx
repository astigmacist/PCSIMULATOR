import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface PCComponent3DProps {
  type: 'motherboard' | 'cpu' | 'ram' | 'gpu' | 'psu' | 'storage';
  position: [number, number, number];
  name?: string;
  installed?: boolean;
  onClick?: () => void;
}

function Fan({ position, radius = 0.22 }: { position: [number, number, number]; radius?: number }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.035, 36]} />
        <meshStandardMaterial color="#0f172a" metalness={0.55} roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((blade) => (
        <mesh key={blade} rotation={[0, 0, (Math.PI / 3) * blade]}>
          <boxGeometry args={[radius * 1.25, 0.035, 0.025]} />
          <meshStandardMaterial color="#334155" metalness={0.45} roughness={0.35} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.025]}>
        <torusGeometry args={[radius * 0.78, 0.012, 8, 36]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function PCComponent3D({ type, position, name, installed, onClick }: PCComponent3DProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current && !installed) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getComponentGeometry = () => {
    switch (type) {
      case 'motherboard':
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.85, 2.55, 0.06]} />
              <meshStandardMaterial color="#0f766e" metalness={0.35} roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.48, 0.055]} castShadow>
              <boxGeometry args={[0.58, 0.58, 0.04]} />
              <meshStandardMaterial color="#d1d5db" metalness={0.65} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.48, 0.082]}>
              <boxGeometry args={[0.42, 0.42, 0.018]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            {[-0.34, -0.18, 0.18, 0.34].map((x) => (
              <mesh key={`ram-slot-${x}`} position={[x + 0.55, 0.42, 0.07]} castShadow>
                <boxGeometry args={[0.055, 1.22, 0.045]} />
                <meshStandardMaterial color="#111827" metalness={0.3} roughness={0.5} />
              </mesh>
            ))}
            {[-0.45, -0.15, 0.15].map((y) => (
              <mesh key={`pcie-${y}`} position={[-0.1, y - 0.58, 0.07]} castShadow>
                <boxGeometry args={[1.35, 0.06, 0.05]} />
                <meshStandardMaterial color="#111827" metalness={0.3} roughness={0.5} />
              </mesh>
            ))}
            <mesh position={[0.45, -0.78, 0.075]} castShadow>
              <boxGeometry args={[0.38, 0.38, 0.065]} />
              <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.35} />
            </mesh>
            {[-0.78, 0.78].map((x) =>
              [-1.05, 1.05].map((y) => (
                <mesh key={`standoff-${x}-${y}`} position={[x, y, 0.09]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
                </mesh>
              ))
            )}
          </group>
        );

      case 'cpu':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[0.42, 0.42, 0.08]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0, 0.055]} castShadow>
              <boxGeometry args={[0.33, 0.33, 0.025]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        );

      case 'ram':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[0.12, 1.05, 0.09]} />
              <meshStandardMaterial color="#14b8a6" metalness={0.35} roughness={0.45} />
            </mesh>
            {[-0.32, -0.12, 0.12, 0.32].map((y) => (
              <mesh key={y} position={[0, y, 0.06]} castShadow>
                <boxGeometry args={[0.09, 0.13, 0.035]} />
                <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.45} />
              </mesh>
            ))}
            <mesh position={[0, 0.58, 0.02]}>
              <boxGeometry args={[0.13, 0.06, 0.11]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.35} />
            </mesh>
          </group>
        );

      case 'gpu':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[1.9, 0.72, 0.08]} />
              <meshStandardMaterial color="#991b1b" metalness={0.35} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.16]} castShadow>
              <boxGeometry args={[1.78, 0.62, 0.24]} />
              <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.32} />
            </mesh>
            <Fan position={[-0.42, 0, 0.3]} radius={0.2} />
            <Fan position={[0.42, 0, 0.3]} radius={0.2} />
            <mesh position={[-1.02, 0, 0.06]} castShadow>
              <boxGeometry args={[0.06, 0.82, 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.2} />
            </mesh>
          </group>
        );

      case 'psu':
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.65, 0.9]} />
              <meshStandardMaterial color="#27272a" metalness={0.72} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.04, 36]} />
              <meshStandardMaterial color="#020617" metalness={0.55} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.365, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.22, 0.012, 8, 36]} />
              <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.25} />
            </mesh>
          </group>
        );

      case 'storage':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.36, 0.12]} />
              <meshStandardMaterial color="#7c3aed" metalness={0.35} roughness={0.45} />
            </mesh>
            <mesh position={[0, 0, 0.075]}>
              <boxGeometry args={[0.42, 0.18, 0.018]} />
              <meshStandardMaterial color="#c4b5fd" metalness={0.15} roughness={0.65} />
            </mesh>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group position={position} onClick={onClick} ref={groupRef}>
      {getComponentGeometry()}

      {!installed && <pointLight intensity={0.5} distance={3} color="#8b5cf6" />}

      {name && (
        <Text
          position={[0, type === 'psu' ? -0.52 : -0.72, 0.38]}
          fontSize={0.12}
          maxWidth={1.6}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}
