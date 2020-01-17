import { CommandWithMetadata } from './CommandWithMetadata';
import { uuid } from 'uuidv4';

class DomainEvent {
  public contextName: string;

  public aggregateName: string;

  public aggregateId: string;

  public name: string;

  public data: object;

  public id: string;

  public metadata: {
    timestamp: number;

    causationId: string;

    correlationId: string;
  };

  public constructor (
    contextName: string,
    aggregateName: string,
    aggregateId: string,
    name: string,
    data: object,
    id: string,
    metadata: {
      timestamp: number;
      causationId: string;
      correlationId: string;
    }
  ) {
    this.contextName = contextName;
    this.aggregateName = aggregateName;
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
    this.id = id;
    this.metadata = metadata;
  }

  public static from (command: CommandWithMetadata, name: string, data: object): DomainEvent {
    const domainEvent = new DomainEvent(
      command.contextName,
      command.aggregateName,
      command.aggregateId,
      name,
      data,
      uuid(),
      {
        timestamp: Date.now(),
        causationId: command.id,
        correlationId: command.metadata.correlationId
      }
    );

    return domainEvent;
  }
}

export { DomainEvent };
