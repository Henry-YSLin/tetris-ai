import VisibleGameState from '../../../gameState/VisibleGameState';
import { TetrominoType } from '../../../Tetrominos';

export default class HeightMap {
  public readonly Map: number[] = [];

  public constructor(state: VisibleGameState) {
    for (let i = 0; i < state.GridWidth; i++) {
      const col = state.Grid.map(r => r[i]);
      col[-1] = TetrominoType.I;
      let j = col.length - 1;
      while (col[j] === TetrominoType.None) j--;
      this.Map.push(j + 1);
    }
  }

  public FindPattern(...pattern: number[]): number[] {
    const ret: number[] = [];
    for (let i = 0; i < this.Map.length - pattern.length + 1; i++) {
      let match = true;
      for (let j = 0; j < pattern.length - 1; j++) {
        if (this.Map[i + j + 1] - this.Map[i + j] !== pattern[j + 1] - pattern[j]) match = false;
      }
      if (match) ret.push(i);
    }
    return ret;
  }
}
