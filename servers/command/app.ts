import { flaschenpost } from 'flaschenpost';
import { getApi } from './getApi';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = getApi();

const server = http.createServer(api);

server.listen(3002, (): void => {
  logger.info('Command server started.', { port: 3002 });
});
