import { CommandWithMetadata } from './CommandWithMetadata';
import { DomainEvent } from './DomainEvent';

abstract class Aggregate {
  public state: object;

  protected constructor () {
    this.state = {};
  }

  public handleCommand (command: CommandWithMetadata): DomainEvent[] {
    let domainEvents;

    try {
      domainEvents = (this as any)[command.name](command);
    } catch (ex) {
      domainEvents = [
        DomainEvent.from(command, `${command.name}Failed`, {
          reason: ex
        })
      ];
    }

    return domainEvents;
  }
}

export { Aggregate };
