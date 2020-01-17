import { flaschenpost } from 'flaschenpost';
import { getApi } from './getApi';
import http from 'http';

const logger = flaschenpost.getLogger();

const api = getApi();

const server = http.createServer(api);

server.listen(3009, (): void => {
  logger.info('Domain event server started.', { port: 3009 });
});
