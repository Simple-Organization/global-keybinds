import { createCommandsManager } from '../src/keybinds/createCommandsManager';
import { createGlobalCommands } from '../src/keybinds/GlobalCommand';

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
