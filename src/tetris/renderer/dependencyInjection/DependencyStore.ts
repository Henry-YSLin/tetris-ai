import DependencyContainer from './DependencyContainer';
import { Constructor } from '../../utils/TypeUtils';

interface DependencyInfo {
  dependencies: Constructor[];
  loader: (...args: any) => void;
}

class DependencyStore {
  private dependencyMap: Map<Constructor, DependencyInfo> = new Map();

  public Register(classType: Constructor, dependencies: Constructor[], loader: (...args: any) => void): void {
    this.dependencyMap.set(classType, {
      dependencies,
      loader,
    });
  }

  public Inject(instance: any, dependencyContainer: DependencyContainer): void {
    // get all constructors in the prototype chain of instance
    const constructors: Constructor[] = [];
    let prototype = Object.getPrototypeOf(instance);
    while (prototype) {
      constructors.push(prototype.constructor);
      prototype = Object.getPrototypeOf(prototype);
    }

    // reverse the list
    constructors.reverse();

    // inject dependencies for each constructor
    constructors.forEach(ctor => {
      const dependencyInfo = this.dependencyMap.get(ctor);
      if (dependencyInfo) {
        const dependencies = dependencyInfo.dependencies.map(dependency => dependencyContainer.Resolve(dependency));
        dependencyInfo.loader.apply(instance, dependencies);
      }
    });
  }
}

export default new DependencyStore();
