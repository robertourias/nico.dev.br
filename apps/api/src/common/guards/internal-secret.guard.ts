import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

// Autenticação servidor-servidor entre apps/blog e apps/api: secret simples em
// header, comparado a CLAPS_API_SECRET. Não é autenticação de usuário final —
// por isso não usa NextAuth/Auth.js (ver docs/context/decisions.md, seção "API").
//
// Fail-closed: se CLAPS_API_SECRET não estiver configurada no ambiente, nega tudo
// em vez de abrir a API por engano.
@Injectable()
export class InternalSecretGuard implements CanActivate {
  private readonly logger = new Logger(InternalSecretGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const expected = process.env.CLAPS_API_SECRET;

    if (!expected) {
      this.logger.error('CLAPS_API_SECRET não configurada — negando todas as requisições');
      throw new UnauthorizedException();
    }

    const provided = req.headers['x-internal-secret'];
    if (provided !== expected) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
