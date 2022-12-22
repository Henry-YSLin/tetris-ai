import Game from './Game';
import Player from '../player/Player';
import MultiGameState from '../gameState/MultiGameState';

export interface Participant {
  player: Player;
  state: MultiGameState;
}

export default abstract class MultiplayerGame extends Game {
  public Participants: Participant[];

  public constructor() {
    super();
    this.Participants = [];
  }
}
