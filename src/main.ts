import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import config from 'config'
import { ServerConfigInterface } from 'config/ConfigInterfaces/serverConfig.interface';

async function bootstrap() {
  const serverConfig = config.get<ServerConfigInterface>('server');
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || serverConfig.port;
  await app.listen(process.env.PORT ?? port);
  logger.log(`Application listening on port ${port}`);

}
bootstrap();
