import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export interface ItemCardLink {
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  target?: "_blank" | "_self";
  rel?: string;
}

interface ItemCardProps {
  /** Slot de mídia livre: aceita <img>, <Image> do Next.js, ícone Lucide, emoji, etc. */
  media?: React.ReactNode;
  title: string;
  description?: string | null;
  links?: ItemCardLink[];
  className?: string;
}

export function ItemCard({ media, title, description, links, className }: ItemCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface text-foreground overflow-hidden flex flex-col",
        className
      )}
    >
      {media && <div className="overflow-hidden">{media}</div>}

      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug">{title}</h3>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">{description}</p>
        )}

        {links && links.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-auto pt-1">
            {links.map((link) => (
              <Button key={link.href} variant={link.variant ?? "outline"} size="sm" asChild>
                <a href={link.href} target={link.target} rel={link.rel}>
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
