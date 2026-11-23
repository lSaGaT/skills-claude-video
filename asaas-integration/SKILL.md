---
name: asaas-integration
description: Especialista em montar código de integração com a API do Asaas (gateway de pagamentos brasileiro) — cobranças, clientes, Pix, assinaturas, parcelamentos, juros/multa/desconto, split, negativação Serasa, consulta de crédito e emissão de NF-e (nota fiscal de serviço). Use sempre que o usuário pedir para criar, integrar, debugar ou escrever código que fale com o Asaas, seja via n8n (HTTP Request node), TypeScript/Node, ou qualquer outra stack — mesmo que ele não diga "Asaas API" explicitamente, só mencione cobrança, Pix, boleto, assinatura recorrente, nota fiscal, negativação ou pagamento nesse contexto. Também use para explicar erros de autenticação (401), problemas de sandbox vs produção, ou configuração de webhooks do Asaas.
---

# Asaas — Integração via API

Skill para escrever código de integração com a API do Asaas (v3). Documentação oficial: https://docs.asaas.com — sempre que precisar confirmar um payload exato ou endpoint que não está coberto aqui, use web_fetch nessa doc antes de inventar campos.

## Antes de escrever qualquer código

1. Pergunte (ou confirme pelo contexto) se é **Sandbox** ou **Produção** — muda a URL base e a chave.
2. Pergunte que stack: n8n (HTTP Request node) ou código TypeScript/Node direto. O padrão do Lucas é n8n + Supabase + Next.js, então na dúvida assuma n8n.
3. Identifique o recurso (cliente, cobrança, Pix, assinatura, webhook etc.) e veja o arquivo correspondente em `references/`.

## Autenticação

- Header obrigatório em toda requisição: `access_token: <API_KEY>`
- **Sandbox**: `https://api-sandbox.asaas.com/v3` — chave começa com `$aact_hmlg_`
- **Produção**: `https://api.asaas.com/v3` — chave começa com `$aact_prod_`
- Usar chave de produção em endpoint de sandbox (ou vice-versa) retorna `401 Unauthorized`. Esse é o erro mais comum — sempre checar isso primeiro quando o usuário reportar 401.
- Desde novembro/2024, contas novas devem enviar o header `User-Agent` (nome da aplicação) em toda requisição.
- Nunca commitar a `access_token` no código. Em n8n, usar Credentials (HTTP Header Auth) ou uma variável de ambiente; em Node, `process.env.ASAAS_API_KEY`.

## Padrão de requisição (TypeScript)

```typescript
const ASAAS_BASE_URL = process.env.ASAAS_ENV === "production"
  ? "https://api.asaas.com/v3"
  : "https://api-sandbox.asaas.com/v3";

async function asaasRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY!,
      "User-Agent": "NodoPrime",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(`Asaas API error ${res.status}: ${JSON.stringify(error)}`);
  }

  return res.json();
}
```

## Padrão de requisição (n8n — HTTP Request node)

- Method + URL: `{{$env.ASAAS_BASE_URL}}/customers` (ou o endpoint correspondente)
- Authentication: Generic Credential Type → Header Auth (nome: `access_token`, valor: a chave)
- Headers extras: `Content-Type: application/json`
- Body: JSON, geralmente montado com um node "Set" ou "Code" antes do HTTP Request
- Para paginação, os endpoints de listagem aceitam `?offset=` e `?limit=` (máx 100); resposta vem com `hasMore`, `totalCount`, `data`

## Recursos principais — ver references/

| Recurso | Arquivo | Quando usar |
|---|---|---|
| Clientes | `references/customers.md` | Sempre antes de criar uma cobrança — cobrança exige `customer` (ID) |
| Cobranças (payments) | `references/payments.md` | Boleto, cartão, Pix avulso, listar/consultar/cancelar, juros/multa/desconto |
| Pix | `references/pix.md` | QR Code dinâmico, chaves Pix, Pix Automático/Recorrente |
| Assinaturas | `references/subscriptions.md` | Cobrança recorrente (mensal, anual etc.) |
| Parcelamentos | `references/installments.md` | Número fixo de parcelas criadas de uma vez (diferente de assinatura) |
| Notas Fiscais (NF-e) | `references/invoices-nfe.md` | Configuração fiscal da conta, emissão manual ou automática de NFS-e |
| Negativação (Serasa) | `references/negativacao.md` | Registrar CPF/CNPJ inadimplente na Serasa, consultar crédito |
| Webhooks | `references/webhooks.md` | Receber eventos de pagamento confirmado, negativação, etc. |

## Erros e gotchas mais comuns

- **401 Unauthorized**: chave de ambiente errada (ver seção Autenticação acima).
- **Webhook sem `authToken`**: desde 2026 o Asaas passou a exigir `authToken` na criação de todo webhook (`POST /v3/webhooks`). Se não enviar, o Asaas gera um automaticamente e retorna no corpo da resposta **uma única vez** — precisa salvar na hora.
- **Validação de eventos recebidos**: o Asaas envia o header `asaas-access-token` em todo POST para seu webhook. Sempre validar esse header contra o `authToken` configurado antes de processar o evento, pra evitar chamadas forjadas.
- **Idempotência em cobranças**: não existe endpoint de idempotência nativo — se seu fluxo n8n pode rodar duas vezes (retry), cheque antes se já existe uma cobrança com o mesmo `externalReference` antes de criar outra.
- **Sandbox tem endpoints exclusivos** pra forçar estados de teste, tipo confirmar pagamento manualmente ou forçar vencimento — úteis pra testar fluxos de webhook sem esperar um pagamento real (ver `references/webhooks.md`).
- **Webhooks de assinatura**: o Asaas não dispara webhook de "assinatura criada/cancelada" diretamente — os eventos são sempre no nível de `PAYMENT_*` (cada cobrança gerada pela assinatura).

## Fluxo típico (cobrança avulsa)

1. Verificar se cliente já existe (`GET /customers?cpfCnpj=`) — senão, criar (`POST /customers`)
2. Criar cobrança (`POST /payments`) com `customer`, `billingType`, `value`, `dueDate`
3. Se Pix: buscar QR Code (`GET /payments/{id}/pixQrCode`)
4. Configurar webhook (`POST /webhooks`) pra receber `PAYMENT_CONFIRMED` / `PAYMENT_RECEIVED`
5. No handler do webhook, validar `asaas-access-token` antes de processar
