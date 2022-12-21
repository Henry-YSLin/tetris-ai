import Player from '../player/Player';
import { Constructor } from '../utils/Mixin';
import { Drawable } from './Renderer';

export type PlayerUsable = Constructor<{
  Player: Player | null;
  ConfigurePlayer(player: Player): void;
}>;

export default function PlayerUsable<TBase extends Drawable>(base: TBase): TBase & PlayerUsable {
  return class PlayerUsable extends base {
    Player: Player | null;

    constructor(...args: any[]) {
      super(...args);
      this.Player = null;
    }

    ConfigurePlayer(player: Player): void {
      this.Player = player;
    }
  };
}
