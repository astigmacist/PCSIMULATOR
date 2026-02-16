# Модели корпусов ПК

## Размещенные модели:

1. **case-1.obj** (16 MB)
   - Путь для загрузки: `/models/cases/case-1.obj`

2. **case-2.obj** (55 MB)
   - Путь для загрузки: `/models/cases/case-2.obj`

3. **case-3.obj** (173 B) ⚠️
   - Путь для загрузки: `/models/cases/case-3.obj`
   - **Внимание**: Файл очень маленький, возможно поврежден

## Использование:

```tsx
import { OBJModelLoader } from '../../../src/components/3D/OBJModelLoader';

<OBJModelLoader 
  modelPath="/models/cases/case-1.obj"
  position={[0, 0, 0]}
  scale={0.01}  // Настройте под размер вашей модели
/>
```

## Интеграция в PCCase3D:

Откройте `src/components/3D/PCCase3D.tsx` и замените стандартные mesh'и на загрузчик моделей.
