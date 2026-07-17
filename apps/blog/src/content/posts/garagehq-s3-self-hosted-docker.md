---
title: "GarageHQ: seu próprio S3 self-hosted com Docker"
slug: "garagehq-s3-self-hosted-docker"
date: "2026-07-17"
category: "tech"
status: "published"
featured: false
description: "Como instalar o GarageHQ com Docker, gerenciar buckets pelo painel web e pela CLI, e usá-lo como storage S3 num projeto Next.js."
tags: ["garagehq", "s3", "self-hosted", "docker", "nextjs"]
coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
---

Se você já usa MinIO pra guardar upload de usuário, sabe o motivo: rodar seu próprio S3 tira a dependência de nuvem, corta custo de egress e te deixa livre pra trocar de provedor sem reescrever nada. O Garage HQ ataca o mesmo problema, mas com uma proposta diferente — feito em Rust pela Deuxfleurs, pensado desde o início pra rodar geo-distribuído, em máquinas modestas, até atrás de um link residencial.

## O que é o Garage e pra que ele serve

Garage é um object store compatível com a API S3, assim como o MinIO. A diferença de proposta aparece no design: onde o MinIO mira clusters robustos em datacenter, o Garage foi desenhado pra replicar dados entre nós heterogêneos e geograficamente espalhados — um nó na sua casa, outro numa VPS, outro no servidor de um amigo — sem exigir hardware idêntico ou rede rápida entre eles.

Na prática, com um único binário (ou container) em Rust, dá pra guardar e servir objetos via API S3 padrão, o que significa que qualquer SDK, CLI ou biblioteca feita pra AWS S3 funciona sem alteração — só troca o endpoint. Dá também pra expor buckets como sites estáticos direto, sem servidor web extra, replicar dados entre múltiplos nós e zonas com fator de replicação configurável, gerenciar chaves de acesso isoladas por bucket, e usar como storage de apps que já falam S3 nativamente, como Nextcloud, PeerTube ou backups via restic.

Não existe um recurso "mágico" que o MinIO não tenha. O que muda é o peso: o binário é pequeno, o consumo de memória é baixo, e o modelo de configuração inteiro vive num arquivo `.toml` e numa CLI — sem um console administrativo pesado rodando junto.

## Subindo com Docker

Antes de mais nada, é preciso um arquivo de configuração. Gere um `garage.toml` com segredos únicos:

```bash
cat > garage.toml <<EOF
metadata_dir = "/data/meta"
data_dir = "/data/data"
db_engine = "sqlite"

replication_factor = 1

rpc_bind_addr = "[::]:3901"
rpc_public_addr = "127.0.0.1:3901"
rpc_secret = "$(openssl rand -hex 32)"

[s3_api]
s3_region = "garage"
api_bind_addr = "[::]:3900"
root_domain = ".s3.localhost"

[s3_web]
bind_addr = "[::]:3902"
root_domain = ".web.localhost"
index = "index.html"

[admin]
api_bind_addr = "[::]:3903"
admin_token = "$(openssl rand -base64 32)"
metrics_token = "$(openssl rand -base64 32)"
EOF
```

`replication_factor = 1` serve só pra teste local — sem redundância, se o nó cai, os dados vão junto. Num cluster real, sobe pra 3.

Com o arquivo pronto, defina as credenciais iniciais e suba o container:

```bash
export GARAGE_DEFAULT_ACCESS_KEY="GK$(openssl rand -hex 16)"
export GARAGE_DEFAULT_SECRET_KEY="$(openssl rand -hex 32)"
export GARAGE_DEFAULT_BUCKET="default-bucket"

docker run -d \
  --name garage \
  -p 3900:3900 -p 3901:3901 -p 3902:3902 -p 3903:3903 \
  -v $(pwd)/garage.toml:/etc/garage.toml \
  -v $(pwd)/data:/data \
  -e GARAGE_DEFAULT_ACCESS_KEY \
  -e GARAGE_DEFAULT_SECRET_KEY \
  -e GARAGE_DEFAULT_BUCKET \
  dxflrs/garage:v2.3.0 \
  /garage server --single-node --default-bucket
```

As flags `--single-node --default-bucket` fazem o Garage se autoconfigurar como cluster de um nó só e já criar uma chave de acesso e um bucket padrão — recurso disponível desde a versão 2.3.0. Sem elas, é preciso rodar os passos manuais de layout, bucket e chave, que aparecem na próxima seção.

Confirme que subiu certo:

```bash
docker exec garage /garage status
```

## Gerenciando o cluster: WebUI, CLI e Admin API

