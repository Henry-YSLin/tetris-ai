import GameState from '../GameState';
import { Constructor } from '../utils/Mixin';
import { Drawable } from './Renderer';

export type GameStateUsable = Constructor<{
  State: GameState | null;
  ConfigureGameState(state: GameState): void;
}>;

export default function GameStateUsable<TBase extends Drawable>(base: TBase): TBase & GameStateUsable {
  return class GameStateUsable extends base {
    State: GameState | null;

    constructor(...args: any[]) {
      super(...args);
      this.State = null;
    }

    ConfigureGameState(state: GameState): void {
      this.State = state;
    }
  };
}
