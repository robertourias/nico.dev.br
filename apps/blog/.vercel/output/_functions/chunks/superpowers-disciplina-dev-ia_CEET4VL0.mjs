import { ae as createVNode, n as Fragment, a3 as __astro_tag_component__ } from './astro/server_D7O-e-38.mjs';
import { $ as $$Timeline, a as $$TimelineItem } from './TimelineItem_DagOm6uO.mjs';
import { $ as $$Callout } from './Callout_DuaDqOb6.mjs';

const frontmatter = {
  "title": "Superpowers: disciplina de dev sênior pra IA codar",
  "slug": "superpowers-disciplina-dev-ia",
  "date": "2026-06-23",
  "category": "ia",
  "status": "published",
  "featured": false,
  "description": "Como o Superpowers ensina o Claude a seguir TDD, planejamento e revisão de código como um time sênior de verdade — com um bolão da Copa como exemplo.",
  "tags": ["claude", "superpowers", "tdd", "agentes-ia", "skills"],
  "template": "immersive",
  "heroImage": "https://images.unsplash.com/photo-1754548930550-be9fa88874f4?w=1600&q=80"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "o-que-muda-na-prática",
    "text": "O que muda na prática"
  }, {
    "depth": 2,
    "slug": "por-que-vale-usar",
    "text": "Por que vale usar"
  }, {
    "depth": 2,
    "slug": "exemplo-montando-um-bolão-da-copa",
    "text": "Exemplo: montando um bolão da Copa"
  }];
}
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Você já pediu pro Claude “implementar uma funcionalidade X” e recebeu de volta um código que funciona, mas que você nunca colocaria em produção sem reescrever a metade? O Superpowers existe justamente pra resolver isso."
    }), "\n", createVNode(_components.p, {
      children: ["É um framework open-source (", createVNode(_components.a, {
        href: "https://github.com/obra/superpowers",
        children: "github.com/obra/superpowers"
      }), ", MIT, criado por Jesse Vincent e o time da Prime Radiant) que empacota uma metodologia inteira de desenvolvimento de software em arquivos markdown. Hoje tem mais de 230 mil estrelas no GitHub e funciona em Claude Code, Cursor, Codex, Gemini CLI, Copilot CLI e mais alguns agentes."]
    }), "\n", createVNode(_components.p, {
      children: "A ideia central é simples: o problema dos agentes de IA programando não é falta de capacidade, é falta de disciplina. E disciplina, ao contrário do que parece, pode ser distribuída como texto puro — um conjunto de “skills” que o próprio Claude consulta antes de qualquer tarefa."
    }), "\n", createVNode(_components.h2, {
      id: "o-que-muda-na-prática",
      children: "O que muda na prática"
    }), "\n", createVNode(_components.p, {
      children: "Sem Superpowers, você pede uma feature e o Claude parte direto pro código. Com Superpowers instalado, ele primeiro recusa — educadamente — a escrever qualquer linha antes de passar por um processo de verdade."
    }), "\n", createVNode($$Callout, {
      type: "info",
      children: createVNode(_components.p, {
        children: "As skills disparam automaticamente. Você não digita comandos especiais — o Claude verifica sozinho qual skill se aplica antes de cada tarefa. É instruído a tratar isso como obrigatório, não como sugestão."
      })
    }), "\n", createVNode(_components.p, {
      children: "O fluxo completo, do “tenho uma ideia” até o merge:"
    }), "\n", createVNode($$Timeline, {
      children: [createVNode($$TimelineItem, {
        date: "1",
        title: "Brainstorming",
        children: createVNode(_components.p, {
          children: "Antes de qualquer código, o Claude faz perguntas socráticas pra entender o que você realmente quer. Explora alternativas, te apresenta o design em pedaços curtos o suficiente pra você de fato ler, e só avança com sua validação explícita."
        })
      }), createVNode($$TimelineItem, {
        date: "2",
        title: "Git worktree isolado",
        children: createVNode(_components.p, {
          children: "Com o design aprovado, cria uma branch nova em um workspace isolado, roda o setup do projeto e confirma que os testes existentes passam antes de tocar em qualquer coisa."
        })
      }), createVNode($$TimelineItem, {
        date: "3",
        title: "Plano de implementação",
        children: createVNode(_components.p, {
          children: "Quebra o trabalho em tarefas de 2 a 5 minutos cada, com caminho de arquivo exato, código completo e critério de verificação. O padrão de qualidade é “um júnior entusiasmado, sem contexto do projeto e sem instinto pra testar conseguiria seguir isso sem se perder”."
        })
      }), createVNode($$TimelineItem, {
        date: "4",
        title: "TDD sem negociação",
        children: createVNode(_components.p, {
          children: "Cada tarefa segue RED → GREEN → REFACTOR: escreve o teste que falha, confirma que falha, escreve o mínimo de código pra passar, só então refatora."
        })
      }), createVNode($$TimelineItem, {
        date: "5",
        title: "Subagentes + revisão dupla",
        children: createVNode(_components.p, {
          children: "Com o plano pronto, você diz “go” e cada tarefa vira um subagente novo, sem o contexto acumulado da conversa principal. Depois de cada uma, revisão em duas etapas: primeiro contra o plano, depois contra qualidade de código."
        })
      }), createVNode($$TimelineItem, {
        date: "6",
        title: "Fechamento da branch",
        children: createVNode(_components.p, {
          children: "Testes verificados de novo, e você escolhe: merge, abrir PR, manter a branch ou descartar. O worktree é limpo no final."
        })
      })]
    }), "\n", createVNode($$Callout, {
      type: "warning",
      children: createVNode(_components.p, {
        children: "Regra explícita do framework: se existe código escrito antes de existir um teste que falhe pra ele, esse código é deletado. Não é refatorado, não é “aproveitado” — é removido e reescrito a partir do teste."
      })
    }), "\n", createVNode(_components.h2, {
      id: "por-que-vale-usar",
      children: "Por que vale usar"
    }), "\n", createVNode(_components.p, {
      children: "O ganho não é só “código mais bonito”. São três coisas concretas."
    }), "\n", createVNode(_components.p, {
      children: "Primeiro, rastreabilidade: cada subagente recebe uma tarefa pequena e isolada, sem o contexto poluído de uma conversa longa. Isso reduz o efeito de “o Claude esqueceu o que combinamos há 40 mensagens”."
    }), "\n", createVNode(_components.p, {
      children: "Segundo, verificação antes de afirmação: a filosofia do projeto é “evidência antes de alegação” — o agente não declara algo como resolvido, ele mostra o teste passando."
    }), "\n", createVNode(_components.p, {
      children: "Terceiro, portabilidade: o mesmo conjunto de skills funciona em times que usam ferramentas diferentes (Claude Code, Cursor, Codex), porque é tudo markdown e instruções, não código amarrado a uma plataforma."
    }), "\n", createVNode(_components.p, {
      children: "A contrapartida é velocidade na primeira interação: você não tem código em 10 segundos, tem uma sessão de brainstorming. Pra protótipo descartável é overkill. Pra qualquer coisa que vai pra produção, é exatamente o atrito que falta hoje."
    }), "\n", createVNode(_components.h2, {
      id: "exemplo-montando-um-bolão-da-copa",
      children: "Exemplo: montando um bolão da Copa"
    }), "\n", createVNode(_components.p, {
      children: "Vamos seguir o fluxo real com um projeto concreto — um bolão pra Copa do Mundo, com pontuação por palpite de placar."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "1. Brainstorming."
      }), " Você escreve: “quero montar um bolão pra Copa”. O Claude, com Superpowers ativo, não escreve uma linha. Em vez disso, pergunta: quantos participantes? A pontuação é só “quem ganha” ou o placar exato vale mais? Fase de grupos e mata-mata pontuam igual? Existe ranking público ou só o total final? Depois de três ou quatro rodadas dessas, ele resume o design em um documento curto e pede seu “ok”."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "2. Plano."
      }), " Com o design fechado — palpite de placar exato vale 10 pontos, acertar só o resultado (vitória, empate, derrota) vale 5, errar vale 0 — o plano vira tarefas como: modelo de ", createVNode(_components.code, {
        children: "Partida"
      }), ", modelo de ", createVNode(_components.code, {
        children: "Palpite"
      }), ", função ", createVNode(_components.code, {
        children: "calcularPontos"
      }), ", endpoint de ranking. Cada uma com arquivo e teste esperado."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "3. TDD na prática."
      }), " O subagente que pega a tarefa de pontuação escreve primeiro o teste:"]
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "ts",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "test"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"acerta o placar exato\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", () "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " pontos"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " calcularPontos"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "({"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    palpite: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "2"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    resultado: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "2"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  });"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "  expect"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(pontos)."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "toBe"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "10"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ");"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "});"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "test"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"acerta só o vencedor\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", () "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " pontos"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " calcularPontos"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "({"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    palpite: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "3"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    resultado: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  });"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "  expect"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(pontos)."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "toBe"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "5"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ");"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "});"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "test"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"erra tudo\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", () "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " pontos"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " calcularPontos"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "({"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    palpite: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    resultado: { golsCasa: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", golsFora: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "2"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " },"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  });"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "  expect"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(pontos)."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "toBe"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ");"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "});"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: ["Roda os testes. Falham — ", createVNode(_components.code, {
        children: "calcularPontos"
      }), " nem existe ainda. Isso é o RED, e é esperado. Só depois disso vem a implementação mínima:"]
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "ts",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "function"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " calcularPontos"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "({ "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "palpite"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "resultado"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " }) {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  if"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " (palpite.golsCasa "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "==="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " resultado.golsCasa "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "&&"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " palpite.golsFora "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "==="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " resultado.golsFora) {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "    return"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " 10"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ";"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  }"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " vencedorPalpite"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " Math."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "sign"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(palpite.golsCasa "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "-"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " palpite.golsFora);"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " vencedorResultado"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " Math."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "sign"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(resultado.golsCasa "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "-"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " resultado.golsFora);"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  return"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " vencedorPalpite "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "==="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " vencedorResultado "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "?"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " 5"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " :"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " 0"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ";"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "}"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Testes passam — GREEN. Só então entra refatoração, se fizer sentido."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "4. Revisão."
      }), " Antes de seguir pra próxima tarefa (o endpoint de ranking), um segundo subagente revisa: a implementação bate com o plano? Os nomes de variável e a estrutura do arquivo seguem o padrão do resto do projeto? Problema crítico bloqueia o avanço; o resto vira nota."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "5. Fechamento."
      }), " Com ", createVNode(_components.code, {
        children: "Partida"
      }), ", ", createVNode(_components.code, {
        children: "Palpite"
      }), ", ", createVNode(_components.code, {
        children: "calcularPontos"
      }), " e o ranking implementados e testados, o Claude pergunta se você quer abrir PR, mergear direto ou manter a branch pra mais ajustes."]
    }), "\n", createVNode(_components.p, {
      children: "O ponto não é que isso seja mágico. É que cada etapa fica registrada — design, plano, teste, código, revisão — em vez de um commit gigante que “parece funcionar”."
    }), "\n", createVNode($$Callout, {
      type: "tip",
      children: createVNode(_components.p, {
        children: "Pra projetos pequenos como esse bolão, o brainstorming inicial parece exagero. Mas é exatamente aí que decisões como “empate nas penalidades pontua como vitória?” deixam de ser descobertas só quando alguém reclama depois da Copa."
      })
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/content/posts/superpowers-disciplina-dev-ia.mdx";
const file = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/superpowers-disciplina-dev-ia.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/superpowers-disciplina-dev-ia.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
