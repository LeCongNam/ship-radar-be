import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api');
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();
  app.flushLogs();
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
bootstrap();
