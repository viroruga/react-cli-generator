import inquirer from 'inquirer';
import path from 'path';
import { writeFile } from '../utils/fileUtils';
import { pageTemplates } from '../templates/pageTemplates';
import { getStyleTemplate } from '../templates/styleTemplates';
import { PageTemplateType } from '../templates/pageTemplates';

export interface PageGeneratorOptions {
  name: string;
  subType: PageTemplateType;
  style?: 'css' | 'scss' | 'styled-components' | 'none';
  withLayout?: boolean;
  withData?: boolean;
  withRouter?: boolean;
  path?: string;
}

export const generatePage = async (name: string, subType: PageTemplateType): Promise<void> => {
  const options = await promptPageOptions(name, subType);
  const baseDir = path.join(process.cwd(), 'src', options.path || '');

  // Generar página principal
  writeFile({
    content: pageTemplates[options.subType](name, options),
    filePath: baseDir,
    fileName: name,
    extension: 'tsx',
  });

  // Generar estilos si se seleccionaron
  if (options.style && options.style !== 'none') {
    const styleExt = options.style === 'styled-components' ? 'ts' : options.style;
    writeFile({
      content: getStyleTemplate(name, options.style),
      filePath: baseDir,
      fileName: `${name}.styles`,
      extension: styleExt,
    });
  }

  // Generar archivos adicionales según las opciones
  if (options.withData) {
    writeFile({
      content: generateDataLayer(name),
      filePath: baseDir,
      fileName: `${name}.data`,
      extension: 'ts',
    });
  }

  if (options.withRouter) {
    writeFile({
      content: generateRouteConfig(name),
      filePath: baseDir,
      fileName: `${name}.routes`,
      extension: 'ts',
    });
  }
};

const promptPageOptions = async (
  name: string,
  subType: PageTemplateType
): Promise<PageGeneratorOptions> => {
  const { style, withLayout, withData, withRouter, path } = await inquirer.prompt([
    {
      type: 'list',
      name: 'style',
      message: '¿Qué tipo de estilos quieres usar?',
      choices: [
        { name: 'CSS', value: 'css' },
        { name: 'SCSS', value: 'scss' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Ninguno', value: 'none' },
      ],
    },
    {
      type: 'confirm',
      name: 'withLayout',
      message: '¿Quieres usar un layout específico?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'withData',
      message: '¿Quieres generar una capa de datos?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'withRouter',
      message: '¿Quieres generar configuración de rutas?',
      default: false,
    },
    {
      type: 'input',
      name: 'path',
      message: '¿En qué directorio quieres crearlo? (relativo a src)',
      default: `pages/${subType}s`,
    },
  ]);

  return { name, subType, style, withLayout, withData, withRouter, path };
};

const generateDataLayer = (pageName: string): string => {
  return `import { useState, useEffect } from 'react';

export interface ${pageName}Data {
  // Define los tipos de datos aquí
}

export const use${pageName}Data = () => {
  const [data, setData] = useState<${pageName}Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Implementa tu lógica de fetching aquí
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
`;
};

const generateRouteConfig = (pageName: string): string => {
  return `import { lazy } from 'react';

const ${pageName} = lazy(() => import('./${pageName}'));

export const ${pageName}Routes = [
  {
    path: '/${pageName.toLowerCase()}',
    element: ${pageName},
    children: [
      // Define las rutas hijas aquí
    ]
  }
];
`;
};
