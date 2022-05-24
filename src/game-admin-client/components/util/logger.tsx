import { createLogger } from 'winston';
import BrowserConsole from 'winston-transport-browserconsole';
import * as Sentry from '@sentry/browser';
import SentryTransport from './sentry-transport';
import configs from '../../configs.json';

Sentry.init({
  dsn: configs.SentryDns,
});

const options = {
  console: {
    level: configs.ConsoleLogLevel,
    handleExceptions: true,
  },
  sentry: {
    level: configs.SentryLogLevel,
  },
  winston: {
    exitOnError: false,
  },
};

const logger = createLogger(options.winston);

logger.add(new BrowserConsole(options.console));
logger.add(new SentryTransport(Sentry, options.sentry));

export default logger;
