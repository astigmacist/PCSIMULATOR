import { PCBuild } from '../types/components';

interface StatusPanelProps {
  build: PCBuild;
  totalPrice: number;
  isComplete: boolean;
}

function StatusPanel({ build, totalPrice, isComplete }: StatusPanelProps) {
  const getTotalRAM = () => {
    return build.ram.reduce((sum, ram) => sum + ram.capacity, 0);
  };

  const getTotalStorage = () => {
    return build.storage.reduce((sum, storage) => sum + storage.capacity, 0);
  };

  const getTotalPowerConsumption = () => {
    let total = 100; // Базовое потребление
    if (build.cpu) total += build.cpu.tdp;
    if (build.gpu) total += build.gpu.powerConsumption;
    total += build.ram.length * 5;
    total += build.storage.length * 5;
    return total;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ru-KZ')}₸`;
  };

  return (
    <div className="status-panel">
      <h3>📊 Статус сборки</h3>
      
      <div className="status-item">
        <span className="status-label">Корпус:</span>
        <span className="status-value">{build.case ? '✅' : '❌'}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Материнская плата:</span>
        <span className="status-value">{build.motherboard ? '✅' : '❌'}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Процессор:</span>
        <span className="status-value">{build.cpu ? '✅' : '❌'}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Оперативная память:</span>
        <span className="status-value">
          {build.ram.length > 0 ? `✅ ${getTotalRAM()}GB` : '❌'}
        </span>
      </div>

      <div className="status-item">
        <span className="status-label">Видеокарта:</span>
        <span className="status-value">{build.gpu ? '✅' : '⚠️ Опционально'}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Накопители:</span>
        <span className="status-value">
          {build.storage.length > 0 ? `✅ ${getTotalStorage()}GB` : '❌'}
        </span>
      </div>

      <div className="status-item">
        <span className="status-label">Блок питания:</span>
        <span className="status-value">{build.psu ? '✅' : '❌'}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Энергопотребление:</span>
        <span className="status-value">
          ~{getTotalPowerConsumption()}W
          {build.psu && ` / ${build.psu.wattage}W`}
        </span>
      </div>

      <div className="total-price">
        Итого: {formatPrice(totalPrice)}
      </div>

      {isComplete && (
        <div className="success-message" style={{ marginTop: '1rem' }}>
          🎉 Сборка завершена! Все основные компоненты установлены.
        </div>
      )}
    </div>
  );
}

export default StatusPanel;

