# Как использовать свои .obj модели в 3D режиме

## Шаг 1: Подготовка моделей

1. **Поместите файлы** в папку `public/models/`
   - Для корпусов: `public/models/cases/`
   - Для других компонентов: создайте соответствующие папки

2. **Форматы файлов**:
   - `.obj` - основной файл модели (обязательно)
   - `.mtl` - файл материалов (опционально)
   - Текстуры - положите в ту же папку

## Шаг 2: Установка необходимых зависимостей

Для работы с .obj моделями нужно установить загрузчики:

```bash
npm install three
```

Загрузчики `OBJLoader` и `MTLLoader` уже включены в `three/examples/jsm/loaders/`.

## Шаг 3: Использование в коде

### Вариант А: Простая загрузка (только .obj)

```tsx
import { SimpleOBJLoader } from './3D/OBJModelLoader';

// В вашем компоненте:
<SimpleOBJLoader 
  modelPath="/models/cases/my-case.obj"
  position={[0, 0, 0]}
  scale={0.01}  // Отмасштабируйте под ваш размер
/>
```

### Вариант Б: С материалами (.obj + .mtl)

```tsx
import { OBJModelLoader } from './3D/OBJModelLoader';

<OBJModelLoader 
  modelPath="/models/cases/my-case.obj"
  mtlPath="/models/cases/my-case.mtl"
  position={[0, 0, 0]}
  rotation={[0, Math.PI / 4, 0]}
  scale={0.01}
/>
```

## Шаг 4: Интеграция в PCCase3D.tsx

Чтобы использовать вашу модель вместо стандартного корпуса, откройте файл `src/components/3D/PCCase3D.tsx` и замените раздел с корпусом:

```tsx
// Вместо стандартных mesh'ей:
{build.case ? (
  <group position={[0, 0, 0]}>
    {/* Замените это на: */}
    <OBJModelLoader 
      modelPath={`/models/cases/${build.case.model || 'default'}.obj`}
      mtlPath={`/models/cases/${build.case.model || 'default'}.mtl`}
      position={[0, 0, 0]}
      scale={0.01}
    />
  </group>
) : (
  // Пустая сцена без модели
  <group>
    <gridHelper args={[10, 10, 0x4b5563, 0x4b5563]} position={[0, -2.5, 0]} />
  </group>
)}
```

## Шаг 5: Добавление модели в данные компонента

Добавьте поле `model` в данные корпуса в `src/data/pcParts.ts`:

```typescript
export const cases: PCCase[] = [
  {
    id: 1,
    name: "NZXT H510",
    model: "nzxt-h510",  // <- Добавьте это поле
    formFactor: "Mid Tower",
    price: 69.99,
    // ... остальные поля
  },
];
```

## Рекомендации по моделям

- **Масштаб**: 1 unit в модели = 1 см в реальности
- **Полигоны**: Не более 50,000 для производительности
- **Центрирование**: Модель должна быть центрирована в origin (0,0,0)
- **Ориентация**: Передняя часть корпуса смотрит по оси +Z

## Пример структуры файлов

```
public/models/
└── cases/
    ├── nzxt-h510.obj
    ├── nzxt-h510.mtl
    ├── lian-li-011.obj
    ├── lian-li-011.mtl
    └── textures/
        └── metal_texture.jpg
```

## Отладка

Если модель не отображается:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что пути к файлам правильные
3. Попробуйте изменить `scale` (например, от 0.001 до 10)
4. Проверьте, что модель экспортирована правильно (Y-up координаты)
