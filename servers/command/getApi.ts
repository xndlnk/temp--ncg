import axios from 'axios';
import bodyParser from 'body-parser';
import { Command } from '../../lib/elements/Command';
import { CommandWithMetadata } from '../../lib/elements/CommandWithMetadata';
import cors from 'cors';
import { flaschenpost } from 'flaschenpost';
import { uuid } from 'uuidv4';
import express, { Application } from 'express';

const logger = flaschenpost.getLogger();

const getApi = function (): Application {
  const api = express();

  api.use(cors());
  api.use(bodyParser.json());

  api.post('/command', async (req, res): Promise<void> => {
    const command = req.body as Command;

    const commandId = uuid();

    const commandWithMetadata = new CommandWithMetadata(
      command.contextName,
      command.aggregateName,
      command.aggregateId,
      command.name,
      command.data,
      commandId,
      {
        timestamp: Date.now(),
        causationId: commandId,
        correlationId: commandId
      }
    );

    logger.info('Command received.', { command, commandWithMetadata });

    await axios({
      method: 'post',
      url: 'http://localhost:3003/command',
      data: commandWithMetadata
    });

    logger.info('Command stored in command store.', { commandWithMetadata });

    res.status(200).json({ commandId });
  });

  return api;
};

export { getApi };
