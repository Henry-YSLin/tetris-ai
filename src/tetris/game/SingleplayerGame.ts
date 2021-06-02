import { TICK_RATE } from '../Consts';
import GameInput, { GameInputResult } from '../GameInput';
import GameState from '../GameState';
import Game from './Game';
import Player from '../player/Player';
import { RotationDirection } from '../Tetrominos';
import TypedEvent from '../utils/TypedEvent';

export default class SingleplayerGame extends Game {
  State: GameState;
  Player: Player;
  #handle: number | null;
  #input: TypedEvent<GameInputResult>;

  constructor(
    player: Player,
    seed: number | GameState | undefined = undefined,
  ) {
    super();
    this.#handle = null;
    this.Player = player;
    if (seed instanceof GameState) {
      this.State = seed;
    }
    else {
      this.State = new GameState(seed);
    }
    this.#input = new TypedEvent();
  }

  get Input(): TypedEvent<GameInputResult> {
    return this.#input;
  }

  get ClockRunning(): boolean {
    return this.#handle !== null;
  }

  StartClock(): void {
    this.#handle = window.setInterval(this.Tick.bind(this), 1000 / TICK_RATE);
  }

  StopClock(): void {
    if (this.#handle !== null)
      window.clearInterval(this.#handle);
  }

  Tick(): void {
    this.State.Tick();
    const input = this.Player.Tick(this.State.GetVisibleState());
    let success = false;
    switch (input) {
      case GameInput.None:
        break;
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
    }
    if (input !== GameInput.None) {
      this.#input.emit(new GameInputResult(this.State.TicksElapsed, input, success));
    }
  }
}