import { useMemo, useState } from 'react';

interface TrainingViewProps {
  onClose: () => void;
}

interface TrainingStep {
  id: string;
  title: string;
  image: string;
  accent: string;
  intro: string;
  checks: string[];
  tips: string[];
}

function TrainingView({ onClose }: TrainingViewProps) {
  const steps = useMemo<TrainingStep[]>(
    () => [
      {
        id: 'motherboard',
        title: '1. Материнская плата — основа системы',
        image: '/images/motherboard.png',
        accent: '#10b981',
        intro:
          'Материнская плата задает совместимость всего ПК и определяет, какие компоненты можно установить.',
        checks: [
          'Форм‑фактор: ATX, mATX, ITX — должен совпадать с корпусом.',
          'Сокет процессора: AM4/AM5/LGA1700 и т.д.',
          'Поддержка памяти: DDR4 или DDR5, количество слотов.',
          'Порты и расширение: PCIe, M.2, SATA, USB.'
        ],
        tips: ['Не выбирайте плату “впритык” по слотам — оставьте запас.']
      },
      {
        id: 'cpu',
        title: '2. Процессор (CPU)',
        image: '/images/cpu.png',
        accent: '#6366f1',
        intro:
          'CPU — главный вычислительный узел. Совместимость по сокету и чипсету обязательна.',
        checks: [
          'Сокет и чипсет должны соответствовать плате.',
          'Частоты и количество ядер/потоков под задачи.',
          'TDP влияет на охлаждение и блок питания.',
          'Поддержка памяти и PCIe поколений.'
        ],
        tips: ['Для игр важна частота, для работы — ядра/потоки.']
      },
      {
        id: 'ram',
        title: '3. Оперативная память (RAM)',
        image: '/images/memory ram.png',
        accent: '#14b8a6',
        intro:
          'RAM отвечает за скорость доступа к данным. Несовместимая память не запустится.',
        checks: [
          'Тип DDR4/DDR5 должен совпадать с платой.',
          'Лучше ставить модули парами для двухканального режима.',
          'Частота и тайминги (CL) влияют на производительность.',
          'Объем выбирайте под задачи.'
        ],
        tips: ['Оптимум для игр — 16–32GB. Для работы — 32–64GB.']
      },
      {
        id: 'gpu',
        title: '4. Видеокарта (GPU)',
        image: '/images/—Pngtree—nvidia rtx 3080 rog strix_21021625.png',
        accent: '#ef4444',
        intro:
          'GPU отвечает за графику и ускорение. Важно, чтобы она поместилась и имела питание.',
        checks: [
          'Длина/толщина должны подходить под корпус.',
          'Питание: 8‑pin/12‑pin, количество коннекторов.',
          'Энергопотребление влияет на БП.',
          'Объем VRAM для игр и графики.'
        ],
        tips: ['Если ПК офисный — GPU может быть встроенной.']
      },
      {
        id: 'storage',
        title: '5. Накопители (SSD/HDD)',
        image: '/images/ssd:hdd.avif',
        accent: '#a78bfa',
        intro:
          'Накопитель влияет на скорость загрузки системы и программ.',
        checks: [
          'NVMe M.2 быстрее SATA SSD и HDD.',
          'Проверьте количество M.2 слотов и SATA портов.',
          'Объем зависит от задач и библиотеки игр.',
          'Сочетайте SSD под систему и HDD под архив.'
        ],
        tips: ['SSD обязателен для комфортной работы.']
      },
      {
        id: 'psu',
        title: '6. Блок питания (PSU)',
        image: '/images/power.png',
        accent: '#f59e0b',
        intro:
          'БП отвечает за стабильность. Некачественный БП может повредить компоненты.',
        checks: [
          'Мощность с запасом 20–30% от суммарного потребления.',
          'Сертификат 80 Plus влияет на эффективность.',
          'Нужные кабели питания под CPU/GPU.',
          'Качество сборки и бренд имеют значение.'
        ],
        tips: ['Не экономьте на БП — это безопасность всего ПК.']
      },
      {
        id: 'case',
        title: '7. Корпус и охлаждение',
        image: '/images/pc case.png',
        accent: '#8b5cf6',
        intro:
          'Корпус определяет удобство сборки и охлаждение системы.',
        checks: [
          'Совместимость с форм‑фактором материнской платы.',
          'Длина видеокарты и высота кулера.',
          'Воздушный поток: вход/выход, число вентиляторов.',
          'Пылевые фильтры и кабель‑менеджмент.'
        ],
        tips: ['Хороший airflow = ниже температуры и тише ПК.']
      },
      {
        id: 'assembly',
        title: '8. Порядок сборки (пошагово)',
        image: '/images/pc case.png',
        accent: '#3b82f6',
        intro:
          'Собирайте аккуратно и по шагам, чтобы не повредить компоненты.',
        checks: [
          'Установите CPU и кулер на плату.',
          'Вставьте RAM в правильные слоты.',
          'Закрепите плату в корпусе на стойках.',
          'Установите накопители и видеокарту.',
          'Подключите блок питания и все кабели.',
          'Проверьте совместимость и запускайте.'
        ],
        tips: ['Не забудьте снять защитные пленки с кулера.']
      }
    ],
    []
  );

  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];

  return (
    <div className="training-view">
      <div className="training-hero">
        <div>
          <div className="training-kicker">📘 Обучение</div>
          <h2 className="training-title">Как собрать ПК: полный курс</h2>
          <p className="training-subtitle">
            Полноценные этапы и характеристики комплектующих — от материнской
            платы до финальной сборки.
          </p>
        </div>
        <div className="training-hero-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            ← Вернуться в симулятор
          </button>
        </div>
      </div>

      <div className="training-layout">
        <aside className="training-sidebar">
          <div className="training-sidebar-title">Разделы обучения</div>
          {steps.map((step) => (
            <button
              key={step.id}
              className={`training-nav-item${
                step.id === activeStepId ? ' active' : ''
              }`}
              onClick={() => setActiveStepId(step.id)}
            >
              {step.title}
            </button>
          ))}
        </aside>

        <section className="training-content">
          <div
            className="training-card"
            style={{ ['--accent' as string]: activeStep.accent } as Record<string, string>}
          >
            <div className="training-card-header">
              <img src={activeStep.image} alt={activeStep.title} />
              <div>
                <div className="training-step-count">
                  Этап {steps.findIndex((step) => step.id === activeStepId) + 1} из{' '}
                  {steps.length}
                </div>
                <h3>{activeStep.title}</h3>
              </div>
            </div>

            <p className="training-intro">{activeStep.intro}</p>

            <div className="training-section">
              <div className="training-section-title">Что проверить</div>
              <ul>
                {activeStep.checks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="training-section tips">
              <div className="training-section-title">Советы</div>
              <ul>
                {activeStep.tips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="training-step-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                const currentIndex = steps.findIndex((step) => step.id === activeStepId);
                if (currentIndex > 0) {
                  setActiveStepId(steps[currentIndex - 1].id);
                }
              }}
              disabled={activeStepId === steps[0].id}
            >
              ⬅️ Назад
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const currentIndex = steps.findIndex((step) => step.id === activeStepId);
                if (currentIndex < steps.length - 1) {
                  setActiveStepId(steps[currentIndex + 1].id);
                }
              }}
              disabled={activeStepId === steps[steps.length - 1].id}
            >
              Далее ➡️
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TrainingView;
