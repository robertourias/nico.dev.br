import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

// Cap defensivo — isso é pra alimentar a listagem do blog (uma página de posts),
// não um endpoint genérico de bulk query. 200 é folga generosa sobre qualquer
// quantidade razoável de posts visíveis numa página.
const MAX_SLUGS = 200;

export class GetClapsTotalsQueryDto {
  @ApiProperty({
    description: 'Slugs separados por vírgula (ex.: "post-a,post-b"). Retorna 0 para slugs sem claps.',
    example: 'post-a,post-b',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? [...new Set(value.split(',').map((slug: string) => slug.trim()).filter(Boolean))]
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_SLUGS)
  @IsString({ each: true })
  slugs!: string[];
}
