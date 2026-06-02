import { useState } from 'react';
import { useBuild } from '../context/BuildContext';
import { ComponentIcon } from './ComponentIcon';
import motherboards from '../data/motherboards.json';
import cpus from '../data/cpus.json';
import rams from '../data/ram.json';
import gpus from '../data/gpus.json';
import psus from '../data/psus.json';
import storages from '../data/storage.json';
import cases from '../data/cases.json';
import {
  Motherboard,
  CPU,
  RAM,
  GPU,
  PSU,
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

function ComponentSelection() {
  const {
    build,
    installMotherboard,
    installCPU,
    installRAM,
    installGPU,
    installPSU,
    installStorage,
    installCase,
  } = useBuild();

  // Состояние для открытых/закрытых категорий
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['case']) // По умолчанию открыт только корпус
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, type: string, data: any) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.setData('componentData', JSON.stringify(data));
    
    // Добавим визуальный эффект
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const handleInstallMotherboard = (mb: Motherboard) => {
    if (!build.case) {
      alert('Сначала выберите корпус!');
      return;
    }
    const error = checkCaseCompatibility(build.case, mb);
    if (error) {
      alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
      return;
    }
    installMotherboard(mb);
  };

  const handleInstallCPU = (cpu: CPU) => {
    if (!build.motherboard) {
      alert('Сначала установите материнскую плату!');
      return;
    }
    const error = checkCPUCompatibility(cpu, build.motherboard);
    if (error) {
      alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
      return;
    }
    installCPU(cpu);
  };

  const handleInstallRAM = (ram: RAM) => {
    if (!build.motherboard) {
      alert('Сначала установите материнскую плату!');
      return;
    }
    const error = checkRAMCompatibility(ram, build.motherboard, build.ram);
    if (error) {
      alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
      return;
    }
    installRAM(ram);
  };

  const handleInstallGPU = (gpu: GPU) => {
    if (!build.motherboard) {
      alert('Сначала установите материнскую плату!');
      return;
    }
    const error = checkGPUCompatibility(gpu, build.motherboard, build.case);
    if (error) {
      alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
      return;
    }
    installGPU(gpu);
  };

  const handleInstallStorage = (storage: Storage) => {
    if (!build.motherboard) {
      alert('Сначала установите материнскую плату!');
      return;
    }
    const error = checkStorageCompatibility(storage, build.motherboard, build.storage);
    if (error) {
      alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
      return;
    }
    installStorage(storage);
  };

  const handleInstallCase = (pcCase: Case) => {
    if (build.motherboard) {
      const error = checkCaseCompatibility(pcCase, build.motherboard);
      if (error) {
        alert(`❌ ${error.reason}\n\n💡 ${error.recommendations?.join('\n')}`);
        return;
      }
    }
    installCase(pcCase);
  };

  return (
    <div className="component-selection">
      <h2>Выбор комплектующих</h2>

      {/* Корпуса */}
      <div className="component-category-accordion">
          <div 
            className="category-header"
            onClick={() => toggleCategory('case')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ComponentIcon type="case" size={24} color="#8b5cf6" />
              <h3 style={{ margin: 0 }}>Корпус</h3>
            </div>
            <span className="expand-icon">{expandedCategories.has('case') ? '▼' : '▶'}</span>
          </div>
          {expandedCategories.has('case') && (
            <div className="component-list">
            {(cases as Case[]).map((pcCase) => (
              <div
                key={pcCase.id}
                className={`component-item ${build.case?.id === pcCase.id ? 'selected' : ''}`}
                draggable
                onClick={() => handleInstallCase(pcCase)}
                onDragStart={(e) => handleDragStart(e, 'case', pcCase)}
                onDragEnd={handleDragEnd}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ComponentIcon type="case" size={32} color="#8b5cf6" />
                  <div className="component-name" style={{ margin: 0 }}>{pcCase.name}</div>
                </div>
                <div className="component-specs">
                  Форм-фактор: {pcCase.formFactor.join(', ')}<br />
                  Макс. длина GPU: {pcCase.maxGPULength}мм
                </div>
              </div>
            ))}
            </div>
          )}
      </div>

      {/* Материнские платы */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('motherboard')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="motherboard" size={24} color="#10b981" />
            <h3 style={{ margin: 0 }}>Материнская плата</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('motherboard') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('motherboard') && (
          <div className="component-list">
          {(motherboards as Motherboard[]).map((mb) => (
            <div
              key={mb.id}
              className={`component-item ${build.motherboard?.id === mb.id ? 'selected' : ''}`}
              draggable
              onClick={() => handleInstallMotherboard(mb)}
              onDragStart={(e) => handleDragStart(e, 'motherboard', mb)}
              onDragEnd={handleDragEnd}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ComponentIcon type="motherboard" size={32} color="#10b981" />
                <div className="component-name" style={{ margin: 0 }}>{mb.name}</div>
              </div>
              <div className="component-specs">
                Сокет: {mb.socket} | RAM: {mb.ramType}<br />
                Форм-фактор: {mb.formFactor}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Процессоры */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('cpu')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="cpu" size={24} color="#6366f1" />
            <h3 style={{ margin: 0 }}>Процессор</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('cpu') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('cpu') && (
          <div className="component-list">
          {(cpus as CPU[]).map((cpu) => {
            const isIncompatible = build.motherboard && cpu.socket !== build.motherboard.socket;
            return (
              <div
                key={cpu.id}
                className={`component-item ${build.cpu?.id === cpu.id ? 'selected' : ''} ${
                  isIncompatible ? 'incompatible' : ''
                }`}
                draggable={!isIncompatible}
                onClick={() => !isIncompatible && handleInstallCPU(cpu)}
                onDragStart={(e) => handleDragStart(e, 'cpu', cpu)}
                onDragEnd={handleDragEnd}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ComponentIcon type="cpu" size={32} color="#6366f1" />
                  <div className="component-name" style={{ margin: 0 }}>{cpu.name}</div>
                </div>
                <div className="component-specs">
                  {cpu.manufacturer} | Сокет: {cpu.socket}<br />
                  {cpu.cores}C/{cpu.threads}T | TDP: {cpu.tdp}W
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Оперативная память */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('ram')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="ram" size={24} color="#14b8a6" />
            <h3 style={{ margin: 0 }}>Оперативная память</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('ram') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('ram') && (
          <div className="component-list">
          {(rams as RAM[]).map((ram) => {
            const isIncompatible = build.motherboard && ram.ramType !== build.motherboard.ramType;
            return (
              <div
                key={ram.id}
                className={`component-item ${
                  build.ram.find((r) => r.id === ram.id) ? 'selected' : ''
                } ${isIncompatible ? 'incompatible' : ''}`}
                draggable={!isIncompatible}
                onClick={() => !isIncompatible && handleInstallRAM(ram)}
                onDragStart={(e) => handleDragStart(e, 'ram', ram)}
                onDragEnd={handleDragEnd}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ComponentIcon type="ram" size={32} color="#14b8a6" />
                  <div className="component-name" style={{ margin: 0 }}>{ram.name}</div>
                </div>
                <div className="component-specs">
                  {ram.ramType} | {ram.capacity}GB ({ram.modules}x{ram.capacity / ram.modules}GB)<br />
                  {ram.frequency}MHz
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Видеокарты */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('gpu')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="gpu" size={24} color="#ef4444" />
            <h3 style={{ margin: 0 }}>Видеокарта</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('gpu') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('gpu') && (
          <div className="component-list">
          {(gpus as GPU[]).map((gpu) => (
            <div
              key={gpu.id}
              className={`component-item ${build.gpu?.id === gpu.id ? 'selected' : ''}`}
              draggable
              onClick={() => handleInstallGPU(gpu)}
              onDragStart={(e) => handleDragStart(e, 'gpu', gpu)}
              onDragEnd={handleDragEnd}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ComponentIcon type="gpu" size={32} color="#ef4444" />
                <div className="component-name" style={{ margin: 0 }}>{gpu.name}</div>
              </div>
              <div className="component-specs">
                {gpu.manufacturer} | Потребление: {gpu.powerConsumption}W<br />
                Длина: {gpu.length}мм | Слотов: {gpu.slots}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Накопители */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('storage')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="storage" size={24} color="#a78bfa" />
            <h3 style={{ margin: 0 }}>Накопители</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('storage') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('storage') && (
          <div className="component-list">
          {(storages as Storage[]).map((storage) => (
            <div
              key={storage.id}
              className={`component-item ${
                build.storage.find((s) => s.id === storage.id) ? 'selected' : ''
              }`}
              draggable
              onClick={() => handleInstallStorage(storage)}
              onDragStart={(e) => handleDragStart(e, 'storage', storage)}
              onDragEnd={handleDragEnd}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ComponentIcon type="storage" size={32} color="#a78bfa" />
                <div className="component-name" style={{ margin: 0 }}>{storage.name}</div>
              </div>
              <div className="component-specs">
                {storage.interface} | {storage.capacity}GB<br />
                {storage.readSpeed && `Чтение: ${storage.readSpeed}MB/s`}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Блоки питания */}
      <div className="component-category-accordion">
        <div 
          className="category-header"
          onClick={() => toggleCategory('psu')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ComponentIcon type="psu" size={24} color="#fbbf24" />
            <h3 style={{ margin: 0 }}>Блок питания</h3>
          </div>
          <span className="expand-icon">{expandedCategories.has('psu') ? '▼' : '▶'}</span>
        </div>
        {expandedCategories.has('psu') && (
          <div className="component-list">
          {(psus as PSU[]).map((psu) => (
            <div
              key={psu.id}
              className={`component-item ${build.psu?.id === psu.id ? 'selected' : ''}`}
              draggable
              onClick={() => installPSU(psu)}
              onDragStart={(e) => handleDragStart(e, 'psu', psu)}
              onDragEnd={handleDragEnd}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ComponentIcon type="psu" size={32} color="#fbbf24" />
                <div className="component-name" style={{ margin: 0 }}>{psu.name}</div>
              </div>
              <div className="component-specs">
                {psu.wattage}W | {psu.efficiency}<br />
                {psu.modular ? 'Модульный' : 'Немодульный'}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComponentSelection;
