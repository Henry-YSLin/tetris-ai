import { Constructor } from './TypeUtils';

export default class DependencyContainer {
  public readonly Parent: DependencyContainer | null;

  #dependencyMap: Map<Constructor, any>;

  public constructor(parent?: DependencyContainer) {
    this.Parent = parent || null;
    this.#dependencyMap = new Map();
  }

  public register(instance: any): void {
    this.#dependencyMap.set(instance.constructor, instance);
  }

  public unregister(classType: Constructor): void {
    this.#dependencyMap.delete(classType);
  }

  public resolve<T>(classType: Constructor<T>): T {
    const instance = this.#dependencyMap.get(classType);
    if (instance) {
      return instance;
    }

    if (this.Parent) {
      return this.Parent.resolve(classType);
    }

    throw new Error(`Cannot resolve ${classType.name}`);
  }

  public createChildContainer(): DependencyContainer {
    return new DependencyContainer(this);
  }
}
