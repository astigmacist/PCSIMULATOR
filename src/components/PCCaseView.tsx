import { useState, useMemo } from 'react';
import { useBuild } from '../context/BuildContext';
import {
  CPU,
  RAM,
  GPU,
  Storage,
  Case,
} from '../types/components';
import {
  checkCPUCompatibility,
  checkRAMCompatibility,
  checkGPUCompatibility,
  checkStorageCompatibility,
  checkCaseCompatibility,
} from '../logic/compatibility';

const ASSEMBLY_ORDER: { key: string; label: string }[] = [
  { key: 'motherboard', label: 'Материнская плата' },
  { key: 'cpu', label: 'Процессор' },
  { key: 'ram', label: 'Оперативная память' },
  { key: 'storage', label: 'Накопитель' },
  { key: 'gpu', label: 'Видеокарта' },
  { key: 'psu', label: 'Блок питания' },
];

export interface PCCaseViewProps {
  showOrderHints?: boolean;
}

function PCCaseView({ showOrderHints = false }: PCCaseViewProps) {
  const { 
    build, 
    removeComponent, 
    removeRAM, 
    removeStorage,
    installMotherboard,
    installCPU,
    installRAM,
    installGPU,
    installPSU,
    installStorage,
    installCase,
  } = useBuild();
  
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const orderState = useMemo(() => {
    const done: Record<string, boolean> = {
      motherboard: !!build.motherboard,
      cpu: !!build.cpu,
      ram: build.ram.length > 0,
      storage: build.storage.length > 0,
      gpu: !!build.gpu,
      psu: !!build.psu,
    };
    let nextStepIndex = ASSEMBLY_ORDER.findIndex((s) => !done[s.key]);
    if (nextStepIndex < 0) nextStepIndex = ASSEMBLY_ORDER.length;
    return { done, nextStepIndex };
  }, [build]);

  const getStepHint = (stepKey: string) => {
    const idx = ASSEMBLY_ORDER.findIndex((s) => s.key === stepKey);
    if (idx < 0) return null;
    const step = ASSEMBLY_ORDER[idx];
    const isDone = orderState.done[stepKey];
    const isNext = orderState.nextStepIndex === idx;
    const blocked = idx > 0 && !orderState.done[ASSEMBLY_ORDER[idx - 1].key];
    const stepNum = idx + 1;
    if (isDone) return { stepNum, text: `Шаг ${stepNum} ✓`, isNext: false, isDone: true, blocked: false };
    if (blocked)
      return {
        stepNum,
        text: `Шаг ${stepNum}: сначала установите ${ASSEMBLY_ORDER[idx - 1].label.toLowerCase()}`,
        isNext: false,
        isDone: false,
        blocked: true,
      };
    if (isNext) return { stepNum, text: `Шаг ${stepNum}: Установите ${step.label.toLowerCase()} сюда`, isNext: true, isDone: false, blocked: false };
    return { stepNum, text: `Шаг ${stepNum}: ${step.label}`, isNext: false, isDone: false, blocked: false };
  };

  const handleDragOver = (e: React.DragEvent, slotType: string, dragKey = slotType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(dragKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);

    try {
      const componentType = e.dataTransfer.getData('componentType');
      const componentData = JSON.parse(e.dataTransfer.getData('componentData'));

      // Проверяем соответствие типа слота и компонента
      if (componentType !== slotType) {
        alert(`❌ Этот компонент нельзя установить в этот слот!\n\nКомпонент типа "${componentType}" нужно устанавливать в соответствующий слот.`);
        return;
      }

      // Устанавливаем компонент в зависимости от типа
      switch (componentType) {
        case 'case':
          if (build.motherboard) {
            const error = checkCaseCompatibility(componentData as Case, build.motherboard);
            if (error) {
              alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
              return;
            }
          }
          installCase(componentData);
          break;

        case 'motherboard':
          if (!build.case) {
            alert('Сначала выберите корпус!');
            return;
          }
          const caseError = checkCaseCompatibility(build.case, componentData);
          if (caseError) {
            alert(`❌ ${caseError.reason}\n\n💡 ${caseError.recommendations?.join('\n')}`);
            return;
          }
          installMotherboard(componentData);
          break;

        case 'cpu':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const cpuError = checkCPUCompatibility(componentData as CPU, build.motherboard);
          if (cpuError) {
            alert(`❌ ${cpuError.reason}\n\n💡 ${cpuError.recommendations?.join('\n')}`);
            return;
          }
          installCPU(componentData);
          break;

        case 'ram':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const ramError = checkRAMCompatibility(componentData as RAM, build.motherboard, build.ram);
          if (ramError) {
            alert(`❌ ${ramError.reason}\n\n💡 ${ramError.recommendations?.join('\n')}`);
            return;
          }
          installRAM(componentData);
          break;

        case 'gpu':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const gpuError = checkGPUCompatibility(componentData as GPU, build.motherboard, build.case);
          if (gpuError) {
            alert(`❌ ${gpuError.reason}\n\n💡 ${gpuError.recommendations?.join('\n')}`);
            return;
          }
          installGPU(componentData);
          break;

        case 'storage':
          if (!build.motherboard) {
            alert('Сначала установите материнскую плату!');
            return;
          }
          const storageError = checkStorageCompatibility(componentData as Storage, build.motherboard, build.storage);
          if (storageError) {
            alert(`❌ ${storageError.reason}\n\n💡 ${storageError.recommendations?.join('\n')}`);
            return;
          }
          installStorage(componentData);
          break;

        case 'psu':
          installPSU(componentData);
          break;

        default:
          alert('Неизвестный тип компонента!');
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      alert('Ошибка при установке компонента!');
    }
  };

  return (
    <div className="pc-case-container">
      <h2>Визуализация сборки</h2>

      {!build.case ? (
        <div
          className={`case-drop-zone ${dragOverSlot === 'case' ? 'drag-over' : ''}`}
          onDragOver={(e) => handleDragOver(e, 'case')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'case')}
        >
          <div className="drop-zone-content">
            <div className="slot-label">Корпус ПК</div>
            <span style={{ opacity: 0.65 }}>Перетащите корпус сюда, чтобы начать сборку</span>
          </div>
        </div>
      ) : (
        <div className="case-info-bar">
          <div>
            <div className="component-name" style={{ marginBottom: '0.25rem' }}>{build.case.name}</div>
            <div className="component-specs">
              Форм-фактор: {build.case.formFactor.join(', ')} | Макс. GPU: {build.case.maxGPULength}мм | Отсеков: {build.case.driveBays}
            </div>
          </div>
          <button
            className="remove-btn"
            onClick={() => removeComponent('case')}
            title="Удалить корпус"
          >
            ×
          </button>
        </div>
      )}

      <div className="pc-case">
        {/* Материнская плата - база для всего */}
        <div 
          className={`motherboard-base ${build.motherboard ? 'has-motherboard' : 'empty'} ${dragOverSlot === 'motherboard' ? 'drag-over' : ''}`}
          onDragOver={(e) => handleDragOver(e, 'motherboard')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'motherboard')}
        >
          {!build.motherboard ? (
            <div className="motherboard-placeholder">
              <div className="slot-label">Материнская плата</div>
              <span style={{ opacity: 0.5 }}>Перетащите материнскую плату сюда</span>
            </div>
          ) : (
            <div className="motherboard-info-bar">
              <span className="motherboard-name">{build.motherboard.name}</span>
              <button
                className="remove-btn"
                onClick={() => removeComponent('motherboard')}
                title="Удалить материнскую плату"
              >
                ×
              </button>
            </div>
          )}

        <div className="case-interior">
          {/* CPU Slot */}
          <div 
            className={`slot cpu-slot ${build.cpu ? 'filled' : ''} ${dragOverSlot === 'cpu' ? 'drag-over' : ''} ${!build.motherboard ? 'disabled' : ''}`}
            onDragOver={(e) => build.motherboard && handleDragOver(e, 'cpu')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'cpu')}
          >
            {!build.cpu ? (
              <>
                <div className="slot-label">CPU</div>
                <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Пусто</span>
              </>
            ) : (
              <button
                className="remove-btn"
                onClick={() => removeComponent('cpu')}
                title="Удалить процессор"
              >
                ×
              </button>
            )}
          </div>

          {/* Слоты оперативной памяти */}
          <div className="ram-slots">
            {[0, 1, 2, 3].map((index) => {
              const ram = build.ram[index];
              return (
                <div 
                  key={index} 
                  className={`slot ${ram ? 'filled' : ''} ${dragOverSlot === `ram-${index}` ? 'drag-over' : ''} ${!build.motherboard ? 'disabled' : ''}`}
                  onDragOver={(e) => build.motherboard && handleDragOver(e, 'ram', `ram-${index}`)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'ram')}
                >
                  {!ram ? (
                    <>
                      <div className="slot-label">RAM {index + 1}</div>
                      <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Пусто</span>
                    </>
                  ) : (
                    <button
                      className="remove-btn"
                      onClick={() => removeRAM(ram.id)}
                      title="Удалить RAM"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Видеокарта */}
          <div 
            className={`slot gpu-slot ${build.gpu ? 'filled' : ''} ${dragOverSlot === 'gpu' ? 'drag-over' : ''} ${!build.motherboard ? 'disabled' : ''}`}
            onDragOver={(e) => build.motherboard && handleDragOver(e, 'gpu')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'gpu')}
          >
            {!build.gpu ? (
              <>
                <div className="slot-label">Видеокарта</div>
                <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Пусто</span>
              </>
            ) : (
              <button
                className="remove-btn"
                onClick={() => removeComponent('gpu')}
                title="Удалить видеокарту"
              >
                ×
              </button>
            )}
          </div>

          {/* Блок питания */}
          <div 
            className={`slot psu-slot ${build.psu ? 'filled' : ''} ${dragOverSlot === 'psu' ? 'drag-over' : ''} ${!build.motherboard ? 'disabled' : ''}`}
            onDragOver={(e) => build.motherboard && handleDragOver(e, 'psu')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'psu')}
          >
            {!build.psu ? (
              <>
                <div className="slot-label">Блок питания</div>
                <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Пусто</span>
              </>
            ) : (
              <button
                className="remove-btn"
                onClick={() => removeComponent('psu')}
                title="Удалить блок питания"
              >
                ×
              </button>
            )}
          </div>

          {/* Накопители */}
          <div className="storage-slots">
            {[0, 1, 2].map((index) => {
              const storage = build.storage[index];
              return (
                <div 
                  key={index} 
                  className={`slot ${storage ? 'filled' : ''} ${dragOverSlot === `storage-${index}` ? 'drag-over' : ''} ${!build.motherboard ? 'disabled' : ''}`}
                  onDragOver={(e) => build.motherboard && handleDragOver(e, 'storage', `storage-${index}`)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'storage')}
                >
                  {!storage ? (
                    <>
                      <div className="slot-label">
                        {index === 0 ? 'M.2/NVMe' : `SATA ${index}`}
                      </div>
                      <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Пусто</span>
                    </>
                  ) : (
                    <button
                      className="remove-btn"
                      onClick={() => removeStorage(storage.id)}
                      title="Удалить накопитель"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PCCaseView;
