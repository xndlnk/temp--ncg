import axios from 'axios';
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

api.get('/command', async (_req, res): Promise<void> => {
  const { data } = await axios({
    method: 'get',
    url: 'http://localhost:3003/commands'
  });

  const commands = data as {
    command: CommandWithMetadata;
    isProcessing: boolean;
  }[];

  const processingAggregateIds = commands.
    filter((row): boolean => row.isProcessing).
    map((row): string => row.command.aggregateId);

  const nextAvailableCommand = commands.
    find((row): boolean =>
      !row.isProcessing &&
      !processingAggregateIds.includes(row.command.aggregateId));

  if (!nextAvailableCommand) {
    res.status(404).json({});

    return;
  }

  const { command } = nextAvailableCommand;

  await axios({
    method: 'post',
    url: 'http://localhost:3003/mark-as-processing',
    data: {
      commandId: command.id
    }
  });

  res.status(200).json(command);
});

api.post('/acknowledge', async (req, res): Promise<void> => {
  const { commandId } = req.body as { commandId: string };

  await axios({
    method: 'delete',
    url: 'http://localhost:3003/command',
    data: { commandId }
  });

  res.status(200).json({});
});

const server = http.createServer(api);

server.listen(3004, (): void => {
  logger.info('Dispatcher server started.', { port: 3004 });
});
