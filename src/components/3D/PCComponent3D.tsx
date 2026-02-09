import { useRef } from 'react';
import { Mesh } from 'three';
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
  const meshRef = useRef<Mesh>(null);
  
  // Небольшая анимация парения для неустановленных компонентов
  useFrame((state) => {
    if (meshRef.current && !installed) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getComponentGeometry = () => {
    switch (type) {
      case 'motherboard':
        // Большая плоская плата
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4, 0.1, 5]} />
              <meshStandardMaterial 
                color={installed ? "#10b981" : "#22c55e"} 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Слоты на материнской плате */}
            <mesh position={[0.5, 0.06, 0]}>
              <boxGeometry args={[2.5, 0.02, 0.3]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.5, 0.06, 0.5]}>
              <boxGeometry args={[2.5, 0.02, 0.3]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Чипсет */}
            <mesh position={[-0.8, 0.08, 1]}>
              <boxGeometry args={[0.6, 0.06, 0.6]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          </group>
        );
      
      case 'cpu':
        // Процессор - квадратный чип
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.8, 0.15, 0.8]} />
              <meshStandardMaterial 
                color={installed ? "#6366f1" : "#8b5cf6"} 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Контакты снизу */}
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.7, 0.01, 0.7]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} />
            </mesh>
            {/* Крышка сверху */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.75, 0.01, 0.75]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
          </group>
        );
      
      case 'ram':
        // Планка оперативной памяти
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.3, 1.2, 0.05]} />
              <meshStandardMaterial 
                color={installed ? "#10b981" : "#14b8a6"} 
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            {/* Чипы памяти */}
            {[0, 0.3, -0.3].map((offset, i) => (
              <mesh key={i} position={[0.16, offset, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.04]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
            {/* Радиатор */}
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.35, 0.4, 0.08]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          </group>
        );
      
      case 'gpu':
        // Видеокарта
        return (
          <group>
            {/* Основная плата */}
            <mesh>
              <boxGeometry args={[3, 0.1, 1.2]} />
              <meshStandardMaterial 
                color={installed ? "#ef4444" : "#f87171"} 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Кулер 1 */}
            <mesh position={[-0.7, 0.15, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Кулер 2 */}
            <mesh position={[0.7, 0.15, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Радиатор */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[2.5, 0.3, 1]} />
              <meshStandardMaterial color="#374151" metalness={0.8} />
            </mesh>
            {/* Бэкплейт */}
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[2.8, 0.02, 1.1]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          </group>
        );
      
      case 'psu':
        // Блок питания
        return (
          <group>
            <mesh>
              <boxGeometry args={[1.5, 0.8, 1.5]} />
              <meshStandardMaterial 
                color={installed ? "#fbbf24" : "#facc15"} 
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Вентилятор */}
            <mesh position={[0, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
            {/* Решетка */}
            <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.02, 16, 32]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Разъемы */}
            <mesh position={[-0.76, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.3, 0.02, 0.6]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      
      case 'storage':
        // Накопитель (SSD/HDD)
        return (
          <group>
            <mesh>
              <boxGeometry args={[1, 0.15, 0.7]} />
              <meshStandardMaterial 
                color={installed ? "#a78bfa" : "#c4b5fd"} 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Этикетка */}
            <mesh position={[0, 0.076, 0]}>
              <boxGeometry args={[0.8, 0.001, 0.5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Разъемы */}
            <mesh position={[-0.51, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.1, 0.02, 0.4]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} />
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
      ref={meshRef}
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
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

