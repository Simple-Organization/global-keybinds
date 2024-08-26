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

  //
  //

  test('Must press the keybind and not execute it because it has no listener', () => {
    const manager = createCommandsManager([commands1, commands2]);

    let executed = manager.keybindPressed('ctrl+g');

    //
    // The keybindsCodes does not have the keybind 'ctrl+g' mapped to any command yet

    expect(executed).toBe(false);

    //
    // When execute getCmds, the keybindsCodes will be updated

    manager.getCmds();
    executed = manager.keybindPressed('ctrl+g');

    //
    // Must continue not executing the keybind

    expect(executed).toBe(false);
  });

  //
  //

  test('Must press the keybind and execute it with scope', () => {
    const manager = createCommandsManager([commands1, commands2]);

    let count = 0;

    const unsub = manager.useScope({
      abrir_gaveta: () => {
        count++;
      },
    });

    //
    // Must execute the keybind

    const executed = manager.keybindPressed('ctrl+g');

    expect(executed).toBe(true);
    expect(count).toBe(1);

    unsub();
  });

  //
  //

  test('Must press the keybind and not execute if the scope does not have the method', () => {
    const manager = createCommandsManager([commands1, commands2]);

    let count = 0;

    const unsub = manager.useScope({
      abrir_gaveta: () => {
        count++;
      },
    });

    //
    // Must execute the keybind

    const executed = manager.keybindPressed('f8');

    expect(executed).toBe(false);
    expect(count).toBe(0);

    unsub();
  });

  //
  //

  test('Must not execute the previous scope method', () => {
    const manager = createCommandsManager([commands1, commands2]);

    let countAbrirGaveta = 0;
    let countFecharGaveta = 0;

    const unsub1 = manager.useScope({
      abrir_gaveta: () => {
        countAbrirGaveta++;
      },
    });

    const unsub2 = manager.useScope({
      fechar_gaveta: () => {
        countFecharGaveta++;
      },
    });

    //
    // Must execute the keybind from the current scope

    let executed = manager.keybindPressed('ctrl+a');

    expect(executed).toBe(true);
    expect(countAbrirGaveta).toBe(0);
    expect(countFecharGaveta).toBe(1);

    //
    // Must not execute the keybind from the previous scope

    executed = manager.keybindPressed('ctrl+g');

    expect(executed).toBe(false);
    expect(countAbrirGaveta).toBe(0);
    expect(countFecharGaveta).toBe(1);

    unsub1();
    unsub2();
  });

  //
  //

  test('Must remove the current scope and use the previous', () => {
    const manager = createCommandsManager([commands1, commands2]);

    let countAbrirGaveta = 0;
    let countFecharGaveta = 0;

    const unsub1 = manager.useScope({
      abrir_gaveta: () => {
        countAbrirGaveta++;
      },
    });

    const unsub2 = manager.useScope({
      fechar_gaveta: () => {
        countFecharGaveta++;
      },
    });

    //
    // Must execute the keybind from the current scope

    let executed = manager.keybindPressed('ctrl+g');

    expect(executed).toBe(false);
    expect(countAbrirGaveta).toBe(0);
    expect(countFecharGaveta).toBe(0);

    //
    // Must remove the current scope and use the previous

    unsub2();

    //
    // Must not execute the keybind from the previous scope

    executed = manager.keybindPressed('ctrl+g');

    expect(executed).toBe(true);
    expect(countAbrirGaveta).toBe(1);
    expect(countFecharGaveta).toBe(0);

    unsub1();
  });
});
