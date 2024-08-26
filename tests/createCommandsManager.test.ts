import { createCommandsManager } from '../src/keybinds/createCommandsManager';
import { expect, test } from '@playwright/test';
import { createGlobalCommands } from '../src/keybinds/createGlobalCommands';

//
//

test.describe('createCommandsManager', () => {
  const commands1 = createGlobalCommands('vendas', {
    abrir_escolha_comandos: {
      description: 'Abrir escolha de comandos disponíveis',
      key: 'f1',
    },
    abrir_gaveta: {
      description: 'Abrir gaveta',
      key: 'ctrl+g',
    },
  });

  const commands2 = createGlobalCommands('vendas', {
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
});

//
//

const cmd1 = createGlobalCommands('vendas', {
  abrir_escolha_comandos: {
    description: 'Abrir escolha de comandos disponíveis',
    key: 'f1',
  },
});

const commands = createGlobalCommands('vendas', {
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

const cmd2 = createGlobalCommands('caixa', {
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
