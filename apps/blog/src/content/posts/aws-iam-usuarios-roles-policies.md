---
title: "AWS IAM: usuários, roles e policies na prática"
slug: "aws-iam-usuarios-roles-policies"
date: "2026-09-29"
categories: ["infra", "architecture"]
status: "published"
featured: false
description: "Guia de AWS IAM: como usuários, roles e policies funcionam, como a AWS avalia uma requisição e como aplicar menor privilégio."
tags: ["aws", "iam", "seguranca", "menor-privilegio", "cloud"]
---

Toda chamada de API na AWS passa por uma pergunta antes de executar: quem está pedindo, o que ele quer fazer e em qual recurso. Quem responde é o AWS IAM (Identity and Access Management), o serviço que decide se a requisição é permitida ou negada.

Entender o IAM é o que separa "coloquei `AdministratorAccess` para funcionar" de um ambiente que você consegue auditar. Este post cobre as identidades, o formato das policies, a lógica de avaliação e o padrão que resolve a maior parte dos casos reais: roles com credenciais temporárias.

## O que o AWS IAM controla

O IAM resolve dois problemas distintos. **Autenticação** é provar quem você é (senha, MFA, chave de acesso). **Autorização** é definir o que essa identidade pode fazer. Os dois vivem no mesmo serviço, mas são etapas separadas.

Alguns termos aparecem o tempo todo:

- **Principal:** quem faz a requisição (usuário, role, serviço da AWS ou conta).
- **Action:** a operação de API, no formato `serviço:Operação`, como `s3:GetObject`.
- **Resource:** o recurso alvo, identificado por um ARN (Amazon Resource Name), como `arn:aws:s3:::meu-bucket/*`.
- **Condition:** restrição extra, como IP de origem, tag ou exigência de MFA.

O IAM é global (não pertence a uma região) e não tem cobrança própria. Você paga pelos recursos que as permissões liberam, não pelo controle de acesso.

## Usuários, grupos e roles: as identidades do IAM

Existem três tipos de identidade que você vai encontrar, mais uma que merece cuidado especial.

**Usuário root.** É a identidade criada junto com a conta, com poder total. Ative MFA, não crie chaves de acesso para ela e use só nas poucas tarefas que exigem root, como alterar o plano de suporte ou fechar a conta.

**Usuário IAM.** Representa uma pessoa ou aplicação, com credenciais de longo prazo: senha de console e/ou chaves de acesso. Funciona, mas o custo é gerenciar rotação e vazamento. Um grupo IAM só junta usuários para anexar policies de uma vez; ele não é uma identidade que faz requisições.

**Role.** Uma identidade sem credencial fixa. Quem precisa dela a *assume* e recebe credenciais temporárias. É o mecanismo padrão para Lambda, EC2, ECS, pipelines de CI e acesso entre contas. Para pessoas do time, a AWS recomenda o IAM Identity Center, que entrega acesso federado também baseado em credenciais temporárias.

A regra prática: humanos entram por federação, máquinas usam roles, e usuário IAM com chave de acesso fica para o que não tem alternativa.

## Policies: o JSON que define permissões

