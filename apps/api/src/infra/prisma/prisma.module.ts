import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global: todo módulo que precisar de PrismaService injeta direto, sem reimportar
// PrismaModule em cada feature module (convenção de infra compartilhada).
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
