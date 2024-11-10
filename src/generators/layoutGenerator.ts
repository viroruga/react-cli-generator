import inquirer from 'inquirer';
import path from 'path';
import { writeFile } from '../utils/fileUtils';
import { layoutTemplates } from '../templates/layoutTemplates';
import { getStyleTemplate } from '../templates/styleTemplates';

export interface LayoutGeneratorOptions {
  name: string;
  subType: string;
  style?: 'css' | 'scss' | 'styled-components' | 'none';
  withNav?: boolean;
  withFooter?: boolean;
  path?: string;
}

export const generateLayout = async (name: string, subType: string): Promise<void> => {
  const options = await promptLayoutOptions(name, subType);
  const baseDir = path.join(process.cwd(), 'src', options.path || '');

  // Generar layout principal
  writeFile({
    content: layoutTemplates[options.subType](name, options),
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

  // Generar componentes adicionales si se necesitan
  if (options.withNav) {
    writeFile({
      content: generateNavComponent(name),
      filePath: baseDir,
      fileName: `${name}Nav`,
      extension: 'tsx'
    });
  }

  if (options.withFooter) {
    writeFile({
      content: generateFooterComponent(name),
      filePath: baseDir,
      fileName: `${name}Footer`,
      extension: 'tsx'
    });
  }
};

const promptLayoutOptions = async (
  name: string,
  subType: string
): Promise<LayoutGeneratorOptions> => {
  const { style, withNav, withFooter, path } = await inquirer.prompt([
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
      name: 'withNav',
      message: '¿Quieres incluir un componente de navegación?',
      default: true
    },
    {
      type: 'confirm',
      name: 'withFooter',
      message: '¿Quieres incluir un componente de footer?',
      default: true
    },
    {
      type: 'input',
      name: 'path',
      message: '¿En qué directorio quieres crearlo? (relativo a src)',
      default: `layouts/${subType}s`
    }
  ]);

  return { name, subType, style, withNav, withFooter, path };
};

const generateNavComponent = (layoutName: string): string => {
  return `import React from 'react';

interface ${layoutName}NavProps {
  // Define las props aquí
}

const ${layoutName}Nav: React.FC<${layoutName}NavProps> = () => {
  return (
    <nav className="${layoutName.toLowerCase()}-nav">
      {/* Agrega tus elementos de navegación aquí */}
    </nav>
  );
};

export default ${layoutName}Nav;
`;
};

const generateFooterComponent = (layoutName: string): string => {
  return `import React from 'react';

interface ${layoutName}FooterProps {
  // Define las props aquí
}

const ${layoutName}Footer: React.FC<${layoutName}FooterProps> = () => {
  return (
    <footer className="${layoutName.toLowerCase()}-footer">
      {/* Agrega tus elementos de footer aquí */}
    </footer>
  );
};

export default ${layoutName}Footer;
`;
};