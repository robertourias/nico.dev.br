---
title: "Route 53 e ACM: domínio próprio com HTTPS na AWS"
slug: "route-53-acm-dominio-https-aws"
date: "2026-09-28"
categories: ["infra"]
status: "published"
featured: false
description: "Como Route 53 e AWS Certificate Manager colocam um domínio próprio com HTTPS na frente do CloudFront: hosted zone, alias, validação por DNS e renovação."
tags: ["aws", "route-53", "acm", "dns", "https"]
---

Colocar um domínio próprio com HTTPS na frente de um site na AWS envolve dois serviços que quase sempre aparecem juntos: o **Route 53**, que é o DNS, e o **ACM (AWS Certificate Manager)**, que emite o certificado TLS. Um responde "qual é o endereço de `meusite.com.br`"; o outro prova para o navegador que quem responde nesse endereço é mesmo você.

No [guia de S3 e CloudFront](/posts/aws-s3-cloudfront-guia-de-projeto) passei rápido por essa parte. Aqui ela ganha o espaço que merece, porque é onde a maioria das configurações trava na primeira vez: certificado que não aparece na lista, validação que fica pendente para sempre, domínio raiz que não aceita CNAME.

## O que cada serviço resolve

**DNS (Domain Name System)** é o sistema que traduz um nome em endereço IP. Quando alguém digita `meusite.com.br`, o navegador pergunta a um resolvedor, que pergunta aos servidores de nomes responsáveis por aquele domínio. O **Route 53** é o serviço da AWS que faz o papel desses servidores de nomes, e também vende registro de domínio, mas as duas coisas são independentes.

**Certificado TLS** é o documento que liga um nome de domínio a uma chave pública, assinado por uma autoridade certificadora em que o navegador confia. Sem ele, não existe HTTPS com cadeado. O **ACM** é a autoridade da AWS que emite esses certificados, guarda a chave privada e renova sozinha antes do vencimento.

O ponto que confunde: o certificado não mora no DNS. O Route 53 só aponta o nome para o serviço certo; quem apresenta o certificado ao navegador é o serviço que recebe a conexão, como CloudFront, Application Load Balancer ou API Gateway.

![Fluxo de uma requisição a meusite.com.br: o navegador consulta o Route 53, que responde via registro alias com os IPs da edge do CloudFront; o navegador abre a conexão HTTPS direto no CloudFront, que apresenta o certificado do ACM emitido em us-east-1 e busca o conteúdo na origem](/images/route-53-acm-dominio-https-aws-fluxo.svg)

A sequência completa: o navegador pergunta o IP ao Route 53, recebe os endereços da edge do CloudFront mais próxima, abre a conexão TLS ali, e o CloudFront apresenta o certificado do ACM. O navegador confere se o nome no certificado bate com o que foi digitado. Só depois disso o CloudFront entrega do cache ou busca na origem.

## Route 53: hosted zone, delegação e alias

### Hosted zone

Uma **hosted zone** é o contêiner dos registros DNS de um domínio: o A, o AAAA, o MX do e-mail, os CNAMEs. Ao criar uma hosted zone pública para `meusite.com.br`, o Route 53 atribui quatro servidores de nomes a ela, que aparecem no registro NS da zona.

Existe também a hosted zone privada, que só responde dentro de VPCs associadas. Serve para nomes internos, como `db.interno`, e não tem nada a ver com site público.

### Delegação quando o domínio está em outro registrador

Registrar o domínio e hospedar o DNS são papéis separados. Se o domínio foi comprado no Registro.br ou em qualquer outro registrador, dá para manter o registro lá e só **delegar** o DNS para o Route 53: você copia os quatro servidores de nomes da hosted zone e os cadastra no painel do registrador.

A partir daí, o Route 53 passa a ser a fonte da verdade. Registro criado no painel antigo do registrador deixa de valer, e esse é um erro comum logo depois da migração: o e-mail para de funcionar porque o MX ficou para trás. Antes de trocar os servidores de nomes, recrie na hosted zone todos os registros que já existiam.

