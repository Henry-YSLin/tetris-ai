import { AchievementType } from '../../../GameAchievement';
import { TetrominoType } from '../../../Tetrominos';
import ChoiceRatingAI from './ChoiceRatingAI';
import '../../../utils/Array';
import RatedPlacement from './RatedPlacement';

export default class MediumTetrisAI extends ChoiceRatingAI {
  protected rateChoice(choice: RatedPlacement): number {
    let ret = 0;
    ret -= choice.GlobalHighestRow * 2;
    ret -= choice.HighestRow * 4;
    ret -= choice.EnclosedHoles * 20;
    ret -= choice.OpenHoles * 20;
    ret -= choice.BlocksAboveHoles;
    const wells = choice.IWells.filter(x => x >= 3);
    if (wells.length > 0) ret -= wells.sum() - wells.max();
    ret -= choice.Bumpiness;
    if (choice.Achievement) {
      if (choice.Achievement.Type === AchievementType.LineClear) {
        if (choice.Achievement.LinesCleared.length === 4) ret += choice.Achievement.Rating * 20;
        else ret -= (4 - choice.Achievement.LinesCleared.length) * 20;
      } else {
        ret += (choice.Achievement?.Rating ?? 0) * 5;
      }
    }
    ret += choice.HoldPiece === TetrominoType.I ? 10 : 0;
    if (choice.IsDead) ret = Number.MIN_VALUE;
    return ret;
  }
}
