import GameInput from '../../../GameInput';
import GameState, { VisibleGameState } from '../../../GameState';
import AIPlayer from '../AIPlayer';
import Tetromino from '../../../Tetromino';
import Tetrominos from '../../../Tetrominos';
import Vector from '../../../utils/Vector';
import { DelayedInputControl } from '../../input/DelayedInputManager';
import HeightMap from './HeightMap';

export default class HeightMapAI extends AIPlayer {
  #lastPiece: Tetromino | null;

  public constructor() {
    super();
    this.#lastPiece = null;
  }

  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    const falling = gameState.Falling;
    if (falling === null) this.#lastPiece = null;
    if (
      (this.#lastPiece === null && falling !== null) ||
      (this.#lastPiece !== null && falling !== null && this.#lastPiece.PieceIndex !== falling.PieceIndex)
    ) {
      this.#lastPiece = falling;
      const map = new HeightMap(gameState);
      const getHeightMap = (points: Vector[]): number[] => {
        const minX = points.map(p => p.X).min();
        const maxX = points.map(p => p.X).max();
        const ret: number[] = [];
        for (let i = minX; i <= maxX; i++) {
          ret.push(
            points
              .filter(p => p.X === i)
              .map(p => p.Y)
              .min()
          );
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

      for (let i = 0; i < Tetrominos[falling.Type].rotations.length; i++) {
        const minX = Tetrominos[falling.Type].rotations[i].map(p => p.X).min();
        for (let j = -minX; j < gameState.GridWidth - minX; j++) {
          const f = falling.Clone();
          f.Position.X = j;
          f.Rotation = i;
          simulation.HardDropPiece(f);
          choices.push({ rot: i, col: j, top: f.Top, isMatch: false });
        }
      }

      Tetrominos[falling.Type].rotations.flatMap((points, rot) =>
        map.FindPattern(...getHeightMap(points.slice())).forEach(col => {
          const index = choices.find(
            x => x.rot === rot && x.col === col - Tetrominos[falling.Type].rotations[rot].map(p => p.X).min()
          );
          if (index) index.isMatch = true;
        })
      );

      const goodChoices = choices.filter(x => x.isMatch === true);
      if (goodChoices.length === 0 && !gameState.BlockHold) {
        inputControl.AddInput(GameInput.Hold);
      } else {
        let choice: PlacementInfo;
        if (goodChoices.length > 0) {
          choice = goodChoices.minBy(c => c.top);
        } else {
          choice = choices.minBy(c => c.top);
        }
        rotation = choice.rot;
        column = choice.col;
        for (let i = 0; i < rotation; i++) inputControl.AddInput(GameInput.RotateCW);
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
