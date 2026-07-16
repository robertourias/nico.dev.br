"use client";

import { Header } from "@nico.dev/ui";

export function SiteHeader() {
  return (
    <Header>
      <Header.Logo href="/" label="Metrobeat" icon="/logo-metronome.png" className="mx-auto" iconClassName="h-16 w-auto" />
    </Header>
  );
}
