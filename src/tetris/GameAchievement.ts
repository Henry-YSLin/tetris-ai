export enum AchievementType {
  Single = 1,
  Double,
  Triple,
  Tetris,
  TSpin,
  TSpinMini
}
export function IsTwist(achievement: AchievementType): boolean {
  return achievement === AchievementType.Tetris
    || achievement === AchievementType.TSpin
    || achievement === AchievementType.TSpinMini;
}
export class GameAchievement {
  LinesCleared: number;
  Type: AchievementType;
  Combo: number;
  BackToBack: boolean;

  constructor(
    linesCleared: number,
    type: AchievementType,
    combo: number,
    backToBack: boolean,
  ) {
    this.LinesCleared = linesCleared;
    this.Type = type;
    this.Combo = combo;
    this.BackToBack = backToBack;
  }
}
export default GameAchievement;