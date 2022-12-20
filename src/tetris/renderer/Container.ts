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

  public override Load(parent: Container | null, dependencies: DependencyContainer): void {
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
    super.SetupSubTree();

    this.graphics.p5.push();
    this.applyTransform(this.graphics);
    this.Setup(this.graphics);
    this.children.forEach(child => child.SetupSubTree());
    this.graphics.p5.pop();
  }

  public override UpdateSubTree(): void {
    super.UpdateSubTree();
    this.children.forEach(child => child.UpdateSubTree());
  }

  public override DrawSubTree(): void {
    this.graphics.p5.push();
    this.applyTransform(this.graphics);
    this.Draw(this.graphics);
    this.children.forEach(child => child.DrawSubTree());
    this.graphics.p5.pop();
  }
}
