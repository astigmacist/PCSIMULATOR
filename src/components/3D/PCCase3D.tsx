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
      {/* Корпус ПК - открытый вид (левая панель снята) */}
      <group position={[0, 0, 0]}>
        
        {/* Дно корпуса */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.08, 2.2]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Задняя стенка */}
        <mesh position={[0, 2.5, -1.1]} castShadow>
          <boxGeometry args={[2.5, 5, 0.08]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Правая боковая стенка (закрытая) */}
        <mesh position={[-1.25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[2.2, 5, 0.08]} />
          <meshStandardMaterial color="#2d3748" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Передняя панель */}
        <mesh position={[0, 2.5, 1.1]} castShadow>
          <boxGeometry args={[2.5, 5, 0.08]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Верхняя панель */}
        <mesh position={[0, 5.04, 0]}>
          <boxGeometry args={[2.5, 0.08, 2.2]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* === ВНУТРЕННИЕ ЭЛЕМЕНТЫ === */}
        
        {/* Задняя планка для материнской платы (standoffs area) */}
        <mesh position={[0, 2.5, -0.95]}>
          <boxGeometry args={[1.8, 3.5, 0.05]} />
          <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Standoffs (винты для материнской платы) */}
        {Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          return (
            <mesh 
              key={`standoff-${i}`} 
              position={[-0.5 + col * 0.5, 1.5 + row * 0.8, -0.92]}
            >
              <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
          );
        })}

        {/* PSU отсек (внизу) */}
        <group position={[0, 0.6, -0.5]}>
          {/* Перегородка PSU */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.3, 0.05, 2]} />
            <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.4} />
          </mesh>
          
          {/* Вентиляционные отверстия в PSU отсеке */}
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={`psu-vent-${i}`} position={[-0.8 + i * 0.3, 0.52, 0.5]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial color="#1a202c" metalness={0.6} />
            </mesh>
          ))}
        </group>

        {/* HDD/SSD cage (отсек для дисков) */}
        <group position={[0.7, 1.5, 0.7]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`hdd-bay-${i}`} position={[0, i * 0.35, 0]}>
              <boxGeometry args={[0.4, 0.25, 0.6]} />
              <meshStandardMaterial 
                color="#2d3748" 
                metalness={0.6} 
                roughness={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>

        {/* PCIe слоты (задние вырезы) */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh 
            key={`pcie-slot-${i}`} 
            position={[0, 1.5 + i * 0.28, -1.06]}
          >
            <boxGeometry args={[1.2, 0.22, 0.1]} />
            <meshStandardMaterial 
              color="#1a202c" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        ))}

        {/* Кабель-менеджмент (отверстия/грommets) */}
        {[[0.5, 3.5], [0.5, 2], [0.5, 0.8]].map(([x, y], i) => (
          <mesh key={`grommet-${i}`} position={[x, y, -0.85]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.12, 0.03, 16, 32]} />
            <meshStandardMaterial color="#1a202c" metalness={0.7} />
          </mesh>
        ))}

        {/* Передние вентиляторы (видны изнутри) */}
        {[1.8, 0.5, -0.8].map((y, i) => (
          <group key={`front-fan-${i}`} position={[0, y, 1]}>
            {/* Рамка вентилятора */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.04, 16, 32]} />
              <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* RGB кольцо */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.5, 0.02, 16, 32]} />
              <meshStandardMaterial 
                color={i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#ec4899"}
                emissive={i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#ec4899"}
                emissiveIntensity={1}
              />
            </mesh>
            {/* Лопасти вентилятора */}
            {Array.from({ length: 7 }).map((_, blade) => (
              <mesh 
                key={`blade-${blade}`} 
                rotation={[Math.PI / 2, (blade * Math.PI * 2) / 7, 0]}
                position={[0, 0, 0]}
              >
                <boxGeometry args={[0.08, 0.4, 0.02]} />
                <meshStandardMaterial color="#4a5568" metalness={0.5} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Верхние вентиляторы */}
        {[-0.6, 0.6].map((x, i) => (
          <group key={`top-fan-${i}`} position={[x, 4.96, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.45, 0.03, 16, 32]} />
              <meshStandardMaterial color="#2d3748" metalness={0.7} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.015, 16, 32]} />
              <meshStandardMaterial 
                color="#3b82f6"
                emissive="#3b82f6"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}

        {/* Задние порты I/O */}
        <mesh position={[0, 4, -1.1]}>
          <boxGeometry args={[1.2, 0.6, 0.05]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Кнопка питания (сверху спереди) */}
        <mesh position={[-0.8, 4.96, 0.8]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
          <meshStandardMaterial 
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* USB порты сверху */}
        {[0, 0.2, 0.4].map((offset, i) => (
          <mesh key={`top-usb-${i}`} position={[0.2 + offset, 4.96, 0.8]}>
            <boxGeometry args={[0.12, 0.08, 0.06]} />
            <meshStandardMaterial color="#1a202c" metalness={0.7} />
          </mesh>
        ))}

        {/* Ножки корпуса */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
          <mesh key={`foot-${i}`} position={[x, -0.1, z]}>
            <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
            <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* RGB подсветка внутри корпуса */}
        {/* Верхняя RGB полоса */}
        <mesh position={[0.5, 4, 0]}>
          <boxGeometry args={[0.05, 0.1, 1.8]} />
          <meshStandardMaterial 
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1.2}
          />
        </mesh>
        
        {/* Нижняя RGB полоса */}
        <mesh position={[0.5, 1.2, 0]}>
          <boxGeometry args={[0.05, 0.1, 1.8]} />
          <meshStandardMaterial 
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Вертикальная RGB подсветка */}
        <mesh position={[0.5, 2.5, 0.9]}>
          <boxGeometry args={[0.05, 3, 0.1]} />
          <meshStandardMaterial 
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Компоненты внутри корпуса */}
      {/* Материнская плата (на задней планке) */}
      {build.motherboard && (
        <PCComponent3D
          type="motherboard"
          position={[0, 2.5, -0.85]}
          name={build.motherboard.name}
          installed={true}
        />
      )}

      {/* Процессор (на материнской плате, сверху) */}
      {build.cpu && build.motherboard && (
        <PCComponent3D
          type="cpu"
          position={[-0.2, 3.2, -0.7]}
          name={build.cpu.name}
          installed={true}
        />
      )}

      {/* Оперативная память (справа от CPU) */}
      {build.ram.map((ram, index) => (
        <PCComponent3D
          key={ram.id}
          type="ram"
          position={[0.4, 3 - index * 0.3, -0.7]}
          name={`${ram.capacity}GB`}
          installed={true}
        />
      ))}

      {/* Видеокарта (в PCIe слоте, горизонтально) */}
      {build.gpu && (
        <PCComponent3D
          type="gpu"
          position={[0.1, 2, -0.6]}
          name={build.gpu.name}
          installed={true}
        />
      )}

      {/* Блок питания (внизу в отсеке) */}
      {build.psu && (
        <PCComponent3D
          type="psu"
          position={[0, 0.4, -0.5]}
          name={`${build.psu.wattage}W`}
          installed={true}
        />
      )}

      {/* Накопители (в HDD cage справа) */}
      {build.storage.map((storage, index) => (
        <PCComponent3D
          key={storage.id}
          type="storage"
          position={[0.7, 1.5 + index * 0.35, 0.7]}
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

