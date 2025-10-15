import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3001', // porta do Next.js
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000).catch(console.error);
}
bootstrap().catch(console.error);
