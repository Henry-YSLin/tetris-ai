import GameInput from '../GameInput';
import GameState, { VisibleGameState } from '../GameState';
import InputQueueable from './InputQueueable';
import AIPlayer from './AIPlayer';
import Tetromino from '../Tetromino';
import Tetrominos, { TetrominoType } from '../Tetrominos';
import Vector from '../utils/Vector';

class PlacementInfo {
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

  get Rating(): number {
    if (this.#cache) {
      return this.#cache;
    }
    let ret = 0;
    ret -= this.pieceTop;
    this.#cache = ret;
    return ret;
    // TODO: compute rating
  }
}

export default class HardAI extends InputQueueable(AIPlayer) {
  #lastPiece: Tetromino | null;

  constructor() {
    super();
    this.#lastPiece = null;
  }

  private getChoice(gameState: VisibleGameState, falling: Tetromino): PlacementInfo {
    const choices: PlacementInfo[] = [];

    for (let i = 0; i < Tetrominos[falling.Type].Rotations.length; i++) {
      const minX = Tetrominos[falling.Type].Rotations[i].map(p => p.X).min();
      for (let j = -minX; j < gameState.GridWidth - minX; j++) {
        const choice = new PlacementInfo(i, j);
        const simulation = new GameState(gameState);
        const f = simulation.Falling;
        if (!f) break;
        f.Position.X = j;
        f.Rotation = i;
        simulation.HardDropPiece();

        choice.pieceTop = f.Top;
        let t = simulation.GridHeight - 1;
        while (t >= 0 && !simulation.Grid[t].some(x => x !== TetrominoType.None))
          t--;
        choice.globalTop = t;

        choices.push(choice);
      }
    }

    choices.sort((a, b) => b.Rating - a.Rating);
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