import GameInputResult from '../GameInputResult';
import TypedEvent from '../utils/TypedEvent';

export default abstract class Game {
  public abstract get Input(): TypedEvent<GameInputResult>;
  public abstract get ClockRunning(): boolean;
  public abstract StartClock(): void;
  public abstract StopClock(): void;
}
