//
//

export type GlobalCommand<G extends string = any> = {
  /**
   * Código do comando que será usado para identificar o comando
   *
   * O código define a configuração no banco de dados
   *
   * Deve ser único em toda a aplicação
   */
  code: string;

  /**
   * Descrição do comando, é a descrição que aparece para o usuário
   * @example "Abrir gaveta"
   * @example "Imprimir venda"
   */
  description: string;

  /**
   * A key segue o seguinte padrão:
   *
   * **ctrl**+**shift**+**alt**+**key**
   *
   * Aonde é obrigatório ter a key, mas os outros são opcionais
   *
   * E os keys precisam ser de acordo com (e: KeyboardEvent).key
   * @example "ctrl+g"
   */
  key?: string;

  /**
   * Grupo para organização dos comandos na visualização dos comandos
   */
  group: G;
};

//
//

/**
 * Função para criar os comandos adicionando o `group` `mutates` o objeto passado para economizar
 * impacto de performance na inicialização da aplicação, caso haja muitos comandos
 *
 * @example
 * ```ts
 * const commands = createCommands('vendas', [
 *   {
 *     code: 'abrir_escolha_comandos',
 *     description: 'Abrir escolha de comandos disponíveis',
 *     key: 'f1',
 *   },
 *   {
 *     code: 'abrir_gaveta',
 *     description: 'Abrir gaveta',
 *     key: 'ctrl+g',
 *   },
 * ]);
 * ```
 *
 * @param group O nome do grupo que os comandos pertencem
 * @param commands Objeto com os comandos
 * @returns Os comandos com os códigos e grupos definidos
 */
export function createGlobalCommands<
  T extends Record<string, Omit<GlobalCommand, 'group' | 'code'>>,
  G extends Readonly<string>,
  K extends keyof T,
>(group: G, commands: T): Record<K, GlobalCommand<G>> {
  for (const key of Object.keys(commands)) {
    (commands[key] as any).code = key;
    (commands[key] as any).group = group;
  }

  return commands as any;
}
