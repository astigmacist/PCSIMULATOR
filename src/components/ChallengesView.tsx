import { useEffect, useMemo, useState } from 'react';
import { useBuild } from '../context/BuildContext';
import { Challenge, challenges } from '../types/tutorial';
import { calculateTotalPrice } from '../logic/compatibility';

interface ChallengesViewProps {
  onClose: () => void;
  onStartChallenge?: (challenge: Challenge) => void;
}

function ChallengesView({ onClose, onStartChallenge }: ChallengesViewProps) {
  const { build, compatibility, buildHistory } = useBuild();
  const [activeChallengeId, setActiveChallengeId] = useState(challenges[0]?.id ?? '');
  const [showHints, setShowHints] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startHistoryIndex, setStartHistoryIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(
    () => new Set()
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('pcsim_achievements');
    if (!stored) return new Set();
    try {
      return new Set(JSON.parse(stored) as string[]);
    } catch {
      return new Set();
    }
  });

  const activeChallenge = challenges.find((item) => item.id === activeChallengeId) ?? challenges[0];
  const totalPrice = calculateTotalPrice(build);

  const totalRAM = build.ram.reduce((sum, r) => sum + r.capacity, 0);
  const totalStorage = build.storage.reduce((sum, s) => sum + s.capacity, 0);
  const totalBaseComponentsInstalled =
    (build.case ? 1 : 0) +
    (build.motherboard ? 1 : 0) +
    (build.cpu ? 1 : 0) +
    (build.psu ? 1 : 0) +
    (build.ram.length > 0 ? 1 : 0) +
    (build.storage.length > 0 ? 1 : 0);

  const progressItems = useMemo(() => {
    if (!activeChallenge) return [];

    const req = activeChallenge.requirements;
    return [
      { label: 'Корпус выбран', ok: !!build.case },
      { label: 'Материнская плата установлена', ok: !!build.motherboard },
      { label: 'Процессор установлен', ok: !!build.cpu },
      {
        label: req.minCPUCores
          ? `CPU: минимум ${req.minCPUCores} ядер`
          : 'CPU соответствует требованиям',
        ok: req.minCPUCores ? !!build.cpu && build.cpu.cores >= req.minCPUCores : !!build.cpu,
      },
      {
        label: req.minRAM ? `RAM: минимум ${req.minRAM}GB` : 'RAM установлена',
        ok: req.minRAM ? totalRAM >= req.minRAM : build.ram.length > 0,
      },
      {
        label: req.minStorage ? `Накопители: минимум ${req.minStorage}GB` : 'Накопители установлены',
        ok: req.minStorage ? totalStorage >= req.minStorage : build.storage.length > 0,
      },
      {
        label: req.requiresGPU ? 'Видеокарта установлена' : 'GPU опционально',
        ok: req.requiresGPU ? !!build.gpu : true,
      },
      {
        label: 'Блок питания установлен',
        ok: !!build.psu,
      },
      {
        label: activeChallenge.budget
          ? `Бюджет: до ${activeChallenge.budget.toLocaleString('ru-KZ')}₸`
          : 'Бюджет не ограничен',
        ok: activeChallenge.budget ? totalPrice <= activeChallenge.budget : true,
      },
      {
        label: 'Совместимость без ошибок',
        ok: compatibility.compatible,
      },
    ];
  }, [
    activeChallenge,
    build,
    compatibility.compatible,
    totalPrice,
    totalRAM,
    totalStorage,
  ]);

  const completion = useMemo(() => {
    const total = progressItems.length;
    const done = progressItems.filter((item) => item.ok).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [progressItems]);

  const isCompleted = completion.percent === 100;

  useEffect(() => {
    if (!isStarted || !startedAt || isCompleted) {
      return;
    }
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted, startedAt, isCompleted]);

  useEffect(() => {
    if (!activeChallenge) return;
    if (completion.percent === 100) {
      setCompletedChallenges((prev) => new Set(prev).add(activeChallenge.id));
    }
  }, [activeChallenge, completion.percent]);

  if (!activeChallenge) {
    return null;
  }

  const order = ['case', 'motherboard', 'cpu', 'ram', 'storage', 'gpu', 'psu'];
  const orderIndex = new Map(order.map((item, index) => [item, index]));
  const orderViolations = useMemo(() => {
    if (!isStarted) return 0;
    const historySlice = buildHistory
      .slice(startHistoryIndex)
      .filter((item) => item.type === 'install');
    let maxIndex = -1;
    let violations = 0;
    const seen = new Set<string>();
    for (const item of historySlice) {
      if (seen.has(item.componentType)) continue;
      seen.add(item.componentType);
      const idx = orderIndex.get(item.componentType);
      if (idx === undefined) continue;
      if (idx < maxIndex) {
        violations += 1;
      } else {
        maxIndex = idx;
      }
    }
    return violations;
  }, [buildHistory, isStarted, startHistoryIndex]);

  const timePenalty = isStarted ? elapsedSeconds * 2 : 0;
  const budgetPenalty =
    activeChallenge?.budget && totalPrice > activeChallenge.budget
      ? Math.floor((totalPrice - activeChallenge.budget) / 1000)
      : 0;
  const compatibilityPenalty = compatibility.errors.length * 50;
  const orderPenalty = orderViolations * 50;
  const baseScore = 500 + completion.percent * 5;
  const finalScore = Math.max(
    0,
    Math.round(baseScore - timePenalty - budgetPenalty - compatibilityPenalty - orderPenalty)
  );
  const rating =
    finalScore >= 900
      ? 'S'
      : finalScore >= 800
      ? 'A'
      : finalScore >= 700
      ? 'B'
      : finalScore >= 600
      ? 'C'
      : 'D';
  const xpScore = isStarted ? finalScore : 0;
  const currentChallengeIndex = challenges.findIndex((c) => c.id === activeChallengeId);
  const nextChallengeId =
    currentChallengeIndex >= 0 && currentChallengeIndex < challenges.length - 1
      ? challenges[currentChallengeIndex + 1].id
      : null;

  const handleStartChallenge = () => {
    setIsStarted(true);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setStartHistoryIndex(buildHistory.length);
    setShowHints(false);
  };

  const handleResetChallenge = () => {
    setIsStarted(false);
    setStartedAt(null);
    setElapsedSeconds(0);
    setStartHistoryIndex(0);
    setShowHints(false);
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
    setShowHints(false);
    setIsStarted(false);
    setStartedAt(null);
    setElapsedSeconds(0);
    setStartHistoryIndex(0);
  };

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const achievements = useMemo(
    () => [
      {
        id: 'first_build',
        title: 'Первая сборка',
        description: 'Установите все базовые компоненты',
        unlocked: totalBaseComponentsInstalled === 6,
      },
      {
        id: 'clean_compat',
        title: 'Чистая совместимость',
        description: 'Сборка без ошибок совместимости',
        unlocked: isStarted && compatibility.compatible,
      },
      {
        id: 'budget_keeper',
        title: 'Бюджетный мастер',
        description: 'Уложитесь в бюджет текущего задания',
        unlocked: Boolean(activeChallenge?.budget && totalPrice <= activeChallenge.budget),
      },
      {
        id: 'speed_runner',
        title: 'Спринтер',
        description: 'Завершите за 10 минут',
        unlocked: isCompleted && elapsedSeconds > 0 && elapsedSeconds <= 600,
      },
      {
        id: 'order_master',
        title: 'Идеальный порядок',
        description: 'Сборка без нарушений порядка',
        unlocked: isCompleted && orderViolations === 0,
      },
      {
        id: 'all_challenges',
        title: 'Гранд-мастер',
        description: 'Завершите все сценарии',
        unlocked: completedChallenges.size === challenges.length,
      },
    ],
    [
      activeChallenge?.budget,
      completedChallenges.size,
      compatibility.compatible,
      elapsedSeconds,
      isCompleted,
      isStarted,
      orderViolations,
      totalBaseComponentsInstalled,
      totalPrice,
    ]
  );

  useEffect(() => {
    const unlockedIds = new Set(unlockedAchievements);
    let changed = false;
    achievements.forEach((achievement) => {
      if (achievement.unlocked && !unlockedIds.has(achievement.id)) {
        unlockedIds.add(achievement.id);
        changed = true;
      }
    });
    if (changed) {
      setUnlockedAchievements(unlockedIds);
      localStorage.setItem('pcsim_achievements', JSON.stringify(Array.from(unlockedIds)));
    }
  }, [achievements, unlockedAchievements]);

  const highestCompletedIndex = challenges.reduce((maxIndex, challenge, index) => {
    return completedChallenges.has(challenge.id) ? Math.max(maxIndex, index) : maxIndex;
  }, -1);
  const unlockIndex = highestCompletedIndex + 1;

  return (
    <div className="challenges-view">
      <div className="challenges-hero">
        <div>
          <div className="challenges-kicker">🎯 Задания</div>
          <h2 className="challenges-title">Игровые задачи сборки</h2>
          <p className="challenges-subtitle">
            Выберите сценарий, соблюдайте требования и соберите ПК как в реальной задаче.
          </p>
        </div>
        <div className="challenges-hero-actions">
          <button className="btn btn-primary" onClick={onClose}>
            ← Вернуться в симулятор
          </button>
        </div>
      </div>

      <div className="challenges-layout">
        <aside className="challenges-sidebar">
          <div className="challenges-sidebar-title">Сценарии</div>
          {challenges.map((challenge) => {
            const isActive = challenge.id === activeChallengeId;
            const isCompleted = completedChallenges.has(challenge.id);
            const challengeIndex = challenges.findIndex((item) => item.id === challenge.id);
            const isLocked = challengeIndex > unlockIndex;
            return (
              <button
                key={challenge.id}
                className={`challenges-nav-item${isActive ? ' active' : ''}${
                  isLocked ? ' locked' : ''
                }`}
                onClick={() => {
                  if (!isLocked) {
                    handleSelectChallenge(challenge);
                  }
                }}
                disabled={isLocked}
              >
                <div className="challenges-nav-title">
                  {challenge.title}
                  {isCompleted && <span className="challenge-badge success">Готово</span>}
                </div>
                <div className="challenges-nav-subtitle">{challenge.description}</div>
                {challenge.budget && (
                  <div className="challenge-badge budget">
                    До {challenge.budget.toLocaleString('ru-KZ')}₸
                  </div>
                )}
                {isLocked && <div className="challenge-badge locked">🔒 Закрыто</div>}
              </button>
            );
          })}
        </aside>

        <section className="challenges-content">
          <div className="challenge-card">
            <div className="challenge-header">
              <div>
                <div className="challenge-step-count">
                  Прогресс: {completion.percent}%
                </div>
                <h3>{activeChallenge.title}</h3>
                <p>{activeChallenge.description}</p>
              </div>
              <div className="challenge-header-right">
                <div className="challenge-price">
                  {totalPrice.toLocaleString('ru-KZ')}₸
                </div>
                <div className="challenge-price-label">Текущая стоимость</div>
                <div className="challenge-meta">
                  <span>⏱ {isStarted ? formatElapsed(elapsedSeconds) : '—:—'}</span>
                  <span>⭐ {xpScore}</span>
                  <span>Рейтинг: {rating}</span>
                </div>
              </div>
            </div>

            <div className="challenge-progress">
              <div className="challenge-progress-bar">
                <div
                  className="challenge-progress-fill"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>
              <div className="challenge-progress-meta">
                {completion.done}/{completion.total} требований выполнено
              </div>
            </div>

            <div className="challenge-actions">
              {!isStarted ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (onStartChallenge) {
                      onStartChallenge(activeChallenge);
                      onClose();
                    } else {
                      handleStartChallenge();
                    }
                  }}
                >
                  {onStartChallenge ? '▶️ Начать задание — перейти в симулятор' : '▶️ Начать задание'}
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={handleResetChallenge}>
                  ⟲ Сбросить задание
                </button>
              )}
              {isCompleted && nextChallengeId && (
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveChallengeId(nextChallengeId)}
                >
                  Следующее задание →
                </button>
              )}
            </div>

            <div className="challenge-grid">
              <div className="challenge-section">
                <div className="challenge-section-title">Требования</div>
                <ul className="challenge-list">
                  {progressItems.map((item) => (
                    <li key={item.label} className={item.ok ? 'ok' : 'fail'}>
                      <span>{item.ok ? '✅' : '⬜'} </span>
                      {item.label}
                    </li>
                  ))}
                  {isStarted && (
                    <li className={orderViolations === 0 ? 'ok' : 'fail'}>
                      <span>{orderViolations === 0 ? '✅' : '⬜'} </span>
                      Порядок сборки: {orderViolations === 0 ? 'соблюден' : 'есть нарушения'}
                    </li>
                  )}
                </ul>
              </div>

              <div className="challenge-section hint-block">
                <div className="challenge-section-title">Подсказки</div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowHints((prev) => !prev)}
                >
                  {showHints ? '🙈 Скрыть подсказки' : '💡 Показать подсказки'}
                </button>
                {showHints && activeChallenge.hints && activeChallenge.hints.length > 0 && (
                  <ul className="challenge-hints">
                    {activeChallenge.hints.map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ul>
                )}
                {showHints && (!activeChallenge.hints || activeChallenge.hints.length === 0) && (
                  <p className="challenge-hints-empty">Подсказок для этого задания нет.</p>
                )}
              </div>
            </div>

            <div
              className={`challenge-result ${
                completion.percent === 100 ? 'success' : 'pending'
              }`}
            >
              {completion.percent === 100 ? (
                <div>
                  <div className="challenge-result-title">🎉 Задание выполнено!</div>
                  <div className="challenge-result-text">
                    Отличная работа! Сборка соответствует требованиям.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="challenge-result-title">🛠️ Продолжайте сборку</div>
                  <div className="challenge-result-text">
                    Выполните все требования, чтобы завершить сценарий.
                  </div>
                </div>
              )}
            </div>

            <div className="challenge-section achievements">
              <div className="challenge-section-title">Достижения</div>
              <div className="achievements-grid">
                {achievements.map((achievement) => {
                  const isUnlocked = unlockedAchievements.has(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`achievement-card${isUnlocked ? ' unlocked' : ''}`}
                    >
                      <div className="achievement-title">
                        {isUnlocked ? '🏆' : '🔒'} {achievement.title}
                      </div>
                      <div className="achievement-desc">{achievement.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ChallengesView;
