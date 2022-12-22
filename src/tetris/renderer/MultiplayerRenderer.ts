import MultiplayerGame, { Participant } from '../game/MultiplayerGame';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import InputHandler from './components/inputHandler/InputHandler';
import Renderer from './Renderer';
import MultiGameState from '../gameState/MultiGameState';

export default class MultiplayerRenderer extends Renderer {
  public declare readonly Game: MultiplayerGame;

  public declare readonly GameState: MultiGameState;

  public constructor(game: MultiplayerGame, participant: Participant, inputHandler: InputHandler) {
    super(game, participant.player, participant.state, inputHandler);
  }

  protected override registerDependencies(dependencyContainer: DependencyContainer): void {
    super.registerDependencies(dependencyContainer);
    dependencyContainer.Register(this.Game, MultiplayerGame);
    dependencyContainer.Register(this.GameState, MultiGameState);
  }
}
