/* eslint-disable func-style */
import { DomainEvent } from '../../../lib/elements/DomainEvent';
import { flaschenpost } from 'flaschenpost';

const logger = flaschenpost.getLogger();

function updateHighscore (rows: any[], levelInEvent: number): void {
  let highestLevel = rows?.[0]?.highscore ?? 0;

  if (levelInEvent > highestLevel) {
    highestLevel = levelInEvent;
  }

  rows.splice(0);
  rows.push({
    highscore: highestLevel
  });

  logger.info('updated highscore', { rows });
}

const projections = {
  'playing.game.levelCompleted' (rows: any[], domainEvent: DomainEvent): void {
    const levelInEvent: number = (domainEvent.data as any).level;

    updateHighscore(rows, levelInEvent);
  },
  'playing.game.opened' (rows: any[], domainEvent: DomainEvent): void {
    const levelInEvent: number = (domainEvent.data as any).level;

    updateHighscore(rows, levelInEvent);
  }
};

export { projections };
