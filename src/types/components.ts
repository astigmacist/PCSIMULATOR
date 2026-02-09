// Типы сокетов процессоров
export type CPUSocket = 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700';

// Типы оперативной памяти
export type RAMType = 'DDR3' | 'DDR4' | 'DDR5';

// Типы интерфейсов накопителей
export type StorageInterface = 'SATA' | 'M.2' | 'NVMe';

// Типы форм-факторов
export type FormFactor = 'ATX' | 'Micro-ATX' | 'Mini-ITX';

// Базовый интерфейс для всех комплектующих
export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  image?: string;
  price?: number;
}

// Типы комплектующих
export type ComponentType = 'motherboard' | 'cpu' | 'ram' | 'gpu' | 'psu' | 'storage' | 'case';

// Материнская плата
export interface Motherboard extends Component {
  type: 'motherboard';
  socket: CPUSocket;
  ramType: RAMType;
  ramSlots: number;
  maxRamCapacity: number; // в GB
  pciSlots: number;
  sataSlots: number;
  m2Slots: number;
  formFactor: FormFactor;
  maxTDP: number; // максимальный TDP процессора
}

// Процессор
export interface CPU extends Component {
  type: 'cpu';
  socket: CPUSocket;
  tdp: number; // тепловыделение в ваттах
  cores: number;
  threads: number;
  baseFrequency: number; // в GHz
  manufacturer: 'Intel' | 'AMD';
}

// Оперативная память
export interface RAM extends Component {
  type: 'ram';
  ramType: RAMType;
  capacity: number; // в GB
  frequency: number; // в MHz
  modules: number; // количество планок
}

// Видеокарта
export interface GPU extends Component {
  type: 'gpu';
  powerConsumption: number; // потребление в ваттах
  length: number; // длина в мм
  slots: number; // количество занимаемых слотов
  manufacturer: 'NVIDIA' | 'AMD';
}

// Блок питания
export interface PSU extends Component {
  type: 'psu';
  wattage: number; // мощность в ваттах
  efficiency: '80+ Bronze' | '80+ Silver' | '80+ Gold' | '80+ Platinum';
  modular: boolean;
}

// Накопитель
export interface Storage extends Component {
  type: 'storage';
  interface: StorageInterface;
  capacity: number; // в GB
  readSpeed?: number; // MB/s
  writeSpeed?: number; // MB/s
}

// Корпус
export interface Case extends Component {
  type: 'case';
  formFactor: FormFactor[];
  maxGPULength: number; // максимальная длина видеокарты в мм
  driveBays: number;
}

// Состояние сборки ПК
export interface PCBuild {
  case: Case | null;
  motherboard: Motherboard | null;
  cpu: CPU | null;
  ram: RAM[];
  gpu: GPU | null;
  psu: PSU | null;
  storage: Storage[];
}

// Ошибка совместимости
export interface CompatibilityError {
  component: string;
  reason: string;
  recommendations?: string[];
}

// Результат проверки совместимости
export interface CompatibilityResult {
  compatible: boolean;
  errors: CompatibilityError[];
  warnings?: string[];
}

