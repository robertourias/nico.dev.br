/**
 * Banner ASCII "NICO SKILLS" (figlet, fonte Standard), gerado uma vez e colado.
 * Larguras: empilhado 35 colunas (<= 40), linha unica 57 colunas.
 */
const STACKED_BANNER = [
  "  _   _ ___ ____ ___",
  " | \\ | |_ _/ ___/ _ \\",
  " |  \\| || | |  | | | |",
  " | |\\  || | |__| |_| |",
  " |_| \\_|___\\____\\___/",
  "  ____  _  _____ _     _     ____",
  " / ___|| |/ /_ _| |   | |   / ___|",
  " \\___ \\| ' / | || |   | |   \\___ \\",
  "  ___) | . \\ | || |___| |___ ___) |",
  " |____/|_|\\_\\___|_____|_____|____/",
].join("\n");

const INLINE_BANNER = [
  "  _   _ ___ ____ ___    ____  _  _____ _     _     ____",
  " | \\ | |_ _/ ___/ _ \\  / ___|| |/ /_ _| |   | |   / ___|",
  " |  \\| || | |  | | | | \\___ \\| ' / | || |   | |   \\___ \\",
  " | |\\  || | |__| |_| |  ___) | . \\ | || |___| |___ ___) |",
  " |_| \\_|___\\____\\___/  |____/|_|\\_\\___|_____|_____|____/",
].join("\n");

// text-primary no escuro (#6B5CF8) dá 3,96:1 sobre o fundo. primary-hover passa nos dois temas
// sem depender de variante dark: (7,5:1 no claro, 5,1:1 no escuro).
const preClass = "select-none whitespace-pre font-mono leading-tight text-primary-hover";

export function AsciiBanner() {
  return (
    <div>
      <h1 className="sr-only">Nico Skills</h1>
      <pre aria-hidden="true" className={`${preClass} text-xs sm:hidden`}>
        {STACKED_BANNER}
      </pre>
      <pre aria-hidden="true" className={`${preClass} hidden text-sm sm:block`}>
        {INLINE_BANNER}
      </pre>
    </div>
  );
}
