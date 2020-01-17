import bodyParser from 'body-parser';
import cors from 'cors';
import { DomainEvent } from '../../lib/elements/DomainEvent';
import { EventEmitter } from 'events';
import express from 'express';
import { flaschenpost } from 'flaschenpost';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = express();

api.use(cors());
api.use(bodyParser.json());

const eventEmitter = new EventEmitter();

api.post('/domain-events', async (req, res): Promise<void> => {
  const domainEvents = req.body as DomainEvent[];

  eventEmitter.emit('domain-events', domainEvents);

  res.status(200).json({});
});

api.get('/domain-events', (_req, res): void => {
  res.writeHead(200, {
    'content-type': 'application/x-ndjson'
  });

  res.write('{}\n');

  eventEmitter.on('domain-events', (domainEvents: DomainEvent[]): void => {
    for (const domainEvent of domainEvents) {
      res.write(`${JSON.stringify(domainEvent)}\n`);
    }
  });
});

const server = http.createServer(api);

server.listen(3008, (): void => {
  logger.info('Domain event publisher server started.', { port: 3008 });
});
