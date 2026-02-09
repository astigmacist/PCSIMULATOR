/// <reference types="vite/client" />

// Поддержка импорта JSON файлов
declare module "*.json" {
  const value: any;
  export default value;
}

