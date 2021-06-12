import GameInput from '../GameInput';
import GameState, { VisibleGameState } from '../GameState';
import InputQueueable from './InputQueueable';
import AIPlayer from './AIPlayer';
import Tetromino from '../Tetromino';
import Tetrominos, { TetrominoType } from '../Tetrominos';

export class PlacementInfo {
  rot: number;
  col: number;
  pieceTop: number;
  globalTop: number;
  enclosedHoles: number;
  openHoles: number;
  blocksAboveHoles: number;
  iWells: number;

  #cache: number | null;

  constructor(_rot: number, _col: number) {
    this.rot = _rot;
    this.col = _col;
    this.pieceTop = 0;
    this.globalTop = 0;
    this.enclosedHoles = 0;
    this.openHoles = 0;
    this.blocksAboveHoles = 0;
    this.iWells = 0;
    this.#cache = null;
  }

  Rating(ratingFunction: (choice: PlacementInfo) => number): number {
    if (this.#cache) {
      return this.#cache;
    }
    const ret = ratingFunction(this);
    this.#cache = ret;
    return ret;
  }
}

function floodfill(x: number, y: number, grid: TetrominoType[][], map: boolean[][]) {
  if (grid[y][x] === TetrominoType.None && !map[y][x]) {
    map[y][x] = true;
    if (x > 0) floodfill(x - 1, y, grid, map);
    if (x < grid[0].length - 1) floodfill(x + 1, y, grid, map);
    if (y > 0) floodfill(x, y - 1, grid, map);
    if (y < grid.length - 1) floodfill(x, y + 1, grid, map);
  }
}

export default class HardAI extends InputQueueable(AIPlayer) {
  #lastPiece: Tetromino | null;

  constructor() {
    super();
    this.#lastPiece = null;
  }

  protected rateChoice(choice: PlacementInfo): number {
    let ret = 0;
    ret -= choice.globalTop;
    ret -= choice.pieceTop;
    ret -= choice.enclosedHoles;
    ret -= choice.openHoles;
    ret -= choice.blocksAboveHoles;
    ret -= choice.iWells;
    return ret;
  }

  protected getChoice(gameState: VisibleGameState, falling: Tetromino): PlacementInfo {
    const choices: PlacementInfo[] = [];

    for (let i = 0; i < Tetrominos[falling.Type].Rotations.length; i++) {
      const minX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).min();
      const maxX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).max();
      for (let j = -minX; j < gameState.GridWidth - maxX; j++) {
        const choice = new PlacementInfo(i, j);
        const simulation = new GameState(gameState);
        if (!falling) continue;
        const f = falling.Clone();
        simulation.Falling = f;
        f.Position.X = j;
        f.Rotation = i;
        simulation.HardDropPiece();

        choice.pieceTop = f.Top;
        let t = simulation.GridHeight - 1;
        while (t >= 0 && !simulation.Grid[t].some(x => x !== TetrominoType.None))
          t--;
        choice.globalTop = t;

        const holes: [number, number][] = [];

        const map: boolean[][] = new Array(simulation.GridHeight).fill(null).map(_ => new Array(simulation.GridWidth).fill(false));
        for (let i = 0; i < simulation.GridWidth; i++) {
          floodfill(i, simulation.GridHeight - 1, simulation.Grid, map);
        }
        choice.enclosedHoles = simulation.Grid.reduce(
          (prev, curr, y) => prev + curr.reduce(
            (p, c, x) => p + (c === TetrominoType.None && !map[y][x] ? (holes.push([x, y]), 1) : 0),
            0,
          ),
          0,
        );

        const heightMap: number[] = [];
        for (let i = 0; i < simulation.GridWidth; i++) {
          const col = simulation.Grid.map(r => r[i]);
          col[-1] = TetrominoType.I;
          let j = col.length - 1;
          while (col[j] === TetrominoType.None) j--;
          heightMap.push(j + 1);
        }
        choice.openHoles = simulation.Grid.reduce(
          (prev, curr, y) => prev + curr.reduce(
            (p, c, x) => p + (c === TetrominoType.None && map[y][x] && y < heightMap[x] ? (holes.push([x, y]), 1) : 0),
            0,
          ),
          0,
        );

        choice.blocksAboveHoles = holes.reduce((prev, [x, y]) => {
          for (let i = y; i < heightMap[x]; i++) {
            if (simulation.Grid[x][i] !== TetrominoType.None)
            prev++;
          }
          return prev;
        }, 0);

        choice.iWells = 0;
        for (let i = 0; i < simulation.GridWidth; i++) {
          if (i > 0 && heightMap[i - 1] - heightMap[i] < 3) continue;
          if (i < simulation.GridWidth - 1 && heightMap[i + 1] - heightMap[i] < 3) continue;
          const diffs: number[] = [];
          if (i > 0) diffs.push(heightMap[i - 1] - heightMap[i]);
          if (i < simulation.GridWidth - 1) diffs.push(heightMap[i + 1] - heightMap[i]);
          choice.iWells += Math.min(...diffs);
        }

        choices.push(choice);
      }
    }

    choices.sort((a, b) => b.Rating(this.rateChoice) - a.Rating(this.rateChoice));
    return choices[0];
  }

  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    const falling = gameState.Falling;
    if (falling === null) this.#lastPiece = null;
    if (this.#lastPiece === null && falling !== null
      || this.#lastPiece !== null && falling !== null && this.#lastPiece.PieceIndex !== falling.PieceIndex) {
      this.#lastPiece = falling;

      const choice = this.getChoice(gameState, falling);
      let holdChoice: PlacementInfo;
      if (gameState.Hold && gameState.Hold.Type !== TetrominoType.None) {
        holdChoice = this.getChoice(gameState, new Tetromino(gameState.Hold.Type));
      }
      else {
        holdChoice = this.getChoice(gameState, new Tetromino(gameState.PieceQueue[0]));
      }

      if (holdChoice.Rating > choice.Rating) {
        this.Enqueue(GameInput.Hold);
      }
      else {
        const column = choice.col;
        const rotation = choice.rot;

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