### Registro alias e o problema do domínio raiz

Pela especificação do DNS, um CNAME não pode coexistir com outros registros no mesmo nome. O domínio raiz (o **apex**, `meusite.com.br` sem `www`) sempre tem pelo menos os registros SOA e NS, então não pode ser CNAME. É por isso que muitos provedores de DNS obrigam a usar `www` para apontar para um serviço que só oferece um nome, como `d111111abcdef8.cloudfront.net`.

O Route 53 contorna isso com o **registro alias**, uma extensão própria. Você cria um registro do tipo A (e outro AAAA, para IPv6) marcado como alias, e ele aponta para um recurso da AWS. Na hora da consulta, o Route 53 resolve o destino internamente e devolve os IPs, como se fosse um A comum. Funciona no apex, acompanha mudanças de IP do destino, e a AWS não cobra pelas consultas a alias que apontam para recursos da própria AWS.

## ACM: como o certificado é emitido

### Região: a regra que mais pega

O certificado ACM vive numa região e só pode ser usado por recursos daquela região. Para ALB e API Gateway regional, peça o certificado na mesma região do recurso. Para **CloudFront**, o certificado precisa estar em **us-east-1 (Norte da Virgínia)**, não importa onde fique o resto da infraestrutura.

Se o certificado foi pedido em `sa-east-1`, ele simplesmente não aparece na lista ao editar a distribution. Não tem mensagem de erro explicando; a opção só não existe.

### Nomes cobertos e wildcard

Um certificado pode cobrir vários nomes. Um wildcard como `*.meusite.com.br` cobre um único nível de subdomínio: vale para `www.meusite.com.br` e `api.meusite.com.br`, mas não para `meusite.com.br` nem para `v2.api.meusite.com.br`. O padrão é pedir os dois de uma vez: o apex como nome principal e o wildcard como nome alternativo.

### Validação por DNS

Antes de emitir, o ACM precisa confirmar que você controla o domínio. São dois métodos: e-mail, enviado a endereços administrativos do domínio, ou DNS. Use DNS. O e-mail depende de uma caixa que talvez nem exista, e exige ação humana a cada renovação.

![Cinco etapas da validação por DNS: você pede o certificado, o ACM gera um registro CNAME com nome aleatório, o CNAME é publicado na zona do domínio, o ACM consulta o DNS público e encontra o registro, e o certificado passa para Issued; na renovação, o ACM repete a checagem no mesmo CNAME](/images/route-53-acm-dominio-https-aws-validacao-dns.svg)

Na validação por DNS, o ACM gera um registro CNAME com um nome aleatório dentro do seu domínio. Publicar esse registro é a prova de controle: só quem administra a zona consegue fazer isso. Quando a zona está no Route 53, o console oferece um botão para criar o registro direto na hosted zone. Com DNS em outro provedor, você copia nome e valor e cria na mão; o ACM funciona igual, só não tem o atalho.

O detalhe que importa depois: **esse CNAME fica lá para sempre**. É ele que o ACM consulta de novo na renovação automática. Quem faz faxina na zona e apaga "aquele registro estranho com underline" descobre meses depois, com o certificado vencendo.

Mais uma armadilha: se o domínio tem registro **CAA** (Certification Authority Authorization, que diz quais autoridades podem emitir certificado para ele), a Amazon precisa estar autorizada nele. Caso contrário, a emissão falha.

### O que o ACM não faz

Certificado público do ACM usado em serviços integrados (CloudFront, ALB, API Gateway) não tem custo. Em troca, a chave privada fica com a AWS: o modelo padrão não deixa baixar o certificado para instalar num nginx rodando numa EC2. Para esse caso, o caminho usual é colocar um ALB na frente, ou usar outra autoridade, como o Let's Encrypt.

## Passo a passo: domínio próprio com HTTPS pela AWS CLI

