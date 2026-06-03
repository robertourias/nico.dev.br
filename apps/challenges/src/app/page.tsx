import { FolderOpen } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@ui/components/alert"
import { fetchChallenges } from "@/lib/github"
import { ChallengeCard } from "@/components/ChallengeCard"

export const revalidate = 86400

export default async function HomePage() {
  let challenges: Awaited<ReturnType<typeof fetchChallenges>> = []
  let fetchError = false

  try {
    challenges = await fetchChallenges()
  } catch {
    fetchError = true
  }

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full pt-26">
      <header className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">challenges.nico.dev</p>
        <h1 className="text-4xl font-bold text-foreground mb-3">Desafios Técnicos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Testes técnicos reais entregues em processos seletivos. Código-fonte e deploy
          disponíveis para cada desafio.
        </p>
      </header>

      {fetchError && (
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os desafios. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}

      {!fetchError && challenges.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <FolderOpen className="h-10 w-10 opacity-40" aria-hidden="true" />
          <p className="text-sm">Nenhum desafio encontrado.</p>
        </div>
      )}

      {!fetchError && challenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.slug} challenge={challenge} />
          ))}
        </div>
      )}
    </main>
  )
}
