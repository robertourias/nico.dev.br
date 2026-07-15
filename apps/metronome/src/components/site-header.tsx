"use client";

import { Header } from "@nico.dev/ui";

export function SiteHeader() {
  return (
    <Header>
      <Header.Logo href="/" label="Metrobeat" icon="/logo-metronome.png" className="mx-auto" />
    </Header>
  );
}
