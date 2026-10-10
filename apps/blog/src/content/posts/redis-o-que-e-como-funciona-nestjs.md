---
title: "Redis na prática: o que é e como usar com NestJS"
slug: "redis-o-que-e-como-funciona-nestjs"
date: "2026-10-09"
categories: ["dev", "infra"]
status: "published"
featured: false
description: "Entenda o que é Redis e como ele funciona, com um passo a passo real: rate limit em NestJS com ioredis e Docker, do redis-cli ao teste com curl."
tags: ["redis", "nestjs", "rate-limit", "ioredis", "docker"]
---

Cada clique de aplauso neste blog passa por um contador no Redis antes de chegar ao banco de dados. Se o mesmo IP bater mais de 20 vezes em 10 segundos, a API responde 429 e nada é gravado. Foi o primeiro uso de Redis que coloquei em produção, e é um bom jeito de entender **o que é Redis** sem ficar na teoria.

Este post primeiro explica o que ele é e como funciona por dentro. Depois mostra o passo a passo desse rate limit no `apps/api` do monorepo, com NestJS, `ioredis` e Docker, incluindo os pontos fracos da implementação.

## O que é Redis

Redis é um servidor de estruturas de dados que guarda tudo **em memória**. O nome vem de *REmote DIctionary Server*: na forma mais simples, é um dicionário de chave e valor acessado pela rede. Você manda `SET`, `GET`, `INCR` e ele responde.

Diferente de um banco relacional, ele não tem tabelas, joins nem schema. Em troca, cada operação é simples e o dado está na RAM, sem disco no caminho da leitura. Por isso aparece como cache, contador, fila e armazenamento de sessão.

## Como o Redis funciona

Quatro ideias explicam a maior parte do comportamento.

**Memória como fonte de verdade.** O dataset inteiro precisa caber na RAM. É o que o torna rápido e também o que limita o seu tamanho.

**Comandos executados um por vez.** O Redis processa os comandos numa thread principal, em sequência. Na prática, cada comando é atômico: dois clientes chamando `INCR` na mesma chave nunca se atropelam, e o contador sobe de um em um.

**Estruturas de dados, não só strings.** O valor de uma chave pode ser de vários tipos:

| Estrutura | Para que serve | Comandos típicos |
| --- | --- | --- |
| String | Cache, contador, flag | `SET`, `GET`, `INCR` |
| Hash | Objeto com campos (sessão, perfil) | `HSET`, `HGETALL` |
| List | Fila simples | `LPUSH`, `RPOP` |
| Set | Conjunto sem repetição | `SADD`, `SISMEMBER` |
| Sorted Set | Ranking ordenado por pontuação | `ZADD`, `ZRANGE` |
| Stream | Log de eventos com consumidores | `XADD`, `XREAD` |

**Expiração embutida.** Qualquer chave pode ter um TTL (*time to live*). Passado o prazo, o Redis remove a chave sozinho. Cache e rate limit dependem disso.

### Persistência: memória não é descartável

Memória some quando o processo cai, então o Redis oferece duas formas de gravar em disco. O **RDB** tira fotos (*snapshots*) do dataset em intervalos. O **AOF** (*append-only file*) registra cada escrita e a reexecuta ao reiniciar. Dá para usar os dois juntos ou nenhum, caso de cache puro.

A documentação oficial recomenda combinar RDB e AOF quando você quer segurança de dados parecida com a de um banco tradicional, e não recomenda AOF sozinho. Para estado efêmero, como um contador que vive 10 segundos, perder alguns segundos de dados não faz diferença.

### Quando não usar

Redis não substitui o Postgres. Se o dado precisa sobreviver, ser consultado de formas variadas ou ficar maior que a RAM, o lugar dele é num banco durável. A comparação mais detalhada entre os modelos está em [SQL vs NoSQL: Postgres e MongoDB e escalabilidade horizontal](/posts/sql-nosql-postgres-mongodb-escalabilidade-horizontal). E para ver Redis dentro de uma arquitetura maior, com cache, fila e sessão, veja o [guia de arquitetura SaaS com Next.js e NestJS](/posts/arquitetura-saas-nextjs-nestjs-guia-completo).

## Exemplo real: rate limit dos claps no nico.dev.br

O sistema de claps do blog tem um backend próprio, o `apps/api`, em NestJS. A divisão de responsabilidades é deliberada: o **Postgres** guarda o ledger durável dos claps, e o **Redis** guarda só o que é efêmero, o contador de requisições por IP.

![Fluxo de uma requisição de clap: o blog chama a API NestJS, que incrementa um contador no Redis; até 20 requisições a chamada segue para o Postgres, acima disso a API responde 429](/images/redis-o-que-e-como-funciona-nestjs-fluxo.svg)

O diagrama mostra o caminho. A API consulta o Redis antes de executar o controller. Se o contador do IP passou de 20 dentro da janela de 10 segundos, a requisição é barrada ali mesmo, sem tocar no Postgres.

### Passo 1: subir o Redis com Docker

No `apps/api/docker-compose.yml`, o serviço do Redis é este:

```yaml
redis:
  image: redis:7-alpine
  container_name: api-claps-redis
  command: ['redis-server', '--appendonly', 'yes']
  ports:
    - '6379:6379'
  volumes:
    - api-claps-redis-data:/data
```

A flag `--appendonly yes` liga o AOF, e o volume mantém o arquivo entre reinícios do container. A porta 6379 é publicada só por conveniência de desenvolvimento, para usar o `redis-cli` da máquina. Em produção ela não deve ser exposta.

```bash
docker compose -f apps/api/docker-compose.yml up -d redis
```

