import MultiplayerGame, { Participant } from '../game/MultiplayerGame';
import Vector from '../utils/Vector';
import FramerateDrawable from './components/drawables/FramerateDrawable';
import GameEventTextDrawable from './components/drawables/GameEventTextDrawable';
import GarbageMeterDrawable from './components/drawables/GarbageMeterDrawable';
import HoldPieceDrawable from './components/drawables/HoldPieceDrawable';
import PieceQueueDrawable from './components/drawables/PieceQueueDrawable';
import PlayfieldDrawable from './components/drawables/PlayfieldDrawable';
import DisableInputHandler from './components/inputHandler/DisableInputHandler';
import GameEventSfxPlayer from './components/sounds/GameEventSfxPlayer';
import GameEventVoicePlayer from './components/sounds/GameEventVoicePlayer';
import Inject from './dependencyInjection/InjectDecorator';
import MultiplayerRenderer from './MultiplayerRenderer';

export default class MultiplayerSpectatingRenderer extends MultiplayerRenderer {
  public constructor(game: MultiplayerGame, participant: Participant) {
    super(game, participant, new DisableInputHandler());
  }

  @Inject()
  private loadMultiplayerSpectatingRenderer(): void {
    const blockSize = this.localConfig.BlockSize;

    this.Add(
      new GameEventVoicePlayer(),
      new GameEventSfxPlayer(),
      new GameEventTextDrawable().With(c => {
        c.Offset = new Vector(blockSize * 11, blockSize * (this.GameState.PlayfieldHeight + 1));
        c.Scale = new Vector(1, 1);
      }),
      new PlayfieldDrawable().With(c => {
        c.Offset = new Vector(blockSize * 6, 0);
        c.Scale = new Vector(1, 1);
      }),
      new HoldPieceDrawable().With(c => {
        c.Offset = new Vector(10, 200);
        c.Scale = new Vector(1, 1);
      }),
      new PieceQueueDrawable().With(c => {
        c.Offset = new Vector(blockSize * 18, 100);
        c.Scale = new Vector(0.7, 0.7);
      }),
      new GarbageMeterDrawable().With(c => {
        c.Offset = new Vector(blockSize * 16.5, 0);
        c.Scale = new Vector(1, 1);
      }),
      new FramerateDrawable().With(c => {
        c.Offset = new Vector(0, this.Height - 20);
        c.Scale = new Vector(1, 1);
      })
    );
  }
}
