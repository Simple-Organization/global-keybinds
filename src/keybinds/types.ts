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
   * Set a {@link CommandsScope} to be used and all `keydown` events in the {@link GlobalCommandsManager.setContainer setContainer} container
   * will be directed only to that {@link CommandsScope}.
   *
   * @param scope The {@link CommandsScope} to be used in the current moment.
   * @returns A function to stop using the specified {@link scope}.
   */
  useScope(scope: CommandsScope<Codes>): () => void;

  /**
   * Get a record containing all commands registered in the manager.
   */
  getCmds(): Record<Codes[number], GlobalCommand>;

  /**
   * Get a record containing all keybinds registered in the manager mapped by the {@link GlobalCommand.code codes}.
   *
   * This method is useful for testing purposes.
   *
   * ```ts
   * // Example
   * const keybinds = getKeybinds();
   *
   * console.log(keybinds);
   * // {
   * //   'ctrl+g': 'abrir_escolha_comandos',
   * //   'ctrl+p': 'abrir_gaveta',
   * // }
   * ```
   */
  getKeybinds(): Record<string, string>;

  /**
   * Get the current {@link CommandsScope} being used if there is one.
   * @returns The current {@link CommandsScope} being used.
   */
  getScope: () => CommandsScope<Codes> | undefined;

  /**
   * Executes the command that has the keybind pressed using {@link KeyboardEvent}
   *
   * @note That is the `keydown` event that will be listened to
   * @returns If the keybind listener was executed
   */
  keybindPressed(e: KeyboardEvent): boolean;

  /**
   * Executes the command that has the keybind pressed using {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values | KeyboardEvent.key}
   *
   * Using the key combination as a string
   * ```ts
   * // Example
   * `ctrl+shift+alt+key`
   * ```
   *
   * @note That is the `keydown` event that will be listened to
   * @returns If the keybind listener was executed
   */
  keybindPressed(keyStr: string): void;

  /**
   * Set the container where the `keydown` events will be listened to. The {@link document} can be used as a container.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | document.querySelector} method.
   *
   * ```ts
   * // Example
   * setContainer('#container');
   * ```
   *
   * @param selector A string selector to find the container in the
   */
  setContainer(selector: string): void;

  /**
   * Set the container where the `keydown` events will be listened to. The {@link document} can be used as a container.
   *
   * ```ts
   * // Example
   * setContainer(document);
   * setContainer(document.querySelector('#container'));
   * ```
   *
   * @param selector A string selector to find the container in the
   */
  setContainer(element: Node): void;
};

//
//

/**
 * Representa um comando global da aplicação
 *
 * ```ts
 * // Example
 * const command: GlobalCommand = {
 *   code: 'abrir_gaveta',
 *   description: 'Abrir a gaveta de comandos',
 *   key: 'ctrl+g',
 * }
 * ```
 */
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
   * ```ts
   * // Example
   * const command: GlobalCommand = {
   *   code: 'abrir_gaveta',
   *   description: 'Abrir a gaveta de comandos',
   *   group: 'Comandos',
   * }
   * ```
   */
  description: string;

  /**
   * A key segue o seguinte padrão:
   *
   * **ctrl**+**shift**+**alt**+**key**
   *
   * Aonde é obrigatório ter a key, mas os outros são opcionais
   *
   * E os keys precisam ser de acordo com {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values | KeyboardEvent.key}
   */
  key?: string;

  /**
   * Grupo para organização dos comandos na visualização dos comandos
   */
  group: G;
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
