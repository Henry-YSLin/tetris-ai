import type Container from './Container';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import DependencyStore from './dependencyInjection/DependencyStore';
import LoadState from './LoadState';

export default class Component {
  private parent: Container | null = null;

  public get Parent(): Container | null {
    return this.parent;
  }

  private loadState: LoadState = LoadState.NotLoaded;

  public get LoadState(): LoadState {
    return this.loadState;
  }

  public get IsLoaded(): boolean {
    return this.loadState >= LoadState.Ready;
  }

  protected injectDependencies(dependencyContainer: DependencyContainer): void {
    DependencyStore.Inject(this, dependencyContainer);
  }

  public Load(parent: Container | null, dependencies: DependencyContainer): void {
    this.loadInternal(parent, dependencies, () => {});
  }

  protected loadInternal(
    parent: Container | null,
    dependencies: DependencyContainer,
    intermediateAction: () => void
  ): void {
    if (this.LoadState !== LoadState.NotLoaded) {
      throw new Error('Component already loaded');
    }
    this.parent = parent;
    this.injectDependencies(dependencies);
    intermediateAction();
    this.loadState = LoadState.Ready;
    this.loadComplete();
  }

  protected loadComplete(): void {}

  public Unload(): void {
    if (this.parent !== null) {
      this.parent.Remove(this);
      this.parent = null;
    }
    this.loadState = LoadState.NotLoaded;
  }

  protected preSetup(): void {}

  public SetupSubTree(): void {
    this.preSetup();
    this.loadState = LoadState.Loaded;
  }

  protected update(): void {}

  public UpdateSubTree(): void {
    this.update();
  }

  public DrawSubTree(): void {}
}
