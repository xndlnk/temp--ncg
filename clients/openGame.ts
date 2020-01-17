import axios from 'axios';
import { buntstift } from 'buntstift';
import { Command } from '../lib/elements/Command';
import { uuid } from 'uuidv4';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  try {
    const openGame = new Command('playing', 'game', uuid(), 'open', {});

    const { data } = await axios({
      method: 'post',
      url: 'http://localhost:3002/command',
      data: openGame
    });

    buntstift.success(`Delivered the 'open game' command with command id '${data.commandId}'.`);
  } catch (ex) {
    buntstift.error(ex.message ?? 'An unexpected error occured.');

    /* eslint-disable unicorn/no-process-exit */
    process.exit(1);
    /* eslint-enable unicorn/no-process-exit */
  }
})();
/* eslint-enable @typescript-eslint/no-floating-promises */
