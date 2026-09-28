import { renderSkillMarkdown } from "../lib/markdown";

export type SkillMarkdownProps = {
  content: string;
};

/**
 * Renderiza o Markdown de uma skill (README) como HTML. Server Component: o parsing roda em
 * build, sem enviar um parser de Markdown para o bundle do cliente (mesma decisão documentada em
 * `lib/markdown.ts`).
 *
 * `dangerouslySetInnerHTML` é seguro aqui porque `renderSkillMarkdown` já passa o resultado por
 * `rehype-sanitize` (ver `lib/markdown.ts`): tags e atributos fora da allowlist (scripts,
 * handlers `on*`, `javascript:` em hrefs, etc.) já foram removidos antes deste componente receber
 * a string. Não há nenhuma regra de lint configurada neste projeto para `dangerouslySetInnerHTML`
 * (`react/no-danger` não está habilitada em `eslint-config-next`), então nenhum
 * `eslint-disable` é necessário — este comentário substitui esse aviso.
 */
export function SkillMarkdown({ content }: SkillMarkdownProps) {
  const html = renderSkillMarkdown(content);

  return <div className="skill-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}
