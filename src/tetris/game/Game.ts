import { GameInputResult } from '../GameInput';
import TypedEvent from '../utils/TypedEvent';

export default abstract class Game {
  abstract get Input(): TypedEvent<GameInputResult>;
  abstract get ClockRunning(): boolean;
  abstract StartClock(): void;
  abstract StopClock(): void;
}