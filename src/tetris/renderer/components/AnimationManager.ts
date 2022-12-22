import { ANIMATION_DURATION } from '../../Consts';
import Game from '../../game/Game';
import GameInput from '../../GameInput';
import GameState from '../../gameState/GameState';
import Player from '../../player/Player';
import { TetrominoType } from '../../Tetrominos';
import Animation from '../../utils/Animation';
import Inject from '../dependencyInjection/InjectDecorator';
import Component from './Component';

type HardDropAnimationData = {
  left: number;
  right: number;
  end: number;
  type: TetrominoType;
};

type LineClearAnimationData = {
  y: number;
  origY: number;
};

type GameEventAnimationData = {
  subtitle: string;
  title: string;
  rating: number;
};

export default class AnimationManager extends Component {
  private hardDropAnimations: Animation<HardDropAnimationData>[] = [];

  private lineClearAnimations: Animation<LineClearAnimationData>[] = [];

  private gameEventAnimation: Animation<GameEventAnimationData> | null = null;

  public get HardDropAnimations(): readonly Animation<HardDropAnimationData>[] {
    return this.hardDropAnimations;
  }

  public get LineClearAnimations(): readonly Animation<LineClearAnimationData>[] {
    return this.lineClearAnimations;
  }

  public get GameEventAnimation(): Animation<GameEventAnimationData> | null {
    return this.gameEventAnimation;
  }

  protected game: Game = null!;

  protected player: Player = null!;

  protected gameState: GameState = null!;

  @Inject(Game, Player, GameState)
  private loadAnimationManager(game: Game, player: Player, gameState: GameState): void {
    this.game = game;
    this.player = player;
    this.gameState = gameState;
  }

  protected override preSetup(): void {
    this.game.Input.On(result => {
      if (result.Player !== this.player) return;
      if (result.Input !== GameInput.HardDrop || !result.Success) return;
      if (!result.Falling) return;
      this.hardDropAnimations.push(
        new Animation(
          1,
          0,
          ANIMATION_DURATION,
          {
            left: result.Falling.Left,
            right: result.Falling.Right,
            end: result.Falling.Top,
            type: result.Falling.Type,
          },
          0,
          Animation.EaseOutQuint
        )
      );
    });

    this.gameState.Achievement.On(achievement => {
      let offset = 0;
      achievement.LinesCleared.forEach(line => {
        this.lineClearAnimations.filter(x => x.Data.y > line).forEach(x => x.Data.y--);
        this.lineClearAnimations.push(
          new Animation(1, 0, ANIMATION_DURATION + offset, { y: line, origY: line }, 0, Animation.EaseOutQuint)
        );
        offset += ANIMATION_DURATION / 5;
      });
    });

    this.gameState.Achievement.On(achievement => {
      const [subtitle, title] = achievement.ToString();
      this.gameEventAnimation = new Animation(
        0,
        1,
        ANIMATION_DURATION * 5 * achievement.Rating,
        { subtitle, title, rating: achievement.Rating },
        0,
        Animation.RevertingFunction()
      );
    });
  }

  protected override update(): void {
    this.hardDropAnimations.forEach(x => x.Tick());
    this.hardDropAnimations = this.hardDropAnimations.filter(x => !x.Finished);

    this.lineClearAnimations.forEach(x => x.Tick());
    this.lineClearAnimations = this.lineClearAnimations.filter(x => !x.Finished);

    this.gameEventAnimation?.Tick();
    if (this.gameEventAnimation?.Finished) this.gameEventAnimation = null;
  }
}
