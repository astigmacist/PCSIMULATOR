import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { PCComponent3D } from './PCComponent3D';
import { useBuild } from '../../context/BuildContext';

export function PCCase3D() {
  const groupRef = useRef<Group>(null);
  const { build } = useBuild();

  // Легкое покачивание для динамики
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.PI * 0.15 + Math.sin(time * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI * 0.15, 0]}>
      {/* Корпус ПК - каркас */}
      {build.case ? (
        <group position={[0, 0, 0]}>

          {/* Дно корпуса */}
          <mesh position={[0, -2.4, 0]} receiveShadow>
            <boxGeometry args={[2.4, 0.05, 4.8]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Задняя стенка (куда крепится мать) */}
          <mesh position={[0, 0.1, -2.4]} castShadow>
            <boxGeometry args={[2.4, 5.0, 0.05]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* Правая боковая стенка (глухая) - "Задняя" для кабель менеджмента */}
          <mesh position={[-1.2, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[4.8, 5.0, 0.05]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Передняя панель */}
          <mesh position={[0, 0.1, 2.4]} castShadow>
            <boxGeometry args={[2.4, 5.0, 0.05]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Верхняя панель */}
          <mesh position={[0, 2.6, 0]}>
            <boxGeometry args={[2.4, 0.05, 4.8]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Кожух БП */}
          <mesh position={[0, -1.8, 0]}>
            <boxGeometry args={[2.3, 0.05, 4.7]} />
            <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.5} />
          </mesh>

          {/* Ножки */}
          {[[-1, -1.8], [1, -1.8], [-1, 1.8], [1, 1.8]].map(([x, z], i) => (
            <mesh key={`foot-${i}`} position={[x, -2.5, z]}>
              <cylinderGeometry args={[0.1, 0.1, 0.15]} />
              <meshStandardMaterial color="#000" />
            </mesh>
          ))}

          {/* RGB Полоса спереди */}
          <mesh position={[0, 0.1, 2.45]}>
            <boxGeometry args={[0.1, 4.5, 0.02]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
          </mesh>

        </group>
      ) : (
        // Только сетка без каркаса корпуса
        <group>
          <gridHelper args={[10, 10, 0x4b5563, 0x4b5563]} position={[0, -2.5, 0]} />
        </group>
      )}

      {/* --- КОМПОНЕНТЫ --- */}

      {/* 1. Материнская плата */}
      {/* Крепится к правой стенке (которая визуально сзади в разрезе) */}
      {/* Сдвигаем влево к стенке (-1.0), центрируем по высоте */}
      {build.motherboard && (
        <PCComponent3D
          type="motherboard"
          position={[-1.1, 0.5, 0]} // Прижата к стенке (x=-1.2)
          name={build.motherboard.name}
          installed={true}
        />
      )}

      {/* 2. Процессор */}
      {/* Относительно материнской платы */}
      {build.cpu && build.motherboard && (
        <PCComponent3D
          type="cpu"
          position={[-0.9, 1.3, 0]} // Чуть выше центра материнки
          name={build.cpu.name}
          installed={true}
        />
      )}

      {/* 3. Оперативная память */}
      {/* Справа от процессора */}
      {build.ram.map((ram, index) => (
        <PCComponent3D
          key={ram.id}
          type="ram"
          // Смещение по Z для слотов
          position={[-0.8, 1.3, 0.4 + (index * 0.15)]}
          name={`${ram.capacity}GB`}
          installed={true}
        />
      ))}

      {/* 4. Видеокарта */}
      {/* Вставляется в PCIe слот, перпендикулярно материнке */}
      {build.gpu && (
        <PCComponent3D
          type="gpu"
          position={[-0.5, -0.2, 0]}
          name={build.gpu.name}
          installed={true}
        />
      )}

      {/* 5. Блок питания */}
      {/* Внизу, под кожухом */}
      {build.psu && (
        <PCComponent3D
          type="psu"
          position={[0, -2.1, -1.5]} // Внизу сзади
          name={`${build.psu.wattage}W`}
          installed={true}
        />
      )}

      {/* 6. Накопители */}
      {/* Спереди за панелью */}
      {build.storage.map((storage, index) => (
        <PCComponent3D
          key={storage.id}
          type="storage"
          position={[0.5, -1.5 + (index * 0.2), 1.5]}
          name={`${storage.capacity}GB`}
          installed={true}
        />
      ))}

      {/* Внутреннее освещение корпуса */}
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#3b82f6" distance={4} />
      <pointLight position={[0, 1, 0]} intensity={0.6} color="#8b5cf6" distance={3} />
      <pointLight position={[0.8, 2, 0]} intensity={0.4} color="#ec4899" distance={2} />
    </group>
  );
}