O binário do Garage não vem com painel embutido — só CLI e uma Admin API HTTP por trás. A própria equipe da Deuxfleurs ainda trabalha numa interface oficial, mas dá pra ter um painel completo rodando hoje com o [garage-webui](https://github.com/khairul169/garage-webui), projeto comunitário que conversa com essa Admin API e cobre o dia a dia sem exigir nenhum comando de terminal.

### Subindo o painel

O jeito mais direto é adicionar o serviço no mesmo `docker-compose.yml` do Garage:

```yaml
services:
  garage:
    image: dxflrs/garage:v2.3.0
    container_name: garage
    volumes:
      - ./garage.toml:/etc/garage.toml
      - ./meta:/var/lib/garage/meta
      - ./data:/var/lib/garage/data
    restart: unless-stopped
    ports:
      - 3900:3900
      - 3901:3901
      - 3902:3902
      - 3903:3903

  webui:
    image: khairul169/garage-webui:latest
    container_name: garage-webui
    restart: unless-stopped
    volumes:
      - ./garage.toml:/etc/garage.toml:ro
    ports:
      - 3909:3909
    environment:
      API_BASE_URL: "http://garage:3903"
      S3_ENDPOINT_URL: "http://garage:3900"
```

Ele lê o `admin_token` direto do `garage.toml` montado, então não precisa configurar mais nada além disso. Suba com `docker compose up -d` e acesse `http://seu-ip:3909`. Em produção, coloque atrás do mesmo reverse proxy com TLS usado pro resto (seção seguinte) e ative autenticação com a variável `AUTH_USER_PASS` (usuário + hash bcrypt gerado via `htpasswd -nbBC 10 usuario senha`) — sem isso, qualquer um que chegue na porta 3909 tem controle total do cluster.

### O que dá pra fazer no painel

A tela inicial (**Dashboard**) mostra a saúde do cluster de cara: status geral (`Healthy`), quantos nós estão ativos e conectados, quantas partições existem e quantas estão com quorum — é o mesmo dado que o `garage status` daria pela CLI, só que visual e atualizado sozinho.

O menu lateral tem quatro seções, que cobrem praticamente toda a operação do dia a dia:

**Cluster** mostra os nós que compõem o cluster, zona e capacidade de cada um, e é onde se atribui layout pra novos nós — o equivalente visual do `garage layout assign` e `garage layout apply`.

**Buckets** lista todos os buckets com uso de armazenamento e número de objetos em cada card, e tem o botão **Create Bucket** pra criar um novo sem tocar em terminal. Clicando num bucket (como no `riffbook-uploads` do exemplo), a tela se divide em três abas: **Overview** mostra uso de storage, aliases do bucket, o toggle de **Website Access** (o mesmo que o `garage bucket website --allow` faz pela CLI) e quotas opcionais de tamanho/número de objetos; **Permissions** é onde se liga quais chaves têm acesso de leitura, escrita ou posse sobre aquele bucket; **Browse** funciona como um explorador de arquivos, pra ver e baixar objetos direto do navegador sem precisar de `aws s3 ls`.

**Keys** lista as chaves de acesso existentes e permite criar novas — a versão visual do `garage key create` — mostrando `Key ID` e `Secret Key` na criação, exatamente como a CLI mostra no terminal.

Pra quem prefere terminal ou quer automatizar (CI/CD, scripts de provisionamento), os mesmos comandos continuam valendo. Criar um bucket:

```bash
docker exec garage /garage bucket create posts-images
```

Criar uma chave de acesso e liberar ela no bucket:

```bash
docker exec garage /garage key create posts-images-key

docker exec garage /garage bucket allow \
  --read --write --owner \
  posts-images \
  --key posts-images-key
```

O comando `key info` mostra a `Key ID` e a `Secret key` geradas — são elas que vão pro `.env` da aplicação. Pra checar o estado do cluster a qualquer momento:

```bash
docker exec garage /garage status
docker exec garage /garage bucket info posts-images
```

E se quiser automatizar isso fora da CLI ou do painel — por exemplo, criar um bucket por tenant dentro da própria aplicação — a Admin API (porta 3903) expõe as mesmas operações via HTTP, com um [SDK oficial em JavaScript](https://git.deuxfleurs.fr/garage-sdk/garage-admin-sdk-js) ainda em estágio inicial, mas funcional pra `nodes`, `layout`, `key` e `bucket`. É a mesma API que tanto o `garage-webui` quanto a CLI usam por trás — os três caminhos (painel, CLI, API) chegam no mesmo lugar.

## Colocando em produção numa VPS

Rodar em `/tmp` com um nó só é ótimo pra testar, ruim pra produção. Três ajustes resolvem isso.

Primeiro, volumes persistentes: troque `metadata_dir` e `data_dir` do `garage.toml` por caminhos reais no disco da VPS (por exemplo `/opt/garage/meta` e `/opt/garage/data`), e garanta que o volume do Docker aponte pra lá — é o que já fizemos no `docker run` acima com `-v $(pwd)/data:/data`.

Segundo, TLS na frente. O Garage não fala HTTPS nativamente — isso é papel do reverse proxy. Caddy é o caminho mais curto porque emite certificado automático via Let's Encrypt:

```caddyfile
s3.suahost.com, *.s3.suahost.com {
    reverse_proxy localhost:3900
}

*.web.suahost.com {
    reverse_proxy localhost:3902
}
```

Se preferir Nginx ou Traefik, a lógica é a mesma: dois blocos de proxy, um pra porta 3900 (API S3) e outro pra 3902 (endpoint web), sem tocar na porta 3901 (RPC entre nós) nem na 3903 (Admin API) — essas duas ficam só na rede interna, nunca expostas pra internet.

Terceiro, DNS. Pra usar acesso "virtual-hosted style" (`bucket.s3.suahost.com`), é preciso um registro wildcard `*.s3.suahost.com` apontando pra VPS, além de certificado wildcard — o bloco do Caddy acima já cobre isso automaticamente. Se não quiser mexer com wildcard, o Garage também aceita acesso "path style" (`s3.suahost.com/bucket`), mais simples de configurar e o que usamos no exemplo a seguir.

Com isso no ar, `replication_factor` continua em 1 se for um nó só. Redundância real exige pelo menos três nós em zonas diferentes — fora do escopo deste post, mas documentado no [cookbook de cluster multi-nó](https://garagehq.deuxfleurs.fr/documentation/cookbook/real-world/) oficial.

## Exemplo prático: upload de imagem num projeto Next.js

Com bucket e chave já criados na seção anterior, a integração no Next.js segue o mesmo padrão de presigned URL que vale pra qualquer S3: o backend nunca vê o arquivo, só autoriza o upload.

Instale o SDK da AWS — o mesmo client funciona com Garage, só muda o endpoint:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Configure o client apontando pra sua VPS:

```typescript
// lib/garage.ts
import { S3Client } from "@aws-sdk/client-s3";

export const garage = new S3Client({
  endpoint: process.env.GARAGE_ENDPOINT, // https://s3.suahost.com
  region: "garage",
  credentials: {
    accessKeyId: process.env.GARAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.GARAGE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // acesso via s3.suahost.com/bucket
});
```

Um route handler que gera a URL de upload:

```typescript
// app/api/upload-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { garage } from "@/lib/garage";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const contentType = req.nextUrl.searchParams.get("type") ?? "image/jpeg";
  const key = `avatares/${randomUUID()}.jpg`;

  const command = new PutObjectCommand({
    Bucket: "posts-images",
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(garage, command, { expiresIn: 300 });

  return NextResponse.json({ uploadUrl, key });
}
```

E o componente que faz o upload direto do browser pro Garage:

```tsx
// components/AvatarUpload.tsx
"use client";

import { useState } from "react";

export function AvatarUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleUpload(file: File) {
    const res = await fetch(`/api/upload-url?type=${file.type}`);
    const { uploadUrl, key } = await res.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    setImageUrl(`${process.env.NEXT_PUBLIC_GARAGE_ENDPOINT}/posts-images/${key}`);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
      {imageUrl && <img src={imageUrl} alt="preview" width={200} />}
    </div>
  );
}
```

Pra a URL final funcionar sem autenticação, o bucket precisa aceitar leitura pública. O Garage não tem ACL por objeto como o S3 clássico — a forma de liberar leitura é expor o bucket como site:

```bash
docker exec garage /garage bucket website --allow posts-images
```

A partir daí, os arquivos em `posts-images` ficam acessíveis via o endpoint web (porta 3902, ou o domínio configurado no reverse proxy) sem precisar de URL assinada pra leitura — só o upload continua exigindo a URL temporária gerada pelo backend.

## Garage ou MinIO?

Se você já tem MinIO rodando numa VPS só e funciona, trocar não traz ganho nenhum — o modelo de presigned URL, o SDK, o `forcePathStyle`, tudo é idêntico. O Garage compensa quando o objetivo é justamente distribuir dados entre máquinas diferentes, sem depender de um único ponto de falha caro, ou quando o console administrativo do MinIO é peso que você não precisa. Pra um bucket só, numa VPS só, servindo upload de app Next.js, a escolha é mais sobre preferência de operação do que sobre recurso técnico.
