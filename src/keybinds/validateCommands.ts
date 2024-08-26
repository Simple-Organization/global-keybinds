import type { GlobalCommand, GlobalCommandGroup } from './types';

//
//

export function validateCommands(
  commands: GlobalCommand[] | GlobalCommandGroup,
) {
  if (
    typeof commands === 'object' &&
    !Array.isArray(commands) &&
    commands != null
  ) {
    commands = Object.values(commands.commands);
  }

  //
  const codes = commands.map((command) => command.code);
  const keys = commands
    .map((command) => command.key)
    .filter((key) => !!key) as string[];

  //
  // Without description
  const withoutDescription = commands.filter((command) => !command.description);

  if (withoutDescription.length > 0) {
    throw new Error(
      `Commands without description ${withoutDescription
        .map((command) => command.code)
        .join(', ')}`,
    );
  }

  //
  // Check if there are duplicated keys
  const duplicatedKeys = keys.filter(
    (key, index) => keys.indexOf(key) !== index,
  );

  if (duplicatedKeys.length > 0) {
    throwDuplicated('keys', duplicatedKeys);
  }

  //
  // Validates if the codes are following the pattern
  // lowercase letters, numbers and underscores, starting with a letter
  const codePattern = /^[a-z][a-z0-9_]*$/;

  const invalidCodes = codes.filter((code) => !codePattern.test(code));

  if (invalidCodes.length > 0) {
    throw new Error(
      `Invalid codes ${invalidCodes.join(
        ', ',
      )}. Codes must be lowercase letters, numbers and underscores, starting with a letter`,
    );
  }

  //
  // Validates if the keys are following the pattern
  // ctrl+shift+alt+key

  const invalidKeys = keys.filter((key) => !keyTest(key));

  if (invalidKeys.length > 0) {
    throw new Error(
      `Invalid key(s) ${invalidKeys.join(
        ', ',
      )}. Keys must follow the pattern in that order ctrl+shift+alt+key. All must be lowercase. And must have a non modifier key`,
    );
  }
}

//
//

export function keyTest(key: string): boolean {
  let splitted = key.split('+');

  // Verifica se há mais de 3 + na key
  if (splitted.length > 4) {
    return false;
  }

  const keys: Record<string, string> = {};

  //

  let standardKey: string = '';

  //

  for (const key of splitted) {
    if (key === 'ctrl' || key === 'shift' || key === 'alt') {
      if (keys[key]) {
        return false;
      }

      keys[key] = key;
      continue;
    }

    if (standardKey) {
      return false;
    }

    standardKey = key;
  }

  //

  const keyStr = `${keys.ctrl ? 'ctrl+' : ''}${keys.shift ? 'shift+' : ''}${
    keys.alt ? 'alt+' : ''
  }${standardKey.toLowerCase()}`;

  //

  if (keyStr !== key) {
    return false;
  }

  //

  return true;
}

//
//

function throwDuplicated(varName: string, duplicated: string[]) {
  throw new Error(`Duplicated ${varName} ${duplicated.join(', ')}`);
}
