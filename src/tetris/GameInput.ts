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
  Input: GameInput;
  Success: boolean;

  constructor(input: GameInput, success: boolean) {
    this.Input = input;
    this.Success = success;
  }
}