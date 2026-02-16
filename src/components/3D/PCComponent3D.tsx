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

export function PCComponent3D({ type, position, name, installed, onClick }: PCComponent3DProps) {
  const groupRef = useRef<Group>(null);

  // Небольшая анимация парения для неустановленных компонентов
  useFrame((state) => {
    if (groupRef.current && !installed) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getComponentGeometry = () => {
    switch (type) {
      case 'motherboard':
        // Большая плоская плата (ATX: ~244x305mm -> 2.4 x 3.0 units)
        return (
          <group rotation={[-Math.PI / 2, 0, 0]}> {/* Повернем вертикально для установки в корпус */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.4, 3.0, 0.05]} />
              <meshStandardMaterial
                color={installed ? "#10b981" : "#22c55e"}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Слоты на материнской плате */}
            <mesh position={[0.6, 0.5, 0.04]}>
              <boxGeometry args={[0.8, 2.0, 0.04]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Сокет CPU */}
            <mesh position={[0, 0.8, 0.04]}>
              <boxGeometry args={[0.6, 0.6, 0.02]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
            </mesh>
            {/* Чипсет */}
            <mesh position={[0.5, -0.8, 0.04]}>
              <boxGeometry args={[0.5, 0.5, 0.03]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'cpu':
        // Процессор - квадратный чип
        return (
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.4, 0.4, 0.05]} />
              <meshStandardMaterial
                color={installed ? "#6366f1" : "#8b5cf6"}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Крышка сверху */}
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.35, 0.35, 0.01]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          </group>
        );

      case 'ram':
        // Планка оперативной памяти
        return (
          <group>
            <mesh>
              <boxGeometry args={[1.3, 0.05, 0.35]} /> {/* Длина, Толщина, Высота */}
              <meshStandardMaterial
                color={installed ? "#10b981" : "#14b8a6"}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            {/* Чипы памяти */}
            {[0, 0.3, -0.3].map((offset, i) => (
              <mesh key={i} position={[offset, 0.04, 0]}>
                <boxGeometry args={[0.2, 0.01, 0.2]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
          </group>
        );

      case 'gpu':
        // Видеокарта
        return (
          <group>
            {/* Основная плата */}
            <mesh>
              <boxGeometry args={[2.8, 0.05, 1.2]} />
              <meshStandardMaterial
                color={installed ? "#ef4444" : "#f87171"}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Радиатор с кулерами */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[2.7, 0.25, 1.1]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} />
            </mesh>
            {/* Бэкплейт */}
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[2.8, 0.01, 1.2]} />
              <meshStandardMaterial color="#374151" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'psu':
        // Блок питания
        return (
          <group>
            <mesh>
              <boxGeometry args={[1.5, 0.85, 1.4]} />
              <meshStandardMaterial
                color={installed ? "#fbbf24" : "#facc15"}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Вентилятор */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.86, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
          </group>
        );

      case 'storage':
        // Накопитель (SSD/HDD)
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.7, 0.1, 1.0]} />
              <meshStandardMaterial
                color={installed ? "#a78bfa" : "#c4b5fd"}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group
      position={position}
      onClick={onClick}
      ref={groupRef}
    >
      {getComponentGeometry()}

      {/* Подсветка при наведении */}
      {!installed && (
        <pointLight intensity={0.5} distance={3} color="#8b5cf6" />
      )}

      {/* Название компонента */}
      {name && (
        <Text
          position={[0, type === 'motherboard' ? 0.2 : (type === 'gpu' ? 0.6 : 0.5), 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

