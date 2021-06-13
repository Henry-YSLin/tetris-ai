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

export default class HeightMapAI extends InputQueueable(AIPlayer) {
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

      let column = Math.floor(Math.random() * gameState.GridWidth);
      let rotation = Math.floor(Math.random() * 4);

      type PlacementInfo = {
        rot: number;
        col: number;
        top: number;
        isMatch: boolean;
      };

      const choices: PlacementInfo[] = [];
      const simulation = new GameState(gameState);

      for (let i = 0; i < Tetrominos[falling.Type].Rotations.length; i++) {
        const minX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).min();
        for (let j = -minX; j < gameState.GridWidth - minX; j++) {
          const f = falling.Clone();
          f.Position.X = j;
          f.Rotation = i;
          simulation.HardDropPiece(f);
          choices.push({ rot: i, col: j, top: f.Top, isMatch: false });
        }
      }

      Tetrominos[falling.Type].Rotations
        .flatMap((points, rot) => map.FindPattern(...getHeightMap(points.slice()))
          .forEach(col => {
            const index = choices.find(x => x.rot === rot && x.col === col - Tetrominos[falling.Type].Rotations[rot].map(p => p.X).min());
            if (index) index.isMatch = true;
          }),
        );

      const goodChoices = choices.filter(x => x.isMatch === true);
      if (goodChoices.length === 0 && !gameState.BlockHold) {
        this.Enqueue(GameInput.Hold);
      }
      else {
        let choice: PlacementInfo;
        if (goodChoices.length > 0) {
          choice = goodChoices.minBy(c => c.top);
        }
        else {
          choice = choices.minBy(c => c.top);
        }
        rotation = choice.rot;
        column = choice.col;
        for (let i = 0; i < rotation; i++)
          this.Enqueue(GameInput.RotateCW);
        if (column > falling.Position.X) {
          for (let i = 0; i < column - falling.Position.X; i++)
            this.Enqueue(GameInput.ShiftRight);
        }
        else if (column < falling.Position.X) {
          for (let i = 0; i < falling.Position.X - column; i++)
            this.Enqueue(GameInput.ShiftLeft);
        }
        this.Enqueue(GameInput.HardDrop);
      }
    }
    return super.Update(gameState, acceptInput);
  }
}