export default class GarbageEntry {
  public constructor(
    /**
     * The number of garbage lines this entry contains.
     * These lines should have holes in the same location.
     */
    public Lines: number,
    /**
     * The game tick at which this entry is enqueued into a garbage meter
     */
    public readonly TickEnqueued: number
  ) {}

  public Clone(): GarbageEntry {
    return new GarbageEntry(this.Lines, this.TickEnqueued);
  }
}
