import p5Types from 'p5';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { Drawable } from './Renderer';
import { GameStateUsable } from './GameStateUsable';
import Animation from '../utils/Animation';
import { ANIMATION_DURATION } from '../Consts';
import { TetrominoType } from '../Tetrominos';
import Vector from '../utils/Vector';
import { p5text } from './Helper';

type AchievementAnimationData = {
  subtitle: string;
  title: string;
  rating: number;
};

export type AchievementTextDrawable = Constructor<{
  AchievementAnimation: Animation<AchievementAnimationData> | null;
  p5Draw(p5: p5Types): void,
  ConfigureAchievementTextDrawable(offset: Vector, scale: Vector): void,
}>;

export default function AchievementTextDrawable<TBase extends Drawable & GameStateUsable>(Base: TBase): TBase & AchievementTextDrawable {
  return class AchievementTextDrawable extends Base {
    #offset: Vector;
    #scale: Vector;

    AchievementAnimation: Animation<AchievementAnimationData> | null;

    constructor(...args: MixinArgs) {
      super(...args);
      this.AchievementAnimation = null;
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigureAchievementTextDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
      if (this.State === null) {
        console.error('ConfigureAchievementTextDrawable called before this.State is assigned. Beware of the call order of Configure_ functions.');
        return;
      }
      this.State.Achievement.on((achievement) => {
        const [subtitle, title] = achievement.toString();
        this.AchievementAnimation = new Animation(
          0,
          1,
          ANIMATION_DURATION * 5 * achievement.Rating,
          { subtitle, title, rating: achievement.Rating },
          0,
          Animation.RevertingFunction(),
        );
      });
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const animation = this.AchievementAnimation;
      if (animation) {
        animation.Tick();
        if (animation.Finished)
          this.AchievementAnimation = null;

        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.fill(255, 255, 255, 255 * animation.CurrentValue);
        p5.noStroke();
        p5.textSize(15 * animation.Data.rating * 0.8);
        p5text(p5, animation.Data.subtitle, 0, 15 * animation.Data.rating);
        p5.textSize(15 * animation.Data.rating);
        p5text(p5, animation.Data.title, 0, 0);
      }
    }
  };
}