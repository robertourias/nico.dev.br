---
title: "JWT na prática: como funciona e como usar com NestJS"
slug: "jwt-o-que-e-como-funciona-nestjs"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Entenda o que é JWT, como header, payload e assinatura funcionam e implemente login com access e refresh token em NestJS e Redis, com cuidados de segurança."
tags: ["jwt", "autenticacao", "nestjs", "refresh-token", "seguranca-web"]
---

Um JWT parece um texto aleatório, mas qualquer pessoa lê o que está dentro dele em segundos. Pegue este token de exemplo e extraia a parte do meio:

```bash
node -e "console.log(Buffer.from(process.argv[1].split('.')[1], 'base64url').toString())" \
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwMDAwMDAwLCJleHAiOjE3NjAwMDA5MDB9._FZLgAA4RaqZGFWIQ0HFt8_xAjCHxa9hqSVTiU4-kKU"
```

```json
{"sub":"42","role":"user","iat":1760000000,"exp":1760000900}
```

Nenhum segredo foi usado. Isso resume **o que é JWT**: um formato de token que carrega dados legíveis e prova, por assinatura, que ninguém os alterou. Este post explica como ele funciona, quais cuidados tomar e monta um login com access token e refresh token numa API NestJS, usando Redis.

## O que é JWT

JWT significa *JSON Web Token* e é definido pela [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519). É uma string compacta que o servidor entrega no login e o cliente devolve a cada requisição. Como o token já traz a identidade do usuário e uma assinatura verificável, o servidor não precisa consultar uma tabela de sessões para saber quem está chamando.

Essa é a promessa e também o custo. Ganha-se uma API sem estado de sessão, fácil de replicar em vários containers. Perde-se a capacidade de "desligar" um token antes de ele expirar, porque o servidor não guarda nada para apagar.

## Como um JWT é por dentro

O token tem três partes em Base64URL separadas por ponto: `header.payload.signature`.

![As três partes de um JWT: header com o algoritmo, payload com as claims e assinatura gerada com o segredo do servidor; as duas primeiras são legíveis por qualquer pessoa](/images/jwt-o-que-e-como-funciona-nestjs-anatomia.svg)

O **header** diz qual algoritmo assinou o token. O **payload** carrega as *claims*, que são os dados em si. A **assinatura** é calculada sobre as duas primeiras partes com um segredo que só o servidor conhece.

As claims mais usadas têm nome padronizado:

| Claim | Significado | Exemplo |
| --- | --- | --- |
| `sub` | Dono do token (subject) | `"42"` |
| `iat` | Emitido em (timestamp Unix) | `1760000000` |
| `exp` | Expira em (timestamp Unix) | `1760000900` |
| `iss` | Quem emitiu | `"api.nico.dev.br"` |
| `aud` | Para quem o token se destina | `"web"` |

No token do começo, `exp - iat` dá 900 segundos: 15 minutos de vida.

### Assinatura não é criptografia

O erro mais comum com JWT é achar que o conteúdo é secreto. Não é. Base64URL é só uma codificação, como o comando lá em cima mostrou. A assinatura garante **integridade**: se alguém trocar `"role":"user"` por `"role":"admin"`, o cálculo da assinatura não bate e o servidor rejeita.

Consequência prática: nunca coloque senha, CPF ou qualquer dado sensível no payload.

### HS256 ou RS256

Com **HS256**, o mesmo segredo assina e verifica. É simples e serve para uma API única que emite e valida os próprios tokens. Com **RS256** (ou ES256), uma chave privada assina e uma chave pública verifica. Faz sentido quando vários serviços precisam validar tokens emitidos por um só, sem que nenhum deles tenha a capacidade de emitir.

## Access token e refresh token

Um token de vida longa é perigoso: se vazar, vale por dias. Um de vida curta é seguro, mas obriga o usuário a logar de novo a cada 15 minutos. A solução é usar dois.

O **access token** é o JWT de vida curta, mandado em toda requisição no header `Authorization: Bearer`. O **refresh token** vive por dias, é usado apenas para pedir um novo access token e fica guardado fora do alcance do JavaScript da página.

![Sequência de login: o cliente envia credenciais, a API grava o hash do refresh token no Redis e devolve access token e cookie; quando o access expira, o cliente chama o refresh, a API consome o refresh antigo com GETDEL e devolve um novo par](/images/jwt-o-que-e-como-funciona-nestjs-fluxo.svg)

