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

api.get('/domain-events/:aggregateId', (req, res): void => {
  const { aggregateId } = req.params;

  const domainEvents = database.
    filter((row): boolean => row.aggregateId === aggregateId);

  res.status(200).json(domainEvents);
});

const server = http.createServer(api);

server.listen(3006, (): void => {
  logger.info('Domain event store server started.', { port: 3006 });
});
