export default class Animation<TData> {
  From: number;
  To: number;
  Duration: number;
  Elapsed: number;
  Data: TData;
  Function: (progress: number) => number;

  constructor(from: number, to: number, duration: number, data: TData, elapsed = 0, func = Animation.Linear) {
    this.From = from;
    this.To = to;
    this.Duration = duration;
    this.Data = data;
    this.Elapsed = elapsed;
    this.Function = func;
  }

  static Linear(progress: number): number {
    return progress;
  }

  static EaseOutQuint(progress: number): number {
    return 1 - Math.pow(1 - progress, 5);
    }

  get CurrentValue(): number {
    return this.From + (this.To - this.From) * this.Function(this.Elapsed / this.Duration);
  }

  get Finished(): boolean {
    return this.Elapsed >= this.Duration;
  }

  Tick(delta = 1): void {
    this.Elapsed += delta;
  }
}