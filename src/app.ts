import { Server } from '@application/server';
import { logger } from '@infrastructure/logging';

process.on('uncaughtException', (error: Error) => {
  logger.error('❗ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('❗ Unhandled Rejection:', reason);
  process.exit(1);
});

async function bootstrap() {
  await Server.start();
}

bootstrap();
