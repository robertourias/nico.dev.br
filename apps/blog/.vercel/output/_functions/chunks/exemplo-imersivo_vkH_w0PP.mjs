import { ae as createVNode, n as Fragment, a3 as __astro_tag_component__ } from './astro/server_D7O-e-38.mjs';

const frontmatter = {
  "title": "Exemplo: O Futuro da IA: Uma Jornada",
  "slug": "exemplo-imersivo",
  "date": "2026-06-03",
  "category": "ia",
  "status": "published",
  "featured": false,
  "description": "Um exemplo de post com layout imersivo, hero image e componentes MDX inline como Callout e Timeline.",
  "tags": ["ia", "futuro", "exemplo"],
  "template": "immersive",
  "heroImage": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "por-que-um-novo-layout",
    "text": "Por que um novo layout?"
  }, {
    "depth": 2,
    "slug": "componentes-disponíveis",
    "text": "Componentes disponíveis"
  }, {
    "depth": 2,
    "slug": "linha-do-tempo-da-ia",
    "text": "Linha do tempo da IA"
  }, {
    "depth": 2,
    "slug": "conclusão",
    "text": "Conclusão"
  }];
}
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  }, {Callout, Timeline, TimelineItem} = _components;
  if (!Callout) _missingMdxReference("Callout");
  if (!Timeline) _missingMdxReference("Timeline");
  if (!TimelineItem) _missingMdxReference("TimelineItem");
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: ["Este é um post com ", createVNode(_components.strong, {
        children: "layout imersivo"
      }), ". O hero image cobre toda a largura da tela e o conteúdo aparece centralizado abaixo, sem sidebar, com tipografia levemente maior."]
    }), "\n", createVNode(_components.h2, {
      id: "por-que-um-novo-layout",
      children: "Por que um novo layout?"
    }), "\n", createVNode(_components.p, {
      children: "Posts editoriais, histórias técnicas e deep-dives merecem mais do que um layout genérico. O template imersivo elimina a sidebar, expande a tipografia e permite usar componentes React inline via MDX."
    }), "\n", createVNode(Callout, {
      type: "info",
      children: createVNode(_components.p, {
        children: ["Para usar o layout imersivo em um post, adicione ", createVNode(_components.code, {
          children: "template: \"immersive\""
        }), " no frontmatter. O campo ", createVNode(_components.code, {
          children: "heroImage"
        }), " é opcional — sem ele, o hero usa o fundo padrão do blog."]
      })
    }), "\n", createVNode(_components.h2, {
      id: "componentes-disponíveis",
      children: "Componentes disponíveis"
    }), "\n", createVNode(_components.p, {
      children: ["Qualquer post ", createVNode(_components.code, {
        children: ".mdx"
      }), " pode usar os componentes do registry sem precisar de import explícito:"]
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.code, {
          children: "<Callout type=\"info|tip|warning|note\">"
        }), " — bloco de destaque"]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.code, {
          children: "<Timeline>"
        }), " + ", createVNode(_components.code, {
          children: "<TimelineItem date=\"...\" title=\"...\">"
        }), " — linha do tempo"]
      }), "\n"]
    }), "\n", createVNode(Callout, {
      type: "tip",
      children: createVNode(_components.p, {
        children: "Prefira componentes Astro (sem JS) quando não há interatividade. React islands ficam para casos de estado dinâmico."
      })
    }), "\n", createVNode(_components.h2, {
      id: "linha-do-tempo-da-ia",
      children: "Linha do tempo da IA"
    }), "\n", createVNode(Timeline, {
      children: [createVNode(TimelineItem, {
        date: "2017",
        title: "Attention is All You Need",
        children: createVNode(_components.p, {
          children: "Google publica o paper do Transformer. A arquitetura que fundamenta todos os LLMs modernos nasce aqui."
        })
      }), createVNode(TimelineItem, {
        date: "2020",
        title: "GPT-3 muda o jogo",
        children: createVNode(_components.p, {
          children: "A OpenAI lança o GPT-3 com 175 bilhões de parâmetros. LLMs deixam de ser pesquisa acadêmica e viram produto."
        })
      }), createVNode(TimelineItem, {
        date: "2022",
        title: "ChatGPT para o público",
        children: createVNode(_components.p, {
          children: "Interface conversacional acessível. 100 milhões de usuários em 2 meses — o crescimento mais rápido de qualquer produto da história."
        })
      }), createVNode(TimelineItem, {
        date: "2024",
        title: "Agentes autônomos",
        children: createVNode(_components.p, {
          children: "Modelos que executam tarefas de forma autônoma. Claude Code, Cursor, Devin. O desenvolvedor vira diretor de operações da IA."
        })
      }), createVNode(TimelineItem, {
        date: "2026",
        title: "Hoje",
        children: createVNode(_components.p, {
          children: "Agentes multimodais, raciocínio estendido, contextos de milhões de tokens. A velocidade de evolução ainda acelera."
        })
      })]
    }), "\n", createVNode(Callout, {
      type: "warning",
      children: createVNode(_components.p, {
        children: "A velocidade de mudança exige atualização constante. Ferramentas que eram estado da arte há 6 meses já podem estar desatualizadas."
      })
    }), "\n", createVNode(_components.h2, {
      id: "conclusão",
      children: "Conclusão"
    }), "\n", createVNode(_components.p, {
      children: "O layout imersivo permite contar histórias com mais impacto visual — sem abrir mão da consistência do design system do blog. Use quando o conteúdo pede mais do que texto simples."
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

const url = "src/content/posts/exemplo-imersivo.mdx";
const file = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/exemplo-imersivo.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/exemplo-imersivo.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
