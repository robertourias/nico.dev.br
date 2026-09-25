"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useStoredValue } from "../hooks/use-stored-value";
import { InstallCommand } from "./install-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/** Chave de `localStorage` padrão da aba escolhida. */
const DEFAULT_STORAGE_KEY = "nico:install-tab";

/** Nota de telemetria padrão. Texto fixo: não monta nem altera o comando exibido. */
const DEFAULT_NOTE = (
  <>
    Para não enviar telemetria anônima, prefixe o comando com <code>DISABLE_TELEMETRY=1</code>.
  </>
);

export type InstallCommandTab = {
  /** Identificador estável da aba (usado como valor persistido). */
  id: string;
  /** Rótulo visível da aba. */
  label: string;
  /** Comando exibido e copiado, exatamente como recebido. */
  command: string;
};

export type InstallCommandTabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Abas disponíveis (mínimo 1). Com uma só, a lista de abas não é renderizada. */
  tabs: InstallCommandTab[];
  /** Aba inicial quando não há valor salvo válido. Padrão: a primeira aba. */
  defaultTabId?: string;
  /** Chave de `localStorage` compartilhada entre instâncias. Padrão: `"nico:install-tab"`. */
  storageKey?: string;
  /** Nota abaixo do comando. `false` remove; um nó customizado substitui a nota de telemetria. */
  note?: React.ReactNode | false;
  /** Estilo das abas. */
  variant?: "pill" | "underline";
};

/**
 * Abas de comandos de instalação, cada uma com um `InstallCommand`. A aba escolhida é
 * persistida em `localStorage` (só ao trocar de aba) e sincronizada entre instâncias que
 * compartilham a `storageKey`. Genérico: recebe apenas `tabs` e strings.
 *
 * @example
 * ```tsx
 * <InstallCommandTabs
 *   defaultTabId="skill"
 *   tabs={[
 *     { id: "skill", label: "Esta skill", command: "npx skills add a/b --skill x" },
 *     { id: "repository", label: "Repositório", command: "npx skills add a/b" },
 *   ]}
 * />
 * ```
 */
const InstallCommandTabs = React.forwardRef<HTMLDivElement, InstallCommandTabsProps>(
  (
    {
      tabs,
      defaultTabId,
      storageKey = DEFAULT_STORAGE_KEY,
      note = DEFAULT_NOTE,
      variant = "pill",
      className,
      ...props
    },
    ref
  ) => {
    const [stored, setStored] = useStoredValue(storageKey);

    const ids = tabs.map((tab) => tab.id);
    const fallbackId = defaultTabId !== undefined && ids.includes(defaultTabId) ? defaultTabId : ids[0];
    const activeId = stored !== null && ids.includes(stored) ? stored : fallbackId;

    return (
      <div ref={ref} className={cn("w-full min-w-0", className)} {...props}>
        {tabs.length === 1 ? (
          <InstallCommand command={tabs[0].command} />
        ) : (
          <Tabs value={activeId} onValueChange={setStored} className="min-w-0">
            <TabsList variant={variant} className="max-w-full overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} variant={variant}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="min-w-0">
                <InstallCommand command={tab.command} />
              </TabsContent>
            ))}
          </Tabs>
        )}
        {note !== false && note !== null && note !== undefined && (
          <p className="mt-2 text-xs text-muted-foreground">{note}</p>
        )}
      </div>
    );
  }
);
InstallCommandTabs.displayName = "InstallCommandTabs";

export { InstallCommandTabs };
