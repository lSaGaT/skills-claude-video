---
name: evolution-api
description: Referência de endpoints da Evolution API (gateway open-source de WhatsApp usado via Baileys/WhatsApp Web) — criação e gerenciamento de instâncias, envio de mensagens (texto, mídia, áudio, botões, listas, enquetes), configuração de webhooks e eventos. Use sempre que o usuário pedir para integrar, enviar mensagem, criar instância, configurar webhook ou debugar algo envolvendo a Evolution API / automação de WhatsApp — mesmo que ele só diga "manda uma mensagem no WhatsApp" ou "cria uma instância" nesse contexto, sem citar o nome da API explicitamente.
---

# Evolution API — Referência de Endpoints

Skill de referência pra integrar com a Evolution API v2 (WhatsApp via Baileys). Doc oficial: https://doc.evolution-api.com — se precisar de um payload que não está coberto aqui (ex: variante menos comum de um endpoint), web_fetch a página específica antes de inventar campo.

## Autenticação

Toda requisição leva o header `apikey`. Duas formas de chave:
- **API Key global** (definida em `AUTHENTICATION_API_KEY` no `.env` do servidor) — dá acesso a qualquer instância, inclusive criar/deletar instâncias.
- **Token da instância** (gerado na criação, campo `hash` na resposta) — funciona só pra endpoints daquela instância específica (mandar mensagem, etc).

Pra automações de produção, prefira usar o token da instância nos endpoints de mensagem, e reservar a API Key global só pra criação/gerenciamento de instâncias.

## Base da URL

Todas as rotas abaixo são relativas à URL do seu servidor Evolution (`{baseUrl}`), ex: `https://evolution.nodoprime.com.br`. O nome da instância entra como parâmetro no path, não no body, na maioria dos endpoints (`/message/sendText/{instance}`).

## Mapa de endpoints — ver references/

| Categoria | Arquivo | Cobre |
|---|---|---|
| Instâncias | `references/instances.md` | Criar, listar, conectar (QR Code), status, logout, deletar, presence |
| Envio de mensagens | `references/messages.md` | Texto, mídia, áudio, sticker, localização, contato, reação, enquete, lista, botões |
| Webhooks e eventos | `references/webhooks.md` | Configurar webhook por instância ou global, lista completa de eventos suportados |
| Utilitários de chat | `references/chat-utility.md` | Checar se número tem WhatsApp, marcar como lida, arquivar chat |

## Padrão de requisição (n8n — HTTP Request node)

- Method + URL: `{{$env.EVOLUTION_BASE_URL}}/message/sendText/{{$env.EVOLUTION_INSTANCE}}`
- Header: `apikey: {{$env.EVOLUTION_API_KEY}}` (via credential Header Auth, não hardcoded)
- Header: `Content-Type: application/json`
- Body: JSON com os campos do endpoint (ver `references/messages.md`)

## Padrão de requisição (TypeScript)

```typescript
const EVOLUTION_BASE_URL = process.env.EVOLUTION_BASE_URL!;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY!;

async function evolutionRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${EVOLUTION_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_API_KEY,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(`Evolution API error ${res.status}: ${JSON.stringify(error)}`);
  }

  return res.json();
}

// Exemplo: enviar texto
await evolutionRequest(`/message/sendText/${instanceName}`, {
  method: "POST",
  body: { number: "5531999999999", text: "Olá!" },
});
```

## Gotchas mais comuns

- **Formato do número**: sempre DDI + DDD + número, só dígitos, sem `+`, espaço ou traço (`5531999999999`). Number com 11 dígitos (DDD + 9 + 8 dígitos) sem o `55` na frente vai falhar silenciosamente ou cair em número errado — formate antes de mandar.
- **Grupo vs contato**: pra mandar em grupo, o `number` recebe o JID do grupo (`xxxxxxxxxx@g.us`), não um campo separado tipo `groupJid`. Isso é um erro comum reportado até no GitHub oficial.
- **Mídia em base64**: manda só o base64 puro, sem o prefixo `data:image/png;base64,`. Incluir o prefixo quebra o envio.
- **Rate limit não é imposto pela Evolution API em si**, é o WhatsApp que penaliza — na prática, manter abaixo de ~100 mensagens/minuto por instância e nunca mandar mensagem fria (sem opt-in) evita banimento do número.
- **Webhook precisa responder rápido**: a Evolution espera um 200 OK imediato. Se a lógica for pesada (chamar um LLM, etc), processe assíncrono (ex: dropar num node de fila do n8n) e responda 200 primeiro.
- **QR Code expira**: depois de escanear, sempre acompanhar o evento `CONNECTION_UPDATE` via webhook pra confirmar que a sessão realmente conectou — o retorno do QR Code por si só não garante que o pareamento deu certo.
- **Instância desconectada não é fim do mundo**: reinício de Docker, perda de rede ou o próprio WhatsApp forçando re-login desconectam a sessão sem apagar os dados — normalmente só precisa re-parear (`GET /instance/connect/{instance}`), não recriar a instância do zero.
