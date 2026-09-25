# @nico.dev/skills

Site estático do catálogo (skills.nico.dev.br). O conteúdo (skills e packs) vive no repo
[`robertourias/skills`](https://github.com/robertourias/skills); este app o busca no build.

## Conteúdo

```
pnpm --filter @nico.dev/skills content:sync   # clone raso; copia skills/ e packs/ para content/
pnpm --filter @nico.dev/skills registry       # valida e gera public/registry.json
```

`content/skills/*` e `content/packs/*` são ignorados pelo git (só os `.gitkeep` são versionados).
`pnpm turbo build --filter=@nico.dev/skills` roda `sync-content` antes do `registry`.

| Env | Efeito |
|---|---|
| `SKILLS_REF` | Branch, tag ou SHA do repo (padrão `main`). Ex.: `SKILLS_REF=feat/x pnpm ... content:sync`. |
| `SKILLS_ROOT` | Checkout local com `skills/` e `packs/`. O sync vira no-op (exit 0) e o `registry` lê essa raiz; permite build offline. |
| `SKILLS_REPO_URL` | Override da URL do repo. Usado só em teste. |

O sync exige `git` no PATH e sai com código 1 se o clone falhar ou o repo não tiver `skills/`.
