import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { PCCase3D } from './PCCase3D';

interface Scene3DProps {
  className?: string;
}

export function Scene3D({ className }: Scene3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'linear-gradient(180deg, #0f0f12 0%, #1a1a1f 100%)' }}
      >
        {/* Камера */}
        <PerspectiveCamera makeDefault position={[4, 3, 5]} fov={60} />
        
        {/* Управление камерой */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 2.5, 0]}
          autoRotate={false}
        />

        {/* Освещение */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[10, 5, 10]} intensity={0.3} color="#10b981" />

        {/* Окружение для красивых отражений */}
        <Environment preset="city" />

        {/* Сетка пола */}
        <Grid
          args={[20, 20]}
          position={[0, 0.4, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#3b82f6"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#8b5cf6"
          fadeDistance={20}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Главная сцена - корпус ПК с компонентами */}
        <PCCase3D />

        {/* Туман для глубины */}
        <fog attach="fog" args={['#0f0f12', 15, 35]} />
      </Canvas>

      {/* Подсказки управления */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '0.75rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#d1d5db',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div>🖱️ Левая кнопка: Вращение</div>
        <div>🖱️ Правая кнопка: Перемещение</div>
        <div>🖱️ Колесико: Масштаб</div>
      </div>
    </div>
  );
}

