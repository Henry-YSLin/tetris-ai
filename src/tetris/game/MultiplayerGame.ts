import Game from './Game';
import Player from '../player/Player';
import MultiGameState from '../MultiGameState';

export interface Participant {
  player: Player;
  state: MultiGameState;
}

export default abstract class MultiplayerGame extends Game {
  Participants: Participant[];

  constructor() {
    super();
    this.Participants = [];
  }
}