O fluxo completo para um site estático no CloudFront, com o domínio já delegado para o Route 53:

1. Pedir o certificado em `us-east-1`, com validação por DNS.
2. Criar o CNAME de validação na hosted zone.
3. Esperar o status `ISSUED`.
4. Na distribution, adicionar `meusite.com.br` e `www.meusite.com.br` como nomes alternativos e selecionar o certificado.
5. Criar os registros alias A e AAAA apontando para a distribution.

O pedido do certificado:

```bash
aws acm request-certificate \
  --region us-east-1 \
  --domain-name meusite.com.br \
  --subject-alternative-names "*.meusite.com.br" \
  --validation-method DNS
```

O comando devolve um ARN. Com ele, `describe-certificate` mostra o registro que precisa ser criado:

```bash
aws acm describe-certificate \
  --region us-east-1 \
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/abc-123 \
  --query "Certificate.DomainValidationOptions[].ResourceRecord"
```

Depois que o certificado estiver associado à distribution, o registro alias no apex. O `HostedZoneId` dentro de `AliasTarget` é fixo para qualquer distribution do CloudFront (`Z2FDTNDATAQYW2`), não é o ID da sua zona:

```json
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "meusite.com.br",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "Z2FDTNDATAQYW2",
        "DNSName": "d111111abcdef8.cloudfront.net",
        "EvaluateTargetHealth": false
      }
    }
  }]
}
```

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id ID_DA_SUA_ZONA \
  --change-batch file://alias-apex.json
```

Repita com `"Type": "AAAA"` se o IPv6 estiver ligado na distribution, e de novo para `www`. Em projeto real, isso tudo vira Terraform ou CDK; o valor de fazer uma vez pela CLI é enxergar cada peça separada.

## Quando algo não funciona

Na prática, quase todo problema cai em uma destas situações:

| Sintoma | Causa provável |
| --- | --- |
| Certificado não aparece ao editar a distribution | Pedido fora de `us-east-1` |
| Validação fica em `Pending validation` | CNAME criado em zona que não é a autoritativa, ou registro CAA bloqueando |
| Navegador mostra erro de nome no certificado | Nome acessado não está no certificado, como apex fora do wildcard |
| CloudFront recusa o nome alternativo | Nenhum certificado associado cobre aquele nome |
| Certificado venceu sem aviso | CNAME de validação apagado, renovação automática falhou |

Para confirmar quem responde pelo domínio, `dig NS meusite.com.br +short` deve devolver os servidores do Route 53. Se devolver os do registrador antigo, a delegação ainda não propagou ou não foi feita, e qualquer registro criado na hosted zone é invisível para o resto da internet.

## O que fica

Route 53 e ACM são simples quando você separa os papéis: DNS aponta, certificado prova identidade, e quem apresenta o certificado é o serviço que termina a conexão. Quase todo erro de configuração vem de misturar essas camadas, como procurar o certificado no DNS ou esperar que um CNAME resolva o apex.

As três decisões que evitam dor de cabeça depois: validação por DNS em vez de e-mail, certificado em `us-east-1` sempre que houver CloudFront, e o CNAME de validação tratado como infraestrutura permanente, de preferência declarado em código para ninguém apagar por engano.

## Referências

- AWS. [Amazon Route 53 Developer Guide — Choosing between alias and non-alias records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
- AWS. [Making Amazon Route 53 the DNS service for an existing domain](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html)
- AWS. [AWS Certificate Manager User Guide — DNS validation](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html)
- AWS. [AWS Certificate Manager User Guide — CAA records](https://docs.aws.amazon.com/acm/latest/userguide/setup-caa.html)
- AWS. [Requirements for using SSL/TLS certificates with CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html)
- No blog: [S3 e CloudFront: guia de uso pra projeto real](/posts/aws-s3-cloudfront-guia-de-projeto)
- No blog: [AWS na prática: Lambda, S3, CloudFront e API Gateway](/posts/aws-na-pratica-lambda-s3-cloudfront-api-gateway)