### Passo 2: conhecer os comandos no redis-cli

Antes de escrever código, vale brincar com os comandos que o guard vai usar:

```bash
docker exec -it api-claps-redis redis-cli
```

```text
127.0.0.1:6379> SET saudacao "oi" EX 30
OK
127.0.0.1:6379> GET saudacao
"oi"
127.0.0.1:6379> TTL saudacao
(integer) 28
127.0.0.1:6379> INCR contador
(integer) 1
127.0.0.1:6379> INCR contador
(integer) 2
```

`EX 30` cria a chave com 30 segundos de vida, e `TTL` mostra quanto falta. `INCR` cria a chave com valor 0 se ela não existir e soma 1, devolvendo o novo valor. Esses dois comandos são a base do rate limit.

### Passo 3: conectar com ioredis

O client é o [ioredis](https://github.com/redis/ioredis). Ele fica encapsulado num serviço do Nest, que lê a URL da variável `REDIS_URL`:

```ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
```

O `maxRetriesPerRequest: 2` evita que uma requisição fique pendurada para sempre se o Redis estiver fora. O `onModuleDestroy` fecha a conexão com `quit()` no desligamento da aplicação. Um `RedisModule` marcado como `@Global()` exporta o serviço, então qualquer módulo o injeta sem importar nada.

### Passo 4: escrever o guard de rate limit

Um *guard* no NestJS decide se a requisição pode continuar. O `RateLimitGuard` usa o IP como identificador:

```ts
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
```

A lógica cabe em três linhas. O `INCR` conta a requisição. Se o resultado é 1, a chave acabou de nascer, então o `EXPIRE` define os 10 segundos de vida. Se o contador passa de 20, o guard lança 429. Depois de 10 segundos a chave desaparece e a contagem recomeça.

O prefixo `ratelimit:claps:` não é enfeite. Prefixar chaves por finalidade evita colisão e facilita achar tudo de um assunto no `redis-cli`.

### Passo 5: aplicar no controller

O guard entra no `@UseGuards` do controller de claps, depois do guard de segredo interno:

```ts
@Controller('claps')
@UseGuards(InternalSecretGuard, RateLimitGuard)
export class ClapsController {
  // ...
}
```

A ordem importa: requisição sem o header `X-Internal-Secret` leva 401 antes de gastar uma operação no Redis.

### Passo 6: testar

Com Postgres e API no ar, dispare 25 requisições seguidas. A URL e o segredo de desenvolvimento estão no README do `apps/api`:

```bash
for i in $(seq 1 25); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "X-Internal-Secret: dev-secret-change-me" \
    http://localhost:3201/api/v1/claps/teste
done
```

Pela lógica do guard, as 20 primeiras devem voltar `200` e as 5 últimas `429`. Para ver o contador por dentro, procure a chave e consulte o TTL:

```bash
docker exec api-claps-redis redis-cli --scan --pattern 'ratelimit:*'
docker exec api-claps-redis redis-cli TTL "ratelimit:claps:<ip-da-chave>"
```

Use `--scan` em vez de `KEYS`: o primeiro percorre as chaves aos poucos, e o segundo bloqueia o servidor em bases grandes.

## Limites dessa implementação

O guard funciona, mas tem três fragilidades que vale conhecer.

**Corrida entre INCR e EXPIRE.** São dois comandos separados. Se o processo cair entre eles, a chave fica sem TTL e o contador nunca zera, o que bloqueia aquele IP até alguém apagar a chave. A [própria documentação do `INCR`](https://redis.io/docs/latest/commands/incr/) descreve esse risco no padrão de rate limiter. Uma correção é enviar os dois num bloco atômico:

```ts
const results = await this.redisService.client
  .multi()
  .incr(key)
  .expire(key, WINDOW_SECONDS, 'NX')
  .exec();
const count = Number(results?.[0]?.[1]);
```

O `MULTI` executa os comandos juntos, e o `NX` só define o TTL se a chave ainda não tiver um (exige Redis 7 ou superior, caso da imagem `redis:7-alpine`). Essa versão ainda não está no repositório; é o ajuste que eu faria.

**Janela fixa.** A contagem zera de uma vez a cada 10 segundos. Um cliente pode mandar 20 requisições no fim de uma janela e 20 no começo da próxima, 40 em poucos segundos. Para um botão de aplauso é aceitável; para proteger uma rota crítica, uma janela deslizante é mais justa.

**Redis fora do ar.** Se o `incr` falhar, o guard lança erro e a requisição falha. É uma escolha: bloquear tudo quando o limitador cai, em vez de deixar passar. Para a API de claps, é o lado seguro.

## O que fica

Redis é uma ferramenta de **estado rápido e descartável**. A pergunta que decide se ele entra na arquitetura é: este dado pode ser perdido ou recalculado sem drama? Contador de rate limit, cache e sessão curta podem. O ledger de claps não pode, e por isso mora no Postgres.

O exemplo também mostra o padrão mais comum: `INCR` mais TTL resolve um problema que, sem Redis, exigiria uma tabela com limpeza periódica. Dois comandos simples, atomicidade de graça e expiração automática.

## Referências

- [Documentação oficial do Redis](https://redis.io/docs/latest/)
- [Redis: comando INCR e o padrão de rate limiter](https://redis.io/docs/latest/commands/incr/)
- [Redis: persistência com RDB e AOF](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [ioredis: client Redis para Node.js](https://github.com/redis/ioredis)
- No repositório: `apps/api/src/common/guards/rate-limit.guard.ts`, `apps/api/src/infra/redis/redis.service.ts` e `apps/api/docker-compose.yml`