O diagrama mostra a decisão de projeto central: o access token é verificado só pela assinatura (passo 4, sem tocar no Redis), e o refresh token é a única peça com estado no servidor. Se precisar encerrar uma sessão, basta apagar o refresh token. O access que já está na mão do cliente morre sozinho em até 15 minutos.

## Cuidados de segurança

A [RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725) reúne as boas práticas de JWT. Os pontos que mais importam no dia a dia:

- **Fixe o algoritmo na verificação.** Aceite só o que você usa (`algorithms: ['HS256']`). Nunca confie no campo `alg` que vem dentro do token.
- **Segredo forte.** Para HS256, use pelo menos 32 bytes aleatórios, como a saída de `openssl rand -hex 32`. Nada de `"secret"` ou `"123456"`.
- **Expiração curta no access token.** Minutos, não dias.
- **Valide `iss` e `aud`** quando houver mais de um emissor ou consumidor.
- **Guarde o access token em memória** e o refresh token num cookie `HttpOnly`, `Secure` e `SameSite`. `localStorage` fica exposto a qualquer script injetado por XSS.
- **Sempre HTTPS.** Um token em texto puro na rede vale como uma senha em texto puro.

## Exemplo: login com JWT numa API NestJS

Um aviso de contexto antes de começar. O `apps/api` deste monorepo hoje não tem login de usuário: ele só autentica o blog por um segredo compartilhado em header (`InternalSecretGuard`, autenticação servidor-servidor). O que segue é o que eu montaria para autenticar usuários finais nessa mesma API, aproveitando o Redis que já existe lá, descrito em [Redis na prática](/posts/redis-o-que-e-como-funciona-nestjs). O código não está no repositório.

### Passo 1: instalar as dependências

```bash
pnpm --filter @nico.dev/api add @nestjs/jwt cookie-parser
pnpm --filter @nico.dev/api add -D @types/cookie-parser
```

Gere um segredo e coloque no `.env` (fora do controle de versão):

```bash
openssl rand -hex 32
```

```dotenv
JWT_ACCESS_SECRET=<saida-do-comando-acima>
```

No `main.ts`, registre o parser de cookies com `app.use(cookieParser())` para a API conseguir ler o refresh token.

### Passo 2: configurar o JwtModule

```ts
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    signOptions: { algorithm: 'HS256', expiresIn: '15m', issuer: 'api.nico.dev.br' },
    verifyOptions: { algorithms: ['HS256'], issuer: 'api.nico.dev.br' },
  }),
})
```

`getOrThrow` derruba a aplicação na subida se o segredo não existir, em vez de assinar tokens com um valor vazio. O `verifyOptions` aplica as duas regras de segurança da lista acima: algoritmo fixo e emissor validado.

### Passo 3: emitir e renovar tokens

O refresh token **não** é um JWT. É uma string aleatória, e o Redis guarda só o hash dela. Assim, um vazamento do Redis não entrega tokens utilizáveis, e apagar a chave revoga a sessão.

```ts
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
    private readonly redis: RedisService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.validateCredentials(email, password); // compara hash (bcrypt/argon2)
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    const userId = await this.redis.client.getdel(this.refreshKey(refreshToken)); // uso único
    if (!userId) throw new UnauthorizedException();
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user.id, user.role);
  }

  async logout(refreshToken: string) {
    await this.redis.client.del(this.refreshKey(refreshToken));
  }

  private async issueTokens(sub: string, role: string) {
    const accessToken = await this.jwt.signAsync({ sub, role });
    const refreshToken = randomBytes(32).toString('base64url');
    await this.redis.client.set(this.refreshKey(refreshToken), sub, 'EX', REFRESH_TTL_SECONDS);
    return { accessToken, refreshToken };
  }

  private refreshKey(token: string) {
    return `refresh:${createHash('sha256').update(token).digest('hex')}`;
  }
}
```

O `GETDEL` lê e apaga a chave num comando só (Redis 6.2 ou superior). Isso torna o refresh token de **uso único**: quem apresentar um token já usado recebe 401. Cada renovação gera um par novo, prática chamada de rotação. Note também que o `refresh` recarrega o usuário do banco, então uma mudança de `role` entra em vigor na próxima renovação.

### Passo 4: o guard que valida o access token

