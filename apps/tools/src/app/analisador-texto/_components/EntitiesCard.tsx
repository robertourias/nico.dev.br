import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Badge } from '@ui'
import type { Entity, EntityRelevance } from '../_types'

interface EntitiesCardProps {
  entities: Entity[]
}

const RELEVANCE_COLOR: Record<EntityRelevance, string> = {
  Alta: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Média: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Baixa: 'bg-muted text-muted-foreground',
}

export function EntitiesCard({ entities }: EntitiesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Entidades{' '}
          <span className="font-normal text-muted-foreground">({entities.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma entidade identificada.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entities.map((entity, i) => (
              <li key={i} className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{entity.name}</span>
                <Badge className="text-xs">
                  {entity.type}
                </Badge>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${RELEVANCE_COLOR[entity.relevance]}`}
                >
                  {entity.relevance}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
