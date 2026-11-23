# Negativação (Serasa)

Registra o CPF/CNPJ do cliente inadimplente na Serasa a partir de uma cobrança vencida do Asaas.

## Fluxo de status de uma cobrança que vai pra negativação
`PAYMENT_CREATED` → `PAYMENT_OVERDUE` (venceu) → `PAYMENT_DUNNING_REQUESTED` (negativação solicitada) → `PAYMENT_DUNNING_RECEIVED` (dívida quitada via negativação)
Esses são os mesmos eventos de webhook de `references/webhooks.md`, categoria cobrança.

## Ver se uma cobrança pode ser negativada
`GET /v3/paymentDunning/eligiblePayments` (listar cobranças disponíveis pra negativação) — retorna, junto com a lista, uma simulação de valores pra cada tipo de negativação possível.

## Simular uma negativação (ver custo antes de confirmar)
`POST /v3/paymentDunning/simulate`

## Criar uma negativação
`POST /v3/paymentDunning`
```json
{
  "payment": "pay_637959110194",
  "type": "SERASA",
  "description": "Débito referente à cobrança em aberto"
}
```
Isso inicia o fluxo — a cobrança precisa já estar vencida (`OVERDUE`) e existir previamente no Asaas.

## Listar negativações
`GET /v3/paymentDunning`

## Recuperar uma única negativação
`GET /v3/paymentDunning/{id}`

## Histórico de eventos de uma negativação
`GET /v3/paymentDunning/{id}/history` — linha do tempo desde o início do processo.

## Cancelar negativação
`POST /v3/paymentDunning/{id}/cancel`
- Só é possível se a propriedade `canBeCancelled` (retornada no objeto da negativação) for `true`.
- Se a negativação já tiver sido efetivada na Serasa, o cancelamento não é imediato — fica com status `AWAITING_CANCELLATION` até o processamento (`CANCELLED`).

## Reenviar documentos (se a negativação for negada)
`POST /v3/paymentDunning/{id}/resendDocuments`
Cheque a propriedade `isNecessaryResendDocumentation` no objeto da negativação — se `true`, precisa reenviar. Depois do reenvio, volta pro status `AWAITING_APPROVAL`.

## Listar pagamentos recebidos via negativação
`GET /v3/paymentDunning/{id}/payments` — pagamentos que o cliente fez pra quitar a dívida negativada (pode ser diferente do valor original, por juros/taxas do processo).

## Consulta Serasa (score/dados de crédito, sem negativar)
Diferente de negativar, se o objetivo é só **consultar** a situação de crédito de alguém antes de fechar negócio:
- `POST /v3/creditBureauReport` — solicita uma consulta
- `GET /v3/creditBureauReport` — lista consultas já feitas
- `GET /v3/creditBureauReport/{id}` — recupera uma consulta específica
Nota: a abrangência da consulta hoje é nacional (não precisa mais informar estado).