```ts
type AccessPayload = { sub: string; role: string; exp: number };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: AccessPayload }>();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      req.user = await this.jwt.verifyAsync<AccessPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
```

O `verifyAsync` confere assinatura, `exp` e as opções configuradas no módulo. Se qualquer coisa falhar, a resposta é 401, sem detalhar o motivo. É o mesmo padrão do guard que o [post de RBAC](/posts/rbac-controle-de-acesso-nestjs-nextjs) usa antes de checar permissões.

### Passo 5: expor as rotas

```ts
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.login(dto.email, dto.password);
    this.setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const current = req.cookies?.refresh_token;
    if (!current) throw new UnauthorizedException();
    const { accessToken, refreshToken } = await this.auth.refresh(current);
    this.setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user?: AccessPayload }) {
    return req.user;
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: REFRESH_TTL_SECONDS * 1000,
    });
  }
}
```

O cookie só é enviado para `/api/v1/auth`, o prefixo da API segundo o README do `apps/api`. Assim o refresh token não viaja em toda requisição, só nas de login e renovação. A rota de logout (omitida por brevidade) chama `auth.logout` e limpa o cookie.

### Passo 6: testar

Suba a API e o Redis como no post anterior e rode o fluxo com `curl`. Use `-i` para ver o `Set-Cookie`:

```bash
curl -i -X POST http://localhost:3201/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"beto@exemplo.com","password":"senha-de-teste"}'
```

Copie o `accessToken` do corpo e o valor de `refresh_token` do cabeçalho `Set-Cookie`, depois:

```bash
curl -H "Authorization: Bearer $ACCESS" http://localhost:3201/api/v1/auth/me

curl -X POST -H "Cookie: refresh_token=$REFRESH" http://localhost:3201/api/v1/auth/refresh
```

O `/auth/me` deve devolver o payload do token, e o `/auth/refresh` deve devolver um novo `accessToken`. Repetir exatamente o mesmo `refresh` uma segunda vez deve dar 401, porque o `GETDEL` já consumiu o token. Passei o cookie à mão porque alguns clientes não reenviam cookie `Secure` por HTTP. Para ver o estado no Redis:

```bash
docker exec api-claps-redis redis-cli --scan --pattern 'refresh:*'
```

## Limites desse desenho

**O access token não é revogável.** Um token roubado vale até o `exp`, no máximo 15 minutos aqui. Se isso for inaceitável, guarde o identificador do token (`jti`) numa denylist no Redis com TTL igual ao tempo restante, e consulte a lista no guard. Você troca parte da vantagem "sem estado" por controle. O [guia de arquitetura SaaS](/posts/arquitetura-saas-nextjs-nestjs-guia-completo) discute esse trade-off.

**Reuso de refresh token não é detectado.** Se um atacante usa um refresh roubado antes do usuário legítimo, o usuário recebe 401 e só percebe um logout inesperado. Sistemas mais rígidos guardam a "família" de tokens e revogam tudo ao detectar reuso.

**O login precisa de proteção contra força bruta.** O rate limit por IP com `INCR` e `EXPIRE` do post de Redis se aplica direto à rota `/auth/login`. Para contas sensíveis, some a autenticação em dois fatores, como no [post sobre MFA com TOTP](/posts/mfa-totp-nextjs-nestjs-turborepo).

**HS256 com um segredo só.** Funciona enquanto uma única API emite e valida. Se outros serviços precisarem validar tokens, migre para RS256 e distribua só a chave pública.

## O que fica

JWT não é um mecanismo de sessão pronto: é um formato de dado assinado. Quase todo problema de segurança com ele vem de tratá-lo como sessão e esquecer que o servidor não controla mais o token depois de emitido.

A pergunta que organiza o desenho é "o que acontece se este token vazar agora?". Access token curto limita o estrago em minutos. Refresh token opaco, de uso único e guardado como hash no Redis dá ao servidor o botão de revogar que o JWT sozinho não tem. Cada parte compensa a fraqueza da outra.

## Referências

- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 8725: JSON Web Token Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [NestJS: autenticação](https://docs.nestjs.com/security/authentication)
- [@nestjs/jwt](https://github.com/nestjs/jwt)
- [Redis: comando GETDEL](https://redis.io/docs/latest/commands/getdel/)
- No repositório: `apps/api/src/common/guards/internal-secret.guard.ts` e `apps/api/README.md`
