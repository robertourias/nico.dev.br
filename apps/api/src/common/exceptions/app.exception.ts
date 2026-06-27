import { HttpException, HttpStatus } from '@nestjs/common';

// Toda exceção de domínio/aplicação deve estender esta classe (convenção de
// docs/context/decisions.md, seção "Backend > Erros e logs").
export class AppException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}
