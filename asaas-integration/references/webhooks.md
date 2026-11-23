# Webhooks

## Criar novo webhook
`POST /v3/webhooks`

```json
{
  "name": "webhook-producao",
  "url": "https://seu-n8n.com/webhook/asaas",
  "email": "voce@nodoprime.com.br",
  "enabled": true,
  "interrupted": false,
  "authToken": "um-token-forte-aleatorio",
  "sendType": "SEQUENTIALLY",
  "events": ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_OVERDUE"]
}
```

- `authToken` é **obrigatório** desde 2026. Se não enviar, o Asaas gera um automaticamente e retorna no corpo da resposta — só aparece **uma vez**, salve na hora.
- O token precisa ser "forte": sem sequências numéricas óbvias, sem repetição de 4 letras, e não pode ser igual a uma chave de API.
- Toda notificação que o Asaas manda pro seu endpoint carrega esse token no header `asaas-access-token`. **Sempre validar esse header no seu handler** antes de processar o evento — sem isso, qualquer um pode forjar um POST pro seu webhook simulando um pagamento confirmado.

## Listar / recuperar / atualizar / remover
- `GET /v3/webhooks`
- `GET /v3/webhooks/{id}`
- `PUT /v3/webhooks/{id}`
- `DELETE /v3/webhooks/{id}`

## Eventos mais usados
| Evento | Quando dispara |
|---|---|
| `PAYMENT_CREATED` | Cobrança criada |
| `PAYMENT_CONFIRMED` | Pagamento confirmado (ainda compensando) |
| `PAYMENT_RECEIVED` | Dinheiro efetivamente creditado |
| `PAYMENT_OVERDUE` | Cobrança venceu sem pagamento |
| `PAYMENT_DELETED` | Cobrança removida (inclusive quando uma assinatura/parcelamento é removido — vem como delete de cada payment filho) |
| `PAYMENT_REFUNDED` | Estorno processado |

Lista completa de categorias de evento (assinaturas, transferências, notas fiscais, chaves de API, contas, split etc.) em `https://docs.asaas.com/docs/webhooks-events` — vale puxar se o fluxo não for só sobre cobrança.

## Idempotência no seu handler
O Asaas pode reenviar o mesmo evento em caso de timeout na sua resposta. Sempre trate o handler como idempotente: cheque se aquele `payment.id` + `event` já foi processado antes de rodar a lógica de novo (ex: já criei o registro no Supabase? já mandei a mensagem de confirmação no WhatsApp?).

## Fila pausada
Se seu endpoint devolver erro (não-2xx) repetidamente, o Asaas pausa a fila de webhooks daquela configuração. Pra reativar: `POST /v3/webhooks/{id}/resumeQueue` (ou pela interface). Por isso o handler deve responder `200` rápido e processar de forma assíncrona (ex: dropar num node de fila do n8n) se a lógica for pesada.

## Testando localmente
Como o Asaas manda POST de fora, pra testar em ambiente local você precisa expor o endpoint — é aqui que entra o Cloudflare Tunnel que o Lucas já usa: aponta o webhook do Asaas (sandbox) pra URL pública do túnel.
