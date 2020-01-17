import { Command } from './Command';

class CommandWithMetadata extends Command {
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
    super(contextName, aggregateName, aggregateId, name, data);

    this.id = id;
    this.metadata = metadata;
  }
}

export { CommandWithMetadata };
