import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PCComponent3D } from './PCComponent3D';
import { useBuild } from '../../context/BuildContext';

interface CaseVariant {
  width: number;
  height: number;
  depth: number;
  metal: string;
  panel: string;
  accent: string;
  glass: boolean;
  front: 'solid' | 'glass' | 'mesh' | 'airflow';
  dualChamber?: boolean;
}

const CASE_VARIANTS: Record<string, CaseVariant> = {
  case_1: {
    width: 2.35,
    height: 4.8,
    depth: 4.25,
    metal: '#111827',
    panel: '#1f2937',
    accent: '#8b5cf6',
    glass: true,
    front: 'solid',
  },
  case_2: {
    width: 3.05,
    height: 4.95,
    depth: 4.65,
    metal: '#0f172a',
    panel: '#172033',
    accent: '#38bdf8',
    glass: true,
    front: 'glass',
    dualChamber: true,
  },
  case_3: {
    width: 2.45,
    height: 4.65,
    depth: 4.05,
    metal: '#18181b',
    panel: '#27272a',
    accent: '#22c55e',
    glass: false,
    front: 'mesh',
  },
  case_4: {
    width: 2.55,
    height: 4.9,
    depth: 4.35,
    metal: '#0b1120',
    panel: '#1e293b',
    accent: '#f59e0b',
    glass: true,
    front: 'airflow',
  },
};

const DEFAULT_CASE: CaseVariant = {
  width: 2.4,
  height: 4.75,
  depth: 4.2,
  metal: '#111827',
  panel: '#1f2937',
  accent: '#8b5cf6',
  glass: true,
  front: 'solid',
};

