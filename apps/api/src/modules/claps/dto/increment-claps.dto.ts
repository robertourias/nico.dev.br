import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class IncrementClapsDto {
  @ApiProperty({ format: 'uuid', description: 'Identificador anônimo do visitante (cookie nico_uid)' })
  @IsUUID()
  uid!: string;

  @ApiProperty({ minimum: 1, maximum: 5, description: 'Quantidade de claps a incrementar nesta chamada' })
  @IsInt()
  @Min(1)
  @Max(5)
  amount!: number;
}
