---
title: "AWS na prática: Lambda, S3, CloudFront e API Gateway"
slug: "aws-na-pratica-lambda-s3-cloudfront-api-gateway"
date: "2026-07-20"
category: "tech"
status: "published"
featured: false
description: "Onde Lambda, S3, CloudFront e um API Gateway (nativo ou algo como o Sensedia) realmente se encaixam numa arquitetura de projeto real."
tags: ["aws", "lambda", "s3", "cloudfront", "api-gateway"]
coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
---

Tem uma pergunta que aparece direto em entrevista técnica e que a maioria responde na base do glossário: "o que é Lambda", "o que é S3". O problema é que isso não ajuda a decidir nada num projeto real. A pergunta certa é onde cada peça entra no fluxo e por que ali, não em outro lugar.

Vou passar pelos quatro recursos que mais aparecem em arquitetura de aplicação web — Lambda, S3, CloudFront e API Gateway — com um exemplo concreto de uso em cada um, e no fim junto tudo num fluxo de projeto real.

## Lambda: código que roda sem servidor pra manter

Lambda é uma função que a AWS executa sob demanda, cobra pelo tempo de execução e desliga sozinha quando não tem nada pra fazer. Você não gerencia instância, não paga por ociosidade, não faz deploy de servidor.

Onde isso vira valor de verdade: processamento assíncrono disparado por evento. Exemplo clássico — usuário faz upload de uma foto de perfil, o arquivo cai num bucket S3, esse upload dispara um evento `s3:ObjectCreated`, e uma Lambda escutando esse evento gera três tamanhos de thumbnail (grid, perfil, capa) e grava de volta no bucket. Nenhuma linha desse fluxo passa pelo servidor principal da aplicação — ele só recebe o upload inicial e segue a vida.

Outro uso comum: webhook handler. Um provedor de pagamento (Stripe, Pagar.me) manda um POST de confirmação de cobrança. Uma Lambda atrás de um API Gateway recebe esse POST, valida a assinatura, atualiza o status do pedido no banco e publica um evento numa fila SQS pra quem mais precisar reagir (time de fulfillment, notificação por e-mail). Isso roda em milissegundos, escala sozinho em picos de Black Friday, e custa quase zero fora desses picos.

## S3: armazenamento de objeto que vira peça de infraestrutura

S3 guarda arquivo — isso todo mundo sabe. O que faz diferença é usá-lo como parte ativa da arquitetura, não só como HD na nuvem.

Exemplo direto: upload de anexo num sistema de tickets de suporte. Em vez do backend receber o arquivo, gravar em disco e depois subir pro S3 (dois hops, dois pontos de falha), o backend gera uma **presigned URL** — uma URL temporária e assinada que autoriza o navegador do usuário a fazer upload direto pro bucket, sem passar pelo servidor. O backend só grava a referência do objeto no banco depois que o upload confirma. Menos carga no servidor, menos latência pro usuário.

Outro encaixe: hospedar o build estático de um frontend (React, Next.js com export estático, ou qualquer SPA). O bucket vira o "servidor" dos arquivos HTML/CSS/JS — sem Nginx, sem instância EC2 rodando 24h só pra servir arquivo estático.

## CloudFront: a camada que fica entre o usuário e a origem

CloudFront é a CDN da AWS. Ele não guarda dado por conta própria — ele fica na frente de uma origem (um bucket S3, um API Gateway, um load balancer) e cacheia resposta em edge locations espalhadas pelo mundo, entregando o conteúdo a partir do ponto mais próximo do usuário.

Encaixe óbvio: na frente do bucket S3 do frontend estático que mencionei acima. Sem CloudFront, todo usuário buscando o `index.html` bate direto no bucket, na região onde ele está hospedado — alguém em Fortaleza acessando um bucket em `us-east-1` sente essa distância. Com CloudFront, a resposta cacheada sai do edge mais próximo, e o bucket só é consultado quando o cache expira ou o conteúdo muda.

Encaixe menos óbvio, mas igual de importante: na frente de uma API. Endpoints de leitura que não mudam a cada request — catálogo de produtos, lista de categorias, config pública da aplicação — podem ser cacheados no CloudFront com um TTL curto (30 segundos, 1 minuto). Isso tira uma fatia real de tráfego do backend sem o backend saber que está sendo cacheado.

## API Gateway: onde a decisão fica interessante

Aqui mora a parte que costuma confundir: **API Gateway da AWS** e **plataforma de API Management** (Sensedia, Apigee, Kong) resolvem o mesmo problema em escalas diferentes.

