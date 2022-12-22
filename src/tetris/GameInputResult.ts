import Player from './player/Player';
import Tetromino from './Tetromino';
import GameInput from './GameInput';

export default class GameInputResult {
  public constructor(
    public readonly Tick: number,
    public readonly Input: GameInput,
    public readonly Success: boolean,
    public readonly Falling: Tetromino | null,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    public readonly Player: Player
  ) {}

  public Clone(): GameInputResult {
    return new GameInputResult(this.Tick, this.Input, this.Success, this.Falling, this.Player);
  }
}
