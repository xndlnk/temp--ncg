import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';

const getApi = function (): Application {
  const api = express();

  api.use(cors());
  api.use(bodyParser.json());

  api.get('/domain-events', async (_req, res): Promise<void> => {
    res.writeHead(200, {
      'content-type': 'application/x-ndjson'
    });

    res.write('{}\n');

    const { data } = await axios({
      method: 'get',
      url: 'http://localhost:3008/domain-events',
      responseType: 'stream'
    });

    data.pipe(res);
  });

  return api;
};

export { getApi };
