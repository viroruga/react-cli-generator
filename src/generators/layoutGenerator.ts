import inquirer from 'inquirer';
import path from 'path';
import { writeFile } from '../utils/fileUtils';
import { layoutTemplates, LayoutTemplateType } from '../templates/layoutTemplates';
import { getStyleTemplate } from '../templates/styleTemplates';

export interface LayoutGeneratorOptions {
  name: string;
  subType: LayoutTemplateType;
  style?: 'css' | 'scss' | 'styled-components' | 'none';
  withNav?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
  path?: string;
}

export const generateLayout = async (name: string, subType: LayoutTemplateType): Promise<void> => {
  const options = await promptLayoutOptions(name, subType);
  const baseDir = path.join(process.cwd(), 'src', options.path || '');

  // Generar layout principal
  writeFile({
    content: layoutTemplates[options.subType](name, {
      withNav: options.withNav,
      withFooter: options.withFooter,
      withSidebar: options.withSidebar
    }),
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
  subType: LayoutTemplateType
): Promise<LayoutGeneratorOptions> => {
  const { style, withNav, withFooter, withSidebar, path } = await inquirer.prompt([
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
      type: 'confirm',
      name: 'withSidebar',
      message: '¿Quieres incluir una barra lateral?',
      default: subType === 'dashboard'
    },
    {
      type: 'input',
      name: 'path',
      message: '¿En qué directorio quieres crearlo? (relativo a src)',
      default: `layouts/${subType}s`
    }
  ]);

  return { name, subType, style, withNav, withFooter, withSidebar, path };
};

const generateNavComponent = (layoutName: string): string => `import React from 'react';

interface ${layoutName}NavProps {
  className?: string;
}

const ${layoutName}Nav: React.FC<${layoutName}NavProps> = ({ className = '' }) => {
  return (
    <nav className={\`${layoutName.toLowerCase()}-nav \${className}\`}>
      {/* Agrega tus elementos de navegación aquí */}
    </nav>
  );
};

export default ${layoutName}Nav;
`;

const generateFooterComponent = (layoutName: string): string => `import React from 'react';

interface ${layoutName}FooterProps {
  className?: string;
}

const ${layoutName}Footer: React.FC<${layoutName}FooterProps> = ({ className = '' }) => {
  return (
    <footer className={\`${layoutName.toLowerCase()}-footer \${className}\`}>
      {/* Agrega tus elementos de footer aquí */}
    </footer>
  );
};

export default ${layoutName}Footer;
`;