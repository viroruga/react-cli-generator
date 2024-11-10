import inquirer from 'inquirer';
import path from 'path';
import { writeFile } from '../utils/fileUtils';
import { componentTemplates } from '../templates/componentTemplates';
import { getStyleTemplate } from '../templates/styleTemplates';
import { getTestTemplate } from '../templates/testTemplates';

export interface ComponentGeneratorOptions {
  name: string;
  subType: string;
  style?: 'css' | 'scss' | 'styled-components' | 'none';
  withTest?: boolean;
  path?: string;
}

export const generateComponent = async (name: string, subType: string): Promise<void> => {
  const options = await promptComponentOptions(name, subType);
  const baseDir = path.join(process.cwd(), 'src', options.path || '');

  // Generar componente principal
  writeFile({
    content: componentTemplates[options.subType](name),
    filePath: baseDir,
    fileName: name,
    extension: 'tsx'
  });

  // Generar estilos si se seleccionaron
  if (options.style && options.style !== 'none') {
    const styleExt = options.style === 'styled-components' ? 'ts' : options.style;
    writeFile({
      content: getStyleTemplate(name, options.style),
      filePath: baseDir,
      fileName: `${name}.styles`,
      extension: styleExt
    });
  }

  // Generar tests si se seleccionaron
  if (options.withTest) {
    writeFile({
      content: getTestTemplate(name),
      filePath: baseDir,
      fileName: `${name}.test`,
      extension: 'tsx'
    });
  }
};

const promptComponentOptions = async (
  name: string,
  subType: string
): Promise<ComponentGeneratorOptions> => {
  const { style, withTest, path } = await inquirer.prompt([
    {
      type: 'list',
      name: 'style',
      message: '¿Qué tipo de estilos quieres usar?',
      choices: [
        { name: 'CSS', value: 'css' },
        { name: 'SCSS', value: 'scss' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Ninguno', value: 'none' }
      ]
    },
    {
      type: 'confirm',
      name: 'withTest',
      message: '¿Quieres generar tests?',
      default: true
    },
    {
      type: 'input',
      name: 'path',
      message: '¿En qué directorio quieres crearlo? (relativo a src)',
      default: `components/${subType}s`
    }
  ]);

  return { name, subType, style, withTest, path };
};