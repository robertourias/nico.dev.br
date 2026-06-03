import * as React from "react";
import { cn } from "../lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  active?: boolean;
}

export function NavLink({ href, external, active, className, children, ...props }: NavLinkProps) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "text-sm transition-colors px-3 py-1.5 rounded-lg",
        active
          ? "text-foreground bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
