import { Aggregate } from '../../../lib/elements/Aggregate';
import { CommandWithMetadata } from '../../../lib/elements/CommandWithMetadata';
import { DomainEvent } from '../../../lib/elements/DomainEvent';

class Game extends Aggregate {
  public state: {
    currentLevel?: number;
    isCompleted: boolean;
  };

  public constructor () {
    super();

    this.state = {
      currentLevel: undefined,
      isCompleted: false
    };
  }

  public open (command: CommandWithMetadata): DomainEvent[] {
    if (this.state.currentLevel !== undefined) {
      throw new Error('Game has already been opened.');
    }

    return [
      DomainEvent.from(command, 'opened', {})
    ];
  }
}

export { Game };
