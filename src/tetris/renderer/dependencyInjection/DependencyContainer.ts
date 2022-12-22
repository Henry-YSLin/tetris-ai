import { Constructor, ConcreteConstructor } from './TypeUtils';

export default class DependencyContainer {
  public readonly Parent: DependencyContainer | null;

  #dependencyMap: Map<Constructor, any>;

  public constructor(parent?: DependencyContainer) {
    this.Parent = parent || null;
    this.#dependencyMap = new Map();
  }

  /**
   * Registers a dependency to be injected.
   * @param instance An instance of the dependency to be injected.
   * @param classType The class type of the dependency to identify this class. Can be a parent class of the instance. If not provided, the type of the instance will be used.
   */
  public Register<T, U>(instance: T, classType?: U & (ConcreteConstructor<T> extends U ? U : never)): void {
    this.#dependencyMap.set(classType ?? (instance as any).constructor, instance);
  }

  /**
   * Remove a dependency from the container.
   * @param classType The class type of the dependency to be unregistered.
   */
  public Unregister(classType: Constructor): void {
    this.#dependencyMap.delete(classType);
  }

  /**
   * Resolve a dependency from the container.
   * @param classType The class type of the dependency to be resolved.
   * @returns The resolved dependency.
   * @throws Error if the dependency cannot be resolved.
   */
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
