import { GlobalCommandGroup } from './GlobalCommand';

//
//

type FlattenCommands<T extends GlobalCommandGroup> = T['codes'];

//

export function createUseCommands<
  T extends GlobalCommandGroup,
  I extends Readonly<[...T[]]>,
  F extends FlattenCommands<I[number]>,
>(
  rootEl: HTMLElement,
  groups: I,
): (listeners: Partial<Record<F[number], () => void>>) => void {
  return groups as any;
}
