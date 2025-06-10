/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "http://127.0.0.1:8080",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
