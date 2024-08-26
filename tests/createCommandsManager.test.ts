import { createCommandsManager } from '../src/keybinds/createCommandsManager';
import { expect, test } from '@playwright/test';
import { createCommands } from '../src/keybinds/createCommands';

//
//

test.describe('createCommandsManager', () => {
  const commands1 = createCommands('vendas', {
    abrir_escolha_comandos: {
      description: 'Abrir escolha de comandos disponíveis',
      key: 'f1',
    },
    abrir_gaveta: {
      description: 'Abrir gaveta',
      key: 'ctrl+g',
    },
  });

  const commands2 = createCommands('vendas', {
    fechar_gaveta: {
      description: 'Fechar gaveta',
      key: 'ctrl+a',
    },
  });

  //
  //

  test('Must call createCommandsManager work correctly', () => {
    createCommandsManager([commands1]);
  });

  //
  //

  test('Must get the commands correctly', () => {
    const manager = createCommandsManager([commands1, commands2]);

    //
    //

    const cmds = manager.getCmds();

    //

    expect(cmds).toEqual({
      abrir_escolha_comandos: {
        description: 'Abrir escolha de comandos disponíveis',
        key: 'f1',
        group: 'vendas',
        code: 'abrir_escolha_comandos',
      },
      abrir_gaveta: {
        description: 'Abrir gaveta',
        key: 'ctrl+g',
        group: 'vendas',
        code: 'abrir_gaveta',
      },
      fechar_gaveta: {
        description: 'Fechar gaveta',
        key: 'ctrl+a',
        group: 'vendas',
        code: 'fechar_gaveta',
      },
    });
  });

  //
  //

  test('Must get the keybinds correctly', () => {
    const manager = createCommandsManager([commands1, commands2]);

    //
    //

    const cmds = manager.getKeybinds();

    //

    expect(cmds).toEqual({
      f1: 'abrir_escolha_comandos',
      'ctrl+g': 'abrir_gaveta',
      'ctrl+a': 'fechar_gaveta',
    });
  });
});

//
//

const cmd1 = createCommands('vendas', {
  abrir_escolha_comandos: {
    description: 'Abrir escolha de comandos disponíveis',
    key: 'f1',
  },
});

const commands = createCommands('vendas', {
  abrir_escolha_comandos4: {
    description: 'Abrir escolha de comandos disponíveis',
    key: 'f1',
  },
  abrir_gaveta: {
    description: 'Abrir gaveta',
    key: 'ctrl+g',
  },
});

//
//

const cmd2 = createCommands('caixa', {
  fechar_caixa: {
    description: 'Abrir escolha de comandos disponíveis',
    key: 'f1',
  },
  abrir_caixa: {
    description: 'Abrir escolha de comandos disponíveis',
    key: 'f1',
  },
});

//
//

const manager = createCommandsManager([cmd1, cmd2, commands]);

manager.useScope({
  abrir_caixa: () => {
    console.log('abrir_caixa');
  },
});
