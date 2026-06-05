import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Badge } from '@ui'

interface DocumentTypeCardProps {
  documentType: string
}

export function DocumentTypeCard({ documentType }: DocumentTypeCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Tipo de Documento</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge className="text-sm px-3 py-1">{documentType}</Badge>
      </CardContent>
    </Card>
  )
}
