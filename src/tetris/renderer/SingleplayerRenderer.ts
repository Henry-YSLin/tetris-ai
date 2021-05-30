import PlayfieldDrawable from './PlayfieldDrawable';
import InputHandleable from './InputHandleable';
import Renderer from './Renderer';
import { MixinArgs } from '../utils/Mixin';
import GameState from '../GameState';
import Player from '../player/Player';
import { BLOCK_SIZE } from '../Consts';
export default class SingleplayerRenderer extends PlayfieldDrawable(InputHandleable(Renderer)) {
  constructor(player: Player, state: GameState, width?: number, height?: number) {
    // TODO: how to not repeat this?
    if (width && height)
      super(state, width, height);
    else
      super(state);
    this.ConfigureInputHandleable(player);
    this.ConfigurePlayfieldDrawable(BLOCK_SIZE);
  }
}