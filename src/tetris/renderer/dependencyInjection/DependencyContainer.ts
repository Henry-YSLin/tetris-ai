import { Constructor } from './TypeUtils';

export default class DependencyContainer {
  public readonly Parent: DependencyContainer | null;

  #dependencyMap: Map<Constructor, any>;

  public constructor(parent?: DependencyContainer) {
    this.Parent = parent || null;
    this.#dependencyMap = new Map();
  }

  public Register(instance: any): void {
    this.#dependencyMap.set(instance.constructor, instance);
  }

  public Unregister(classType: Constructor): void {
    this.#dependencyMap.delete(classType);
  }

  public Resolve<T>(classType: Constructor<T>): T {
    const instance = this.#dependencyMap.get(classType);
    if (instance) {
      return instance;
    }

    if (this.Parent) {
      return this.Parent.Resolve(classType);
    }

    throw new Error(`Cannot resolve ${classType.name}`);
  }

  public CreateChildContainer(): DependencyContainer {
    return new DependencyContainer(this);
  }
}
