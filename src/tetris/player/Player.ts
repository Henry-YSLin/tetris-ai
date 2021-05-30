import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import { Constructor } from '../utils/Mixin';

export default class Player {
  Tick(_gameState: VisibleGameState): GameInput {
    return GameInput.None;
  }
}

export type Playable = Constructor<Player>;