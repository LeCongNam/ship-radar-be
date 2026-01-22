import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './infrastructure/shared/log-request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    Logger.log(`Server is running on port: ${PORT}`);
  });
}
bootstrap();
