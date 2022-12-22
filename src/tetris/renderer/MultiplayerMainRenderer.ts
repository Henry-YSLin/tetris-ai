import MultiplayerGame, { Participant } from '../game/MultiplayerGame';
import RepeatableInputHandler from './components/inputHandler/RepeatableInputHandler';
import MultiplayerRenderer from './MultiplayerRenderer';

export default class MultiplayerMainRenderer extends MultiplayerRenderer {
  public constructor(game: MultiplayerGame, participant: Participant) {
    super(game, participant, new RepeatableInputHandler());
  }
}
