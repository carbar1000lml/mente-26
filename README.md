# Formulário de Pesquisa com Supabase

Este projeto consiste em um formulário de pesquisa que envia dados para uma tabela no Supabase.

## Configuração

### Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Projeto no [Supabase](https://supabase.com) com uma tabela chamada `Respostas`

### Estrutura da Tabela Supabase

Crie uma tabela chamada `Respostas` com as seguintes colunas:

- `id` (tipo: uuid, primary key)
- `A` (tipo: text)
- `B` (tipo: text)
- `C` (tipo: text)
- `Nome` (tipo: text)
- `Email` (tipo: text)
- `csrf_token` (tipo: text)
- `timestamp` (tipo: timestamp)
- `created_at` (tipo: timestamp, default: now())

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Vercel:

- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase

## Deploy no Vercel

### Método 1: Deploy via CLI

1. Instale a CLI do Vercel:

