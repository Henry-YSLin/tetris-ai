import Player from './player/Player';
import Tetromino from './Tetromino';

export enum GameInput {
  None,
  SoftDrop,
  HardDrop,
  Hold,
  ShiftLeft,
  ShiftRight,
  RotateCW,
  RotateCCW,
}
export default GameInput;
export function IsRotation(input: GameInput): boolean {
  return input === GameInput.RotateCCW || input === GameInput.RotateCW;
}
export function IsShift(input: GameInput): boolean {
  return input === GameInput.ShiftLeft || input === GameInput.ShiftRight;
}
export class GameInputResult {
  Tick: number;
  Input: GameInput;
  Success: boolean;
  Falling: Tetromino | null;
  Player: Player;

  constructor(tick: number, input: GameInput, success: boolean, falling: Tetromino | null, player: Player) {
    this.Tick = tick;
    this.Input = input;
    this.Success = success;
    this.Falling = falling;
    this.Player = player;
  }

  Clone(): GameInputResult {
    return new GameInputResult(
      this.Tick,
      this.Input,
      this.Success,
      this.Falling,
      this.Player,
    );
  }
}