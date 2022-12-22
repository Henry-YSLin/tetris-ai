import DependencyStore from './DependencyStore';
import { Constructor, MapToInstance } from '../../utils/TypeUtils';

export default function Inject<TDeps extends Constructor[], TConcreteDeps extends any[] = MapToInstance<TDeps>>(
  ...classTypes: TDeps
) {
  return function injectDecorator(
    targetPrototype: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: TConcreteDeps) => void>
  ): TypedPropertyDescriptor<(...args: TConcreteDeps) => void> {
    const originalFunc = descriptor.value;

    if (typeof originalFunc !== 'function') {
      throw new Error(`@Inject can only be used on methods, not on ${typeof originalFunc}`);
    }

    DependencyStore.Register(targetPrototype.constructor, classTypes, originalFunc);

    return descriptor;
  };
}
