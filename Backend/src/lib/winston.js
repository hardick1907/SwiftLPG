import { createLogger, transports, format } from 'winston';

export const customerLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'CustomerBackend.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      filename: 'Customer-errorBackend.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});

export const AdminLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'AdminBackend.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      filename: 'Admin-errorBackend.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});
