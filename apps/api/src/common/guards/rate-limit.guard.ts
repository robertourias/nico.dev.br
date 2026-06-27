import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { RedisService } from '../../infra/redis/redis.service';

// Rate limit por IP via INCR + EXPIRE no Redis — mesma lógica que já era usada em
// apps/blog antes da migração para este backend (ver histórico em
// apps/blog/docs/specs/2026-06-25-claps.md). Implementação própria em vez de
// @nestjs/throttler + storage Redis de terceiros: evita depender de uma lib cuja
// interface ThrottlerStorage pode variar entre versões do @nestjs/throttler
// (risco já registrado em docs/plans/2026-06-25-api-claps-backend.md, T-04).
const WINDOW_SECONDS = 10;
const MAX_REQUESTS = 20;

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const identifier = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
    const key = `ratelimit:claps:${identifier}`;

    const count = await this.redisService.client.incr(key);
    if (count === 1) {
      await this.redisService.client.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
