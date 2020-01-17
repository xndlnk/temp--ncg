import { Aggregate } from '../../../../lib/elements/Aggregate';
import { CommandWithMetadata } from '../../../../lib/elements/CommandWithMetadata';
import { DomainEvent } from '../../../../lib/elements/DomainEvent';
import riddles from '../../riddles.json';

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

  // Command handlers
  public open (command: CommandWithMetadata): DomainEvent[] {
    if (this.state.currentLevel !== undefined) {
      throw new Error('Game has already been opened.');
    }

    const level = 1;
    const { riddle } = riddles[level - 1];

    return [
      DomainEvent.from(command, 'opened', {
        level,
        riddle
      })
    ];
  }

  // Domain event handlers
  public opened (domainEvent: DomainEvent): void {
    this.state.currentLevel = (domainEvent.data as any).level;
  }
}

export { Game };
