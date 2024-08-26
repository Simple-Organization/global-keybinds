import type { GlobalCommand, GlobalCommandGroup } from './types';

/**
 * Função para criar os comandos adicionando o {@link GlobalCommand.group} e o {@link GlobalCommand.code} ao objeto passado para economizar
 * impacto de performance na inicialização da aplicação, caso haja muitos comandos
 *
 * > **Important:** mutates the object passed to economize performance, it is the only function that does this in the library
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
export function createCommands<
  T extends Record<string, Omit<GlobalCommand, 'group' | 'code'>>,
  G extends Readonly<string>,
  K extends keyof T & string,
>(group: G, commands: T): GlobalCommandGroup<G, K[]> {
  const keys = Object.keys(commands);

  //
  //

  const _group: GlobalCommandGroup<G, any> = {
    group,
    codes: keys,
    commands: commands as any,
  };

  //
  //

  for (const key of keys) {
    (commands[key] as any).code = key;
    (commands[key] as any).group = group;
  }

  //
  //

  return _group;
}
