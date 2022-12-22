import { PLAYFIELD_HEIGHT } from '../Consts';
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
import PlayerSfxPlayer from './components/sounds/PlayerSfxPlayer';
import Inject from './dependencyInjection/InjectDecorator';
import Renderer from './Renderer';

export default class SingleplayerRenderer extends Renderer {
  public constructor(game: SingleplayerGame) {
    super(game, game.Player, game.State, new RepeatableInputHandler());
  }

  @Inject()
  private loadSingleplayerRenderer(): void {
    const blockSize = this.renderConfig.BlockSize;

    this.Add(
      new PlayerSfxPlayer(),
      new GameEventVoicePlayer(),
      new GameEventSfxPlayer(),
      new GameEventTextDrawable().With(c => {
        c.Offset = new Vector(blockSize * 11, blockSize * ((this.GameState?.PlayfieldHeight ?? PLAYFIELD_HEIGHT) + 1));
        c.Size = new Vector(1, 1);
      }),
      new PlayfieldDrawable().With(c => {
        c.Offset = new Vector(blockSize * 6, 0);
        c.Size = new Vector(1, 1);
      }),
      new HoldPieceDrawable().With(c => {
        c.Offset = new Vector(10, 200);
        c.Size = new Vector(1, 1);
      }),
      new PieceQueueDrawable().With(c => {
        c.Offset = new Vector(blockSize * 17, 100);
        c.Size = new Vector(0.7, 0.7);
      }),
      new FramerateDrawable().With(c => {
        c.Offset = new Vector(0, this.Height - 10);
        c.Size = new Vector(1, 1);
      })
    );
  }
}
