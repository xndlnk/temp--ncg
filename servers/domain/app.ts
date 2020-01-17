import { Aggregate } from '../../lib/elements/Aggregate';
import axios from 'axios';
import { CommandWithMetadata } from '../../lib/elements/CommandWithMetadata';
import { DomainEvent } from '../../lib/elements/DomainEvent';
import { flaschenpost } from 'flaschenpost';
import path from 'path';
import { promisify } from 'util';
import { upperFirst } from 'lodash';

const sleep = promisify(setTimeout);

const logger = flaschenpost.getLogger();

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  try {
    logger.info('Domain server started.');

    /* eslint-disable no-constant-condition, @typescript-eslint/no-unnecessary-condition */
    while (true) {
      let data;

      try {
        ({ data } = await axios({
          method: 'get',
          url: 'http://localhost:3004/command'
        }));
      } catch (ex) {
        if (ex.response.status !== 404) {
          throw ex;
        }

        await sleep(500);
        continue;
      }

      const command = data as CommandWithMetadata;

      logger.info('Command received.', { command });

      const AggregateDefinition = await import(path.join(__dirname, '..', '..', 'app', command.contextName, command.aggregateName, 'index'));
      const AggregateConstructor = AggregateDefinition[upperFirst(command.aggregateName)];
      const aggregateInstance: Aggregate = new AggregateConstructor();

      ({ data } = await axios({
        method: 'get',
        url: `http://localhost:3006/domain-events/${command.aggregateId}`
      }));

      const previousDomainEvents = data as DomainEvent[];

      for (const previousDomainEvent of previousDomainEvents) {
        aggregateInstance.updateWithDomainEvent(previousDomainEvent);
      }

      const domainEvents = aggregateInstance.handleCommand(command);

      await axios({
        method: 'post',
        url: 'http://localhost:3006/domain-events',
        data: domainEvents
      });

      // TODO: ...

      await axios({
        method: 'post',
        url: 'http://localhost:3004/acknowledge',
        data: {
          commandId: command.id
        }
      });
    }
    /* eslint-enable no-constant-condition, @typescript-eslint/no-unnecessary-condition */
  } catch (ex) {
    logger.error(ex.message ?? 'An unexpected error occured.', { ex });

    /* eslint-disable unicorn/no-process-exit */
    process.exit(1);
    /* eslint-enable unicorn/no-process-exit */
  }
})();
/* eslint-enable @typescript-eslint/no-floating-promises */
