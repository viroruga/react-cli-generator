#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import { generatorTypes } from './constants/menuOptions';
import { generateComponent } from './generators/componentGenerator';
import { generateHook } from './generators/hookGenerator';
import { generateLayout } from './generators/layoutGenerator';
import { generatePage } from './generators/pageGenerator';
import { getValidationMessage } from './utils/validationUtils';

const generate = async () => {
  try {
    // Primera pregunta: Tipo de generador
    const { generatorType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'generatorType',
        message: '¿Qué quieres generar?',
        choices: generatorTypes
      }
    ]);

    // Encuentra el generador seleccionado
    const selectedGenerator = generatorTypes.find(g => g.value === generatorType);

    // Segunda pregunta: Subtipo
    const { subType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'subType',
        message: `¿Qué tipo de ${generatorType} quieres crear?`,
        choices: selectedGenerator?.submenu || []
      }
    ]);

    // Tercera pregunta: Nombre
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '¿Cuál es el nombre?',
        validate: (input: string) => getValidationMessage(generatorType, input)
      }
    ]);

    // Ejecutar el generador correspondiente
    switch (generatorType) {
      case 'component':
        await generateComponent(name, subType);
        break;
      case 'hook':
        await generateHook(name, subType);
        break;
      case 'layout':
        await generateLayout(name, subType);
        break;
      case 'page':
        await generatePage(name, subType);
        break;
      default:
        throw new Error(`Tipo de generador no soportado: ${generatorType}`);
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

program
  .name('react-cli')
  .description('CLI para generar componentes React')
  .version('1.0.0');

program
  .command('generate')
  .alias('g')
  .description('Genera un nuevo elemento React')
  .action(generate);

program.parse(process.argv);