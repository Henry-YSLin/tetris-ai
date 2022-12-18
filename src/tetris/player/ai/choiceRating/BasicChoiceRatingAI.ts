import { TetrominoType } from '../../../Tetrominos';
import ChoiceRatingAI from './ChoiceRatingAI';
import RatedPlacement from './RatedPlacement';

export default class BasicChoiceRatingAI extends ChoiceRatingAI {
  protected override rateChoice(choice: RatedPlacement): number {
    let ret = 0;
    ret -= choice.GlobalHighestRow;
    ret -= choice.HighestRow;
    ret -= choice.EnclosedHoles;
    ret -= choice.OpenHoles;
    ret -= choice.BlocksAboveHoles;
    ret -= choice.IWells.sum();
    ret += (choice.Achievement?.Rating ?? 0) * 10;
    ret -= choice.Bumpiness;
    ret += choice.HoldPiece === TetrominoType.I ? 10 : 0;
    if (choice.IsDead) ret = Number.MIN_VALUE;
    return ret;
  }
}
