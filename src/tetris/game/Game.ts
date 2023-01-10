import GameInputResult from '../GameInputResult';
import GlobalConfiguration from '../GlobalConfiguration';
import TypedEvent from '../utils/TypedEvent';

export default abstract class Game {
  #gameRunning = false;

  public abstract get Input(): TypedEvent<GameInputResult>;
  public get GameRunning(): boolean {
    return this.#gameRunning;
  }

  public StartGame(): void {
    this.#gameRunning = true;
  }

  public PauseGame(): void {
    this.#gameRunning = false;
  }

  public abstract Tick(delta: number): void;

  public constructor(
    /**
     * The configuration applied to all game states associated with this game.
     */
    public readonly Configuration: GlobalConfiguration
  ) {}
}
