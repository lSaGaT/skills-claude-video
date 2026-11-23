# Cobranças (Payments)

## Criar nova cobrança
`POST /v3/payments`

```json
{
  "customer": "cus_000005219613",
  "billingType": "PIX",
  "value": 100.0,
  "dueDate": "2026-08-10",
  "description": "Referente ao pedido #123",
  "externalReference": "id-no-seu-sistema"
}
```
`billingType`: `BOLETO`, `CREDIT_CARD`, `PIX`, ou `UNDEFINED` (deixa o cliente escolher na fatura).

## Criar cobrança com cartão de crédito (cobrança direta, sem fatura)
`POST /v3/payments/creditCard` — envia os dados do cartão junto (tokenizado ou não). Usar só se a tela de checkout for sua; senão prefira o Asaas Checkout hospedado.
Pra reaproveitar dados de cartão sem armazenar novamente: tokenize uma vez (`POST /v3/creditCard/tokenize`) e depois manda só `creditCardToken` na criação da cobrança, sem precisar reenviar `creditCard`/`creditCardHolderInfo`.

## Juros, multa e desconto
São objetos opcionais dentro do próprio payload de `POST /v3/payments` (não são endpoints separados):
```json
{
  "customer": "cus_000005219613",
  "billingType": "BOLETO",
  "value": 2000.00,
  "dueDate": "2026-08-21",
  "interest": { "value": 1 },
  "fine": { "value": 2, "type": "PERCENTAGE" },
  "discount": { "value": 10, "dueDateLimitDays": 5, "type": "PERCENTAGE" }
}
```
- `interest.value`: % de juros ao **mês** sobre atraso.
- `fine.value`: multa (fixa ou %, conforme `type`) aplicada uma vez no atraso.
- `discount`: desconto se pagar até X dias antes do vencimento (`dueDateLimitDays`).
- **Cuidado**: se a conta já tem juros/multa configurados globalmente (padrão da conta) e você manda `interest`/`fine` vazios ou nulos na cobrança, isso **sobrescreve** a configuração padrão pra essa cobrança específica. Se quer manter o padrão da conta, o mais seguro é **não enviar** esses objetos.
- Depois do pagamento, o campo `interestValue` no webhook mostra o total de juros+multa efetivamente cobrado.

## Cobrança parcelada (installments)
Em vez de `value`, envie `installmentCount` + `installmentValue`:
```json
{
  "customer": "cus_000005219613",
  "billingType": "BOLETO",
  "installmentCount": 6,
  "installmentValue": 100.00,
  "dueDate": "2026-08-21"
}
```
Isso cria o grupo de parcelamento de uma vez — cada parcela vira uma cobrança individual vinculada. Pra gerenciar o parcelamento como um todo (cancelar todas as pendentes, listar parcelas, gerar carnê), ver `references/installments.md`.

## Listar cobranças
`GET /v3/payments`
Filtros: `?customer=`, `?billingType=`, `?status=`, `?dueDate[ge]=`, `?dueDate[le]=`

## Recuperar uma única cobrança
`GET /v3/payments/{id}`

## Atualizar cobrança existente
`POST /v3/payments/{id}` — só funciona se a cobrança ainda estiver pendente.

## Excluir cobrança
`DELETE /v3/payments/{id}`

## Estornar cobrança
`POST /v3/payments/{id}/refund` — cartão de crédito recebido/confirmado. Prazo de até 10 dias úteis pra aparecer na fatura do cliente.

## Obter QR Code Pix de uma cobrança
`GET /v3/payments/{id}/pixQrCode`
Retorna `encodedImage` (base64 do QR), `payload` (copia-e-cola) e `expirationDate`.

## Obter linha digitável do boleto
`GET /v3/payments/{id}/identificationField`

## Status possíveis de uma cobrança
`PENDING` → `RECEIVED`/`CONFIRMED` (Pix costuma pular direto pra `RECEIVED`) → `RECEIVED_IN_CASH` (se confirmado manualmente) ou `OVERDUE` (venceu sem pagar). Ver `references/webhooks.md` pra eventos correspondentes.

## Sandbox — forçar estados (só ambiente de testes)
- `POST /v3/payments/{id}/confirmPayment` — confirma o pagamento manualmente, sem precisar pagar de verdade
- `POST /v3/payments/{id}/overduePayment` — força o vencimento

Extremamente útil pra testar o fluxo de webhook ponta a ponta sem esperar um pagamento real.
