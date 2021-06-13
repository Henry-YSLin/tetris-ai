import { TetrominoType } from '../Tetrominos';
import ChoiceRatingAI, { PlacementInfo }  from './ChoiceRatingAI';

export default class MediumRenAI extends ChoiceRatingAI {
  protected rateChoice(choice: PlacementInfo): number {
    let ret = 0;
    ret -= choice.globalTop;
    ret -= choice.pieceTop * 4;
    ret -= choice.enclosedHoles * 10;
    ret -= choice.openHoles * 10;
    ret -= choice.blocksAboveHoles;
    ret -= choice.iWells;
    ret -= choice.bumpiness;
    if (choice.achievement) {
      ret += choice.achievement.Combo * 10;
    }
    if (choice.isDead) ret = Number.MIN_VALUE;
    ret += choice.holdPiece === TetrominoType.I ? 10 : 0;
    return ret;
  }
}