import GameInput from '../GameInput';
import GameState, { VisibleGameState } from '../GameState';
import InputQueueable from './InputQueueable';
import AIPlayer from './AIPlayer';
import Tetromino from '../Tetromino';
import Tetrominos, { TetrominoType } from '../Tetrominos';
import Vector from '../utils/Vector';

class HeightMap {
  Map: number[];

  constructor(state: VisibleGameState) {
    this.Map = [];
    for (let i = 0; i < state.GridWidth; i++) {
      const col = state.Grid.map(r => r[i]);
      col[-1] = TetrominoType.I;
      let j = col.length - 1;
      while (col[j] === TetrominoType.None) j--;
      this.Map.push(j + 1);
    }
    console.log(this.Map);
  }

  FindPattern(...pattern: number[]): number[]  {
    const ret: number[] = [];
    for (let i = 0; i < this.Map.length - pattern.length + 1; i++) {
      let match = true;
      for (let j = 0; j < pattern.length - 1; j++) {
        if (this.Map[i + j + 1] - this.Map[i + j] !== pattern[j + 1] - pattern[j])
          match = false;
      }
      if (match) ret.push(i);
    }
    return ret;
  }
}

export default class DecentAI extends InputQueueable(AIPlayer) {
  #lastPiece: Tetromino | null;

  constructor() {
    super();
    this.#lastPiece = null;
  }

  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    const falling = gameState.Falling;
    if (falling === null) this.#lastPiece = null;
    if (this.#lastPiece === null && falling !== null
      || this.#lastPiece !== null && falling !== null && this.#lastPiece.PieceIndex !== falling.PieceIndex) {
      this.#lastPiece = falling;
      console.log('============');
      const map = new HeightMap(gameState);
      const getHeightMap = (points: Vector[]): number[] => {
        const minX = points.map(p => p.X).min();
        const maxX = points.map(p => p.X).max();
        const ret: number[] = [];
        for (let i = minX; i <= maxX; i++) {
          ret.push(points.filter(p => p.X === i).map(p => p.Y).min());
        }
        return ret;
      };
      let col = Math.floor(Math.random() * gameState.GridWidth);
      let rotation = 0;
      const indices = Tetrominos[falling.Type].Rotations.flatMap((points, idx) => map.FindPattern(...getHeightMap(points.slice())).map(x => [idx, x]));
      if (indices.length === 0 && !gameState.BlockHold) {
        this.Enqueue(GameInput.Hold);
      }
      else {
        if (indices.length > 0) {
          const simulation = new GameState(gameState);
          const choices = indices.map(([rot, c]) => {
            const f = falling.Clone();
            f.Position.X = c -= Tetrominos[f.Type].Rotations[rot].map(p => p.X).min();
            f.Rotation = rot;
            simulation.HardDropPiece(f);
            return [rot, c, f.Top];
          });
          console.log(choices);
          [rotation, col] = choices.minBy(c => c[2]);
          console.log(choices.minBy(c => c[2]));
          for (let i = 0; i < rotation; i++)
            this.Enqueue(GameInput.RotateCW);
        }
        if (col > falling.Position.X) {
          for (let i = 0; i < col - falling.Position.X; i++)
            this.Enqueue(GameInput.ShiftRight);
        }
        else if (col < falling.Position.X) {
          for (let i = 0; i < falling.Position.X - col; i++)
            this.Enqueue(GameInput.ShiftLeft);
        }
        this.Enqueue(GameInput.HardDrop);
      }
    }
    return super.Update(gameState, acceptInput);
  }
}