export interface Challenge {
  id: string;
  title: string;
  description: string;
  budget?: number;
  requirements: {
    minCPUCores?: number;
    minRAM?: number;
    requiresGPU?: boolean;
    minStorage?: number;
    maxTDP?: number;
    socket?: string[];
    ramType?: string[];
  };
  hints: string[];
}

export const challenges: Challenge[] = [
  {
    id: 'office_pc',
    title: '💼 Офисный ПК',
    description: 'Соберите бюджетный компьютер для офисной работы',
    budget: 250000,
    requirements: {
      minCPUCores: 4,
      minRAM: 8,
      minStorage: 256,
      requiresGPU: false,
    },
    hints: [
      'Для офисной работы не нужна видеокарта',
      'Выберите процессор с 4-6 ядрами',
      'Достаточно 8-16GB оперативной памяти',
      'SSD на 256-512GB будет оптимальным',
      'Блока питания 500-600W хватит',
    ],
  },
  {
    id: 'gaming_budget',
    title: '🎮 Бюджетный игровой ПК',
    description: 'Соберите недорогой игровой компьютер для популярных игр',
    budget: 400000,
    requirements: {
      minCPUCores: 6,
      minRAM: 16,
      requiresGPU: true,
      minStorage: 512,
    },
    hints: [
      'Выберите процессор с 6 ядрами',
      'Минимум 16GB оперативной памяти DDR4',
      'Видеокарта обязательна для игр',
      'NVMe SSD ускорит загрузку игр',
      'Блок питания минимум 600W',
    ],
  },
  {
    id: 'gaming_high',
    title: '🚀 Мощный игровой ПК',
    description: 'Соберите топовый компьютер для игр в высоком качестве',
    budget: 700000,
    requirements: {
      minCPUCores: 8,
      minRAM: 32,
      requiresGPU: true,
      minStorage: 1000,
    },
    hints: [
      'Процессор минимум 8 ядер для современных игр',
      '32GB DDR5 памяти для максимальной производительности',
      'Мощная видеокарта RTX 4070 или RX 7800 XT',
      'Быстрый NVMe SSD на 1-2TB',
      'Блок питания 750-850W',
    ],
  },
  {
    id: 'workstation',
    title: '💻 Рабочая станция',
    description: 'Соберите ПК для работы с графикой, видео и 3D',
    budget: 800000,
    requirements: {
      minCPUCores: 12,
      minRAM: 64,
      requiresGPU: true,
      minStorage: 2000,
    },
    hints: [
      'Процессор с 12+ ядрами для рендеринга',
      'Минимум 64GB памяти для работы с большими файлами',
      'Мощная видеокарта для ускорения рендеринга',
      'Несколько накопителей: быстрый NVMe + большой SATA',
      'Надежный блок питания 850W+',
    ],
  },
];

