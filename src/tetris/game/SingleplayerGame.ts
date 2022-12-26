import GameInput from '../GameInput';
import GameInputResult from '../GameInputResult';
import GameState from '../gameState/GameState';
import Game from './Game';
import Player from '../player/Player';
import { RotationDirection } from '../Tetrominos';
import TypedEvent from '../utils/TypedEvent';
import GlobalConfiguration from '../GlobalConfiguration';

export default class SingleplayerGame extends Game {
  public State: GameState;

  public Player: Player;

  #handle: number | null;

  #input: TypedEvent<GameInputResult>;

  public constructor(
    configuration: GlobalConfiguration,
    player: Player,
    seedOrState: number | GameState | undefined = undefined
  ) {
    super(configuration);
    this.#handle = null;
    this.Player = player;
    if (seedOrState instanceof GameState) {
      this.State = seedOrState;
    } else {
      this.State = new GameState(this.Configuration, seedOrState);
    }
    this.#input = new TypedEvent();
  }

  public get Input(): TypedEvent<GameInputResult> {
    return this.#input;
  }

  public override Tick(): void {
    if (!this.GameRunning) return;
    if (this.State.IsDead) return;
    this.State.Tick();
    const input = this.Player.Tick(this.State.GetVisibleState());
    const falling = this.State.Falling;
    let success = false;
    switch (input) {
      case GameInput.HardDrop:
        success = this.State.HardDropPiece();
        break;
      case GameInput.Hold:
        success = this.State.HoldPiece();
        break;
      case GameInput.RotateCW:
        success = this.State.RotatePiece(RotationDirection.CW);
        break;
      case GameInput.RotateCCW:
        success = this.State.RotatePiece(RotationDirection.CCW);
        break;
      case GameInput.ShiftLeft:
        success = this.State.ShiftPiece(-1);
        break;
      case GameInput.ShiftRight:
        success = this.State.ShiftPiece(1);
        break;
      case GameInput.SoftDrop:
        success = this.State.SoftDropPiece(false);
        break;
      default:
        break;
    }
    if (input !== GameInput.None) {
      this.#input.Emit(new GameInputResult(this.State.TicksElapsed, input, success, falling, this.Player));
    }
  }
}