Uma policy é um documento JSON com uma lista de statements. Este exemplo libera leitura em um bucket específico e só isso:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LerArquivosDoSite",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::meu-site-assets/*"
    }
  ]
}
```

`Version` é a versão da linguagem de policy (use `2012-10-17`). `Effect` é `Allow` ou `Deny`. `Action` e `Resource` dizem o que e onde. Um `Condition` opcional refina o statement, por exemplo `"Bool": {"aws:MultiFactorAuthPresent": "true"}` para exigir MFA.

Nem toda policy é igual. O tipo determina onde ela é anexada e o que ela faz:

| Tipo | Onde vive | Para que serve |
| --- | --- | --- |
| Baseada em identidade | Usuário, grupo ou role | Define o que a identidade pode fazer |
| Baseada em recurso | No recurso (bucket policy, fila SQS) | Define quem pode acessar o recurso; inclui `Principal` |
| Trust policy | Na role | Define quem pode assumir a role |
| Permissions boundary | Usuário ou role | Teto máximo de permissões que a identidade pode ter |
| SCP (AWS Organizations) | Conta ou unidade organizacional | Teto de permissões para todas as contas abaixo |

Boundary e SCP não concedem nada. Eles só limitam o que as outras policies podem conceder.

## Como a AWS avalia uma requisição

A lógica de avaliação cabe em três regras. Toda requisição começa **negada por padrão** (deny implícito). Um `Allow` aplicável libera. Um `Deny` explícito em qualquer policy vence todos os `Allow`.

![Fluxograma da avaliação do IAM: primeiro verifica Deny explícito, que nega; depois verifica Allow, que permite; sem Allow, nega por deny implícito.](/images/aws-iam-usuarios-roles-policies-avaliacao.svg)

O diagrama resume a ordem: Deny explícito primeiro, depois procura um Allow, e sem Allow o resultado é negado.

Na prática isso muda como você diagnostica erro. A mensagem `is not authorized to perform` costuma indicar deny implícito: falta um `Allow`. Quando a mensagem menciona *explicit deny*, existe uma policy negando de propósito, e adicionar outro `Allow` não resolve. Nesse caso o caminho é achar o `Deny` (às vezes vindo de uma SCP ou boundary).

## Roles na prática: trust policy e permissions policy

Uma role tem duas policies com papéis diferentes. A **trust policy** diz quem pode assumi-la. A **permissions policy** diz o que ela pode fazer depois de assumida.

![Quatro etapas: o chamador assume a role, a trust policy confere quem pode assumir, o STS emite credenciais temporárias e a permissions policy define o que a chamada de API pode fazer.](/images/aws-iam-usuarios-roles-policies-assume-role.svg)

Exemplo clássico: uma função Lambda que lê um bucket. A trust policy deixa o serviço Lambda assumir a role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

A permissions policy é a do bucket mostrada antes. O código da função não guarda chave nenhuma: o SDK obtém as credenciais temporárias da role automaticamente. Se a função vazar em um log, o que vaza expira sozinho.

Um detalhe que pega muita gente: para *entregar* uma role a um serviço (ao criar uma Lambda, por exemplo), a identidade que cria precisa da permissão `iam:PassRole`. Sem ela, o erro aparece na criação, não na execução. O post [AWS na prática: Lambda, S3, CloudFront e API Gateway](/posts/aws-na-pratica-lambda-s3-cloudfront-api-gateway) mostra onde essa role entra na arquitetura.

## Menor privilégio sem sofrer

Menor privilégio significa conceder só o necessário para a tarefa. O erro comum é tratar isso como esforço inicial impossível e cair em `"Action": "*"`. Um caminho mais realista:

1. Comece com uma policy gerenciada estreita para o serviço e o recurso, não com `AdministratorAccess`.
2. Restrinja `Resource` ao ARN real em vez de `*` sempre que a ação suportar.
3. Use `Condition` onde faz sentido: MFA, tags, origem da requisição.
4. Depois de um período de uso, revise o que foi realmente usado. O IAM Access Analyzer consegue gerar uma policy a partir da atividade registrada no CloudTrail, e o "último acesso" das permissões mostra o que sobrou sem uso.

Esse último passo é o que torna a abordagem viável: você afrouxa com cuidado no começo e aperta com dados depois.

## Erros que se repetem

Chave de acesso de usuário commitada em repositório é o vazamento mais comum, e existe justamente para ser evitado com roles. `Resource: "*"` em policy de escrita costuma ser preguiça, não necessidade. E usar a conta root no dia a dia elimina qualquer rastreabilidade.

O outro erro é organizacional: uma role compartilhada por várias aplicações. Quando uma delas precisa de mais permissão, todas ganham. Uma role por workload custa pouco e isola o dano.

## O que fica

O modelo mental que sustenta o IAM é curto: tudo é negado, um `Allow` libera, um `Deny` vence. Depois disso, as escolhas são de desenho. Prefira credenciais temporárias a chaves fixas, uma role por workload, `Resource` específico e revisão periódica com dados de uso.

Quando um acesso falha, pergunte primeiro se o problema é falta de `Allow` ou presença de `Deny`. Essa distinção sozinha poupa horas de tentativa e erro. E quando montar a próxima infraestrutura, como um site em [S3 com CloudFront](/posts/aws-s3-cloudfront-guia-de-projeto), comece pela pergunta de quem precisa acessar o quê, antes de abrir o console.

## Referências

- [AWS: O que é o IAM (guia do usuário)](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
- [AWS: Lógica de avaliação de policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [AWS: Boas práticas de segurança no IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS: Solução de problemas de acesso negado](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_access-denied.html)
