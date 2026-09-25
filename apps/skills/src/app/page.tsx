import { Card, CardContent } from "@nico.dev/ui";
import { installCommandTemplates, siteConfig } from "../../catalog.config";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="text-muted-foreground">{siteConfig.tagline}</p>
      <Card>
        <CardContent className="overflow-x-auto p-4">
          <code className="whitespace-nowrap font-mono text-sm">
            $ {installCommandTemplates.repository}
          </code>
        </CardContent>
      </Card>
    </main>
  );
}
