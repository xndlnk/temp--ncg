import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DomainEvent } from '../../lib/elements/DomainEvent';
import express from 'express';
import { flaschenpost } from 'flaschenpost';
import fs from 'fs';
import http from 'http';
import ndjson from 'ndjson';
import path from 'path';

const logger = flaschenpost.getLogger();

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  try {
    const api = express();

    api.use(cors());
    api.use(bodyParser.json());

    const entries = await fs.promises.readdir(path.join(__dirname, '..', '..', 'app', 'views'), { withFileTypes: true });

    // This should actually be a database, which should run as a process of its
    // own. For the sake of simplicity we used an in-memory array here, which on
    // the other hand means that the projections also need to be part of this
    // server, as otherwise they could not access the array.
    // In a real-world solution running the queries via the HTTP routes and
    // running the projections should be split into separate servers, which only
    // have the database in common.
    const views: Record<string, any[]> = {};

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      views[entry.name] = [];
    }

    const { data: dataEvents } = await axios({
      method: 'get',
      url: 'http://localhost:3008/domain-events',
      responseType: 'stream'
    });

    dataEvents.pipe(ndjson()).on('data', async (domainEvent: DomainEvent): Promise<void> => {
      if (!domainEvent.contextName) {
        return;
      }

      logger.info('Domain Event received.', { domainEvent });

      for (const [ viewName, view ] of Object.entries(views)) {
        const viewDefinition = await import(path.join(__dirname, '..', '..', 'app', 'views', viewName, 'index'));
        const { projections } = viewDefinition;

        const fullyQualifiedDomainEventName = `${domainEvent.contextName}.${domainEvent.aggregateName}.${domainEvent.name}`;

        if (!projections[fullyQualifiedDomainEventName]) {
          continue;
        }

        projections[fullyQualifiedDomainEventName](view, domainEvent);
      }
    });

    api.get('/query/:viewName', async (req, res): Promise<void> => {
      const { viewName } = req.params;

      res.status(200).json(views[viewName]);
    });

    const server = http.createServer(api);

    server.listen(3010, (): void => {
      logger.info('Query server started.', { port: 3010 });
    });
  } catch (ex) {
    logger.error(ex.message ?? 'An unexpected error occured.', { ex });

    /* eslint-disable unicorn/no-process-exit */
    process.exit(1);
    /* eslint-enable unicorn/no-process-exit */
  }
})();
/* eslint-enable @typescript-eslint/no-floating-promises */
