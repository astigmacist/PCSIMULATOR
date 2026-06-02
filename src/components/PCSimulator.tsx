import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../context/BuildContext';
import {
  checkCPUCompatibility,
  checkRAMCompatibility,
  checkGPUCompatibility,
  checkStorageCompatibility,
  checkCaseCompatibility,
} from '../logic/compatibility';
import ComponentSelection from './ComponentSelection';
import PCCaseView from './PCCaseView';
import StatusPanel from './StatusPanel';
import CompatibilityPanel from './CompatibilityPanel';
import TrainingView from './TrainingView';
import ChallengesView from './ChallengesView';
import { Scene3D } from './3D/Scene3D';
import { calculateTotalPrice } from '../logic/compatibility';
import { Challenge } from '../types/tutorial';

function PCSimulator() {
  const navigate = useNavigate();
  const {
    build,
    resetBuild,
    compatibility,
    installCase,
    installMotherboard,
    installCPU,
    installRAM,
    installGPU,
    installPSU,
    installStorage
  } = useBuild();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [showTaskHints, setShowTaskHints] = useState(false);

  const taskProgress = useMemo(() => {
    if (!activeChallenge) return { percent: 0, done: 0, total: 0 };
    const totalRAM = build.ram.reduce((s, r) => s + r.capacity, 0);
    const totalStorage = build.storage.reduce((s, st) => s + st.capacity, 0);
    const req = activeChallenge.requirements;
    const items = [
      !!build.motherboard,
      !!build.cpu && (req.minCPUCores ? build.cpu.cores >= req.minCPUCores : true),
      req.minRAM ? totalRAM >= req.minRAM : build.ram.length > 0,
      req.minStorage ? totalStorage >= req.minStorage : build.storage.length > 0,
      req.requiresGPU ? !!build.gpu : true,
      !!build.psu,
      activeChallenge.budget ? calculateTotalPrice(build) <= activeChallenge.budget : true,
      compatibility.compatible,
    ];
    const total = items.length;
    const done = items.filter(Boolean).length;
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [activeChallenge, build, compatibility.compatible]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    const dataStr = e.dataTransfer.getData('componentData');

    if (!type || !dataStr) return;

    try {
      const data = JSON.parse(dataStr);

      switch (type) {
        case 'case':
          if (build.motherboard) {
            const error = checkCaseCompatibility(data, build.motherboard);
            if (error) {
              alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
              return;
            }
          }
          installCase(data);
          break;

        case 'motherboard':
          if (!build.case) {
            alert('Сначала выберите корпус!');
            return;
          }
          const caseError = checkCaseCompatibility(build.case, data);
          if (caseError) {
            alert(`❌ ${caseError.reason}\n\n💡 ${caseError.recommendations?.join('\n')}`);
            return;
          }
          installMotherboard(data);
          break;

        case 'cpu':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const cpuError = checkCPUCompatibility(data, build.motherboard);
          if (cpuError) {
            alert(`❌ ${cpuError.reason}\n\n💡 ${cpuError.recommendations?.join('\n')}`);
            return;
          }
          installCPU(data);
          break;

        case 'ram':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const ramError = checkRAMCompatibility(data, build.motherboard, build.ram);
          if (ramError) {
            alert(`❌ ${ramError.reason}\n\n💡 ${ramError.recommendations?.join('\n')}`);
            return;
          }
          installRAM(data);
          break;

        case 'gpu':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const gpuError = checkGPUCompatibility(data, build.motherboard, build.case);
          if (gpuError) {
            alert(`❌ ${gpuError.reason}\n\n💡 ${gpuError.recommendations?.join('\n')}`);
            return;
          }
          installGPU(data);
          break;

        case 'psu':
          installPSU(data);
          break;

        case 'storage':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const storageError = checkStorageCompatibility(data, build.motherboard, build.storage);
          if (storageError) {
            alert(`❌ ${storageError.reason}\n\n💡 ${storageError.recommendations?.join('\n')}`);
            return;
          }
          installStorage(data);
          break;
      }
    } catch (err) {
      console.error('Error processing drop:', err);
    }
  };

  const totalPrice = calculateTotalPrice(build);
  const isComplete =
    build.case !== null &&
    build.motherboard !== null &&
    build.cpu !== null &&
    build.ram.length > 0 &&
    build.psu !== null &&
    build.storage.length > 0;

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              title="Вернуться на главную"
            >
              ← Главная
            </button>
            <h1> Симулятор Сборки ПК</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn"
              onClick={() => setView3D(!view3D)}
              style={{
                background: view3D
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                boxShadow: view3D
                  ? '0 4px 15px rgba(139, 92, 246, 0.4)'
                  : '0 4px 15px rgba(107, 114, 128, 0.4)'
              }}
            >
              {view3D ? '🎮 3D Режим' : '📱 2D Режим'}
            </button>
            <button className="btn btn-secondary" onClick={resetBuild}>
              🔄 Сбросить
            </button>
            <button
              className="btn"
              onClick={() => {
                setShowChallenges(true);
                setShowTraining(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
                border: '1px solid #3f3f46'
              }}
            >
              🎯 Задания
            </button>
            <button
              className="btn"
              onClick={() => {
                setShowTraining(true);
                setShowChallenges(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
                border: '1px solid #334155'
              }}
            >
              📘 Обучение
            </button>
            <button
              className="btn"
              onClick={() => setShowTutorial(!showTutorial)}
              style={{
                background: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
                border: '1px solid #3f3f46'
              }}
            >
              ❓ Помощь
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {showTraining ? (
          <TrainingView onClose={() => setShowTraining(false)} />
        ) : showChallenges ? (
          <ChallengesView
            onClose={() => setShowChallenges(false)}
            onStartChallenge={(challenge: Challenge) => {
              setActiveChallenge(challenge);
              setShowChallenges(false);
            }}
          />
        ) : (
          <>
            {activeChallenge && (
              <div className="active-task-bar">
                <div className="active-task-info">
                  <span className="active-task-title">🎯 {activeChallenge.title}</span>
                  <span className="active-task-progress">
                    Прогресс: {taskProgress.done}/{taskProgress.total} ({taskProgress.percent}%)
                  </span>
                </div>
                <div className="active-task-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowTaskHints((v) => !v)}
                  >
                    {showTaskHints ? '🙈 Скрыть подсказки' : '💡 Подсказки'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setActiveChallenge(null);
                      setShowChallenges(true);
                    }}
                  >
                    Вернуться к заданиям
                  </button>
                </div>
                {showTaskHints && (
                  <ul className="active-task-hints">
                    {activeChallenge.hints.map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="main-container">
              <ComponentSelection />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {view3D ? (
                  <div
                    className="pc-case-container pc-case-container-3d"
                    style={{ minHeight: '620px', height: '620px', border: '2px dashed #4b5563', borderRadius: '12px' }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, pointerEvents: 'none' }}>
                      <h2 style={{ margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🎮 3D Студия</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        Перетащите компоненты сюда
                      </p>
                    </div>
                    <Scene3D className="pc-case-3d-stage" />
                  </div>
                ) : (
                  <PCCaseView showOrderHints={!!activeChallenge} />
                )}

                <CompatibilityPanel compatibility={compatibility} />
              </div>
            </div>

            <StatusPanel
              build={build}
              totalPrice={totalPrice}
              isComplete={isComplete}
            />
          </>
        )}
      </div>

      {showTutorial && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowTutorial(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              padding: '2rem',
              borderRadius: '16px',
              maxWidth: '600px',
              border: '2px solid #8b5cf6',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#a78bfa', marginBottom: '1rem' }}>📖 Как пользоваться симулятором</h2>
            <div style={{ color: '#d1d5db', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>1. Выберите корпус</strong> - начните с выбора корпуса для вашего ПК
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>2. Установите материнскую плату</strong> - это основа вашей системы
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>3. Добавьте процессор</strong> - убедитесь, что сокет совпадает с материнской платой
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>4. Установите оперативную память</strong> - проверьте тип памяти (DDR4/DDR5)
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>5. Добавьте видеокарту</strong> (опционально) - для игр и графики
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>6. Выберите накопитель</strong> - SSD или HDD для хранения данных
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>7. Установите блок питания</strong> - убедитесь, что мощности хватает
              </p>
              <p style={{ marginTop: '1.5rem', color: '#fbbf24' }}>
                ⚠️ Система автоматически проверит совместимость компонентов и подскажет, если что-то не подходит!
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowTutorial(false)}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Понятно!
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default PCSimulator;
