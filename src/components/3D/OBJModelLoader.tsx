import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useEffect, useState } from 'react';
import { Group } from 'three';

interface OBJModelLoaderProps {
    modelPath: string; // Путь к .obj файлу, например: '/models/cases/nzxt-h510.obj'
    mtlPath?: string;  // Опционально: путь к .mtl файлу
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
}

/**
 * Компонент для загрузки .obj моделей в 3D сцену
 * 
 * Пример использования:
 * <OBJModelLoader 
 *   modelPath="/models/cases/nzxt-h510.obj"
 *   mtlPath="/models/cases/nzxt-h510.mtl"
 *   position={[0, 0, 0]}
 *   scale={0.01}
 * />
 */
export function OBJModelLoader({
    modelPath,
    mtlPath,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1
}: OBJModelLoaderProps) {
    const [materials, setMaterials] = useState<any>(null);

    // Если есть MTL файл, загружаем материалы
    useEffect(() => {
        if (mtlPath) {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(
                mtlPath,
                (loadedMaterials) => {
                    loadedMaterials.preload();
                    setMaterials(loadedMaterials);
                },
                undefined,
                (error) => {
                    console.error('Ошибка загрузки MTL:', error);
                }
            );
        }
    }, [mtlPath]);

    // Загружаем OBJ модель
    const obj = useLoader(OBJLoader, modelPath, (loader) => {
        if (materials) {
            loader.setMaterials(materials);
        }
    });

    return (
        <primitive
            object={obj}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
}

/**
 * Альтернативный вариант: загрузка с useLoader напрямую
 * Используйте этот вариант для простых моделей без MTL
 */
export function SimpleOBJLoader({ modelPath, position, rotation, scale }: OBJModelLoaderProps) {
    const obj = useLoader(OBJLoader, modelPath);

    return (
        <primitive
            object={obj}
            position={position || [0, 0, 0]}
            rotation={rotation || [0, 0, 0]}
            scale={scale || 1}
        />
    );
}
