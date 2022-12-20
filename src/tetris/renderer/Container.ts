import type Component from './Component';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Drawable from './Drawable';

export default class Container extends Drawable {
  private dependencies: DependencyContainer = new DependencyContainer();

  private children: Component[] = [];

  public get Children(): readonly Component[] {
    return this.children;
  }

  public set Children(children: readonly Component[]) {
    this.Clear();
    children.forEach(child => this.Add(child));
  }

  protected registerDependencies(dependencyContainer: DependencyContainer): void {}

  public override Load(parent: Container, dependencies: DependencyContainer): void {
    this.loadInternal(parent, dependencies, () => {
      this.dependencies = dependencies.createChildContainer();
      this.registerDependencies(this.dependencies);
      this.children.forEach(child => child.Load(this, this.dependencies));
    });
  }

  public Add(child: Component): void {
    this.children.push(child);
    if (this.IsLoaded) {
      child.Load(this, this.dependencies);
    }
  }

  public Remove(child: Component): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      const [deleted] = this.children.splice(index, 1);
      deleted.Unload();
    }
  }

  public Clear(): void {
    const deleted = this.children;
    this.children = [];
    deleted.forEach(child => child.Unload());
  }

  public WithChildren(...children: Component[]): Container {
    this.Children = children;
    return this;
  }

  public override SetupSubTree(): void {
    this.children.forEach(child => child.SetupSubTree());
    super.SetupSubTree();
  }

  public override UpdateSubTree(): void {
    this.children.forEach(child => child.UpdateSubTree());
    super.UpdateSubTree();
  }
}
