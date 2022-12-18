import { TetrominoType } from '../../../Tetrominos';
import ChoiceRatingAI from './ChoiceRatingAI';
import '../../../utils/Array';
import RatedPlacement from './RatedPlacement';

export default class MediumRenAI extends ChoiceRatingAI {
  protected override rateChoice(choice: RatedPlacement): number {
    let ret = 0;
    ret -= choice.GlobalHighestRow;
    ret -= choice.HighestRow * 4;
    ret -= choice.EnclosedHoles * 10;
    ret -= choice.OpenHoles * 10;
    ret -= choice.BlocksAboveHoles;
    ret -= choice.IWells.filter(x => x >= 3).sum();
    ret -= choice.Bumpiness;
    if (choice.Achievement) {
      ret += choice.Achievement.Combo * 10;
    }
    ret += choice.HoldPiece === TetrominoType.I ? 10 : 0;
    if (choice.IsDead) ret = Number.MIN_VALUE;
    return ret;
  }
}
