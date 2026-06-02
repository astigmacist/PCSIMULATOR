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
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'linear-gradient(180deg, #0f0f12 0%, #1a1a1f 100%)',
        }}
      >
        {/* Камера */}
        <PerspectiveCamera makeDefault position={[5.2, 2.7, 6.2]} fov={45} />

        {/* Управление камерой */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0, 0]}
          autoRotate={false}
        />

        {/* Улучшенное освещение */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* Цветные акцентные источники света */}
        <pointLight position={[-8, 8, -8]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[8, 6, 8]} intensity={0.6} color="#10b981" />
        <pointLight position={[0, 10, 0]} intensity={0.4} color="#3b82f6" />

        {/* Окружение для красивых отражений */}
        <Environment preset="city" />

        {/* Сетка пола с улучшенным дизайном */}
        <Grid
          args={[20, 20]}
          position={[0, -2.5, 0]}
          cellSize={0.6}
          cellThickness={0.8}
          cellColor="#6366f1"
          sectionSize={3}
          sectionThickness={1.5}
          sectionColor="#a78bfa"
          fadeDistance={15}
          fadeStrength={2}
          followCamera={false}
        />

        {/* Главная сцена - корпус ПК с компонентами */}
        <PCCase3D />

        {/* Туман для глубины с мягким переходом */}
        <fog attach="fog" args={['#0f0f12', 12, 30]} />
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
