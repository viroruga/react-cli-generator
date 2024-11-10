import inquirer from 'inquirer';
import path from 'path';
import { writeFile } from '../utils/fileUtils';
import { hookTemplates, HookTemplateType } from '../templates/hookTemplates';
import { getTestTemplate } from '../templates/testTemplates';

export interface HookGeneratorOptions {
  name: string;
  subType: HookTemplateType;
  withTest?: boolean;
  path?: string;
  withTypes?: boolean;
}

export const generateHook = async (name: string, subType: HookTemplateType): Promise<void> => {
  const options = await promptHookOptions(name, subType);
  const baseDir = path.join(process.cwd(), 'src', options.path || '');

  // Generar hook principal
  writeFile({
    content: hookTemplates[options.subType](name, {
      withTypes: options.withTypes,
    }),
    filePath: baseDir,
    fileName: name,
    extension: 'ts',
  });

  // Generar tests si se seleccionaron
  if (options.withTest) {
    writeFile({
      content: getTestTemplate(name, 'hook'),
      filePath: baseDir,
      fileName: `${name}.test`,
      extension: 'ts',
    });
  }

  // Generar tipos si se seleccionaron
  if (options.withTypes) {
    writeFile({
      content: generateHookTypes(name),
      filePath: baseDir,
      fileName: `${name}.types`,
      extension: 'ts',
    });
  }
};

// Aquí está la corrección: cambiar string por HookTemplateType
const promptHookOptions = async (
  name: string,
  subType: HookTemplateType // Cambio de string a HookTemplateType
): Promise<HookGeneratorOptions> => {
  const { withTest, withTypes, path } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'withTest',
      message: '¿Quieres generar tests?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'withTypes',
      message: '¿Quieres generar un archivo de tipos separado?',
      default: false,
    },
    {
      type: 'input',
      name: 'path',
      message: '¿En qué directorio quieres crearlo? (relativo a src)',
      default: `hooks/${subType}s`,
    },
  ]);

  return { name, subType, withTest, withTypes, path };
};

const generateHookTypes = (name: string): string => {
  return `export interface ${name}Props {
  // Define las props del hook aquí
}

export interface ${name}Return {
  // Define el tipo de retorno del hook aquí
}
`;
};