function CaseShell({ variant }: { variant: CaseVariant }) {
  const { width, height, depth, metal, panel, accent } = variant;
  const halfW = width / 2;
  const halfH = height / 2;
  const halfD = depth / 2;

  const meshDots = useMemo(() => {
    const dots: [number, number][] = [];
    for (let x = -0.82; x <= 0.82; x += 0.28) {
      for (let y = -1.5; y <= 1.5; y += 0.3) {
        dots.push([x, y]);
      }
    }
    return dots;
  }, []);

  return (
    <group>
      <mesh position={[0, -halfH, 0]} receiveShadow>
        <boxGeometry args={[width, 0.08, depth]} />
        <meshStandardMaterial color={metal} metalness={0.82} roughness={0.32} />
      </mesh>
      <mesh position={[0, halfH, 0]} castShadow>
        <boxGeometry args={[width, 0.08, depth]} />
        <meshStandardMaterial color={metal} metalness={0.78} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, -halfD]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.08]} />
        <meshStandardMaterial color={panel} metalness={0.72} roughness={0.38} />
      </mesh>
      <mesh position={[-halfW, 0, 0]} castShadow>
        <boxGeometry args={[0.08, height, depth]} />
        <meshStandardMaterial color={metal} metalness={0.82} roughness={0.34} />
      </mesh>
      <mesh position={[halfW, 0, 0]} castShadow>
        <boxGeometry args={[0.05, height * 0.92, depth * 0.92]} />
        <meshPhysicalMaterial
          color={variant.glass ? '#dbeafe' : metal}
          transparent={variant.glass}
          opacity={variant.glass ? 0.18 : 1}
          roughness={variant.glass ? 0.05 : 0.34}
          metalness={variant.glass ? 0 : 0.75}
          transmission={variant.glass ? 0.2 : 0}
        />
      </mesh>
      <mesh position={[0, 0, halfD]} castShadow>
        <boxGeometry args={[width, height, 0.08]} />
        <meshStandardMaterial
          color={variant.front === 'glass' ? '#0f172a' : metal}
          metalness={0.78}
          roughness={variant.front === 'glass' ? 0.15 : 0.35}
          transparent={variant.front === 'glass'}
          opacity={variant.front === 'glass' ? 0.5 : 1}
        />
      </mesh>

      <mesh position={[0, -halfH + 0.72, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.94, 0.08, depth * 0.86]} />
        <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.44} />
      </mesh>

      {variant.dualChamber && (
        <mesh position={[halfW - 0.72, 0, -0.05]} castShadow>
          <boxGeometry args={[0.08, height * 0.86, depth * 0.82]} />
          <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.38} />
        </mesh>
      )}

      {variant.front === 'solid' && (
        <mesh position={[0, 0, halfD + 0.055]}>
          <boxGeometry args={[0.12, height * 0.8, 0.035]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} />
        </mesh>
      )}

      {variant.front === 'mesh' && meshDots.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, halfD + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.018, 12]} />
          <meshStandardMaterial color="#020617" metalness={0.4} roughness={0.45} />
        </mesh>
      ))}

      {variant.front === 'airflow' && [-0.62, -0.31, 0, 0.31, 0.62].map((x) => (
        <mesh key={x} position={[x, 0, halfD + 0.06]}>
          <boxGeometry args={[0.09, height * 0.72, 0.035]} />
          <meshStandardMaterial color="#020617" metalness={0.45} roughness={0.5} />
        </mesh>
      ))}

      {variant.front === 'glass' && (
        <>
          <mesh position={[-halfW + 0.18, 0, halfD + 0.07]}>
            <boxGeometry args={[0.055, height * 0.82, 0.03]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0, -halfH + 0.18, halfD + 0.08]}>
            <boxGeometry args={[width * 0.82, 0.055, 0.03]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
          </mesh>
        </>
      )}

      {[[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].map(([x, z], index) => (
        <mesh key={`foot-${index}`} position={[x, -halfH - 0.08, z]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
          <meshStandardMaterial color="#020617" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function PCCase3D() {
  const groupRef = useRef<Group>(null);
  const { build } = useBuild();
  const variant = build.case ? CASE_VARIANTS[build.case.id] || DEFAULT_CASE : DEFAULT_CASE;
  const backZ = -variant.depth / 2 + 0.12;

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.PI * 0.16 + Math.sin(time * 0.22) * 0.035;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI * 0.16, 0]}>
      {build.case ? (
        <CaseShell variant={variant} />
      ) : (
        <group>
          <mesh position={[0, -2.35, 0]} receiveShadow>
            <boxGeometry args={[2.6, 0.04, 4.4]} />
            <meshStandardMaterial color="#111827" metalness={0.45} roughness={0.55} />
          </mesh>
          <Text position={[0, 0.3, 0]} fontSize={0.24} color="#94a3b8" anchorX="center">
            Выберите корпус
          </Text>
        </group>
      )}

      {build.motherboard && (
        <PCComponent3D
          type="motherboard"
          position={[-0.25, 0.12, backZ + 0.06]}
          name={build.motherboard.formFactor}
          installed
        />
      )}

      {build.cpu && build.motherboard && (
        <PCComponent3D
          type="cpu"
          position={[-0.25, 0.6, backZ + 0.16]}
          name={build.cpu.manufacturer}
          installed
        />
      )}

      {build.ram.map((ram, index) => (
        <PCComponent3D
          key={ram.id}
          type="ram"
          position={[0.34 + index * 0.14, 0.52, backZ + 0.17]}
          name={`${ram.capacity}GB`}
          installed
        />
      ))}

      {build.gpu && (
        <PCComponent3D
          type="gpu"
          position={[-0.12, -0.75, backZ + 0.75]}
          name={build.gpu.manufacturer}
          installed
        />
      )}

      {build.psu && (
        <PCComponent3D
          type="psu"
          position={[-0.48, -1.92, -0.9]}
          name={`${build.psu.wattage}W`}
          installed
        />
      )}

      {build.storage.map((storage, index) => (
        <PCComponent3D
          key={storage.id}
          type="storage"
          position={[0.72, -1.25 + index * 0.28, 1.2]}
          name={storage.interface}
          installed
        />
      ))}

      <pointLight position={[0, 1.8, 0.2]} intensity={0.7} color={variant.accent} distance={4.2} />
      <pointLight position={[0.9, 0.4, 1.2]} intensity={0.45} color="#60a5fa" distance={3.4} />
    </group>
  );
}
