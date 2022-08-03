import { createLogger } from 'winston';
import BrowserConsole from 'winston-transport-browserconsole';
import * as Sentry from '@sentry/browser';
import SentryTransport from './sentry-transport';
import commonConstant from '../../constants/common-constant';

Sentry.init({
  dsn: commonConstant.SentryDns,
});

const options = {
  console: {
    level: commonConstant.ConsoleLogLevel,
    handleExceptions: true,
  },
  sentry: {
    level: commonConstant.SentryLogLevel,
  },
  winston: {
    exitOnError: false,
  },
};

const logger = createLogger(options.winston);

logger.add(new BrowserConsole(options.console));
logger.add(new SentryTransport(Sentry, options.sentry));

export default logger;
