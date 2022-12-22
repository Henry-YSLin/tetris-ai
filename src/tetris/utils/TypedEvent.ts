export interface Listener<T> {
  (event: T): void;
}

export interface Disposable {
  dispose(): void;
}

/** passes through events as they happen. You will not get events from before you start listening */
export default class TypedEvent<T> {
  private listeners: Listener<T>[] = [];

  private listenersOncer: Listener<T>[] = [];

  public On = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener);
    return {
      dispose: () => this.Off(listener),
    };
  };

  public Once = (listener: Listener<T>): void => {
    this.listenersOncer.push(listener);
  };

  public Off = (listener: Listener<T>): void => {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  };

  public Emit = (event: T): void => {
    /** Update any general listeners */
    this.listeners.forEach(listener => listener(event));

    /** Clear the `Once` queue */
    if (this.listenersOncer.length > 0) {
      const toCall = this.listenersOncer;
      this.listenersOncer = [];
      toCall.forEach(listener => listener(event));
    }
  };

  public Pipe = (te: TypedEvent<T>): Disposable => this.On(e => te.Emit(e));
}
