import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  PCBuild,
  Motherboard,
  CPU,
  RAM,
  GPU,
  PSU,
  Storage,
  Case,
  CompatibilityResult,
} from '../types/components';
import { checkFullCompatibility } from '../logic/compatibility';

interface BuildEvent {
  type: 'install' | 'remove';
  componentType: string;
  timestamp: number;
}

interface BuildContextType {
  build: PCBuild;
  compatibility: CompatibilityResult;
  buildHistory: BuildEvent[];
  installMotherboard: (mb: Motherboard) => void;
  installCPU: (cpu: CPU) => void;
  installRAM: (ram: RAM) => void;
  removeRAM: (ramId: string) => void;
  installGPU: (gpu: GPU) => void;
  installPSU: (psu: PSU) => void;
  installStorage: (storage: Storage) => void;
  removeStorage: (storageId: string) => void;
  installCase: (pcCase: Case) => void;
  removeComponent: (componentType: string) => void;
  resetBuild: () => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

const initialBuild: PCBuild = {
  case: null,
  motherboard: null,
  cpu: null,
  ram: [],
  gpu: null,
  psu: null,
  storage: [],
};

export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<PCBuild>(initialBuild);
  const [buildHistory, setBuildHistory] = useState<BuildEvent[]>([]);
  const [compatibility, setCompatibility] = useState<CompatibilityResult>({
    compatible: true,
    errors: [],
  });

  // Обновить проверку совместимости
  const updateCompatibility = (newBuild: PCBuild) => {
    const result = checkFullCompatibility(newBuild);
    setCompatibility(result);
  };

  const installMotherboard = (mb: Motherboard) => {
    const newBuild = { ...build, motherboard: mb };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'motherboard', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installCPU = (cpu: CPU) => {
    const newBuild = { ...build, cpu };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'cpu', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installRAM = (ram: RAM) => {
    const newBuild = { ...build, ram: [...build.ram, ram] };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'ram', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const removeRAM = (ramId: string) => {
    const newBuild = { ...build, ram: build.ram.filter((r) => r.id !== ramId) };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'remove', componentType: 'ram', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installGPU = (gpu: GPU) => {
    const newBuild = { ...build, gpu };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'gpu', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installPSU = (psu: PSU) => {
    const newBuild = { ...build, psu };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'psu', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installStorage = (storage: Storage) => {
    const newBuild = { ...build, storage: [...build.storage, storage] };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'storage', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const removeStorage = (storageId: string) => {
    const newBuild = {
      ...build,
      storage: build.storage.filter((s) => s.id !== storageId),
    };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'remove', componentType: 'storage', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const installCase = (pcCase: Case) => {
    const newBuild = { ...build, case: pcCase };
    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'install', componentType: 'case', timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const removeComponent = (componentType: string) => {
    let newBuild = { ...build };

    switch (componentType) {
      case 'motherboard':
        newBuild.motherboard = null;
        break;
      case 'cpu':
        newBuild.cpu = null;
        break;
      case 'gpu':
        newBuild.gpu = null;
        break;
      case 'psu':
        newBuild.psu = null;
        break;
      case 'case':
        newBuild.case = null;
        break;
    }

    setBuild(newBuild);
    setBuildHistory((prev) => [
      ...prev,
      { type: 'remove', componentType, timestamp: Date.now() },
    ]);
    updateCompatibility(newBuild);
  };

  const resetBuild = () => {
    setBuild(initialBuild);
    setCompatibility({ compatible: true, errors: [] });
    setBuildHistory([]);
  };

  return (
    <BuildContext.Provider
      value={{
        build,
        compatibility,
        buildHistory,
        installMotherboard,
        installCPU,
        installRAM,
        removeRAM,
        installGPU,
        installPSU,
        installStorage,
        removeStorage,
        installCase,
        removeComponent,
        resetBuild,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const context = useContext(BuildContext);
  if (context === undefined) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
}

