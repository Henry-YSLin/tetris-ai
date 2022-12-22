import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { p5Text } from '../../Helper';
import AnimationManager from '../AnimationManager';
import Drawable from './Drawable';

export default class GameEventTextDrawable extends Drawable {
  protected animationManager: AnimationManager = null!;

  @Inject(AnimationManager)
  private loadGameEventTextDrawable(animationManager: AnimationManager): void {
    this.animationManager = animationManager;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;
    const animation = this.animationManager.GameEventAnimation;
    if (!animation) return;

    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.fill(255, 255, 255, 255 * animation.CurrentValue);
    p5.noStroke();
    p5.textSize(15 * animation.Data.rating * 0.8);
    p5Text(p5, animation.Data.subtitle, 0, 15 * animation.Data.rating);
    p5.textSize(15 * animation.Data.rating);
    p5Text(p5, animation.Data.title, 0, 0);
  }
}
