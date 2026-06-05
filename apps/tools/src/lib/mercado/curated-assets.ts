import type { Asset } from "./types"

// Tickers Yahoo Finance: ações e FIIs B3 usam sufixo .SA; índices usam ^ prefix
export const CURATED_ASSETS: Asset[] = [
  { id: "^BVSP",      name: "Ibovespa",  category: "indices", source: "yahoo" },
  { id: "IFIX.SA",    name: "IFIX",      category: "indices", source: "yahoo" },
  { id: "PETR4.SA",   name: "Petrobras", category: "acoes",   source: "yahoo" },
  { id: "VALE3.SA",   name: "Vale",      category: "acoes",   source: "yahoo" },
  { id: "ITUB4.SA",   name: "Itaú",      category: "acoes",   source: "yahoo" },
  { id: "BBDC4.SA",   name: "Bradesco",  category: "acoes",   source: "yahoo" },
  { id: "WEGE3.SA",   name: "WEG",       category: "acoes",   source: "yahoo" },
  { id: "MXRF11.SA",  name: "MXRF11",   category: "fiis",    source: "yahoo" },
  { id: "HGLG11.SA",  name: "HGLG11",   category: "fiis",    source: "yahoo" },
  { id: "KNRI11.SA",  name: "KNRI11",   category: "fiis",    source: "yahoo" },
  { id: "bitcoin",    name: "Bitcoin",   category: "cripto",  source: "coingecko" },
  { id: "ethereum",   name: "Ethereum",  category: "cripto",  source: "coingecko" },
  { id: "solana",     name: "Solana",    category: "cripto",  source: "coingecko" },
]
