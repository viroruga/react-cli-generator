import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export interface WriteFileOptions {
  content: string;
  filePath: string;
  fileName: string;
  extension: string;
}

export const writeFile = ({ content, filePath, fileName, extension }: WriteFileOptions): void => {
  try {
    fs.mkdirSync(filePath, { recursive: true });
    const fullPath = path.join(filePath, `${fileName}.${extension}`);
    fs.writeFileSync(fullPath, content);
    console.log(chalk.green(`✓ Archivo creado exitosamente en ${fullPath}`));
  } catch (error) {
    console.error(chalk.red(`Error al crear el archivo ${fileName}.${extension}:`), error);
    throw error;
  }
};

export const createDirectory = (dirPath: string): void => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (error) {
    console.error(chalk.red(`Error al crear el directorio ${dirPath}:`), error);
    throw error;
  }
};