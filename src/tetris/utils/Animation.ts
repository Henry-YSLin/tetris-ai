export type EasingFunction = (progress: number) => number;

export default class Animation<TData> {
  From: number;

  To: number;

  Duration: number;

  Elapsed: number;

  Data: TData;

  EasingFunction: EasingFunction;

  constructor(from: number, to: number, duration: number, data: TData, elapsed = 0, func = Animation.Linear) {
    this.From = from;
    this.To = to;
    this.Duration = duration;
    this.Data = data;
    this.Elapsed = elapsed;
    this.EasingFunction = func;
  }

  static Linear(progress: number): number {
    return progress;
  }

  static EaseOutQuint(progress: number): number {
    return 1 - (1 - progress) ** 5;
  }

  static EaseInOutSine(progress: number): number {
    return -(Math.cos(Math.PI * progress) - 1) / 2;
  }

  static RevertingFunction(func = Animation.EaseInOutSine, inOutPercentage = 0.2): EasingFunction {
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

  get CurrentValue(): number {
    return this.From + (this.To - this.From) * this.EasingFunction(this.Elapsed / this.Duration);
  }

  get Finished(): boolean {
    return this.Elapsed >= this.Duration;
  }

  Tick(delta = 1): void {
    this.Elapsed += delta;
  }
}
