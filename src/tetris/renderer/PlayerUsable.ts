import Player from '../player/Player';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { Drawable } from './Renderer';

export type PlayerUsable = Constructor<{
  Player: Player | null,
  ConfigurePlayer(player: Player): void,
}>;

export default function PlayerUsable<TBase extends Drawable>(Base: TBase): TBase & PlayerUsable {
  return class PlayerUsable extends Base {
    Player: Player | null;

    constructor(...args: MixinArgs) {
      super(...args);
      this.Player = null;
    }

    ConfigurePlayer(player: Player): void {
      this.Player = player;
    }
  };
}