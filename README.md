# global-keybinds

Pacote para o **navegador** com o intuito de criar comandos globais que possam ser exibidos para o usuário

## Keybinds / GlobalCommands

As **keybinds** devem ser criadas como `GlobalCommand`

Quando um componente registra seus métodos com `useCommands` (é diferente de acordo com o framework usado que dermos suporte), o comando passa a ficar ativo

### Exemplo de criação de comandos

```ts
import { createGlobalCommands } from 'global-keybinds';

// Comandos relacionados a vendas
const salesCmds = createGlobalCommands('vendas', [
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
    code: 'fechar_gaveta_do_fundo',
    description: 'Fechar gaveta do fundo',
    key: 'ctrl+l',
  },
]);
```

### Criando o `useCommands`

Primeiro precisamos criar o `useCommands` com o `root` da aplicação, pode ser a `div` usada, ou o `document`

A intenção é de se só utilizar um `root.addEventListener('keydown')` para toda a aplicação

```ts
import { createUseCommands } from 'global-keybinds/svelte'; // Damos suporte ao preact também

const appDiv = document.getElementById('app');

const useCommands = createUseCommands(appDiv, [...otherCommands, salesCmds]);
```

### Usando o `useCommands`

```svelte
<script>
import { useCommands } from '../somewhere'

useCommands({
  abrir_escolha_comandos() {
    // Os métodos não recebem argumentos
  },
  abrir_gaveta() {
    // Não registramos a função do comando fechar_gaveta_do_fundo, então por conta disso nesse escopo essa função está desativada
  },
})
</script>
```

Todo componente filho que chamar o `useCommands` sobreescreverá todos os comandos dos componentes pais, até que o componente que chamou `useCommands` seja destruído

### Validação das keybinds

Disponibilizamos o método `validateCommands` para validar se os comandos estão seguindo o padrão correto, recomendamos que chame o `validateCommands` em testes automatizados, especialmente se você possui uma quantidade muito grande de comandos, pois se eles não estiverem seguindo o padrão correto, é possível que haja bugs
