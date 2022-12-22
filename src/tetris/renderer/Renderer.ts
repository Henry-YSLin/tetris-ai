import Game from '../game/Game';
import GameState from '../GameState';
import Player from '../player/Player';
import Container from './components/Container';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Graphics from './Graphics';
import InputHandler from './components/inputHandler/InputHandler';

export default class Renderer extends Container {
  public readonly Game: Game;

  public readonly Player: Player;

  public readonly GameState: GameState;

  public readonly InputHandler: InputHandler;

  public constructor(game: Game, player: Player, gameState: GameState, inputHandler: InputHandler) {
    super();
    this.Game = game;
    this.Player = player;
    this.GameState = gameState;
    this.Children = [(this.InputHandler = inputHandler)];
  }

  protected override registerDependencies(dependencyContainer: DependencyContainer): void {
    dependencyContainer.Register(this.InputHandler, InputHandler);
    dependencyContainer.Register(this.Game, Game);
    dependencyContainer.Register(this.Player, Player);
    dependencyContainer.Register(this.GameState, GameState);
  }

  protected override applyTransform(graphics: Graphics): void {
    // todo: remove coordinate transform
    const { p5 } = graphics;
    p5.resetMatrix();
    p5.scale(1, -1);
    p5.translate(0, -this.Height);

    super.applyTransform(graphics);
  }
}
