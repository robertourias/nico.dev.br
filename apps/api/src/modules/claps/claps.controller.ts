import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InternalSecretGuard } from '../../common/guards/internal-secret.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { ClapsService, type ClapsData } from './claps.service';
import { GetClapsQueryDto } from './dto/get-claps-query.dto';
import { GetClapsTotalsQueryDto } from './dto/get-claps-totals-query.dto';
import { IncrementClapsDto } from './dto/increment-claps.dto';

@ApiTags('claps')
@ApiSecurity('internal-secret')
@Controller('claps')
@UseGuards(InternalSecretGuard, RateLimitGuard)
export class ClapsController {
  constructor(private readonly clapsService: ClapsService) {}

  // Sem segmento (`/claps`, não `/claps/:slug`) — não conflita com a rota abaixo.
  // Usado pela listagem do blog: uma chamada com todos os slugs em vez de N.
  @Get()
  @ApiOkResponse({ description: 'Totais agregados por slug (sem dado de visitante) — usado na listagem.' })
  getTotals(@Query() query: GetClapsTotalsQueryDto): Promise<Record<string, number>> {
    return this.clapsService.getTotals(query.slugs);
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Total agregado e claps do visitante (uid), se informado.' })
  getClaps(@Param('slug') slug: string, @Query() query: GetClapsQueryDto): Promise<ClapsData> {
    return this.clapsService.getClaps(slug, query.uid);
  }

  @Post(':slug')
  @ApiOkResponse({ description: 'Total e userClaps atualizados após o incremento (capado em 50).' })
  incrementClaps(@Param('slug') slug: string, @Body() body: IncrementClapsDto): Promise<ClapsData> {
    return this.clapsService.incrementClaps(slug, body.uid, body.amount);
  }
}
