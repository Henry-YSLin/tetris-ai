import SingleplayerGame from '../game/SingleplayerGame';
import Vector from '../utils/Vector';
import FramerateDrawable from './components/drawables/FramerateDrawable';
import GameEventTextDrawable from './components/drawables/GameEventTextDrawable';
import HoldPieceDrawable from './components/drawables/HoldPieceDrawable';
import PieceQueueDrawable from './components/drawables/PieceQueueDrawable';
import PlayfieldDrawable from './components/drawables/PlayfieldDrawable';
import RepeatableInputHandler from './components/inputHandler/RepeatableInputHandler';
import GameEventSfxPlayer from './components/sounds/GameEventSfxPlayer';
import GameEventVoicePlayer from './components/sounds/GameEventVoicePlayer';
import InputSfxPlayer from './components/sounds/InputSfxPlayer';
import Inject from './dependencyInjection/InjectDecorator';
import Renderer from './Renderer';

export default class SingleplayerRenderer extends Renderer {
  public constructor(game: SingleplayerGame) {
    super(game, game.Player, game.State, new RepeatableInputHandler());
  }

  @Inject()
  private loadSingleplayerRenderer(): void {
    const blockSize = this.localConfig.BlockSize;

    this.Add(
      new InputSfxPlayer(),
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
        c.Offset = new Vector(blockSize * 17, 100);
        c.Scale = new Vector(0.7, 0.7);
      }),
      new FramerateDrawable().With(c => {
        c.Offset = new Vector(0, this.Height - 20);
        c.Scale = new Vector(1, 1);
      })
    );
  }
}
