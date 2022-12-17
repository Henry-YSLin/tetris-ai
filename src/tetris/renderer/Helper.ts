import p5Types from 'p5';
import GameAchievement, { AchievementType } from '../GameAchievement';
import GameInput from '../GameInput';
import GameInputResult from '../GameInputResult';
import { TetrominoType } from '../Tetrominos';
import Vector from '../utils/Vector';

export function WithAlpha(color: p5Types.Color, alpha: number): p5Types.Color {
  color.setAlpha(alpha);
  return color;
}

export function TetrominoColor(p5: p5Types, tetromino: TetrominoType): p5Types.Color {
  switch (tetromino) {
    case TetrominoType.None:
      return p5.color(50);
    case TetrominoType.I:
      return p5.color(77, 208, 225);
    case TetrominoType.J:
      return p5.color(33, 150, 243);
    case TetrominoType.L:
      return p5.color(255, 152, 0);
    case TetrominoType.O:
      return p5.color(253, 216, 53);
    case TetrominoType.S:
      return p5.color(76, 175, 80);
    case TetrominoType.T:
      return p5.color(224, 64, 251);
    case TetrominoType.Z:
      return p5.color(229, 115, 115);
    case TetrominoType.Garbage:
      return p5.color(150);
  }
}

export function DrawTetromino(
  p5: p5Types,
  type: TetrominoType | null,
  origin: Vector,
  points: Vector[],
  blockSize: number,
  alpha: number
): void {
  p5.fill(WithAlpha(TetrominoColor(p5, type ?? TetrominoType.None), alpha));
  points.forEach(p => {
    p5.rect(origin.X + p.X * blockSize, origin.Y + p.Y * blockSize, blockSize, blockSize);
  });
}

export function p5text(
  p5: p5Types,
  str:
    | string
    | number
    | boolean
    | object
    | any[] /* eslint-disable-line @typescript-eslint/ban-types */ /* eslint-disable-line @typescript-eslint/no-explicit-any */,
  x: number,
  y: number,
  x2?: number | undefined,
  y2?: number | undefined
): void {
  p5.push();
  p5.scale(1, -1);
  p5.text(str, x, -y, x2, y2 === undefined ? y2 : -y2);
  p5.pop();
}

export enum InputSFX {
  Lock = '/assets/sfx/sfx_lockdown.wav',
  RotateSuccess = '/assets/sfx/sfx_rotate.wav',
  RotateFail = '/assets/sfx/sfx_rotatefail.wav',
  ShiftSuccess = '/assets/sfx/sfx_move.wav',
  ShiftFail = '/assets/sfx/sfx_movefail.wav',
  SoftDrop = '/assets/sfx/sfx_softdrop.wav',
  Hold = '/assets/sfx/sfx_hold.wav',
}

export enum GameEventSFX {
  Single = '/assets/sfx/sfx_single.wav',
  Double = '/assets/sfx/sfx_double.wav',
  Triple = '/assets/sfx/sfx_triple.wav',
  Tetris = '/assets/sfx/sfx_tetris.wav',
  TSpin = '/assets/sfx/sfx_tspin_zero.wav',
  TSpinMini = '/assets/sfx/sfx_tspin_mini.wav',
  TSpinSingle = '/assets/sfx/sfx_tspin_single.wav',
  TSpinDouble = '/assets/sfx/sfx_tspin_double.wav',
  TSpinTriple = '/assets/sfx/sfx_tspin_triple.wav',
  B2bTSpinMini = '/assets/sfx/sfx_b2b_tspin_mini.wav',
  B2bTSpinSingle = '/assets/sfx/sfx_b2b_tspin_single.wav',
  B2bTSpinDouble = '/assets/sfx/sfx_b2b_tspin_double.wav',
  B2bTSpinTriple = '/assets/sfx/sfx_b2b_tspin_triple.wav',
  B2bTetris = '/assets/sfx/sfx_b2b_tetris.wav',
  PerfectClear = '/assets/sfx/sfx_perfectclear.wav',
  Combo1 = '/assets/sfx/sfx_combo1.wav',
  Combo2 = '/assets/sfx/sfx_combo2.wav',
  Combo3 = '/assets/sfx/sfx_combo3.wav',
  Combo4 = '/assets/sfx/sfx_combo4.wav',
  Combo5 = '/assets/sfx/sfx_combo5.wav',
  Combo6 = '/assets/sfx/sfx_combo6.wav',
  Combo7 = '/assets/sfx/sfx_combo7.wav',
  Combo8 = '/assets/sfx/sfx_combo8.wav',
  Combo9 = '/assets/sfx/sfx_combo9.wav',
  Combo10 = '/assets/sfx/sfx_combo10.wav',
  Combo11 = '/assets/sfx/sfx_combo11.wav',
  Combo12 = '/assets/sfx/sfx_combo12.wav',
  Combo13 = '/assets/sfx/sfx_combo13.wav',
  Combo14 = '/assets/sfx/sfx_combo14.wav',
  Combo15 = '/assets/sfx/sfx_combo15.wav',
  Combo16 = '/assets/sfx/sfx_combo16.wav',
  Combo17 = '/assets/sfx/sfx_combo17.wav',
  Combo18 = '/assets/sfx/sfx_combo18.wav',
  Combo19 = '/assets/sfx/sfx_combo19.wav',
  Combo20 = '/assets/sfx/sfx_combo20.wav',

  GameOver = '/assets/sfx/sfx_gameover.wav',
}

