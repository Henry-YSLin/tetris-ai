import Game from '../game/Game';
import GameState from '../GameState';
import Player from '../player/Player';
import Container from './components/drawables/Container';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Graphics from './Graphics';
import InputHandler from './components/inputHandler/InputHandler';
import AnimationManager from './components/AnimationManager';
import RenderConfiguration from './RenderConfiguration';
import Inject from './dependencyInjection/InjectDecorator';

export default class Renderer extends Container {
  public readonly Game: Game;

  public readonly Player: Player;

  public readonly GameState: GameState;

  public readonly InputHandler: InputHandler;

  public readonly AnimationManager: AnimationManager;

  protected renderConfig: RenderConfiguration = null!;

  public constructor(game: Game, player: Player, gameState: GameState, inputHandler: InputHandler) {
    super();
    this.Game = game;
    this.Player = player;
    this.GameState = gameState;
    this.Add((this.InputHandler = inputHandler), (this.AnimationManager = new AnimationManager()));
  }

  @Inject(RenderConfiguration)
  private loadRenderer(renderConfig: RenderConfiguration): void {
    this.renderConfig = renderConfig;
    this.Width = renderConfig.Width;
    this.Height = renderConfig.Height;
  }

  protected override registerDependencies(dependencyContainer: DependencyContainer): void {
    dependencyContainer.Register(this.Game, Game);
    dependencyContainer.Register(this.Player, Player);
    dependencyContainer.Register(this.GameState, GameState);
    dependencyContainer.Register(this.InputHandler, InputHandler);
    dependencyContainer.Register(this.AnimationManager, AnimationManager);
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
