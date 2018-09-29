import * as express from 'express';
import * as http from 'http'
import config from './config';
import routes from './routes';
import logger from './utils/logger';
import * as cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: config.cors.origin,
        credentials: true
    })
);

app.use('/', routes);

server.listen(config.port);
logger.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-');
logger.info(`🌐  Listening on port ${config.port}`);
logger.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-');
