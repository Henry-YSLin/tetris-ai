import { BLOCK_SIZE } from '../../Consts';
import { Constructor } from '../../utils/Mixin';
import { Drawable } from './Renderer';

export type BlockSizeConfigurable = Constructor<{
  BlockSize: number;
  ConfigureBlockSize(blockSize: number): void;
}>;

export default function BlockSizeConfigurable<TBase extends Drawable>(base: TBase): TBase & BlockSizeConfigurable {
  return class BlockSizeConfigurable extends base {
    protected blockSize: number;

    constructor(...args: any[]) {
      super(...args);
      this.blockSize = BLOCK_SIZE;
    }

    get BlockSize(): number {
      return this.blockSize;
    }

    ConfigureBlockSize(blockSize: number): void {
      this.blockSize = blockSize;
    }
  };
}
