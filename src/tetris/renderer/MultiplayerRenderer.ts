import MultiplayerGame, { Participant } from '../game/MultiplayerGame';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import InputHandler from './components/inputHandler/InputHandler';
import Renderer from './Renderer';

export default class MultiplayerRenderer extends Renderer {
  public readonly MultiplayerGame: MultiplayerGame;

  public constructor(
    game: MultiplayerGame,
    participant: Participant,
    inputHandler: InputHandler,
    width: number,
    height: number
  ) {
    super(game, participant.player, participant.state, inputHandler);
    this.MultiplayerGame = game;
    this.Width = width;
    this.Height = height;
  }

  protected override registerDependencies(dependencyContainer: DependencyContainer): void {
    super.registerDependencies(dependencyContainer);
    dependencyContainer.Register(this.MultiplayerGame, MultiplayerGame);
  }
}
