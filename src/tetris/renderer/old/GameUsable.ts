import Game from '../game/Game';
import { Constructor } from '../utils/Mixin';
import { Drawable } from './Renderer';

/**
 * Specifies that this renderer depends on data from a Game.
 * You should only use this mixin if you are looking for data that is available
 * in the Game object only. Use Player/GameStateUsable instead of you are
 * looking for game state or player state
 */
export type GameUsable = Constructor<{
  Game: Game | null;
  ConfigureGame(game: Game): void;
}>;

export default function GameUsable<TBase extends Drawable>(base: TBase): TBase & GameUsable {
  return class GameUsable extends base {
    Game: Game | null;

    constructor(...args: any[]) {
      super(...args);
      this.Game = null;
    }

    ConfigureGame(game: Game): void {
      this.Game = game;
    }
  };
}
