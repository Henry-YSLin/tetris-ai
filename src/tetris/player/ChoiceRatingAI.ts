import GameInput from '../GameInput';
import GameState, { VisibleGameState } from '../GameState';
import WithInputQueue from './InputQueueable';
import AIPlayer from './AIPlayer';
import Tetromino from '../Tetromino';
import Tetrominos, { TetrominoType } from '../Tetrominos';
import GameAchievement from '../GameAchievement';
import '../utils/Array';

export class PlacementInfo {
  rot: number;

  col: number;

  pieceTop: number;

  heightMap: number[];

  enclosedHoles: number;

  openHoles: number;

  blocksAboveHoles: number;

  iWells: number[];

  isDead: boolean;

  holdPiece: TetrominoType;

  achievement: GameAchievement | null;

  #cache: number | null;

  constructor(_rot: number, _col: number) {
    this.rot = _rot;
    this.col = _col;
    this.pieceTop = 0;
    this.heightMap = [];
    this.enclosedHoles = 0;
    this.openHoles = 0;
    this.blocksAboveHoles = 0;
    this.iWells = [];
    this.isDead = false;
    this.holdPiece = TetrominoType.None;
    this.#cache = null;
    this.achievement = null;
  }

  get globalTop(): number {
    return this.heightMap.max();
  }

  get bumpiness(): number {
    return this.heightMap.reduce(
      (prev, curr, idx) => prev + (idx === 0 ? 0 : Math.abs(curr - this.heightMap[idx - 1])),
      0
    );
  }

  Rating(ratingFunction: (choice: PlacementInfo) => number): number {
    if (this.#cache) {
      return this.#cache;
    }
    const ret = ratingFunction(this);
    this.#cache = ret;
    return ret;
  }

  static get Never(): PlacementInfo {
    const ret = new PlacementInfo(0, 0);
    ret.#cache = Number.MIN_VALUE;
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

export default class ChoiceRatingAI extends WithInputQueue(AIPlayer) {
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
    ret -= choice.iWells.sum();
    ret += (choice.achievement?.Rating ?? 0) * 10;
    ret -= choice.bumpiness;
    ret += choice.holdPiece === TetrominoType.I ? 10 : 0;
    if (choice.isDead) ret = Number.MIN_VALUE;
    return ret;
  }

  protected getChoice(gameState: VisibleGameState, falling: Tetromino): PlacementInfo {
    const choices: PlacementInfo[] = [];
    // todo: i j k l ....
    for (let i = 0; i < Tetrominos[falling.Type].Rotations.length; i++) {
      const minX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).min();
      const maxX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).max();
      for (let j = -minX; j < gameState.GridWidth - maxX; j++) {
        const choice = new PlacementInfo(i, j);
        const simulation = new GameState(gameState);

        simulation.Achievement.once(achievement => {
          choice.achievement = achievement;
        });

        const f = falling.Clone();
        simulation.Falling = f;
        f.Position.X = j;
        f.Rotation = i;
        simulation.HardDropPiece();

        choice.pieceTop = f.Top;

        const holes: [number, number][] = [];

        const map: boolean[][] = new Array(simulation.GridHeight)
          .fill(null)
          .map(_ => new Array(simulation.GridWidth).fill(false));
        for (let k = 0; k < simulation.GridWidth; k++) {
          floodfill(k, simulation.GridHeight - 1, simulation.Grid, map);
        }
        choice.enclosedHoles = simulation.Grid.reduce(
          (prev, curr, y) =>
            prev +
            curr.reduce((p, c, x) => p + (c === TetrominoType.None && !map[y][x] ? (holes.push([x, y]), 1) : 0), 0),
          0
        );

        const heightMap: number[] = [];
        for (let k = 0; k < simulation.GridWidth; k++) {
          const col = simulation.Grid.map(r => r[k]);
          col[-1] = TetrominoType.I;
          let l = col.length - 1;
          while (col[l] === TetrominoType.None) l--;
          heightMap.push(l + 1);
        }
        choice.heightMap = heightMap;
        choice.openHoles = simulation.Grid.reduce(
          (prev, curr, y) =>
            prev +
            curr.reduce(
              (p, c, x) =>
                p + (c === TetrominoType.None && map[y][x] && y < heightMap[x] ? (holes.push([x, y]), 1) : 0),
              0
            ),
          0
        );

        choice.blocksAboveHoles = holes.reduce((prev, [x, y]) => {
          for (let k = y; k < heightMap[x]; k++) {
            if (simulation.Grid[x][k] !== TetrominoType.None) prev++;
          }
          return prev;
        }, 0);

        choice.iWells = [];
        for (let k = 0; k < simulation.GridWidth; k++) {
          const diffs: number[] = [];
          if (k > 0) diffs.push(heightMap[k - 1] - heightMap[k]);
          if (k < simulation.GridWidth - 1) diffs.push(heightMap[k + 1] - heightMap[k]);
          choice.iWells.push(Math.max(0, Math.min(...diffs)));
        }

        choice.isDead = simulation.IsDead;

        choice.holdPiece = simulation.Hold?.Type ?? TetrominoType.None;

        choices.push(choice);
      }
    }

    choices.sort((a, b) => b.Rating(this.rateChoice) - a.Rating(this.rateChoice));
    return choices[0];
  }

  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    const falling = gameState.Falling;
    if (falling === null) this.#lastPiece = null;
    if (
      (this.#lastPiece === null && falling !== null) ||
      (this.#lastPiece !== null && falling !== null && this.#lastPiece.PieceIndex !== falling.PieceIndex)
    ) {
      this.#lastPiece = falling;

      const choice = this.getChoice(gameState, falling);
      let holdChoice: PlacementInfo = PlacementInfo.Never;
      const simulation = new GameState(gameState);
      simulation.HoldPiece();
      if (simulation.Falling) holdChoice = this.getChoice(simulation.GetVisibleState(), simulation.Falling);

      if (holdChoice.Rating(this.rateChoice) > choice.Rating(this.rateChoice)) {
        this.Enqueue(GameInput.Hold);
      } else {
        const column = choice.col;
        const rotation = choice.rot;

        if (rotation === 1) this.Enqueue(GameInput.RotateCW);
        else if (rotation === 3) this.Enqueue(GameInput.RotateCCW);
        else if (rotation === 2) {
          this.Enqueue(GameInput.RotateCW);
          this.Enqueue(GameInput.RotateCW);
        }
        if (column > falling.Position.X) {
          for (let i = 0; i < column - falling.Position.X; i++) this.Enqueue(GameInput.ShiftRight);
        } else if (column < falling.Position.X) {
          for (let i = 0; i < falling.Position.X - column; i++) this.Enqueue(GameInput.ShiftLeft);
        }
        this.Enqueue(GameInput.HardDrop);
      }
    }
    return super.Update(gameState, acceptInput);
  }
}
