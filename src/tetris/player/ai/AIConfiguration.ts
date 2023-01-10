import { FieldsOf } from '../../utils/TypeUtils';

export default class AIConfiguration {
  /**
   * The least number of ticks to wait between AI actions
   */
  public ActionDelay = 60;

  public UpdateConfig(options: Partial<FieldsOf<AIConfiguration>>): void {
    this.ActionDelay = options.actionDelay ?? this.ActionDelay;
  }

  public constructor(options: Partial<FieldsOf<AIConfiguration>> = {}) {
    this.UpdateConfig(options);
  }

  public Serialize(): FieldsOf<AIConfiguration> {
    return {
      actionDelay: this.ActionDelay,
    };
  }
}
