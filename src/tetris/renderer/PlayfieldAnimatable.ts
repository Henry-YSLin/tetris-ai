import p5Types from 'p5';
import { Constructor } from '../utils/Mixin';
import Renderer, { Drawable } from './Renderer';
import { GameStateUsable } from './GameStateUsable';
import Animation from '../utils/Animation';
import { GameUsable } from './GameUsable';
import GameInput from '../GameInput';
import { ANIMATION_DURATION } from '../Consts';
import { TetrominoType } from '../Tetrominos';
import { PlayerUsable } from './PlayerUsable';

type HardDropAnimationData = {
  left: number;
  right: number;
  end: number;
  type: TetrominoType;
};

type LineClearAnimationData = {
  Y: number;
  OrigY: number;
};

export type PlayfieldAnimatableContent = {
  HardDropAnimations: Animation<HardDropAnimationData>[];
  LineClearAnimations: Animation<LineClearAnimationData>[];
  p5Draw(p5: p5Types): void;
  ConfigurePlayfieldAnimatable(): void;
};

export function IsPlayfieldAnimatable(maybe: Renderer): maybe is Renderer & PlayfieldAnimatableContent {
  return 'ConfigurePlayfieldAnimatable' in maybe;
}

export type PlayfieldAnimatable = Constructor<PlayfieldAnimatableContent>;

export default function PlayfieldAnimatable<TBase extends Drawable & GameStateUsable & GameUsable & PlayerUsable>(
  Base: TBase
): TBase & PlayfieldAnimatable {
  return class PlayfieldAnimatable extends Base {
    HardDropAnimations: Animation<HardDropAnimationData>[];

    LineClearAnimations: Animation<LineClearAnimationData>[];

    constructor(...args: any[]) {
      super(...args);
      this.HardDropAnimations = [];
      this.LineClearAnimations = [];
    }

    ConfigurePlayfieldAnimatable(): void {
      if (this.State === null) {
        console.error(
          'ConfigurePlayfieldAnimatable called before this.State is assigned. Beware of the call order of Configure_ functions.'
        );
        return;
      }
      if (this.Game === null) {
        console.error(
          'ConfigurePlayfieldAnimatable called before this.Game is assigned. Beware of the call order of Configure_ functions.'
        );
        return;
      }
      if (this.Player === null) {
        console.error(
          'ConfigurePlayfieldAnimatable called before this.Player is assigned. Beware of the call order of Configure_ functions.'
        );
        return;
      }
      this.Game.Input.on(result => {
        if (result.Player !== this.Player) return;
        if (result.Input !== GameInput.HardDrop || !result.Success) return;
        if (!result.Falling) return;
        this.HardDropAnimations.push(
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
      this.State.Achievement.on(achievement => {
        let offset = 0;
        achievement.LinesCleared.forEach(line => {
          this.LineClearAnimations.filter(x => x.Data.Y > line).forEach(x => x.Data.Y--);
          this.LineClearAnimations.push(
            new Animation(1, 0, ANIMATION_DURATION + offset, { Y: line, OrigY: line }, 0, Animation.EaseOutQuint)
          );
          offset += ANIMATION_DURATION / 5;
        });
      });
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      this.HardDropAnimations.forEach(x => x.Tick());
      this.HardDropAnimations = this.HardDropAnimations.filter(x => !x.Finished);
      this.LineClearAnimations.forEach(x => x.Tick());
      this.LineClearAnimations = this.LineClearAnimations.filter(x => !x.Finished);
    }
  };
}
