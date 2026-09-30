import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nico.dev/ui";

export default function CalculatorPjPj() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Calculadora PJ vs PJ</CardTitle>
        <CardDescription>
          Em breve: Ferramenta para comparar propostas PJ com diferentes tributações e custos associados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          Esta funcionalidade está em desenvolvimento.
        </div>
      </CardContent>
    </Card>
  );
}
