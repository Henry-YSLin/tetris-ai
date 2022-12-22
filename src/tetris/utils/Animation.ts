export type EasingFunction = (progress: number) => number;

export default class Animation<TData> {
  public constructor(
    public From: number,
    public To: number,
    public Duration: number,
    public Data: TData,
    public Elapsed = 0,
    public EasingFunction = Animation.Linear
  ) {}

  public static Linear(progress: number): number {
    return progress;
  }

  public static EaseOutQuint(progress: number): number {
    return 1 - (1 - progress) ** 5;
  }

  public static EaseInOutSine(progress: number): number {
    return -(Math.cos(Math.PI * progress) - 1) / 2;
  }

  public static Step(progress: number): number {
    return progress < 0.05 ? 0 : 1;
  }

  /**
   * Create an easing function that is 0 at the beginning and end of the animation.
   * @param func The easing function used for transitions in the middle of the animation.
   * @param inOutPercentage The percentage of the animation that is not 1 at the beginning and end.
   * @returns The easing function.
   */
  public static RevertingFunction(
    func: EasingFunction = Animation.EaseInOutSine,
    inOutPercentage = 0.2
  ): EasingFunction {
    return (progress: number): number => {
      if (progress <= inOutPercentage) {
        return func(progress / inOutPercentage);
      }
      if (progress >= 1 - inOutPercentage) {
        return func((1 - progress) / inOutPercentage);
      }
      return 1;
    };
  }

  public get CurrentValue(): number {
    return this.From + (this.To - this.From) * this.EasingFunction(this.Elapsed / this.Duration);
  }

  public get Finished(): boolean {
    return this.Elapsed >= this.Duration;
  }

  public Tick(delta = 1): void {
    this.Elapsed += delta;
  }
}