export enum GameEventVoice {
  Single = '/assets/voice/voice_single.wav',
  Double = '/assets/voice/voice_double.wav',
  Triple = '/assets/voice/voice_triple.wav',
  Tetris = '/assets/voice/voice_tetris.wav',
  TSpin = '/assets/voice/voice_tspin.wav',
  TSpinMini = '/assets/voice/voice_tspinmini.wav',
  TSpinSingle = '/assets/voice/voice_tspinsingle.wav',
  TSpinDouble = '/assets/voice/voice_tspindouble.wav',
  TSpinTriple = '/assets/voice/voice_tspintriple.wav',
  B2bTSpinMini = '/assets/voice/voice_b2btspinmini.wav',
  B2bTSpinSingle = '/assets/voice/voice_b2btspinsingle.wav',
  B2bTSpinDouble = '/assets/voice/voice_b2btspindouble.wav',
  B2bTSpinTriple = '/assets/voice/voice_b2btspintriple.wav',
  B2bTetris = '/assets/voice/voice_b2btetris.wav',
  PerfectClear = '/assets/voice/voice_perfectclear.wav',
  Combo1 = '/assets/voice/voice_combo01.wav',
  Combo2 = '/assets/voice/voice_combo02.wav',
  Combo3 = '/assets/voice/voice_combo03.wav',
  Combo4 = '/assets/voice/voice_combo04.wav',
  Combo5 = '/assets/voice/voice_combo05.wav',
}

export function isGameEventSFX(maybe: string): maybe is keyof typeof GameEventSFX {
  return Object.keys(GameEventSFX).find(x => x === maybe) !== undefined;
}

export function isGameEventVoice(maybe: string): maybe is keyof typeof GameEventVoice {
  return Object.keys(GameEventVoice).find(x => x === maybe) !== undefined;
}

export function GetSFX(result: GameInputResult): InputSFX | null;

export function GetSFX(result: GameAchievement): GameEventSFX[] | null;

export function GetSFX(result: GameInputResult | GameAchievement): InputSFX | GameEventSFX[] | null {
  if (result instanceof GameInputResult) {
    switch (result.Input) {
      case GameInput.None:
        return null;
      case GameInput.HardDrop:
        return InputSFX.Lock;
      case GameInput.RotateCCW:
      case GameInput.RotateCW:
        return result.Success ? InputSFX.RotateSuccess : InputSFX.RotateFail;
      case GameInput.ShiftLeft:
      case GameInput.ShiftRight:
        return result.Success ? InputSFX.ShiftSuccess : InputSFX.ShiftFail;
      case GameInput.SoftDrop:
        return InputSFX.SoftDrop;
      case GameInput.Hold:
        return result.Success ? InputSFX.Hold : null;
    }
  }
  if (result instanceof GameAchievement) {
    const ret: GameEventSFX[] = [];
    if (result.Combo > 0) {
      const comboSfx = `Combo${Math.min(20, result.Combo)}`;
      if (isGameEventSFX(comboSfx)) ret.push(GameEventSFX[comboSfx]);
    }
    if (result.Type === AchievementType.PerfectClear) {
      ret.push(GameEventSFX.PerfectClear);
      return ret;
    }
    let gameEventSfx = '';
    if (result.BackToBack) gameEventSfx += 'B2b';
    if (result.Type === AchievementType.TSpinMini) {
      gameEventSfx += 'TSpinMini';
    } else {
      if (result.Type === AchievementType.TSpin) gameEventSfx += 'TSpin';
      if (result.LinesCleared.length === 1) gameEventSfx += 'Single';
      else if (result.LinesCleared.length === 2) gameEventSfx += 'Double';
      else if (result.LinesCleared.length === 3) gameEventSfx += 'Triple';
      else if (result.LinesCleared.length === 4) gameEventSfx += 'Tetris';
    }
    if (isGameEventSFX(gameEventSfx)) ret.push(GameEventSFX[gameEventSfx]);
    else if (gameEventSfx.startsWith('B2b')) {
      // Attempt to get the normal version if there is no back-to-back version
      gameEventSfx = gameEventSfx.substr(3);
      if (isGameEventSFX(gameEventSfx)) {
        ret.push(GameEventSFX[gameEventSfx]);
      }
    }
    return ret;
  }
  return null;
}

export function GetVoice(result: GameAchievement): GameEventVoice | null {
  if (result.Type === AchievementType.PerfectClear) {
    return GameEventVoice.PerfectClear;
  }
  let gameEventVoice = '';
  if (result.BackToBack) gameEventVoice += 'B2b';
  if (result.Type === AchievementType.TSpinMini) {
    gameEventVoice += 'TSpinMini';
  } else {
    if (result.Type === AchievementType.TSpin) gameEventVoice += 'TSpin';
    if (result.LinesCleared.length === 1) gameEventVoice += 'Single';
    else if (result.LinesCleared.length === 2) gameEventVoice += 'Double';
    else if (result.LinesCleared.length === 3) gameEventVoice += 'Triple';
    else if (result.LinesCleared.length === 4) gameEventVoice += 'Tetris';
  }
  if (isGameEventVoice(gameEventVoice) && gameEventVoice !== 'Single') return GameEventVoice[gameEventVoice];
  if (gameEventVoice.startsWith('B2b')) {
    // Attempt to get the normal version if there is no back-to-back version
    gameEventVoice = gameEventVoice.substr(3);
    if (isGameEventVoice(gameEventVoice)) {
      return GameEventVoice[gameEventVoice];
    }
  }
  if (result.Combo > 0) {
    const comboVoice = `Combo${Math.min(5, result.Combo)}`;
    if (isGameEventVoice(comboVoice)) return GameEventVoice[comboVoice];
  }
  return null;
}
