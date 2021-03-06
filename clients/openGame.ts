import axios from 'axios';
import { buntstift } from 'buntstift';
import { Command } from '../lib/elements/Command';
import { DomainEvent } from '../lib/elements/DomainEvent';
import ndjson from 'ndjson';
import { uuid } from 'uuidv4';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  try {
    const gameId = uuid();
    const openGame = new Command('playing', 'game', gameId, 'open', {});

    const { data: dataCommand } = await axios({
      method: 'post',
      url: 'http://localhost:3002/command',
      data: openGame
    });

    buntstift.success(`Delivered the 'open game' command with command id '${dataCommand.commandId}'.`);

    const { data: dataEvents } = await axios({
      method: 'get',
      url: 'http://localhost:3009/domain-events',
      responseType: 'stream'
    });

    dataEvents.pipe(ndjson()).on('data', (domainEvent: DomainEvent): void => {
      if (!domainEvent.contextName) {
        return;
      }

      buntstift.success('Received the response domain event.');

      /* eslint-disable no-console */
      console.log(domainEvent);
      /* eslint-enable no-console */
    });
  } catch (ex) {
    buntstift.error(ex.message ?? 'An unexpected error occured.');

    /* eslint-disable unicorn/no-process-exit */
    process.exit(1);
    /* eslint-enable unicorn/no-process-exit */
  }
})();
/* eslint-enable @typescript-eslint/no-floating-promises */
