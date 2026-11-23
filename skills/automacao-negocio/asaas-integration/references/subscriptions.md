# Assinaturas (Subscriptions)

Cobrança recorrente. O Asaas gera uma nova cobrança (`payment`) automaticamente a cada ciclo — não existe webhook "de assinatura" separado, os eventos vêm como `PAYMENT_*` de cada cobrança individual gerada.

## Criar nova assinatura
`POST /v3/subscriptions`

```json
{
  "customer": "cus_000005219613",
  "billingType": "CREDIT_CARD",
  "value": 49.9,
  "nextDueDate": "2026-08-10",
  "cycle": "MONTHLY",
  "description": "Plano Pro mensal"
}
```
`cycle`: `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `QUARTERLY`, `SEMIANNUALLY`, `YEARLY`

## Criar assinatura com cartão de crédito (dados do cartão inline)
`POST /v3/subscriptions` com bloco `creditCard` e `creditCardHolderInfo` no corpo — evita precisar de tokenização separada na primeira cobrança.

## Atualizar assinatura existente
`POST /v3/subscriptions/{id}` — muda valor, dia de vencimento, ciclo etc. dali pra frente (não afeta cobranças já geradas).

## Atualizar cartão sem cobrar
`POST /v3/subscriptions/{id}/creditCard` — troca o cartão vinculado sem gerar cobrança imediata; cobranças pendentes da assinatura também são atualizadas pro novo cartão.

## Listar / recuperar / remover
- `GET /v3/subscriptions`
- `GET /v3/subscriptions/{id}`
- `DELETE /v3/subscriptions/{id}`

## Listar cobranças de uma assinatura
`GET /v3/subscriptions/{id}/payments` — útil pra montar um histórico de faturas do cliente.

## Gerar carnê (várias cobranças em um PDF)
`GET /v3/subscriptions/{id}/paymentBook`

## Gotcha: cancelar assinatura não cancela cobranças já geradas
Cancelar a assinatura (`DELETE`) não mexe em cobranças `PENDING` que já foram criadas — se quiser cancelar tudo, também precisa cancelar as cobranças pendentes individualmente (`references/payments.md`).
