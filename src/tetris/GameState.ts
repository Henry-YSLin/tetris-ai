import { Tetrominos, Tetromino } from './Tetrominos';

class FallingTetromino {
  Type: Tetromino;
  Rotation: 0|1|2|3;
  constructor(type: Tetromino, rotation: 0|1|2|3 = 0) {
    this.Type = type;
    this.Rotation = rotation;
  }
}

export class GameState {
  Grid: Tetromino[][];
  Falling: FallingTetromino | null;

  constructor() {
    this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(Tetromino.None));
    this.Falling = null;
  }
}
export default GameState;