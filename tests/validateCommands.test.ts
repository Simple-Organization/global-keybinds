import { expect, test } from '@playwright/test';
import { createGlobalCommands } from '../src/keybinds/GlobalCommand';
import { validateCommands } from '../src/keybinds/validateCommands';

//
//

test.describe('validateCommands', () => {
  test('Must validate correctly', () => {
    const commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1',
      },
      {
        code: 'abrir_gaveta',
        description: 'Abrir gaveta',
        key: 'ctrl+g',
      },
    ]);

    //
    // Must throw

    validateCommands(commands);
  });

  //
  //

  test('Must throw because of duplicated commands', () => {
    const commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1',
      },
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir gaveta',
        key: 'ctrl+g',
      },
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError(
      'Duplicated codes abrir_escolha_comandos',
    );
  });

  //
  //

  test('Must throw because of not having description', () => {
    const commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        key: 'f1',
      } as any,
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError(
      'Commands without description abrir_escolha_comandos',
    );
  });

  //
  //

  test('Must throw because of not having code', () => {
    const commands = createGlobalCommands('vendas', [
      {
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1',
      } as any,
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError(
      'Commands without code Abrir escolha de comandos disponíveis',
    );
  });

  //
  //

  test('Must throw because of duplicated key', () => {
    const commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1',
      },
      {
        code: 'abrir_gaveta',
        description: 'Abrir gaveta',
        key: 'f1',
      },
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError('Duplicated keys f1');
  });

  //
  //

  test('Must throw because of invalid keys', () => {
    let commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1+ctrl',
      },
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError(
      'Invalid key(s) f1+ctrl. Keys must follow the pattern in that order ctrl+shift+alt+key. All must be lowercase. And must have a non modifier key',
    );

    //
    //
    commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl',
      },
    ]);

    //
    // Must throw

    expect(() => validateCommands(commands)).toThrowError(
      'Invalid key(s) ctrl. Keys must follow the pattern in that order ctrl+shift+alt+key. All must be lowercase. And must have a non modifier key',
    );

    //
    //
    commands = createGlobalCommands('vendas', [
      {
        code: 'abrir_escolha_comandos1',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl+a',
      },
      {
        code: 'abrir_escolha_comandos2',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl+b',
      },
      {
        code: 'abrir_escolha_comandos3',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl+/',
      },
      {
        code: 'abrir_escolha_comandos4',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl+{',
      },
      {
        code: 'abrir_escolha_comandos5',
        description: 'Abrir escolha de comandos disponíveis',
        key: 'ctrl+.',
      },
    ]);

    //
    // Must not throw

    validateCommands(commands);
  });
});
