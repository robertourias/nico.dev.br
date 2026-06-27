import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

// Estilo Medium: cada visitante (uid) pode dar até este número de claps no mesmo
// post. Reforçado aqui no servidor via upsert atômico — o client só faz UI
// otimista, nunca decide o cap de verdade.
export const MAX_CLAPS_PER_USER = 50;

export interface ClapsData {
  total: number;
  userClaps: number;
}

@Injectable()
export class ClapsService {
  constructor(private readonly prisma: PrismaService) {}

  // Slug/uid nunca vistos retornam zeros, não erro — a existência do slug é
  // responsabilidade de apps/blog (content collection do Astro), não desta API.
  async getClaps(slug: string, uid: string | undefined): Promise<ClapsData> {
    const rows = await this.prisma.clap.findMany({ where: { slug } });
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const userClaps = uid ? rows.find((row) => row.uid === uid)?.count ?? 0 : 0;
    return { total, userClaps };
  }

  // Usado pela listagem do blog (uma chamada com todos os slugs visíveis em vez
  // de N chamadas a getClaps) — sem dado de visitante, só o total agregado.
  async getTotals(slugs: string[]): Promise<Record<string, number>> {
    const rows = await this.prisma.clap.groupBy({
      by: ['slug'],
      where: { slug: { in: slugs } },
      _sum: { count: true },
    });

    const totals: Record<string, number> = {};
    for (const slug of slugs) totals[slug] = 0;
    for (const row of rows) totals[row.slug] = row._sum.count ?? 0;
    return totals;
  }

  async incrementClaps(slug: string, uid: string, amount: number): Promise<ClapsData> {
    // Upsert atômico — o lock de linha do Postgres cobre concorrência (cliques
    // simultâneos do mesmo uid em abas diferentes nunca passam do cap).
    await this.prisma.$executeRaw`
      INSERT INTO claps (slug, uid, count, updated_at)
      VALUES (${slug}, ${uid}::uuid, LEAST(${amount}, ${MAX_CLAPS_PER_USER}), now())
      ON CONFLICT (slug, uid) DO UPDATE
        SET count = LEAST(claps.count + ${amount}, ${MAX_CLAPS_PER_USER}),
            updated_at = now()
    `;

    return this.getClaps(slug, uid);
  }
}
