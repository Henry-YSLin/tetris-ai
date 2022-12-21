import MultiGameState from '../MultiGameState';
import { Constructor } from '../utils/Mixin';
import { Drawable } from './Renderer';

export type MultiGameStateUsable = Constructor<{
  State: MultiGameState | null;
  ConfigureGameState(state: MultiGameState): void;
}>;

export default function MultiGameStateUsable<TBase extends Drawable>(base: TBase): TBase & MultiGameStateUsable {
  return class MultiGameStateUsable extends base {
    State: MultiGameState | null;

    constructor(...args: any[]) {
      super(...args);
      this.State = null;
    }

    ConfigureGameState(state: MultiGameState): void {
      this.State = state;
    }
  };
}
