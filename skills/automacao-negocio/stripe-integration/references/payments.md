# Pagamentos (Payment Intents)

O Stripe usa **PaymentIntent** como objeto principal para processar pagamentos. Ele representa o ciclo de vida completo de uma transação: criação, autenticação (3D Secure/SCA), confirmação e captura.

> **Importante:** Stripe usa valores em **centavos** (ou menor unidade da moeda). R$ 100,00 = `10000`. Dólar $10,00 = `1000`.

## Criar PaymentIntent (pagamento simples)

`POST /v1/payment_intents`

```json
{
  "amount": 2000,
  "currency": "brl",
  "customer": "cus_xxx",
  "payment_method": "pm_xxx",
  "description": "Pedido #123 - Camiseta Preta",
  "metadata": {
    "order_id": "12345"
  },
  "confirm": true,
  "off_session": false,
  "receipt_email": "cliente@email.com"
}
```

### Fluxo típico (recomendado para checkout)

1. **Backend**: `POST /v1/payment_intents` com `amount` e `currency` (sem confirm)
2. **Backend**: Retorna `client_secret` para o front-end
3. **Front-end**: Stripe.js + Elements confirma o pagamento com o `client_secret`
4. **Webhook**: Stripe envia `payment_intent.succeeded` quando confirmado

```typescript
// 1. Criar PaymentIntent (sem confirm)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'brl',
  customer: 'cus_xxx',
  metadata: { order_id: '12345' },
});

// Retorna { client_secret: 'pi_xxx_secret_xxx' } — mandar pro front-end

// 2. NO FRONT-END (Stripe.js):
// const { error } = await stripe.confirmCardPayment(clientSecret);
```

## PaymentIntent para Connect (Marketplace)

`POST /v1/payment_intents` — com parâmetros de Connect

```json
{
  "amount": 10000,
  "currency": "brl",
  "customer": "cus_xxx",
  "application_fee_amount": 1500,
  "transfer_data": {
    "destination": "acct_connected_id"
  },
  "metadata": {
    "seller_id": "seller_123",
    "order_id": "12345",
    "platform_fee_percent": "15"
  }
}
```

- `application_fee_amount`: **taxa da plataforma** em centavos (R$ 15,00)
- `transfer_data.destination`: ID da **conta conectada (seller)** que vai receber o líquido
- O Stripe automaticamente:
  - Cobra o valor total do cliente (R$ 100,00)
  - Transfere R$ 15,00 para a plataforma (sua conta)
  - Transfere R$ 85,00 para a conta conectada (seller)
  - Deduz as taxas do Stripe da conta do seller (padrão) ou da plataforma (configurável)

## Capturar PaymentIntent (pré-autorização)

Para fluxos de "reservar" o valor e capturar depois:

```json
// Criar sem capturar
{
  "amount": 5000,
  "currency": "brl",
  "capture_method": "manual"
}

// Depois capturar
POST /v1/payment_intents/{id}/capture
```

Se não capturar dentro de 7 dias, a autorização expira.

## Listar PaymentIntents

`GET /v1/payment_intents`

Filtros: `?customer=cus_xxx`, `?limit=10`, `?created[gte]=1234567890`

## Recuperar PaymentIntent

`GET /v1/payment_intents/{id}`

## Atualizar PaymentIntent

`POST /v1/payment_intents/{id}`

## Cancelar PaymentIntent

`POST /v1/payment_intents/{id}/cancel`

## Estornos (Refunds)

### Estornar pagamento inteiro

`POST /v1/refunds`

```json
{
  "payment_intent": "pi_xxx"
}
```

### Estornar parcial

```json
{
  "payment_intent": "pi_xxx",
  "amount": 2000
}
```

### Estornar em Marketplace (Connect)

```json
{
  "payment_intent": "pi_xxx",
  "reverse_transfer": true,
  "refund_application_fee": true
}
```

- `reverse_transfer`: **puxa o dinheiro de volta** da conta conectada (seller) para cobrir o estorno — se `false`, o estorno sai do saldo da plataforma
- `refund_application_fee`: devolve a comissão da plataforma também

## Status de um PaymentIntent

| Status | Significado |
|---|---|
| `requires_payment_method` | Aguardando método de pagamento |
| `requires_confirmation` | Criado, precisa ser confirmado |
| `requires_action` | Precisa de autenticação (3D Secure) |
| `processing` | Processando (débito em conta, etc.) |
| `succeeded` | Pagamento confirmado com sucesso |
| `canceled` | Cancelado |
| `requires_capture` | Aguardando captura (pré-autorização) |

## Cartões de teste (Stripe)

| Cartão | Resultado |
|---|---|
| `4242424242424242` | Sucesso |
| `4000000000000002` | Recusado genérico |
| `4000002500003155` | Requer 3D Secure (autenticação) |
| `4000000000003220` | Recusado com 3D Secure |

Qualquer data futura, qualquer CVC de 3 dígitos.

## Exemplo (n8n) — cobrança simples

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/payment_intents`
4. Auth: Header Auth (`Authorization: Bearer {{$env.STRIPE_SECRET_KEY}}`)
5. Body: Form-Data
   - `amount`: `2000`
   - `currency`: `brl`
   - `customer`: `{{$json.customerId}}`
   - `confirm`: `true`
   - `payment_method`: `{{$json.paymentMethodId}}`
