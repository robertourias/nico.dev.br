import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './infra/prisma/prisma.module';
import { RedisModule } from './infra/redis/redis.module';
import { ClapsModule } from './modules/claps/claps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        // Nunca logar o secret nem o header de auth (convenção: nunca logar dados sensíveis).
        redact: ['req.headers["x-internal-secret"]', 'req.headers.authorization'],
      },
    }),
    PrismaModule,
    RedisModule,
    ClapsModule,
  ],
})
export class AppModule {}
