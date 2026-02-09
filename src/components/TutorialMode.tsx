import { useState } from 'react';
import { useBuild } from '../context/BuildContext';
import { Challenge, challenges } from '../types/tutorial';
import { calculateTotalPrice } from '../logic/compatibility';

interface TutorialModeProps {
  onClose: () => void;
}

function TutorialMode({ onClose }: TutorialModeProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showHints, setShowHints] = useState(false);
  const { build, compatibility } = useBuild();

  const checkChallengeCompletion = (challenge: Challenge): { completed: boolean; errors: string[] } => {
    const errors: string[] = [];
    const totalPrice = calculateTotalPrice(build);

    // Проверка бюджета
    if (challenge.budget && totalPrice > challenge.budget) {
      errors.push(`Превышен бюджет: ${totalPrice.toLocaleString('ru-KZ')}₸ из ${challenge.budget.toLocaleString('ru-KZ')}₸`);
    }

    // Проверка совместимости
    if (!compatibility.compatible) {
      errors.push('Есть проблемы совместимости компонентов');
    }

    // Проверка CPU
    if (challenge.requirements.minCPUCores && (!build.cpu || build.cpu.cores < challenge.requirements.minCPUCores)) {
      errors.push(`Процессор должен иметь минимум ${challenge.requirements.minCPUCores} ядер`);
    }

    // Проверка RAM
    const totalRAM = build.ram.reduce((sum, r) => sum + r.capacity, 0);
    if (challenge.requirements.minRAM && totalRAM < challenge.requirements.minRAM) {
      errors.push(`Требуется минимум ${challenge.requirements.minRAM}GB оперативной памяти`);
    }

    // Проверка GPU
    if (challenge.requirements.requiresGPU && !build.gpu) {
      errors.push('Требуется видеокарта');
    }

    // Проверка Storage
    const totalStorage = build.storage.reduce((sum, s) => sum + s.capacity, 0);
    if (challenge.requirements.minStorage && totalStorage < challenge.requirements.minStorage) {
      errors.push(`Требуется минимум ${challenge.requirements.minStorage}GB накопителей`);
    }

    // Проверка обязательных компонентов
    if (!build.motherboard) errors.push('Установите материнскую плату');
    if (!build.cpu) errors.push('Установите процессор');
    if (!build.psu) errors.push('Установите блок питания');
    if (build.ram.length === 0) errors.push('Установите оперативную память');
    if (build.storage.length === 0) errors.push('Установите накопитель');

    return {
      completed: errors.length === 0,
      errors,
    };
  };

  const renderChallengeList = () => (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ color: '#a78bfa', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        🎯 Обучающие задания
      </h2>
      <p style={{ color: '#d1d5db', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Выберите задание и попробуйте собрать ПК по требованиям
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
              {challenge.title}
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              {challenge.description}
            </p>
            {challenge.budget && (
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Бюджет: {challenge.budget.toLocaleString('ru-KZ')}₸
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallengeDetails = (challenge: Challenge) => {
    const result = checkChallengeCompletion(challenge);
    const totalPrice = calculateTotalPrice(build);

    return (
      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => setSelectedChallenge(null)}
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid #8b5cf6',
            color: '#a78bfa',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          ← Назад к заданиям
        </button>

        <h2 style={{ color: '#a78bfa', marginBottom: '1rem', fontSize: '1.8rem' }}>
          {challenge.title}
        </h2>
        <p style={{ color: '#d1d5db', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          {challenge.description}
        </p>

        {/* Требования */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <h3 style={{ color: '#c4b5fd', marginBottom: '1rem' }}>📋 Требования:</h3>
          <ul style={{ color: '#d1d5db', lineHeight: '2', paddingLeft: '1.5rem' }}>
            {challenge.budget && (
              <li>Бюджет: {challenge.budget.toLocaleString('ru-KZ')}₸</li>
            )}
            {challenge.requirements.minCPUCores && (
              <li>Минимум {challenge.requirements.minCPUCores} ядер процессора</li>
            )}
            {challenge.requirements.minRAM && (
              <li>Минимум {challenge.requirements.minRAM}GB оперативной памяти</li>
            )}
            {challenge.requirements.requiresGPU && <li>Требуется видеокарта</li>}
            {challenge.requirements.minStorage && (
              <li>Минимум {challenge.requirements.minStorage}GB накопителей</li>
            )}
          </ul>
        </div>

        {/* Подсказки */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowHints(!showHints)}
            className="btn btn-primary"
            style={{ marginBottom: '1rem' }}
          >
            {showHints ? '🙈 Скрыть подсказки' : '💡 Показать подсказки'}
          </button>

          {showHints && (
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <h4 style={{ color: '#fde68a', marginBottom: '1rem' }}>💡 Подсказки:</h4>
              <ul style={{ color: '#fde68a', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                {challenge.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Статус выполнения */}
        <div
          style={{
            background: result.completed
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: result.completed
              ? '2px solid #10b981'
              : '2px solid #ef4444',
          }}
        >
          <h3
            style={{
              color: result.completed ? '#6ee7b7' : '#fca5a5',
              marginBottom: '1rem',
              fontSize: '1.3rem',
            }}
          >
            {result.completed ? '✅ Задание выполнено!' : '📝 Статус выполнения'}
          </h3>

          {result.completed ? (
            <div style={{ color: '#6ee7b7', fontSize: '1.1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                🎉 Поздравляем! Вы успешно собрали ПК по требованиям!
              </p>
              <p>Итоговая стоимость: {totalPrice.toLocaleString('ru-KZ')}₸</p>
              {challenge.budget && (
                <p>
                  Бюджет: {totalPrice.toLocaleString('ru-KZ')}₸ из{' '}
                  {challenge.budget.toLocaleString('ru-KZ')}₸
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#fca5a5', marginBottom: '1rem' }}>
                Для завершения задания исправьте следующее:
              </p>
              <ul style={{ color: '#fca5a5', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid #8b5cf6',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
          }}
        >
          <h2 style={{ margin: 0 }}>🎓 Обучающий режим</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {selectedChallenge ? renderChallengeDetails(selectedChallenge) : renderChallengeList()}
      </div>
    </div>
  );
}

export default TutorialMode;

