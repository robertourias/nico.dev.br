import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  path: string;
  message: string;
}

// Filtro global de exceções: shape de resposta consistente, sem stacktrace exposto
// ao client (convenção de docs/context/decisions.md). Erros 5xx são logados; erros
// 4xx (validação, secret errado, rate limit) não — são esperados no fluxo normal.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception, status);

    if (status >= 500) {
      this.logger.error({ path: req.url, message }, exception instanceof Error ? exception.stack : undefined);
    }

    const body: ErrorResponseBody = {
      statusCode: status,
      path: req.url,
      message,
    };

    res.status(status).json(body);
  }

  private extractMessage(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') return response;
      if (typeof response === 'object' && response !== null && 'message' in response) {
        const m = (response as { message: unknown }).message;
        return Array.isArray(m) ? m.join('; ') : String(m);
      }
      return exception.message;
    }
    // Nunca expor detalhes de erros não esperados (ex.: erro de driver do Postgres).
    return status >= 500 ? 'Internal server error' : 'Unexpected error';
  }
}
