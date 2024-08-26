import { GlobalCommand, GlobalCommandGroup } from './GlobalCommand';

//
//

type FlattenCommands<T extends GlobalCommandGroup> = T['codes'];

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

export function createCommandsManager<
  Group extends GlobalCommandGroup,
  ArrayGroups extends Readonly<[...Group[]]>,
  Codes extends FlattenCommands<ArrayGroups[number]>,
>(groups: ArrayGroups): GlobalCommandsManager<Codes> {
  //
  //

  let htmlElement: HTMLElement | null = null;
  let scopes: CommandsScope<Codes>[] = [];

  let flattenedCommands: Record<Codes[number], GlobalCommand> | null = null;
  let keybindsCodes: Record<string, string> | null = null;

  //
  //

  function keybindPressed(e: KeyboardEvent) {
    const keyStr = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${
      e.altKey ? 'alt+' : ''
    }${e.key.toLowerCase()}`;

    if (!keybindsCodes![keyStr]) {
      return;
    }

    const lastScope: Partial<Record<Codes[number], () => void>> =
      scopes[scopes.length - 1];

    const code = keybindsCodes![keyStr];

    const listener: (() => void) | undefined = (lastScope as any)[code];

    if (!listener) {
      return;
    }

    e.preventDefault();
    listener();
  }

  //
  //

  function start() {
    htmlElement?.addEventListener('keydown', keybindPressed);
    getCmds();
  }

  //
  //

  function stop() {
    htmlElement?.removeEventListener('keydown', keybindPressed);
  }

  //
  //

  function setContainer(element: HTMLElement | string) {
    if (typeof element === 'string') {
      htmlElement = document.querySelector(element);
      return;
    }

    if ('addEventListener' in element) {
      htmlElement = element;
      return;
    }

    throw new Error('Invalid container');
  }

  //
  //

  function getCmds(): Record<Codes[number], GlobalCommand> {
    if (flattenedCommands) {
      return flattenedCommands;
    }

    //

    const commandsArray: Record<any, GlobalCommand<any>>[] = [];

    for (const key of Object.keys(groups)) {
      commandsArray.push(groups[key as any].commands);
    }

    const result: Record<Codes[number], GlobalCommand> = commandsArray
      .flatMap((commands) => Object.entries(commands))
      .reduce(
        (acc, [key, value]) => {
          (acc as any)[key] = value;
          return acc;
        },
        {} as Record<Codes[number], GlobalCommand>,
      );

    //

    flattenedCommands = result;
    return flattenedCommands;
  }

  //
  //

  function useScope(scope: CommandsScope<Codes>): () => void {
    if (scopes.length === 0) {
      start();
    }

    scopes.push(scope);

    return () => {
      scopes = scopes.filter((s) => s !== scope);

      if (scopes.length === 0) {
        stop();
      }
    };
  }
  //
  //

  return {
    useScope,
    getCmds,
    setContainer,
  };
}
