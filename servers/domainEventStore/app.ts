import bodyParser from 'body-parser';
import cors from 'cors';
import { DomainEvent } from '../../lib/elements/DomainEvent';
import express from 'express';
import { flaschenpost } from 'flaschenpost';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = express();

api.use(cors());
api.use(bodyParser.json());

const database: DomainEvent[] = [];

api.post('/domain-events', (req, res): void => {
  const domainEvents = req.body as DomainEvent[];

  for (const domainEvent of domainEvents) {
    database.push(domainEvent);
  }

  res.status(200).json({});
});

api.get('/domain-events', (_req, res): void => {
  res.status(200).json(database);
});

const server = http.createServer(api);

server.listen(3006, (): void => {
  logger.info('Domain event store server started.', { port: 3006 });
});
