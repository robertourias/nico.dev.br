import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetClapsQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Identificador anônimo do visitante (cookie nico_uid)' })
  @IsOptional()
  @IsUUID()
  uid?: string;
}
