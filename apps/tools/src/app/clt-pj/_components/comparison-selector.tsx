import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nico.dev/ui";

export function ComparisonSelector() {
  const options = [
    {
      mode: "clt-pj",
      title: "CLT vs PJ",
      description: "Compare o salário líquido de uma vaga CLT com uma vaga PJ equivalente.",
    },
    {
      mode: "pj-pj",
      title: "PJ vs PJ",
      description: "Compare duas propostas PJ diferentes (ex: simples nacional vs lucro presumido).",
    },
    {
      mode: "clt-clt",
      title: "CLT vs CLT",
      description: "Compare duas propostas CLT com diferentes benefícios e descontos.",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 mt-8">
      {options.map((option) => (
        <Link key={option.mode} href={`/clt-pj?mode=${option.mode}`} className="group outline-none">
          <Card className="h-full transition-colors group-hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/80">{option.description}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
