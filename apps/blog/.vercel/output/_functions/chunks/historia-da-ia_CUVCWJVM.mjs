import { ae as createVNode, n as Fragment, a3 as __astro_tag_component__ } from './astro/server_D7O-e-38.mjs';
import { $ as $$Timeline, a as $$TimelineItem } from './TimelineItem_DagOm6uO.mjs';
import { $ as $$Callout } from './Callout_DuaDqOb6.mjs';

const frontmatter = {
  "title": "História da IA: Do Mito à Machine Intelligence",
  "slug": "historia-da-ia",
  "date": "2026-06-03",
  "category": "ia",
  "status": "published",
  "featured": true,
  "description": "Uma jornada pelos momentos que transformaram sonhos filosóficos em sistemas que hoje escrevem código, compõem músicas e diagnosticam doenças.",
  "tags": ["ia", "historia", "machine-learning", "deep-learning"],
  "template": "immersive",
  "heroImage": "/images/historia-ia-hero.jpg"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "os-fundadores",
    "text": "Os Fundadores"
  }, {
    "depth": 2,
    "slug": "os-invernos-da-ia",
    "text": "Os Invernos da IA"
  }, {
    "depth": 2,
    "slug": "a-virada-do-aprendizado",
    "text": "A Virada do Aprendizado"
  }, {
    "depth": 2,
    "slug": "a-era-dos-transformers",
    "text": "A Era dos Transformers"
  }, {
    "depth": 2,
    "slug": "onde-estamos-agora",
    "text": "Onde Estamos Agora"
  }];
}
function _createMdxContent(props) {
  const _components = {
    em: "em",
    h2: "h2",
    hr: "hr",
    p: "p",
    strong: "strong",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: ["Antes de existir um único computador, a humanidade já sonhava com máquinas que pensam. Na mitologia grega, Hefesto forjou Talos — um gigante de bronze programado para proteger Creta. Na Idade Média, alquimistas tentavam criar o ", createVNode(_components.em, {
        children: "homunculus"
      }), ", uma vida artificial em miniatura. O desejo de criar inteligência é tão antigo quanto a própria consciência."]
    }), "\n", createVNode(_components.p, {
      children: "Mas foi só no século XX que esse sonho encontrou um método."
    }), "\n", createVNode(_components.h2, {
      id: "os-fundadores",
      children: "Os Fundadores"
    }), "\n", createVNode($$Timeline, {
      children: [createVNode($$TimelineItem, {
        date: "1936",
        title: "A Máquina Universal",
        children: createVNode(_components.p, {
          children: ["Alan Turing publica ", createVNode(_components.em, {
            children: "On Computable Numbers"
          }), ", descrevendo uma máquina teórica capaz de executar qualquer algoritmo. O conceito de computação nasce antes dos computadores."]
        })
      }), createVNode($$TimelineItem, {
        date: "1943",
        title: "Neurônios Artificiais",
        children: createVNode(_components.p, {
          children: "McCulloch e Pitts propõem o primeiro modelo matemático de neurônio artificial. A ideia: se o cérebro pode ser modelado em lógica, pode ser simulado."
        })
      }), createVNode($$TimelineItem, {
        date: "1950",
        title: "O Teste de Turing",
        children: createVNode(_components.p, {
          children: ["Em ", createVNode(_components.em, {
            children: "Computing Machinery and Intelligence"
          }), ", Turing propõe a pergunta: “Pode uma máquina pensar?” — e oferece um teste para verificar. A filosofia da IA começa aqui."]
        })
      }), createVNode($$TimelineItem, {
        date: "1956",
        title: "A Conferência de Dartmouth",
        children: createVNode(_components.p, {
          children: "John McCarthy cunha o termo “Inteligência Artificial” e reúne os maiores cérebros do momento. A IA se torna um campo oficial. O otimismo é total: em 20 anos, máquinas farão tudo o que humanos fazem."
        })
      })]
    }), "\n", createVNode($$Callout, {
      type: "tip",
      children: createVNode(_components.p, {
        children: "O otimismo de 1956 era compreensível — mas subestimava radicalmente a complexidade do senso comum. Coisas triviais para humanos (reconhecer um gato, entender sarcasmo) se revelaram problemas de décadas."
      })
    }), "\n", createVNode(_components.h2, {
      id: "os-invernos-da-ia",
      children: "Os Invernos da IA"
    }), "\n", createVNode(_components.p, {
      children: "Os anos 70 e 80 foram marcados por dois períodos chamados “invernos da IA” — momentos em que o financiamento secou e o entusiasmo desabou. Os sistemas de regras explícitas chegavam no limite: não conseguiam generalizar, não lidavam com ambiguidade, não escalavam."
    }), "\n", createVNode(_components.p, {
      children: ["O problema central era simples de enunciar e difícil de resolver: ", createVNode(_components.strong, {
        children: "você não pode escrever regras para tudo o que existe no mundo"
      }), "."]
    }), "\n", createVNode(_components.h2, {
      id: "a-virada-do-aprendizado",
      children: "A Virada do Aprendizado"
    }), "\n", createVNode($$Timeline, {
      children: [createVNode($$TimelineItem, {
        date: "1986",
        title: "Backpropagation",
        children: createVNode(_components.p, {
          children: "Rumelhart, Hinton e Williams popularizam o algoritmo de retropropagação, tornando viável treinar redes neurais com múltiplas camadas. A ideia não era nova — mas agora funcionava."
        })
      }), createVNode($$TimelineItem, {
        date: "1997",
        title: "Deep Blue vence Kasparov",
        children: createVNode(_components.p, {
          children: "O computador da IBM derrota o campeão mundial de xadrez. Pela primeira vez, uma máquina supera o melhor humano em um domínio cognitivo complexo. O mundo para para assistir."
        })
      }), createVNode($$TimelineItem, {
        date: "2006",
        title: "Deep Learning ressurge",
        children: createVNode(_components.p, {
          children: "Geoffrey Hinton publica papers mostrando que redes profundas podem ser treinadas eficientemente com a técnica de pré-treinamento em camadas. O campo renascerá."
        })
      }), createVNode($$TimelineItem, {
        date: "2012",
        title: "AlexNet muda tudo",
        children: createVNode(_components.p, {
          children: "A rede de Hinton e seus alunos vence o ImageNet com margem absurda — 10 pontos percentuais acima do segundo lugar. O mundo da visão computacional vira de cabeça para baixo em uma semana."
        })
      })]
    }), "\n", createVNode($$Callout, {
      type: "warning",
      children: createVNode(_components.p, {
        children: "2012 não foi uma evolução — foi uma ruptura. Pesquisadores que passaram anos refinando algoritmos clássicos de visão computacional viram seu trabalho ficar obsoleto quase da noite para o dia."
      })
    }), "\n", createVNode(_components.h2, {
      id: "a-era-dos-transformers",
      children: "A Era dos Transformers"
    }), "\n", createVNode(_components.p, {
      children: ["Em 2017, pesquisadores do Google publicaram um paper com um título provocador: ", createVNode(_components.em, {
        children: "“Attention Is All You Need”"
      }), ". A arquitetura Transformer que ele introduzia aboliu as redes recorrentes que dominavam o processamento de linguagem — e abriu caminho para uma nova geração de modelos."]
    }), "\n", createVNode(_components.p, {
      children: "GPT-1 (2018), BERT (2018), GPT-2 (2019), GPT-3 (2020). Cada ano, modelos maiores, mais capazes, mais surpreendentes."
    }), "\n", createVNode($$Callout, {
      type: "info",
      children: createVNode(_components.p, {
        children: "A escala importa de uma forma que ninguém antecipou completamente. Modelos maiores não eram apenas “mais do mesmo” — eles exibiam capacidades emergentes: tradução, raciocínio, geração de código, que nunca foram explicitamente treinadas."
      })
    }), "\n", createVNode(_components.h2, {
      id: "onde-estamos-agora",
      children: "Onde Estamos Agora"
    }), "\n", createVNode($$Timeline, {
      children: [createVNode($$TimelineItem, {
        date: "2022",
        title: "ChatGPT e o momento de virada",
        children: createVNode(_components.p, {
          children: "100 milhões de usuários em dois meses. O público geral finalmente interage com IA — e entende o que estava acontecendo nos últimos anos. Nada voltará a ser como antes."
        })
      }), createVNode($$TimelineItem, {
        date: "2023",
        title: "Multimodalidade",
        children: createVNode(_components.p, {
          children: "Modelos passam a ver imagens, ouvir áudio, interpretar vídeo. A IA deixa de ser só texto e começa a perceber o mundo de formas mais próximas das humanas."
        })
      }), createVNode($$TimelineItem, {
        date: "2024",
        title: "Agentes e raciocínio",
        children: createVNode(_components.p, {
          children: "Modelos ganham capacidade de usar ferramentas, navegar na web, escrever e executar código. A IA começa a agir no mundo, não apenas responder sobre ele."
        })
      }), createVNode($$TimelineItem, {
        date: "2025–",
        title: "O que vem depois",
        children: createVNode(_components.p, {
          children: "Ninguém sabe ao certo. Mas os próximos capítulos serão escritos tão rápido quanto os anteriores — talvez mais."
        })
      })]
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: "Do mito de Talos ao GPT-4, o fio condutor é sempre o mesmo: a recusa humana em aceitar que certas coisas são privilégio exclusivo da biologia. Cada “inverno” foi seguido de uma primavera mais quente. Cada limite, redefinido."
    }), "\n", createVNode(_components.p, {
      children: "A pergunta que Turing fez em 1950 ainda não tem resposta definitiva. Mas hoje, pela primeira vez na história, a pergunta parece genuinamente aberta."
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

const url = "src/content/posts/historia-da-ia.mdx";
const file = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/historia-da-ia.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/historia-da-ia.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
