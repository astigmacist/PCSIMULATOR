import { useState } from 'react';

interface TrainingModalProps {
  onClose: () => void;
}

const trainingSteps = [
  {
    id: 'motherboard',
    title: '1. Материнская плата — основа системы',
    image: '/images/motherboard.png',
    content: [
      'Выберите форм‑фактор (ATX, mATX, ITX) под корпус.',
      'Сокет должен совпадать с процессором (AM4/AM5/LGA1700 и т.д.).',
      'Проверьте тип памяти (DDR4/DDR5) и число слотов.',
      'Смотрите на количество PCIe/M.2/SATA и порты USB.'
    ],
    note: 'Материнская плата задает совместимость всего ПК.'
  },
  {
    id: 'cpu',
    title: '2. Процессор (CPU)',
    image: '/images/cpu.png',
    content: [
      'Совместим по сокету и чипсету с материнской платой.',
      'Важны ядра/потоки и частоты (base/boost).',
      'TDP влияет на охлаждение и выбор блока питания.',
      'Поддержка памяти и PCIe поколений.'
    ],
    note: 'CPU — главный вычислительный узел системы.'
  },
  {
    id: 'ram',
    title: '3. Оперативная память (RAM)',
    image: '/images/memory ram.png',
    content: [
      'Тип DDR4/DDR5 должен совпадать с платой.',
      'Лучше ставить пары модулей для двухканала.',
      'Объем и частота влияют на скорость работы.',
      'Тайминги (CL) важны для отклика.'
    ],
    note: 'Для игр обычно 16–32GB, для работы — больше.'
  },
  {
    id: 'gpu',
    title: '4. Видеокарта (GPU)',
    image: '/images/—Pngtree—nvidia rtx 3080 rog strix_21021625.png',
    content: [
      'Проверьте длину и толщину — поместится ли в корпус.',
      'Нужны подходящие PCIe и питание (8‑pin/12‑pin).',
      'Энергопотребление влияет на выбор БП.',
      'Объем VRAM важен для игр и графики.'
    ],
    note: 'GPU опционален для офисных ПК.'
  },
  {
    id: 'storage',
    title: '5. Накопители (SSD/HDD)',
    image: '/images/ssd:hdd.avif',
    content: [
      'NVMe M.2 быстрее SATA SSD и HDD.',
      'Проверьте наличие M.2 слотов и SATA портов.',
      'Объем зависит от задач: игры, работа, хранение.',
      'Лучше иметь SSD под систему и HDD под архив.'
    ],
    note: 'Скорость накопителя влияет на загрузку и отзывчивость.'
  },
  {
    id: 'psu',
    title: '6. Блок питания (PSU)',
    image: '/images/power.png',
    content: [
      'Мощность с запасом 20–30% от потребления системы.',
      'Сертификат 80 Plus влияет на эффективность.',
      'Должны быть нужные кабели питания.',
      'Качество БП влияет на стабильность и ресурс.'
    ],
    note: 'Не экономьте на блоке питания.'
  },
  {
    id: 'case',
    title: '7. Корпус и охлаждение',
    image: '/images/pc case.png',
    content: [
      'Корпус должен поддерживать форм‑фактор платы.',
      'Проверьте место под видеокарту и кулер.',
      'Важно направление и количество вентиляторов.',
      'Хороший airflow снижает температуры.'
    ],
    note: 'Охлаждение = стабильная работа и тишина.'
  },
  {
    id: 'assembly',
    title: '8. Порядок сборки (пошагово)',
    image: '/images/pc case.png',
    content: [
      'Установите CPU в сокет и закрепите кулер.',
      'Поставьте RAM в правильные слоты.',
      'Закрепите плату в корпусе на стойках.',
      'Установите накопители (M.2/SATA).',
      'Поставьте видеокарту в PCIe слот.',
      'Установите блок питания и подключите кабели.',
      'Проверьте совместимость и запускайте.'
    ],
    note: 'Симулятор помогает найти ошибки совместимости.'
  }
];

function TrainingModal({ onClose }: TrainingModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = trainingSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === trainingSteps.length - 1;

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, trainingSteps.length - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          padding: '2rem',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '90%',
          border: '2px solid #38bdf8',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#7dd3fc', marginBottom: '1rem' }}>
          📘 Обучение: как собрать ПК
        </h2>

        <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1rem' }}>
            Это пошаговое обучение. Выбирайте разделы слева или листайте кнопками
            «Назад/Далее».
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '1rem',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
              }}
            >
              <div style={{ color: '#93c5fd', marginBottom: '0.5rem' }}>
                Разделы
              </div>
              {trainingSteps.map((item, index) => (
                <button
                  key={item.id}
                  className="btn"
                  onClick={() => setStepIndex(index)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: '0.5rem',
                    background:
                      index === stepIndex
                        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
                    border: '1px solid #334155',
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    background: 'rgba(2, 6, 23, 0.6)',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    border: '1px solid #1f2937',
                  }}
                />
                <div>
                  <div style={{ color: '#93c5fd', fontSize: '0.9rem' }}>
                    Этап {stepIndex + 1} из {trainingSteps.length}
                  </div>
                  <h3 style={{ color: '#e2e8f0', margin: 0 }}>{step.title}</h3>
                </div>
              </div>

              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {step.content.map((point) => (
                  <li key={point} style={{ marginBottom: '0.5rem' }}>
                    {point}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '0.75rem', color: '#fbbf24' }}>
                💡 {step.note}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={goPrev}
              disabled={isFirst}
              style={{ flex: 1, opacity: isFirst ? 0.6 : 1 }}
            >
              ⬅️ Назад
            </button>
            <button
              className="btn btn-primary"
              onClick={goNext}
              disabled={isLast}
              style={{ flex: 1, opacity: isLast ? 0.6 : 1 }}
            >
              Далее ➡️
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Закрыть обучение
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainingModal;
