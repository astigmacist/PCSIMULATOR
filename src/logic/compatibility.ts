import {
  PCBuild,
  CPU,
  RAM,
  GPU,
  Storage,
  Motherboard,
  PSU,
  Case,
  CompatibilityResult,
  CompatibilityError,
} from '../types/components';

// Проверка совместимости процессора с материнской платой
export function checkCPUCompatibility(
  cpu: CPU,
  motherboard: Motherboard
): CompatibilityError | null {
  // Проверка сокета
  if (cpu.socket !== motherboard.socket) {
    return {
      component: cpu.name,
      reason: `Процессор имеет сокет ${cpu.socket}, но материнская плата поддерживает ${motherboard.socket}`,
      recommendations: [`Выберите процессор с сокетом ${motherboard.socket}`],
    };
  }

  // Проверка TDP
  if (cpu.tdp > motherboard.maxTDP) {
    return {
      component: cpu.name,
      reason: `TDP процессора (${cpu.tdp}W) превышает максимально поддерживаемый материнской платой (${motherboard.maxTDP}W)`,
      recommendations: [
        `Выберите процессор с TDP не более ${motherboard.maxTDP}W`,
        'Или выберите более мощную материнскую плату',
      ],
    };
  }

  return null;
}

// Проверка совместимости оперативной памяти
export function checkRAMCompatibility(
  ram: RAM,
  motherboard: Motherboard,
  currentRAM: RAM[]
): CompatibilityError | null {
  // Проверка типа памяти
  if (ram.ramType !== motherboard.ramType) {
    return {
      component: ram.name,
      reason: `Тип памяти ${ram.ramType} несовместим с материнской платой (поддерживает ${motherboard.ramType})`,
      recommendations: [`Выберите память типа ${motherboard.ramType}`],
    };
  }

  // Проверка количества слотов
  const totalModules = currentRAM.reduce((sum, r) => sum + r.modules, 0) + ram.modules;
  if (totalModules > motherboard.ramSlots) {
    return {
      component: ram.name,
      reason: `Недостаточно слотов памяти. Доступно: ${motherboard.ramSlots}, требуется: ${totalModules}`,
      recommendations: ['Удалите часть установленной памяти', 'Выберите модули с меньшим количеством планок'],
    };
  }

  // Проверка максимального объема
  const totalCapacity = currentRAM.reduce((sum, r) => sum + r.capacity, 0) + ram.capacity;
  if (totalCapacity > motherboard.maxRamCapacity) {
    return {
      component: ram.name,
      reason: `Превышен максимальный объем памяти. Максимум: ${motherboard.maxRamCapacity}GB, устанавливается: ${totalCapacity}GB`,
      recommendations: [`Выберите модули с меньшим объемом`],
    };
  }

  return null;
}

// Проверка совместимости видеокарты
export function checkGPUCompatibility(
  gpu: GPU,
  motherboard: Motherboard,
  pcCase: Case | null
): CompatibilityError | null {
  // Проверка количества PCI слотов
  if (gpu.slots > motherboard.pciSlots) {
    return {
      component: gpu.name,
      reason: `Видеокарта занимает ${gpu.slots} слота, но на материнской плате доступно только ${motherboard.pciSlots}`,
      recommendations: ['Выберите более компактную видеокарту', 'Выберите материнскую плату с большим количеством слотов'],
    };
  }

  // Проверка размера относительно корпуса
  if (pcCase && gpu.length > pcCase.maxGPULength) {
    return {
      component: gpu.name,
      reason: `Длина видеокарты (${gpu.length}мм) превышает максимально допустимую для корпуса (${pcCase.maxGPULength}мм)`,
      recommendations: ['Выберите более короткую видеокарту', 'Выберите корпус большего размера'],
    };
  }

  return null;
}

// Проверка совместимости накопителя
export function checkStorageCompatibility(
  storage: Storage,
  motherboard: Motherboard,
  currentStorage: Storage[]
): CompatibilityError | null {
  // Подсчет используемых слотов
  const sataCount = currentStorage.filter((s) => s.interface === 'SATA').length;
  const m2Count = currentStorage.filter((s) => s.interface === 'NVMe' || s.interface === 'M.2').length;

  if (storage.interface === 'SATA') {
    if (sataCount >= motherboard.sataSlots) {
      return {
        component: storage.name,
        reason: `Все SATA слоты заняты (доступно: ${motherboard.sataSlots})`,
        recommendations: ['Удалите один из SATA накопителей', 'Выберите NVMe накопитель'],
      };
    }
  }

  if (storage.interface === 'NVMe' || storage.interface === 'M.2') {
    if (m2Count >= motherboard.m2Slots) {
      return {
        component: storage.name,
        reason: `Все M.2 слоты заняты (доступно: ${motherboard.m2Slots})`,
        recommendations: ['Удалите один из M.2 накопителей', 'Выберите SATA накопитель'],
      };
    }
  }

  return null;
}

