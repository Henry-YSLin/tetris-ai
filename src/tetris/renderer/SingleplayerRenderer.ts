import PlayfieldDrawable from './PlayfieldDrawable';
import HoldPieceDrawable from './HoldPieceDrawable';
import PieceQueueDrawable from './PieceQueueDrawable';
import FramerateDrawable from './FramerateDrawable';
import InputHandleable from './InputHandleable';
import BlockSizeConfigurable from './BlockSizeConfigurable';
import Renderer from './Renderer';
import GameState from '../GameState';
import Player from '../player/Player';
import { BLOCK_SIZE } from '../Consts';
import Vector from '../utils/Vector';
export default class SingleplayerRenderer
extends FramerateDrawable(PieceQueueDrawable(HoldPieceDrawable(PlayfieldDrawable(BlockSizeConfigurable(InputHandleable(Renderer))))))
{
  constructor(player: Player, state: GameState, width?: number, height?: number) {
    if (width && height)
      super(state, width, height);
    else
      super(state);
    this.ConfigureInputHandleable(player);
    this.ConfigureBlockSize(BLOCK_SIZE);
    this.ConfigurePlayfieldDrawable(new Vector(120, 0), new Vector(1, 1));
    this.ConfigureHoldPieceDrawable(new Vector(10, 200), new Vector(1, 1));
    this.ConfigurePieceQueueDrawable(new Vector(400, 0), new Vector(0.7, 0.7));
    this.ConfigureFramerateDrawable(new Vector(0, this.height - 10), new Vector(1, 1));
  }
}