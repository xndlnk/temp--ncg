import bodyParser from 'body-parser';
import { CommandWithMetadata } from '../../lib/elements/CommandWithMetadata';
import cors from 'cors';
import express from 'express';
import { flaschenpost } from 'flaschenpost';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = express();

api.use(cors());
api.use(bodyParser.json());

let database: {
  command: CommandWithMetadata;
  isProcessing: boolean;
}[] = [];

api.post('/command', (req, res): void => {
  const command = req.body as CommandWithMetadata;

  database.push({ command, isProcessing: false });

  logger.info('Command stored.', { command });

  res.status(200).json({});
});

api.get('/commands', (_req, res): void => {
  res.status(200).json(database);
});

api.post('/mark-as-processing', (req, res): void => {
  const { commandId } = req.body as { commandId: string };

  const commandWithStatus = database.find(
    (row): boolean => row.command.id === commandId
  );

  if (!commandWithStatus) {
    res.status(404).json({});

    return;
  }

  commandWithStatus.isProcessing = true;

  res.status(200).json({});
});

api.delete('/command', (req, res): void => {
  const { commandId } = req.body as { commandId: string };

  database = database.filter((row): boolean => row.command.id !== commandId);

  logger.info('Removed command from store.', { commandId });

  res.status(200).json({});
});

const server = http.createServer(api);

server.listen(3003, (): void => {
  logger.info('Command store server started.', { port: 3003 });
});
