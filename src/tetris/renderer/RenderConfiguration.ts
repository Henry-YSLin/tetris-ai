import { OptionalFieldsOf } from '../utils/TypeUtils';

export default class RenderConfiguration {
  public BlockSize = 20;

  public Width = 440;

  public Height = 502;

  public Framerate = 60;

  public SoundVolume = 0.5;

  public UpdateConfig(options: OptionalFieldsOf<RenderConfiguration>): void {
    this.Width = options.width ?? this.Width;
    this.Height = options.height ?? this.Height;
    this.BlockSize = options.blockSize ?? this.BlockSize;
    this.Framerate = options.framerate ?? this.Framerate;
    this.SoundVolume = options.soundVolume ?? this.SoundVolume;
  }

  public constructor(options: OptionalFieldsOf<RenderConfiguration> = {}) {
    this.UpdateConfig(options);
  }
}
