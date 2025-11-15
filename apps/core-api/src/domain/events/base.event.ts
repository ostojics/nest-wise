/**
 * Base class for all domain events.
 * Domain events represent something significant that happened in the domain.
 */
export abstract class DomainEvent {
  /**
   * The timestamp when the event occurred
   */
  public readonly occurredOn: Date;

  /**
   * The name of the event
   */
  public readonly eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredOn = new Date();
  }
}
