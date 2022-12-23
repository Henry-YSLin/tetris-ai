import { BACKGROUND_COLOR, BLOCK_SIZE, FRAMERATE, PLAYFIELD_HEIGHT, SOUND_VOLUME } from '../Consts';
import { OptionalFieldsOf } from '../utils/TypeUtils';

export default class RenderConfiguration {
  public BlockSize = BLOCK_SIZE;

  public Width = BLOCK_SIZE * 21;

  public Height = BLOCK_SIZE * (PLAYFIELD_HEIGHT + 0.1) + 100;

  public Framerate = FRAMERATE;

  public SoundVolume = SOUND_VOLUME;

  public BackgroundColor = BACKGROUND_COLOR;

  public UpdateConfig(options: OptionalFieldsOf<RenderConfiguration>): void {
    this.Width = options.width ?? this.Width;
    this.Height = options.height ?? this.Height;
    this.BlockSize = options.blockSize ?? this.BlockSize;
    this.Framerate = options.framerate ?? this.Framerate;
    this.SoundVolume = options.soundVolume ?? this.SoundVolume;
    this.BackgroundColor = options.backgroundColor ?? this.BackgroundColor;
  }

  public constructor(options: OptionalFieldsOf<RenderConfiguration> = {}) {
    this.UpdateConfig(options);
  }
}
