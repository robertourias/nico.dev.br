import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

// Redis usado só para rate limit (estado efêmero, TTL) — o ledger durável dos claps
// vive no Postgres via Prisma (ver infra/prisma). Conexão via REDIS_URL.
@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
