import GameInput from '../../../GameInput';
import GameState from '../../../gameState/GameState';
import AIPlayer from '../AIPlayer';
import Tetromino from '../../../Tetromino';
import Tetrominos, { TetrominoType } from '../../../Tetrominos';
import '../../../utils/Array';
import RatedPlacement from './RatedPlacement';
import { DelayedInputControl } from '../../input/DelayedInputManager';
import VisibleGameState from '../../../gameState/VisibleGameState';

function Floodfill(x: number, y: number, grid: TetrominoType[][], map: boolean[][]) {
  if (grid[y][x] === TetrominoType.None && !map[y][x]) {
    map[y][x] = true;
    if (x > 0) Floodfill(x - 1, y, grid, map);
    if (x < grid[0].length - 1) Floodfill(x + 1, y, grid, map);
    if (y > 0) Floodfill(x, y - 1, grid, map);
    if (y < grid.length - 1) Floodfill(x, y + 1, grid, map);
  }
}

export default abstract class ChoiceRatingAI extends AIPlayer {
  #lastPiece: Tetromino | null = null;

  protected abstract rateChoice(choice: RatedPlacement): number;

  private getChoice(gameState: VisibleGameState, falling: Tetromino): RatedPlacement {
    const choices: RatedPlacement[] = [];
    // todo: i j k l ....
    for (let i = 0; i < Tetrominos[falling.Type].rotations.length; i++) {
      const minX = Tetrominos[falling.Type].rotations[i].map(p => p.X).min();
      const maxX = Tetrominos[falling.Type].rotations[i].map(p => p.X).max();
      for (let j = -minX; j < gameState.GridWidth - maxX; j++) {
        const choice = new RatedPlacement(i, j, this.rateChoice);
        const simulation = new GameState(gameState);

        simulation.Achievement.Once(achievement => {
          choice.Achievement = achievement;
        });

        const f = falling.Clone();
        simulation.Falling = f;
        f.Position.X = j;
        f.Rotation = i;
        simulation.HardDropPiece();

        choice.HighestRow = f.Top;

        const holes: [number, number][] = [];

        const map: boolean[][] = new Array(simulation.GridHeight)
          .fill(null)
          .map(_ => new Array(simulation.GridWidth).fill(false));
        for (let k = 0; k < simulation.GridWidth; k++) {
          Floodfill(k, simulation.GridHeight - 1, simulation.Grid, map);
        }
        choice.EnclosedHoles = simulation.Grid.reduce(
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
        choice.HeightMap = heightMap;
        choice.OpenHoles = simulation.Grid.reduce(
          (prev, curr, y) =>
            prev +
            curr.reduce(
              (p, c, x) =>
                p + (c === TetrominoType.None && map[y][x] && y < heightMap[x] ? (holes.push([x, y]), 1) : 0),
              0
            ),
          0
        );

        choice.BlocksAboveHoles = holes.reduce((prev, [x, y]) => {
          for (let k = y; k < heightMap[x]; k++) {
            if (simulation.Grid[x][k] !== TetrominoType.None) prev++;
          }
          return prev;
        }, 0);

        choice.IWells = [];
        for (let k = 0; k < simulation.GridWidth; k++) {
          const diffs: number[] = [];
          if (k > 0) diffs.push(heightMap[k - 1] - heightMap[k]);
          if (k < simulation.GridWidth - 1) diffs.push(heightMap[k + 1] - heightMap[k]);
          choice.IWells.push(Math.max(0, Math.min(...diffs)));
        }

        choice.IsDead = simulation.IsDead;

        choice.HoldPiece = simulation.Hold?.Type ?? TetrominoType.None;

        choices.push(choice);
      }
    }

    choices.sort((a, b) => b.Rating - a.Rating);
    return choices[0];
  }

  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    const falling = gameState.Falling;
    if (falling === null) this.#lastPiece = null;
    if (
      (this.#lastPiece === null && falling !== null) ||
      (this.#lastPiece !== null && falling !== null && this.#lastPiece.PieceIndex !== falling.PieceIndex)
    ) {
      this.#lastPiece = falling;

      const choice = this.getChoice(gameState, falling);
      let holdChoice: RatedPlacement = RatedPlacement.Never;
      const simulation = new GameState(gameState);
      simulation.HoldPiece();
      if (simulation.Falling) holdChoice = this.getChoice(simulation.GetVisibleState(), simulation.Falling);

      if (holdChoice.Rating > choice.Rating) {
        inputControl.AddInput(GameInput.Hold);
      } else {
        const column = choice.Column;
        const rotation = choice.Rotation;

        if (rotation === 1) inputControl.AddInput(GameInput.RotateCW);
        else if (rotation === 3) inputControl.AddInput(GameInput.RotateCCW);
        else if (rotation === 2) {
          inputControl.AddInput(GameInput.RotateCW);
          inputControl.AddInput(GameInput.RotateCW);
        }
        if (column > falling.Position.X) {
          for (let i = 0; i < column - falling.Position.X; i++) inputControl.AddInput(GameInput.ShiftRight);
        } else if (column < falling.Position.X) {
          for (let i = 0; i < falling.Position.X - column; i++) inputControl.AddInput(GameInput.ShiftLeft);
        }
        inputControl.AddInput(GameInput.HardDrop);
      }
    }
  }
}
