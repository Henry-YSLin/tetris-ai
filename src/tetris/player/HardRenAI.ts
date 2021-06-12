import HardAI, { PlacementInfo }  from './HardAI';

export default class HardRenAI extends HardAI {
  protected rateChoice(choice: PlacementInfo): number {
    let ret = 0;
    ret -= choice.globalTop;
    ret -= choice.pieceTop * 4;
    ret -= choice.enclosedHoles * 10;
    ret -= choice.openHoles * 10;
    ret -= choice.blocksAboveHoles;
    ret -= choice.iWells;
    if (choice.achievement) {
      ret += choice.achievement.Combo * 10;
    }
    return ret;
  }
}