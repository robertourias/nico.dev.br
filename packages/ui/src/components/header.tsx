"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

// ─── Header.Logo ──────────────────────────────────────────────────────────────

interface HeaderLogoProps {
  href: string;
  label: string;
  className?: string;
}

function HeaderLogo({ href, label, className }: HeaderLogoProps) {
  return (
    <a
      href={href}
      className={cn(
        "font-semibold text-md text-foreground shrink-0 transition-colors hover:text-primary mr-auto lg:mr-0",
        className
      )}
    >
      {label}
    </a>
  );
}

// ─── Header.Nav ───────────────────────────────────────────────────────────────

interface HeaderNavProps {
  children: React.ReactNode;
  className?: string;
}

function HeaderNav({ children, className }: HeaderNavProps) {
  return (
    <nav
      className={cn("hidden lg:flex items-center gap-1 mr-auto", className)}
      aria-label="Navegação principal"
    >
      {children}
    </nav>
  );
}

// ─── Header.Actions ───────────────────────────────────────────────────────────

interface HeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

function HeaderActions({ children, className }: HeaderActionsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

// ─── Header.Menu ──────────────────────────────────────────────────────────────

interface HeaderMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Direção de abertura do drawer. @default "left" */
  side?: "left" | "right";
  triggerClassName?: string;
  className?: string;
}

function HeaderMenu({
  children,
  open: controlledOpen,
  onOpenChange,
  side = "left",
  triggerClassName,
  className,
}: HeaderMenuProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function setOpen(next: boolean) {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  }

  return (
    <>
      {/* Hamburger trigger — visível apenas no mobile */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          triggerClassName
        )}
      >
        <Menu size={18} />
      </button>

      {/* Drawer + backdrop — renderizados via portal em document.body para
          escapar do stacking context criado por backdrop-filter no header */}
      {open && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[998] bg-[rgba(0,0,0,0.4)]"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Side drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className={cn(
              "fixed top-0 bottom-0 z-[999] w-64",
              "bg-background flex flex-col",
              side === "right"
                ? "right-0 border-l border-border"
                : "left-0 border-r border-border",
              className
            )}
          >
            {/* Header do drawer com botão fechar */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo — NavLinks e outros filhos */}
            <nav
              className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setOpen(false);
              }}
            >
              {children}
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

// ─── Header root ──────────────────────────────────────────────────────────────

interface HeaderProps {
  children: React.ReactNode;
  scrollAware?: boolean;
  /** Cor da borda inferior. Aceita qualquer valor CSS (ex: "#fff", "rgba(255,255,255,0.1)"). */
  borderColor?: string;
  className?: string;
}

function HeaderRoot({ children, scrollAware, borderColor, className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!scrollAware) return;
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [scrollAware]);

  const borderStyle = borderColor ? { borderBottomColor: borderColor } : undefined;

  if (scrollAware) {
    return (
      <header
        style={borderStyle}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          "border-b border-border",
          scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent",
          className
        )}
      >
        <div
          className={cn(
            "relative flex items-center px-4 gap-3 transition-all duration-300 justify-between max-w-5xl mx-auto",
            scrolled ? "h-14" : "h-16"
          )}
        >
          {children}
        </div>
      </header>
    );
  }

  return (
    <header
      style={borderStyle}
      className={cn(
        "sticky top-0 z-50",
        "border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="relative flex items-center px-4 h-16 gap-3 justify-between max-w-5xl mx-auto">
        {children}
      </div>
    </header>
  );
}

// ─── Compound assembly ────────────────────────────────────────────────────────

export const Header = Object.assign(HeaderRoot, {
  Logo: HeaderLogo,
  Nav: HeaderNav,
  Actions: HeaderActions,
  Menu: HeaderMenu,
});

export type {
  HeaderProps,
  HeaderLogoProps,
  HeaderNavProps,
  HeaderActionsProps,
  HeaderMenuProps,
};
