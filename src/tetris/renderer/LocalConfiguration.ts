import { FieldsOf } from '../utils/TypeUtils';

export default class LocalConfiguration {
  public BlockSize = 30;

  public Width = 630;

  public Height = 703;

  /**
   * The number of frames per second. Use undefined to match dispaly refresh rate.
   */
  public Framerate: number | undefined = undefined;

  public SoundVolume = 0.5;

  public BackgroundColor = '#34515e';

  /**
   * Number of frames a normal animation lasts for
   */
  public AnimationDuration = 20;

  /**
   * The number of frames to wait before repeating input
   */
  public AutoRepeatDelay = 20;

  /**
   * The number of frames to wait between repeated inputs
   */
  public AutoRepeatInterval = 5;

  public UpdateConfig(options: Partial<FieldsOf<LocalConfiguration>>): void {
    this.Width = options.width ?? this.Width;
    this.Height = options.height ?? this.Height;
    this.BlockSize = options.blockSize ?? this.BlockSize;
    this.Framerate = options.framerate ?? this.Framerate;
    this.SoundVolume = options.soundVolume ?? this.SoundVolume;
    this.AnimationDuration = options.animationDuration ?? this.AnimationDuration;
    this.BackgroundColor = options.backgroundColor ?? this.BackgroundColor;
    this.AutoRepeatDelay = options.autoRepeatDelay ?? this.AutoRepeatDelay;
    this.AutoRepeatInterval = options.autoRepeatInterval ?? this.AutoRepeatInterval;
  }

  public constructor(options: Partial<FieldsOf<LocalConfiguration>> = {}) {
    this.UpdateConfig(options);
  }

  public Serialize(): FieldsOf<LocalConfiguration> {
    return {
      width: this.Width,
      height: this.Height,
      blockSize: this.BlockSize,
      framerate: this.Framerate,
      soundVolume: this.SoundVolume,
      animationDuration: this.AnimationDuration,
      backgroundColor: this.BackgroundColor,
      autoRepeatDelay: this.AutoRepeatDelay,
      autoRepeatInterval: this.AutoRepeatInterval,
    };
  }
}
