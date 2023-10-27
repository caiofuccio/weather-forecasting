import pino from 'pino';
import config from 'config';

export default pino({
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    enabled: config.get('App.logger.enabled'),
    level: config.get('App.logger.level'),
});
