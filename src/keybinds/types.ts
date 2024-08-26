//
//

/**
 * A record containing all commands that will be used. Only one scope can be used at a time.
 */
export type CommandsScope<Codes extends string[]> = Partial<
  Record<Codes[number], () => void>
>;

//
//

export type GlobalCommandsManager<Codes extends string[]> = {
  /**
   * Use a {@link CommandsScope} and all `keydown` events in the {@link GlobalCommandsManager.setContainer} container
   * will be directed only to that {@link CommandsScope}.
   *
   * @param scope The {@link CommandsScope} to be used in the current moment.
   * @returns A function to stop using the specified {@link scope}.
   */
  useScope(scope: CommandsScope<Codes>): () => void;
  getCmds(): Record<Codes[number], GlobalCommand>;
  setContainer(selector: string): void;
  setContainer(element: HTMLElement): void;
};

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
  group: GlobalCommandGroup<G>;
};

//
//

export type GlobalCommandGroup<
  G extends string = any,
  K extends string[] = any,
> = {
  /**
   * Grupo para organização dos comandos na visualização dos comandos
   */
  group: G;

  /**
   * Codes dos comandos do grupo
   */
  codes: K;

  /**
   * Comandos do grupo
   */
  commands: Record<K[number], GlobalCommand<G>>;
};

//
//