// Проверка достаточности мощности блока питания
export function checkPowerSupply(build: PCBuild): CompatibilityError | null {
  if (!build.psu) return null;

  let totalPower = 0;

  // Базовое потребление системы (материнская плата, кулеры и т.д.)
  totalPower += 100;

  // Процессор
  if (build.cpu) {
    totalPower += build.cpu.tdp;
  }

  // Видеокарта
  if (build.gpu) {
    totalPower += build.gpu.powerConsumption;
  }

  // Оперативная память (примерно 3W на модуль)
  totalPower += build.ram.reduce((sum, r) => sum + r.modules * 3, 0);

  // Накопители (примерно 5W на каждый)
  totalPower += build.storage.length * 5;

  // Рекомендуемый запас 20%
  const recommendedPower = Math.ceil(totalPower * 1.2);

  if (build.psu.wattage < recommendedPower) {
    return {
      component: build.psu.name,
      reason: `Недостаточная мощность блока питания. Требуется минимум ${recommendedPower}W, доступно: ${build.psu.wattage}W`,
      recommendations: [
        `Выберите блок питания мощностью не менее ${recommendedPower}W`,
        'Или уменьшите энергопотребление компонентов',
      ],
    };
  }

  return null;
}

// Проверка совместимости корпуса с материнской платой
export function checkCaseCompatibility(
  pcCase: Case,
  motherboard: Motherboard
): CompatibilityError | null {
  if (!pcCase.formFactor.includes(motherboard.formFactor)) {
    return {
      component: pcCase.name,
      reason: `Форм-фактор материнской платы (${motherboard.formFactor}) несовместим с корпусом`,
      recommendations: [
        `Выберите корпус, поддерживающий ${motherboard.formFactor}`,
        'Или выберите материнскую плату с другим форм-фактором',
      ],
    };
  }

  return null;
}

// Полная проверка всей сборки
export function checkFullCompatibility(build: PCBuild): CompatibilityResult {
  const errors: CompatibilityError[] = [];
  const warnings: string[] = [];

  // Если нет материнской платы, проверять нечего
  if (!build.motherboard) {
    return {
      compatible: true,
      errors: [],
      warnings: ['Установите материнскую плату для начала сборки'],
    };
  }

  // Проверка процессора
  if (build.cpu) {
    const cpuError = checkCPUCompatibility(build.cpu, build.motherboard);
    if (cpuError) errors.push(cpuError);
  } else {
    warnings.push('Процессор не установлен');
  }

  // Проверка оперативной памяти
  if (build.ram.length > 0) {
    build.ram.forEach((ram) => {
      const ramError = checkRAMCompatibility(ram, build.motherboard!, build.ram.filter(r => r.id !== ram.id));
      if (ramError) errors.push(ramError);
    });
  } else {
    warnings.push('Оперативная память не установлена');
  }

  // Проверка видеокарты
  if (build.gpu) {
    const gpuError = checkGPUCompatibility(build.gpu, build.motherboard, build.case);
    if (gpuError) errors.push(gpuError);
  }

  // Проверка накопителей
  if (build.storage.length > 0) {
    build.storage.forEach((storage) => {
      const storageError = checkStorageCompatibility(storage, build.motherboard!, build.storage.filter(s => s.id !== storage.id));
      if (storageError) errors.push(storageError);
    });
  } else {
    warnings.push('Накопитель не установлен');
  }

  // Проверка блока питания
  if (build.psu) {
    const psuError = checkPowerSupply(build);
    if (psuError) errors.push(psuError);
  } else {
    warnings.push('Блок питания не установлен');
  }

  // Проверка корпуса
  if (build.case) {
    const caseError = checkCaseCompatibility(build.case, build.motherboard);
    if (caseError) errors.push(caseError);
  } else {
    warnings.push('Корпус не выбран');
  }

  return {
    compatible: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// Вычисление общей стоимости сборки
export function calculateTotalPrice(build: PCBuild): number {
  let total = 0;

  if (build.case?.price) total += build.case.price;
  if (build.motherboard?.price) total += build.motherboard.price;
  if (build.cpu?.price) total += build.cpu.price;
  if (build.gpu?.price) total += build.gpu.price;
  if (build.psu?.price) total += build.psu.price;

  build.ram.forEach((ram) => {
    if (ram.price) total += ram.price;
  });

  build.storage.forEach((storage) => {
    if (storage.price) total += storage.price;
  });

  return total;
}

