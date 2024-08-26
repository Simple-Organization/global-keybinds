export type CommandDescription = {
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
  group: string;

  /**
   * Se o comando está desativado dependendo da configuração do programa
   *
   * exemplo: Se a configuração do programa não permite venda a prazo, ou desconto na venda
   */
  disabled?: boolean;
};