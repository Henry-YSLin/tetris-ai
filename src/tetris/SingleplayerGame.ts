import { TICK_RATE } from './Consts';
import GameInput from './GameInput';
import GameState from './GameState';
import Player from './player/Player';
import { RotationDirection } from './Tetrominos';

export default class SingleplayerGame {
  State: GameState;
  Player: Player;
  #handle: number | null;

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
    switch (input) {
      case GameInput.None:
        return;
      case GameInput.HardDrop:
        this.State.HardDropPiece();
        break;
      case GameInput.Hold:
        this.State.HoldPiece();
        break;
      case GameInput.RotateCW:
        this.State.RotatePiece(RotationDirection.CW);
        break;
      case GameInput.RotateCCW:
        this.State.RotatePiece(RotationDirection.CCW);
        break;
      case GameInput.ShiftLeft:
        this.State.ShiftPiece(-1);
        break;
      case GameInput.ShiftRight:
        this.State.ShiftPiece(1);
        break;
      case GameInput.SoftDrop:
        this.State.SoftDropPiece(false);
        break;
    }
  }

  constructor(
    player: Player,
    seed: number | GameState | undefined = undefined,
  ) {
    this.#handle = null;
    this.Player = player;
    if (seed instanceof GameState) {
      this.State = seed;
    }
    else if (seed !== undefined) {
      this.State = new GameState(seed);
    }
    else {
      this.State = new GameState();
    }
  }
}