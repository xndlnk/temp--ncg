import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { flaschenpost } from 'flaschenpost';
import { getApi as getApiCommand } from '../servers/command/getApi';
import { getApi as getApiDomainEvent } from '../servers/domainEvent/getApi';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = express();

api.use(cors());
api.use(bodyParser.json());

api.use('/command', getApiCommand());
api.use('/domain-event', getApiDomainEvent());

const server = http.createServer(api);

server.listen(3000, (): void => {
  logger.info('Single-process server started.', { port: 3000 });
});
