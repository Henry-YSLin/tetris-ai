import { TICK_RATE } from '../Consts';
import GameInput from '../GameInput';
import GameInputResult from '../GameInputResult';
import Player from '../player/Player';
import { RotationDirection } from '../Tetrominos';
import TypedEvent from '../utils/TypedEvent';
import MultiGameState, { GarbageEntry } from '../MultiGameState';
import MultiplayerGame, { Participant } from './MultiplayerGame';

export default class LocalMutiplayerGame extends MultiplayerGame {
  Participants: Participant[];

  #handle: number | null;

  #input: TypedEvent<GameInputResult>;

  #isGameEnded: boolean;

  #gameEnded: TypedEvent<void>;

  constructor(players: { player: Player; seed?: number | MultiGameState }[]) {
    super();
    this.#handle = null;
    this.Participants = players.map(p => ({
      Player: p.player,
      State: p.seed instanceof MultiGameState ? p.seed : new MultiGameState(p.seed),
    }));
    this.Participants.map(p => p.State).forEach(state =>
      state.Achievement.on(achievement => {
        const garbage = achievement.Garbage;
        const states = this.Participants.map(p => p.State).filter(s => s !== state);
        states.forEach(s => s.GarbageMeter.push(new GarbageEntry(garbage.Universal, s.TicksElapsed)));

        // TODO: target selection
        const availableTargets = states.filter(x => !x.IsDead);
        const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
        if (target) target.GarbageMeter.push(new GarbageEntry(garbage.Targeted, target.TicksElapsed));
      })
    );
    this.#input = new TypedEvent();
    this.#isGameEnded = false;
    this.#gameEnded = new TypedEvent();
  }

  get IsGameEnded(): boolean {
    if (this.#isGameEnded) return true;
    if (this.Participants.filter(p => !p.State.IsDead).length <= 1) {
      this.#isGameEnded = true;
      return true;
    }
    return false;
  }

  get Input(): TypedEvent<GameInputResult> {
    return this.#input;
  }

  get GameEnded(): TypedEvent<void> {
    return this.#gameEnded;
  }

  get ClockRunning(): boolean {
    return this.#handle !== null;
  }

  StartClock(): void {
    this.#handle = window.setInterval(this.Tick.bind(this), 1000 / TICK_RATE);
  }

  StopClock(): void {
    if (this.#handle !== null) window.clearInterval(this.#handle);
  }

  Tick(): void {
    this.Participants.forEach(p => {
      if (p.State.IsDead) return;
      p.State.Tick();
      if (p.State.IsDead) return;
      const input = p.Player.Tick(p.State.GetVisibleState());
      const falling = p.State.Falling;
      let success = false;
      switch (input) {
        case GameInput.HardDrop:
          success = p.State.HardDropPiece();
          break;
        case GameInput.Hold:
          success = p.State.HoldPiece();
          break;
        case GameInput.RotateCW:
          success = p.State.RotatePiece(RotationDirection.CW);
          break;
        case GameInput.RotateCCW:
          success = p.State.RotatePiece(RotationDirection.CCW);
          break;
        case GameInput.ShiftLeft:
          success = p.State.ShiftPiece(-1);
          break;
        case GameInput.ShiftRight:
          success = p.State.ShiftPiece(1);
          break;
        case GameInput.SoftDrop:
          success = p.State.SoftDropPiece(false);
          break;
        default:
          break;
      }
      if (input !== GameInput.None) {
        this.#input.emit(new GameInputResult(p.State.TicksElapsed, input, success, falling, p.Player));
      }
    });
    if (!this.#isGameEnded && this.IsGameEnded) {
      this.#gameEnded.emit();
    }
  }
}
