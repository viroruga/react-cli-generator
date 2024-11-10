#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ComponentTemplateType } from './templates/componentTemplates';
import { HookTemplateType } from './templates/hookTemplates';
import { LayoutTemplateType } from './templates/layoutTemplates';
import { PageTemplateType } from './templates/pageTemplates';
import { generateComponent } from './generators/componentGenerator';
import { generateHook } from './generators/hookGenerator';
import { generateLayout } from './generators/layoutGenerator';
import { generatePage } from './generators/pageGenerator';
import { validateComponentName, validateHookName } from './utils/validationUtils';

type GeneratorType = 'component' | 'hook' | 'layout' | 'page';

interface GeneratorOption {
  name: string;
  value: GeneratorType;
  submenu: Array<{
    name: string;
    value: string;
  }>;
}

const generatorTypes: GeneratorOption[] = [
  {
    name: 'Componente',
    value: 'component',
    submenu: [
      { name: 'Componente Básico', value: 'basic' as ComponentTemplateType },
      { name: 'Card', value: 'card' as ComponentTemplateType },
      { name: 'Modal', value: 'modal' as ComponentTemplateType },
      { name: 'Tabla', value: 'table' as ComponentTemplateType },
      { name: 'Lista', value: 'list' as ComponentTemplateType },
      { name: 'Navbar', value: 'navbar' as ComponentTemplateType },
    ],
  },
  {
    name: 'Hook',
    value: 'hook',
    submenu: [
      { name: 'Hook de Estado', value: 'state' as HookTemplateType },
      { name: 'Hook de API', value: 'api' as HookTemplateType },
      { name: 'Hook de Formulario', value: 'form' as HookTemplateType },
      { name: 'Hook de Media Query', value: 'media' as HookTemplateType },
      { name: 'Hook de LocalStorage', value: 'storage' as HookTemplateType },
    ],
  },
  {
    name: 'Layout',
    value: 'layout',
    submenu: [
      { name: 'Layout por Defecto', value: 'default' as LayoutTemplateType },
      { name: 'Layout de Dashboard', value: 'dashboard' as LayoutTemplateType },
      { name: 'Layout de Autenticación', value: 'auth' as LayoutTemplateType },
      { name: 'Layout de Landing', value: 'landing' as LayoutTemplateType },
    ],
  },
  {
    name: 'Página',
    value: 'page',
    submenu: [
      { name: 'Página Básica', value: 'basic' as PageTemplateType },
      { name: 'Página de Detalle', value: 'detail' as PageTemplateType },
      { name: 'Página de Lista', value: 'list' as PageTemplateType },
      { name: 'Página de Dashboard', value: 'dashboard' as PageTemplateType },
    ],
  },
];

interface GenerateOptions {
  path?: string;
  style?: 'css' | 'scss' | 'styled-components' | 'none';
  withTest?: boolean;
}

const generate = async () => {
  try {
    // Primera pregunta: Tipo de generador
    const { generatorType } = await inquirer.prompt<{ generatorType: GeneratorType }>([
      {
        type: 'list',
        name: 'generatorType',
        message: '¿Qué quieres generar?',
        choices: generatorTypes.map((type) => ({
          name: type.name,
          value: type.value,
        })),
      },
    ]);

    // Encuentra el generador seleccionado
    const selectedGenerator = generatorTypes.find((g) => g.value === generatorType);
    if (!selectedGenerator) {
      throw new Error(`Tipo de generador no encontrado: ${generatorType}`);
    }

    // Segunda pregunta: Subtipo
    const { subType } = await inquirer.prompt<{ subType: string }>([
      {
        type: 'list',
        name: 'subType',
        message: `¿Qué tipo de ${generatorType} quieres crear?`,
        choices: selectedGenerator.submenu,
      },
    ]);

    // Tercera pregunta: Nombre
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: '¿Cuál es el nombre?',
        validate: (input: string) => {
          if (generatorType === 'hook') {
            return validateHookName(input);
          }
          return validateComponentName(input);
        },
      },
    ]);

    // Ejecutar el generador correspondiente
    switch (generatorType) {
      case 'component':
        await generateComponent(name, subType as ComponentTemplateType);
        break;
      case 'hook':
        await generateHook(name, subType as HookTemplateType);
        break;
      case 'layout':
        await generateLayout(name, subType as LayoutTemplateType);
        break;
      case 'page':
        await generatePage(name, subType as PageTemplateType);
        break;
      default:
        throw new Error(`Tipo de generador no soportado: ${generatorType}`);
    }

    console.log(chalk.green(`✓ ${generatorType} ${name} creado exitosamente`));
  } catch (error) {
    console.error(
      chalk.red('Error:'),
      error instanceof Error ? error.message : 'Error desconocido'
    );
    process.exit(1);
  }
};

// Configuración del CLI
program
  .name('react-cli')
  .description('CLI para generar componentes React, hooks, contextos y layouts')
  .version('1.0.0');

program
  .command('generate')
  .alias('g')
  .description('Genera un nuevo elemento React')
  .action(generate);

// Error por comando desconocido
program.on('command:*', () => {
  console.error(chalk.red('Error: Comando inválido'));
  console.log('Usa', chalk.green('react-cli --help'), 'para ver los comandos disponibles.');
  process.exit(1);
});

// Manejo de errores general
process.on('uncaughtException', (err) => {
  console.error(chalk.red('Error no controlado:'), err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Promesa no controlada:'), reason);
  process.exit(1);
});

program.parse(process.argv);
