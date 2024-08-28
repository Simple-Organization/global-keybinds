# global-keybinds

Pacote para o **navegador** com o intuito de criar comandos globais que possam ser exibidos para o usuário

Os comandos são prédefinidos, mas o **global-keybinds** suporta a sobrescrita das teclas para os comandos pelo usuário

Com algumas pequenas configurações, você pode usar o **global-keybinds** em qualquer framework

## Keybinds / GlobalCommands

As **keybinds** devem ser criadas com o tipo `GlobalCommand`

Quando um componente registra seus métodos com `useCommands` (é diferente de acordo com o framework usado que dermos suporte), o comando passa a ficar ativo

### Exemplo de criação de comandos

```ts
import { createCommands } from 'global-keybinds';

// Comandos relacionados a vendas
const salesCmds = createCommands('vendas', [
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
  {
    code: 'comando_sem_tecla',
    description: 'Comando sem tecla definida',
  },
]);
```

### Criando um commandManager com `createCommandsManager`

Nesse exemplo abaixo nós criamos o manager com os comandos `salesCmds` do [exemplo anterior](#exemplo-de-criação-de-comandos), todo tipo de comando criado deve ser adicionado no `commandsManager`

```ts
import { createCommandsManager } from 'global-keybinds';

const commandsManager = createCommandsManager([otherCommands, salesCmds]);
```

Quando a aplicação iniciar chame o método `.setContainer` para que o `commandsManager` defina o único event listener que será usado na aplicação

O 'keydown' só será adicionado, caso algum componente chamou o método [`commandsManager.useScope`](#ativando-os-comandos-adicionando-os-listeners)

Exemplo com `React`

```tsx
import { useEffect } from 'react';
import { commandsManager } from './manager';

function App() {
  useEffect(() => {
    commandsManager.setContainer(document);

    // Ou também
    // commandsManager.setContainer('#app');
  }, []);

  return <div> ... </div>;
}
```

### Ativando os comandos, adicionando os listeners

Com o método `commandsManager.useScope`, se usa um escopo que terá todos os métodos adicionados a ele

O escopo anterior passa a ficar desativado

O exemplo abaixo só ativa alguns métodos no escopo atual, mas desativa todos os outros escopos anteriores até que esse componente seja destruído

```svelte
<script>
import { commandsManager } from './manager';
import { onDestroy } from 'svelte';

const unsub = commandsManager.useScope({
  abrir_escolha_comandos() {
    // Os métodos não recebem argumentos
  },
  abrir_gaveta() {
    // Não registramos a função do comando fechar_gaveta_do_fundo, então por conta disso nesse escopo essa função está desativada
  },
})

onDestroy(unsub);
</script>
```

Todo componente filho que chamar o `useCommands` sobreescreverá todos os comandos dos componentes pais, até que o componente que chamou `useCommands` seja destruído

### Validação das keybinds

Disponibilizamos o método `validateCommands` para validar se os comandos estão seguindo o padrão correto, recomendamos que chame o `validateCommands` em testes automatizados, especialmente se você possui uma quantidade muito grande de comandos, pois se eles não estiverem seguindo o padrão correto, é possível que haja bugs
