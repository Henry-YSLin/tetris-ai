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

  /**
   * A number describing the "impressiveness" of this achievement.
   * Used for sizing related UI.
   */
  get Rating(): number {
    let ret = Math.pow(1.1, this.LinesCleared.length);
    switch (this.Type) {
      case AchievementType.PerfectClear:
        ret *= 1.5;
      case AchievementType.TSpin:
        ret *= 1.3;
      case AchievementType.TSpinMini:
        ret *= 1.1;
    }
    if (this.BackToBack) ret *= 1.1;
    if (this.Combo) ret *= Math.pow(1.05, this.Combo);
    return ret;
  }

  /**
   * Lines of garbage sent by this achievement
   */
  get Garbage(): { Targeted: number, Universal: number } {
    let targeted = 0;
    let universal = 0;
    if (this.BackToBack) targeted++;
    switch (this.Combo) {
      case 0:
      case 1:
        break;
      case 2:
      case 3:
        targeted += 1;
        break;
      case 4:
      case 5:
        targeted += 2;
        break;
      case 6:
      case 7:
        targeted += 3;
        break;
      case 8:
      case 9:
      case 10:
        targeted += 4;
        break;
      default:
        targeted += 5;
        break;
    }
    if (this.Type === AchievementType.PerfectClear) {
      universal += 6;
    }
    else if (this.Type === AchievementType.LineClear) {
      switch (this.LinesCleared.length) {
        case 0:
        case 1:
          break;
        case 2:
          targeted++;
          break;
        case 3:
          targeted += 2;
          break;
        default:
          targeted += 4;
          break;
      }
    }
    else if (this.Type === AchievementType.TSpinMini) {
      targeted += this.LinesCleared.length;
    }
    else if (this.Type === AchievementType.TSpin) {
      targeted += this.LinesCleared.length * 2;

      // special bonus for B2b T-spin triple
      if (this.BackToBack && this.LinesCleared.length === 3) targeted++;
    }
    return { Targeted: targeted, Universal: universal };
  }

  toString(): [string, string] {
    let subtitle = '';
    let title = '';
    if (this.Combo > 0) subtitle += `${this.Combo} REN `;
    if (this.BackToBack) subtitle += 'Back-to-back ';
    switch (this.Type) {
      case AchievementType.PerfectClear:
        title += 'Perfect Clear ';
        break;
      case AchievementType.TSpinMini:
        title += 'T-Spin Mini ';
        break;
      case AchievementType.TSpin:
        title += 'T-Spin ';
        break;
      default:
        break;
    }
    if (this.Type !== AchievementType.PerfectClear) {
      switch (this.LinesCleared.length) {
        case 4:
          title += 'Tetris ';
          break;
        case 3:
          title += 'Triple ';
          break;
        case 2:
          title += 'Double ';
          break;
        case 1:
          title += 'Single ';
          break;
        default:
          break;
      }
    }
    return [subtitle.trim(), title.trim()];
  }
}
export default GameAchievement;

export function BackToBackEligible(achievement: GameAchievement): boolean {
  return achievement.Type === AchievementType.LineClear && achievement.LinesCleared.length >= 4
    || (achievement.Type === AchievementType.TSpin
    || achievement.Type === AchievementType.TSpinMini) && achievement.LinesCleared.length > 0;
}