import { AchievementType } from '../GameAchievement';
import { TetrominoType } from '../Tetrominos';
import ChoiceRatingAI, { PlacementInfo } from './ChoiceRatingAI';
import '../utils/Array';

export default class MediumTetrisAI extends ChoiceRatingAI {
  protected rateChoice(choice: PlacementInfo): number {
    let ret = 0;
    ret -= choice.globalTop * 2;
    ret -= choice.pieceTop * 4;
    ret -= choice.enclosedHoles * 20;
    ret -= choice.openHoles * 20;
    ret -= choice.blocksAboveHoles;
    const wells = choice.iWells.filter(x => x >= 3);
    if (wells.length > 0) ret -= wells.sum() - wells.max();
    ret -= choice.bumpiness;
    if (choice.achievement) {
      if (choice.achievement.Type === AchievementType.LineClear) {
        if (choice.achievement.LinesCleared.length === 4) ret += choice.achievement.Rating * 20;
        else ret -= (4 - choice.achievement.LinesCleared.length) * 20;
      } else {
        ret += (choice.achievement?.Rating ?? 0) * 5;
      }
    }
    ret += choice.holdPiece === TetrominoType.I ? 10 : 0;
    if (choice.isDead) ret = Number.MIN_VALUE;
    return ret;
  }
}