O API Gateway da AWS é a porta de entrada pras suas Lambdas — ele recebe o request HTTP, aplica autenticação via Cognito ou Lambda authorizer, faz throttling básico, transforma payload se precisar, e invoca a função. Ele resolve bem o caso "preciso expor uma função como endpoint REST" dentro do próprio ecossistema AWS.

O que ele não resolve — e onde entra uma plataforma como o Sensedia — é gestão de API como produto, num cenário com múltiplos backends, múltiplos consumidores externos e exigência de governança. Empresas com múltiplas squads publicando API pra parceiros (bancos, operadoras de telecom, varejo com marketplace de terceiros) usam o Sensedia como camada única de:

Portal de desenvolvedor pra quem consome a API externamente, com documentação, sandbox e onboarding de chave própria. Políticas de segurança centralizadas — rate limit por parceiro, mTLS, validação de token OAuth — aplicadas de forma consistente entre APIs que rodam em AWS, on-premise ou outro provedor de nuvem, sem cada time reimplementar a mesma política. Monetização e analytics de consumo por cliente, coisa que o API Gateway nativo não tem embutido.

Na prática: o API Gateway da AWS resolve "expor minha Lambda". O Sensedia resolve "gerenciar o ciclo de vida de dezenas de APIs, de múltiplos times, consumidas por parceiros externos que pagam por chamada". Um projeto pequeno não precisa do segundo. Um banco com API aberta pro Open Finance, sim.

## Outras ferramentas da AWS que valem a pena conhecer

Lambda, S3, CloudFront e API Gateway resolvem a espinha dorsal. Mas tem um segundo grupo de serviços que aparece o tempo todo em volta dessa espinha, e que faz falta quando falta.

**IAM** é a primeira coisa que qualquer dev deveria entender antes de tocar em qualquer outro serviço. É o sistema de permissão da AWS — quem pode invocar qual Lambda, qual função pode ler qual bucket, qual usuário pode criar recurso. A maioria dos incidentes de segurança em AWS não vem de código malicioso, vem de role com permissão ampla demais (`s3:*` num bucket que devia só aceitar `GetObject`).

**CloudWatch** guarda log e métrica de tudo que roda na AWS. Toda Lambda escreve log ali automaticamente. Na prática, é onde você vai quando a função que processa thumbnail começa a falhar silenciosamente às 3 da manhã — e é onde você configura um alarme pra ser avisado antes do cliente perceber.

**SQS** é fila de mensagem. Ela entra exatamente no ponto onde duas partes do sistema não devem estar acopladas em tempo real. No exemplo do webhook de pagamento lá em cima, a Lambda que recebe a confirmação não chama diretamente o serviço de e-mail — ela publica na fila, e um consumidor separado processa o envio no próprio ritmo, sem travar a resposta do webhook.

**DynamoDB** é banco de dados chave-valor gerenciado, sem servidor pra manter. Faz sentido quando o acesso é previsível (buscar por ID de pedido, por ID de sessão) e a escala é imprevisível — ele escala automaticamente sem você tocar em configuração de instância.

**Secrets Manager** guarda credencial — senha de banco, chave de API de terceiro — fora do código e fora de variável de ambiente exposta. Uma Lambda busca o segredo em runtime, com acesso controlado via IAM. Resolve o problema clássico de chave de API vazada em repositório público.

**EventBridge** é um barramento de eventos: permite que um serviço publique "isso aconteceu" sem saber quem está ouvindo. Um pedido criado dispara um evento; hoje ele aciona a Lambda de nota fiscal, amanhã pode acionar também uma Lambda de recomendação, sem tocar no código que gerou o evento original.

Vale conhecer o suficiente de cada um pra saber quando ele resolve o problema — não precisa dominar todos de primeira. Mas ignorar IAM e CloudWatch, especialmente, cobra a conta mais cedo do que parece.

## Juntando tudo num fluxo real

Pega um cenário de e-commerce com upload de nota fiscal pelo cliente:

O frontend (Next.js) está num bucket S3, servido via CloudFront. O cliente acessa a tela de "enviar nota fiscal", pede uma presigned URL ao backend e sobe o PDF direto pro S3. O evento de upload dispara uma Lambda que valida o arquivo (tamanho, tipo, malware scan básico) e grava metadado no banco.

Um parceiro logístico externo precisa consultar o status dessas notas via API. Essa API roda atrás do Sensedia, que aplica rate limit por parceiro e expõe um portal de documentação — por baixo, o Sensedia roteia pra um API Gateway da AWS que invoca a Lambda de consulta, que lê do banco.

Cada peça faz uma coisa só, e a arquitetura inteira nunca depende de um servidor rodando 24 horas esperando requisição.
