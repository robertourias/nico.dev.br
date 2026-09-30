import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nico.dev/ui";

export default function CalculatorCltClt() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Calculadora CLT vs CLT</CardTitle>
        <CardDescription>
          Em breve: Ferramenta para comparar propostas CLT considerando diferentes pacotes de benefícios (VR, VA, plano de saúde, etc).
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
