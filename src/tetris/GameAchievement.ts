export enum AchievementType {
  LineClear,
  TSpin,
  TSpinMini,
  PerfectClear,
}
export class GameAchievement {
  LinesCleared: number[];
  Type: AchievementType;
  Combo: number;
  BackToBack: boolean;

  constructor(
    linesCleared: number[],
    type: AchievementType,
    combo: number,
    backToBack: boolean,
  ) {
    this.LinesCleared = linesCleared;
    this.Type = type;
    this.Combo = combo;
    this.BackToBack = backToBack;
  }

  Clone(): GameAchievement {
    return new GameAchievement(
      this.LinesCleared,
      this.Type,
      this.Combo,
      this.BackToBack,
    );
  }
}
export default GameAchievement;

export function BackToBackEligible(achievement: GameAchievement): boolean {
  return achievement.Type === AchievementType.LineClear && achievement.LinesCleared.length >= 4
    || achievement.Type === AchievementType.TSpin
    || achievement.Type === AchievementType.TSpinMini;
}