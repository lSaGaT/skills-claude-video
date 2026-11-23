# Parcelamentos (Installments)

Diferente de assinatura (recorrência indefinida), parcelamento é um número fixo de parcelas criadas de uma vez. Ver `payments.md` pra como criar (via `installmentCount`/`installmentValue` em `POST /v3/payments`).

## Criar parcelamento com cartão de crédito
`POST /v3/payments/creditCard` com `installmentCount`/`installmentValue` — limites de parcelas variam por bandeira do cartão.

## Listar parcelamentos
`GET /v3/installments`

## Recuperar um único parcelamento
`GET /v3/installments/{id}`

## Listar cobranças (parcelas) de um parcelamento
`GET /v3/installments/{id}/payments`

## Cancelar cobranças de um parcelamento (pendentes e vencidas)
`DELETE /v3/installments/{id}/payments` — cancela só as parcelas que ainda não foram pagas; as já pagas continuam.

## Remover parcelamento inteiro
`DELETE /v3/installments/{id}`

## Estornar parcelamento
`POST /v3/installments/{id}/refund` — só parcelamento via cartão de crédito recebido/confirmado. Mesmo funcionamento do estorno de cobrança avulsa (ver `payments.md`), até 10 dias úteis pra refletir na fatura do cliente.

## Gerar carnê (PDF com todas as parcelas)
`GET /v3/installments/{id}/paymentBook`

## Atualizar splits do parcelamento
`PUT /v3/installments/{id}/splits` — se o parcelamento usa split de pagamento, dá pra ajustar a divisão pra todas as parcelas de uma vez.
