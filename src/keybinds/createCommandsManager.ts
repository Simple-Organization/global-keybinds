import type {
  CommandsScope,
  GlobalCommand,
  GlobalCommandGroup,
  GlobalCommandsManager,
} from './types';

//
//

type FlattenCommands<T extends GlobalCommandGroup> = T['codes'];

//
//

export function createCommandsManager<
  Group extends GlobalCommandGroup,
  ArrayGroups extends Readonly<[...Group[]]>,
  Codes extends FlattenCommands<ArrayGroups[number]>,
>(groups: ArrayGroups): GlobalCommandsManager<Codes> {
  //
  //

  let htmlElement: Node | null = null;
  let scopes: CommandsScope<Codes>[] = [];

  let flattenedCommands: Record<Codes[number], GlobalCommand> | null = null;
  let keybindsCodes: Record<string, string> | null = null;

  //
  //

  const noop = () => {};

  const getLastScope: () => CommandsScope<Codes> | undefined = () =>
    scopes[scopes.length - 1];

  //
  //

  function keybindPressed(e: KeyboardEvent | string): boolean {
    if (scopes.length === 0) {
      return false;
    }

    let keyStr: string;
    let preventDefault = noop;

    if (typeof e === 'string') {
      keyStr = e;
    } else {
      keyStr = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${
        e.altKey ? 'alt+' : ''
      }${e.key.toLowerCase()}`;

      preventDefault = () => e.preventDefault();
    }

    //

    if (!keybindsCodes || !keybindsCodes[keyStr]) {
      return false;
    }

    const lastScope = getLastScope();

    const code = keybindsCodes![keyStr];

    const listener: (() => void) | undefined = (lastScope as any)[code];

    if (!listener) {
      return false;
    }

    preventDefault();
    listener();

    return true;
  }

  //
  //

  const addListener = () => {
    if (scopes.length === 0) {
      htmlElement?.addEventListener('keydown', keybindPressed as any);
    }
  };

  //
  //

  function setContainer(element: string | Node): void {
    if (typeof element === 'string') {
      htmlElement = document.querySelector(element);
      addListener();
      return;
    }

    if ('addEventListener' in element) {
      htmlElement = element;
      addListener();
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

    keybindsCodes = {};

    const result: Record<Codes[number], GlobalCommand> = commandsArray
      .flatMap((commands) => Object.entries(commands))
      .reduce(
        (acc, [key, value]) => {
          (acc as any)[key] = value;
          keybindsCodes![value.key!] = key;
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

  function getKeybinds(): Record<string, string> {
    getCmds();
    return keybindsCodes!;
  }

  //
  //

  function useScope(scope: CommandsScope<Codes>): () => void {
    addListener();
    getCmds();

    scopes.push(scope);

    return () => {
      scopes = scopes.filter((s) => s !== scope);

      if (scopes.length === 0) {
        htmlElement?.removeEventListener('keydown', keybindPressed as any);
      }
    };
  }
  //
  //

  return {
    useScope,
    setContainer,
    keybindPressed,
    getCmds,
    getKeybinds,
    getScope: getLastScope,
  };
}
