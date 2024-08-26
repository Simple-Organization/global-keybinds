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

  let htmlElement: HTMLElement | null = null;
  let scopes: CommandsScope<Codes>[] = [];

  let flattenedCommands: Record<Codes[number], GlobalCommand> | null = null;
  let keybindsCodes: Record<string, string> | null = null;

  //
  //

  const noop = () => {};

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

    console.log('Reaching here');

    const lastScope: Partial<Record<Codes[number], () => void>> =
      scopes[scopes.length - 1];

    console.log('lastScope', lastScope);

    const code = keybindsCodes![keyStr];

    console.log('code', code);

    const listener: (() => void) | undefined = (lastScope as any)[code];

    console.log('listener', listener);

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
      htmlElement?.addEventListener('keydown', keybindPressed);
    }
  };

  //
  //

  function setContainer(element: HTMLElement | string) {
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
        htmlElement?.removeEventListener('keydown', keybindPressed);
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
  };
}
