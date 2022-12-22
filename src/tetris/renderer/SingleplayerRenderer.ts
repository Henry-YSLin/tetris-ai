import SingleplayerGame from '../game/SingleplayerGame';
import RepeatableInputHandler from './components/inputHandler/RepeatableInputHandler';
import Renderer from './Renderer';

export default class SingleplayerRenderer extends Renderer {
  public constructor(game: SingleplayerGame, width: number, height: number) {
    super(game, game.Player, game.State, new RepeatableInputHandler());
    this.Width = width;
    this.Height = height;
  }
}
