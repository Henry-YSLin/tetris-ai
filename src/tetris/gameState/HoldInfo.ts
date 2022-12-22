import { TetrominoType } from '../Tetrominos';

export default class HoldInfo {
  public constructor(public readonly Type: TetrominoType, public readonly PieceIndex: number) {}

  public Clone(): HoldInfo {
    return new HoldInfo(this.Type, this.PieceIndex);
  }
}
