import { DomainEvent } from '../../../lib/elements/DomainEvent';

const projections = {
  'playing.game.opened' (rows: any[], domainEvent: DomainEvent): void {
    rows.push({
      id: domainEvent.aggregateId,
      level: (domainEvent.data as any).level,
      riddle: (domainEvent.data as any).riddle,
      isCompleted: false
    });
  }
};

export { projections };
