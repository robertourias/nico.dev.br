---
title: "Como usar MinIO para armazenar uploads"
slug: "como-usar-minio-armazenar-uploads"
date: "2026-06-23"
category: "tech"
status: "published"
featured: false
description: "Guia prático para subir um MinIO, criar buckets e integrar uploads de arquivos numa aplicação Node.js — sem depender da AWS."
tags: ["minio", "s3", "armazenamento-de-objetos", "uploads", "docker"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
---

Salvar upload de usuário direto no disco do servidor funciona até o dia em que você precisa escalar horizontalmente, trocar de servidor ou fazer backup de verdade. Nesse momento, ou você migra para um provedor de object storage, ou recria a roda. O MinIO resolve isso sem te prender a nenhuma nuvem.

## O que é o MinIO

MinIO é um servidor de armazenamento de objetos compatível com a API do S3 da AWS. Isso significa que qualquer SDK, CLI ou biblioteca feita para S3 funciona com MinIO sem alterações — você só troca o endpoint.

A diferença é que você roda o MinIO onde quiser: numa VPS de R$20/mês, num cluster on-premise ou num container ao lado da sua aplicação. Self-hosted, sem custo de egress, sem vendor lock-in.

Para uploads de usuário (avatares, documentos, anexos, imagens de produto), é a solução mais direta entre "salvar no disco e rezar" e "assinar contrato com a AWS".

## Subindo o MinIO com Docker

O jeito mais rápido de testar é via `docker-compose`:

```yaml
services:
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"   # API S3
      - "9001:9001"   # Console web
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: senha-forte-aqui
    volumes:
      - minio_data:/data

volumes:
  minio_data:
```

```bash
docker compose up -d
```

O console fica em `http://localhost:9001`. A API S3 (a que sua aplicação vai usar) fica em `http://localhost:9000`.

Em produção, troque `MINIO_ROOT_PASSWORD` por algo gerado, coloque atrás de um proxy com TLS e nunca exponha a porta 9000 direto pra internet sem autenticação adicional.

## Criando o bucket

Com o cliente `mc` (MinIO Client), criar e configurar um bucket é uma questão de poucos comandos:

```bash
mc alias set local http://localhost:9000 admin senha-forte-aqui
mc mb local/uploads
mc anonymous set download local/uploads
```

O último comando torna os objetos do bucket `uploads` legíveis publicamente via URL direta — útil para avatares e imagens que vão aparecer no front-end. Para documentos sensíveis, não rode esse comando: deixe o bucket privado e sirva os arquivos só via URL assinada.

## Os dois padrões de upload

Existem dois jeitos de subir um arquivo para o MinIO a partir da sua aplicação, e a escolha entre eles importa.

**Upload via backend (proxy).** O arquivo passa pelo seu servidor antes de chegar no MinIO. Simples de implementar, mas o arquivo trafega duas vezes pela rede e consome banda e memória do seu backend.

**Upload via URL pré-assinada (presigned URL).** O backend gera uma URL temporária com permissão de escrita, e o cliente (browser ou app) sobe o arquivo direto para o MinIO. O backend nunca vê o conteúdo do arquivo — só autoriza a operação.

```
Cliente                Backend                  MinIO
   │                       │                       │
   │  1. Pede permissão    │                       │
   │  para enviar arquivo  │                       │
   ├──────────────────────>│                       │
   │                       │  2. Gera presigned URL│
   │                       ├──────────────────────>│
   │                       │<──────────────────────┤
   │  3. Recebe a URL      │                       │
   │<──────────────────────┤                       │
   │                       │                       │
   │  4. Upload direto do arquivo (PUT)             │
   ├────────────────────────────────────────────────>│
   │                       │                       │
   │  5. Confirma sucesso e salva metadata no banco │
   ├──────────────────────>│                       │
```

Para a maioria dos casos — upload de imagem de perfil, anexo em formulário, documento de usuário — presigned URL é a escolha certa. Menos carga no backend, upload mais rápido, e o servidor só lida com metadados.

## Integrando com Node.js

Usando o SDK oficial da AWS (compatível com MinIO):

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // obrigatório para MinIO
});

async function gerarUrlDeUpload(nomeArquivo, tipoConteudo) {
  const command = new PutObjectCommand({
    Bucket: "uploads",
    Key: `avatares/${nomeArquivo}`,
    ContentType: tipoConteudo,
  });

  // URL válida por 5 minutos
  return getSignedUrl(s3, command, { expiresIn: 300 });
}
```

No front-end, o upload fica assim:

```javascript
const url = await fetch("/api/upload-url?filename=foto.jpg&type=image/jpeg")
  .then((res) => res.json())
  .then((data) => data.url);

await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "image/jpeg" },
  body: arquivoSelecionado,
});
```

O detalhe que costuma travar quem migra de S3 puro: `forcePathStyle: true`. Sem isso, o SDK monta a URL no formato `bucket.endpoint.com`, que o MinIO não resolve por padrão.

## Boas práticas que evitam dor de cabeça depois

**Versionamento de bucket.** Ative com `mc version enable local/uploads` se exclusão acidental é um risco real no seu caso de uso.

**Lifecycle policy.** Arquivos temporários (uploads abandonados no meio do fluxo, por exemplo) devem expirar automaticamente:

```bash
mc ilm add local/uploads --expiry-days 7 --prefix "temp/"
```

**Buckets separados por ambiente.** `uploads-dev`, `uploads-staging`, `uploads-prod`. Misturar ambiente de teste com produção no mesmo bucket é abrir margem para vazar dado de teste em produção — ou pior, o contrário.

**Nunca confie no nome de arquivo enviado pelo cliente.** Gere um nome próprio (UUID, hash, timestamp) no backend antes de montar a `Key` do objeto. Confiar no nome original é abrir a porta para path traversal e sobrescrita de arquivo.

Com isso rodando, trocar de MinIO self-hosted para S3 da AWS — ou o contrário — é mudança de três variáveis de ambiente. É essa portabilidade que faz valer a pena não acoplar o código direto a um provedor específico desde o primeiro dia.
