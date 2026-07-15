import { ae as createVNode, n as Fragment, a3 as __astro_tag_component__ } from './astro/server_D7O-e-38.mjs';
import { $ as $$Callout } from './Callout_DuaDqOb6.mjs';

const frontmatter = {
  "title": "Shadcn UI: componentes que viram código do seu projeto",
  "slug": "shadcn-ui-componentes-projetos-react",
  "date": "2026-07-12",
  "category": "tech",
  "status": "published",
  "featured": false,
  "description": "Como o shadcn/ui se diferencia de bibliotecas como MUI e Chakra, por que ele combina tão bem com Radix UI e como usar em formulários e carrosséis.",
  "tags": ["shadcn-ui", "radix-ui", "react", "tailwind", "frontend"],
  "template": "immersive",
  "heroImage": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "o-que-é-shadcnui",
    "text": "O que é shadcn/ui"
  }, {
    "depth": 2,
    "slug": "diferença-para-mui-chakra-e-outras-libs",
    "text": "Diferença para MUI, Chakra e outras libs"
  }, {
    "depth": 2,
    "slug": "onde-ele-encaixa-em-projetos-reais",
    "text": "Onde ele encaixa em projetos reais"
  }, {
    "depth": 2,
    "slug": "e-o-radix-ui-nessa-história",
    "text": "E o Radix UI nessa história?"
  }, {
    "depth": 2,
    "slug": "exemplo-formulário-de-cadastro",
    "text": "Exemplo: formulário de cadastro"
  }, {
    "depth": 2,
    "slug": "exemplo-carrossel-rotativo",
    "text": "Exemplo: carrossel rotativo"
  }, {
    "depth": 2,
    "slug": "cadastro--carrossel-na-mesma-tela",
    "text": "Cadastro + carrossel na mesma tela"
  }, {
    "depth": 2,
    "slug": "quando-eu-não-usaria",
    "text": "Quando eu não usaria"
  }, {
    "depth": 2,
    "slug": "resumo-prático",
    "text": "Resumo prático"
  }];
}
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    span: "span",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: ["Quando alguém fala “biblioteca de UI em React”, a imagem mental costuma ser sempre a mesma: instalar um pacote, importar ", createVNode(_components.code, {
        children: "Button"
      }), ", ", createVNode(_components.code, {
        children: "Dialog"
      }), ", ", createVNode(_components.code, {
        children: "Select"
      }), ", talvez configurar um tema global, e torcer para o design do produto caber dentro das decisões que a biblioteca já tomou."]
    }), "\n", createVNode(_components.p, {
      children: ["O ", createVNode(_components.a, {
        href: "https://ui.shadcn.com/docs",
        children: "shadcn/ui"
      }), " muda essa relação. Ele não tenta ser uma dependência fechada que manda na sua interface. Ele entrega o código dos componentes para dentro do seu projeto. A partir daí, o componente é seu: você lê, altera, versiona, quebra, melhora e adapta ao design system real da aplicação."]
    }), "\n", createVNode(_components.p, {
      children: "Essa diferença parece pequena na instalação, mas fica enorme depois de três meses de produto."
    }), "\n", createVNode(_components.h2, {
      id: "o-que-é-shadcnui",
      children: "O que é shadcn/ui"
    }), "\n", createVNode(_components.p, {
      children: "Shadcn UI é uma coleção de componentes bem desenhados, acessíveis e distribuídos por CLI. Você escolhe um componente, roda o comando, e ele copia os arquivos para a sua base de código."
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "bash",
      children: createVNode(_components.code, {
        children: createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "npx"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " shadcn@latest"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " add"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " button"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " dialog"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " form"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " carousel"
          })]
        })
      })
    }), "\n", createVNode(_components.p, {
      children: ["Depois disso, o botão não vem de ", createVNode(_components.code, {
        children: "node_modules"
      }), ". Ele vive em algo como:"]
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "txt",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "src/components/ui/button.tsx"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "src/components/ui/dialog.tsx"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "src/components/ui/carousel.tsx"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "O resultado é quase o meio-termo ideal entre “não quero desenhar tudo do zero” e “não quero ficar refém de uma biblioteca gigante”."
    }), "\n", createVNode($$Callout, {
      type: "info",
      children: createVNode(_components.p, {
        children: "A frase mais importante da própria documentação é: shadcn/ui não é uma biblioteca de componentes tradicional. É um jeito de construir a sua própria biblioteca de componentes."
      })
    }), "\n", createVNode(_components.h2, {
      id: "diferença-para-mui-chakra-e-outras-libs",
      children: "Diferença para MUI, Chakra e outras libs"
    }), "\n", createVNode(_components.p, {
      children: "MUI, Chakra, Ant Design e Mantine são bibliotecas no sentido clássico: você instala o pacote, importa os componentes e usa a API pública que elas expõem. Isso é ótimo quando você quer velocidade, consistência e um ecossistema pronto."
    }), "\n", createVNode(_components.p, {
      children: ["O custo aparece quando o produto começa a ter opinião visual própria. Um botão precisa de uma animação específica. O ", createVNode(_components.code, {
        children: "Select"
      }), " precisa se comportar um pouco diferente. O design system troca tokens. O modal precisa encaixar em um fluxo estranho. Aí você começa a empilhar overrides, props, wrappers e CSS cada vez mais específico."]
    }), "\n", createVNode(_components.p, {
      children: "Com shadcn/ui, a lógica muda:"
    }), "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, {
      children: [createVNode(_components.thead, {
        children: createVNode(_components.tr, {
          children: [createVNode(_components.th, {
            children: "Abordagem"
          }), createVNode(_components.th, {
            children: "O componente mora onde?"
          }), createVNode(_components.th, {
            children: "Como customiza?"
          }), createVNode(_components.th, {
            children: "Melhor para"
          })]
        })
      }), createVNode(_components.tbody, {
        children: [createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            children: "MUI / Chakra / Ant"
          }), createVNode(_components.td, {
            children: ["Dentro de ", createVNode(_components.code, {
              children: "node_modules"
            })]
          }), createVNode(_components.td, {
            children: "Tema, props, wrappers e overrides"
          }), createVNode(_components.td, {
            children: "Apps que aceitam bem o visual da biblioteca"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            children: "Headless UI / Radix puro"
          }), createVNode(_components.td, {
            children: "Dentro da lib, sem estilo pronto"
          }), createVNode(_components.td, {
            children: "Você cria toda a camada visual"
          }), createVNode(_components.td, {
            children: "Times com design system maduro"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            children: "shadcn/ui"
          }), createVNode(_components.td, {
            children: "Dentro do seu projeto"
          }), createVNode(_components.td, {
            children: "Editando o próprio código"
          }), createVNode(_components.td, {
            children: "Produtos que querem velocidade sem perder controle"
          })]
        })]
      })]
    }), "\n", createVNode(_components.p, {
      children: "Na prática, shadcn/ui troca dependência por posse. Você ainda usa pacotes por baixo, mas a camada de UI que o time toca todos os dias fica local."
    }), "\n", createVNode(_components.h2, {
      id: "onde-ele-encaixa-em-projetos-reais",
      children: "Onde ele encaixa em projetos reais"
    }), "\n", createVNode(_components.p, {
      children: "Shadcn UI brilha quando o produto precisa de uma interface consistente, mas ainda não tem tempo ou orçamento para construir um design system inteiro do zero."
    }), "\n", createVNode(_components.p, {
      children: "Eu usaria sem pensar em dashboards internos, SaaS B2B, painéis administrativos, ferramentas de IA, CRMs, backoffices, portais com muitos formulários e qualquer produto React/Next/Astro que precise parecer bem cuidado sem virar um projeto paralelo de design."
    }), "\n", createVNode(_components.p, {
      children: "O fluxo costuma ser:"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: ["Configurar Tailwind e ", createVNode(_components.code, {
          children: "components.json"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: "Adicionar só os componentes necessários."
      }), "\n", createVNode(_components.li, {
        children: "Ajustar tokens, radius, fonte, cores e estados."
      }), "\n", createVNode(_components.li, {
        children: ["Criar componentes de domínio por cima: ", createVNode(_components.code, {
          children: "UserInviteDialog"
        }), ", ", createVNode(_components.code, {
          children: "BillingPlanCard"
        }), ", ", createVNode(_components.code, {
          children: "ProjectSwitcher"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: ["Manter ", createVNode(_components.code, {
          children: "components/ui"
        }), " como base reutilizável, sem regra de negócio."]
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: ["Essa separação é importante. ", createVNode(_components.code, {
        children: "Button"
      }), ", ", createVNode(_components.code, {
        children: "Input"
      }), ", ", createVNode(_components.code, {
        children: "Dialog"
      }), " e ", createVNode(_components.code, {
        children: "Carousel"
      }), " são infraestrutura visual. “Formulário de cadastro de usuário” já é componente de produto."]
    }), "\n", createVNode($$Callout, {
      type: "warning",
      children: createVNode(_components.p, {
        children: "O erro comum é tratar shadcn/ui como pasta intocável. Se o componente foi copiado para o seu repositório, ele deve seguir os padrões do seu projeto: tokens, acessibilidade, testes visuais quando fizer sentido e revisão como qualquer outro código."
      })
    }), "\n", createVNode(_components.h2, {
      id: "e-o-radix-ui-nessa-história",
      children: "E o Radix UI nessa história?"
    }), "\n", createVNode(_components.p, {
      children: ["Boa parte dos componentes mais interessantes do shadcn/ui usa ", createVNode(_components.a, {
        href: "https://www.radix-ui.com/primitives/docs/overview/introduction",
        children: "Radix UI"
      }), " por baixo. Radix é uma coleção de primitives sem estilo, focada em acessibilidade, teclado, gerenciamento de foco e composição."]
    }), "\n", createVNode(_components.p, {
      children: "Pense em camadas:"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "txt",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "Produto"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "  UserRegisterForm, PricingDialog, DashboardSidebar"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {})
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "Componentes locais"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "  Button, Input, Select, Dialog, Popover"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {})
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "shadcn/ui"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "  Código base, padrões de composição, Tailwind, variantes"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {})
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "Radix UI"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            children: "  Comportamento acessível, foco, teclado, ARIA"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: ["Radix resolve a parte difícil e invisível: abrir um ", createVNode(_components.code, {
        children: "Dialog"
      }), " com foco correto, navegar em um ", createVNode(_components.code, {
        children: "Select"
      }), " pelo teclado, fechar um ", createVNode(_components.code, {
        children: "Popover"
      }), " na hora certa, expor atributos ARIA adequados. Shadcn UI resolve a parte de ergonomia visual: classes, variantes, composição e aparência inicial."]
    }), "\n", createVNode(_components.p, {
      children: "É por isso que a combinação é tão forte. Você não precisa escolher entre “bonito” e “acessível”. O shadcn/ui pega primitives robustas e entrega uma base estilizada que você consegue modificar."
    }), "\n", createVNode(_components.h2, {
      id: "exemplo-formulário-de-cadastro",
      children: "Exemplo: formulário de cadastro"
    }), "\n", createVNode(_components.p, {
      children: "Imagine uma tela simples de cadastro com nome, email e senha. Em um projeto React, eu normalmente combinaria shadcn/ui com React Hook Form e Zod."
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "tsx",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"use client\""
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " { zodResolver } "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"@hookform/resolvers/zod\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " { useForm } "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"react-hook-form\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " *"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " as"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " z "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"zod\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " { Button } "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"@/components/ui/button\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  Form,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  FormControl,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  FormField,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  FormItem,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  FormLabel,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  FormMessage,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "} "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"@/components/ui/form\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " { Input } "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"@/components/ui/input\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " cadastroSchema"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " z."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "object"
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
            children: "  name: z."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "string"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "()."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "min"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "2"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Informe seu nome.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "),"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  email: z."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "string"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "()."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "email"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Informe um email válido.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "),"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  password: z."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "string"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "()."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "min"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "8"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Use pelo menos 8 caracteres.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "),"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "})"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "type"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " CadastroData"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " z"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "infer"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "<"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "typeof"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " cadastroSchema>"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "export"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " function"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " CadastroForm"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "() {"
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
            children: " form"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " useForm"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "<"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "CadastroData"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">({"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    resolver: "
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "zodResolver"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(cadastroSchema),"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    defaultValues: {"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      name: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      email: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      password: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    },"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  })"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "  function"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " onSubmit"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "data"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: ":"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " CadastroData"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ") {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    console."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "log"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"cadastro\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ", data)"
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
          class: "line"
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
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Form"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "..."
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "form}>"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "form"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " onSubmit"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{form."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "handleSubmit"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(onSubmit)} "
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"space-y-5\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormField"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          control"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{form.control}"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          name"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"name\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          render"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{({ "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "field"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " }) "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">Nome</"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "                <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Input"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " placeholder"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Nico Dev\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "..."
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "field} />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormMessage"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          )}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        />"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormField"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          control"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{form.control}"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          name"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"email\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          render"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{({ "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "field"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " }) "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">Email</"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "                <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Input"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " placeholder"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"nico@email.com\""
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " type"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"email\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "..."
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "field} />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormMessage"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          )}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        />"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormField"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          control"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{form.control}"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          name"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"password\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "          render"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{({ "
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "field"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " }) "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">Senha</"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormLabel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "                <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Input"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " type"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"password\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "..."
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "field} />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormControl"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormMessage"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "FormItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          )}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        />"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " type"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"submit\""
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"w-full\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          Criar conta"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "form"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Form"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  )"
          })
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
      children: "O ponto principal não é o formulário em si. É que cada parte tem uma responsabilidade clara:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Zod define a regra."
      }), "\n", createVNode(_components.li, {
        children: "React Hook Form gerencia estado e validação."
      }), "\n", createVNode(_components.li, {
        children: "shadcn/ui entrega a estrutura visual."
      }), "\n", createVNode(_components.li, {
        children: "Os componentes locais continuam editáveis."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Se amanhã o time quiser trocar o visual do erro, adicionar ícone no input ou mudar o espaçamento do formulário inteiro, o código está dentro do projeto. Não existe guerra contra CSS gerado por outra biblioteca."
    }), "\n", createVNode(_components.h2, {
      id: "exemplo-carrossel-rotativo",
      children: "Exemplo: carrossel rotativo"
    }), "\n", createVNode(_components.p, {
      children: ["O carrossel do shadcn/ui é construído sobre ", createVNode(_components.a, {
        href: "https://www.embla-carousel.com/",
        children: "Embla Carousel"
      }), ". Isso significa que você ganha swipe, navegação e API de controle sem montar tudo na mão."]
    }), "\n", createVNode(_components.p, {
      children: "Um exemplo comum: um carrossel de benefícios na tela de cadastro."
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "tsx",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"use client\""
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " Autoplay "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"embla-carousel-autoplay\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " {"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  Carousel,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  CarouselContent,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  CarouselItem,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  CarouselNext,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  CarouselPrevious,"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "} "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " \"@/components/ui/carousel\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "const"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: " slides"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " ="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " ["
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  {"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    title: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Componentes sob seu controle\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    description: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"O código fica no repositório e pode seguir o design system do produto.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  },"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  {"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    title: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Acessibilidade como base\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    description: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Radix cuida de foco, teclado e padrões ARIA em vários componentes.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  },"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  {"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    title: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Visual consistente\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    description: "
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"Tailwind e variantes mantêm estados e espaçamentos previsíveis.\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  },"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "]"
          })
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "export"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " function"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " BeneficiosCarousel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "() {"
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
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Carousel"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "      opts"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{{ loop: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "true"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " }}"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "      plugins"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{["
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "        Autoplay"
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
            children: "          delay: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "4000"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          stopOnInteraction: "
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "true"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ","
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        }),"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      ]}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "      className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"w-full\""
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    >"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselContent"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        {slides."
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "map"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "(("
          }), createVNode(_components.span, {
            style: {
              color: "#FFAB70"
            },
            children: "slide"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ") "
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "=>"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselItem"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " key"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "{slide.title}>"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "div"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"rounded-2xl border bg-card p-6\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "h3"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"text-lg font-semibold\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">{slide.title}</"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "h3"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "p"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"mt-2 text-sm text-muted-foreground\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "                {slide.description}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "              </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "p"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "            </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "div"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "          </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselItem"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        ))}"
          })
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselContent"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselPrevious"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CarouselNext"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    </"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "Carousel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  )"
          })
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
      children: "Para instalar a base:"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "bash",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "npx"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " shadcn@latest"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " add"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " carousel"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: "npm"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " install"
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: " embla-carousel-autoplay"
          })]
        })]
      })
    }), "\n", createVNode($$Callout, {
      type: "tip",
      children: createVNode(_components.p, {
        children: "Carrossel automático precisa de cuidado. Dê controle manual, pause em interação e evite usar rotação automática para conteúdo essencial. Se a pessoa precisa ler para decidir, não faça a interface fugir dela."
      })
    }), "\n", createVNode(_components.h2, {
      id: "cadastro--carrossel-na-mesma-tela",
      children: "Cadastro + carrossel na mesma tela"
    }), "\n", createVNode(_components.p, {
      children: "Com os dois blocos, a tela final pode ser simples:"
    }), "\n", createVNode(_components.pre, {
      class: "astro-code github-dark",
      style: {
        backgroundColor: "#24292e",
        color: "#e1e4e8",
        overflowX: "auto"
      },
      tabindex: "0",
      "data-language": "tsx",
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "export"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: " function"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " CadastroPage"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "() {"
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
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "main"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"grid min-h-screen gap-8 p-6 lg:grid-cols-[420px_1fr]\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "section"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"flex items-center\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "CadastroForm"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "section"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line"
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      <"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "aside"
          }), createVNode(_components.span, {
            style: {
              color: "#B392F0"
            },
            children: " className"
          }), createVNode(_components.span, {
            style: {
              color: "#F97583"
            },
            children: "="
          }), createVNode(_components.span, {
            style: {
              color: "#9ECBFF"
            },
            children: "\"hidden items-center lg:flex\""
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "        <"
          }), createVNode(_components.span, {
            style: {
              color: "#79B8FF"
            },
            children: "BeneficiosCarousel"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: " />"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "      </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "aside"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "    </"
          }), createVNode(_components.span, {
            style: {
              color: "#85E89D"
            },
            children: "main"
          }), createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: ">"
          })]
        }), "\n", createVNode(_components.span, {
          class: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#E1E4E8"
            },
            children: "  )"
          })
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
      children: "Esse exemplo mostra bem a filosofia da ferramenta. Você não instalou um “template de cadastro”. Você montou uma interface com peças pequenas, acessíveis e editáveis."
    }), "\n", createVNode(_components.h2, {
      id: "quando-eu-não-usaria",
      children: "Quando eu não usaria"
    }), "\n", createVNode(_components.p, {
      children: "Shadcn UI não é resposta universal. Se o time não quer manter código de componentes, uma biblioteca tradicional pode fazer mais sentido. Se o produto precisa de uma implementação visual extremamente específica desde o primeiro dia, talvez seja melhor começar direto por Radix puro, Ariakit ou componentes próprios."
    }), "\n", createVNode(_components.p, {
      children: ["Também vale lembrar: como os arquivos são copiados para o projeto, atualizações não chegam magicamente. Isso é vantagem e responsabilidade ao mesmo tempo. Você não acorda com um breaking change visual vindo de ", createVNode(_components.code, {
        children: "node_modules"
      }), ", mas também precisa acompanhar melhorias manualmente quando quiser."]
    }), "\n", createVNode(_components.h2, {
      id: "resumo-prático",
      children: "Resumo prático"
    }), "\n", createVNode(_components.p, {
      children: "Use shadcn/ui quando você quer velocidade sem abrir mão de controle."
    }), "\n", createVNode(_components.p, {
      children: "Use Radix por baixo quando comportamento acessível importa, especialmente em componentes interativos."
    }), "\n", createVNode(_components.p, {
      children: "Use uma biblioteca tradicional quando a customização pesada não é prioridade."
    }), "\n", createVNode(_components.p, {
      children: "E, principalmente, trate os componentes copiados como parte do produto. O maior ganho do shadcn/ui não é ter um botão bonito em cinco minutos. É ter uma base de interface que o time consegue entender, adaptar e evoluir sem pedir permissão para uma dependência."
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

const url = "src/content/posts/shadcn-ui-componentes-projetos-react.mdx";
const file = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/shadcn-ui-componentes-projetos-react.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "C:/Users/Rober/projetos/nico.dev.br/apps/blog/src/content/posts/shadcn-ui-componentes-projetos-react.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
