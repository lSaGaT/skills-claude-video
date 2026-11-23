# Assinaturas (Subscriptions)

Assinatura no Stripe é um objeto que vincula um **Cliente** a um ou mais **Preços** (Prices) e gera cobranças recorrentes automaticamente.

## Criar assinatura

`POST /v1/subscriptions`

```json
{
  "customer": "cus_xxx",
  "items": [
    {
      "price": "price_xxx"
    }
  ],
  "payment_behavior": "default_incomplete",
  "payment_settings": {
    "save_default_payment_method": "on_subscription"
  },
  "metadata": {
    "seller_id": "seller_123"
  }
}
```

### Com trial grátis

```json
{
  "customer": "cus_xxx",
  "items": [{ "price": "price_xxx" }],
  "trial_period_days": 14,
  "trial_settings": {
    "end_behavior": {
      "missing_payment_method": "cancel"
    }
  }
}
```

### Com múltiplos itens (preços diferentes na mesma assinatura)

```json
{
  "customer": "cus_xxx",
  "items": [
    { "price": "price_plano_base" },
    { "price": "price_addon" }
  ]
}
```

## Assinatura no Connect (Marketplace)

Para uma assinatura onde o valor é dividido entre plataforma e seller:

1. Crie o **Product** e **Price** normalmente na sua conta
2. Crie a **Subscription** normalmente
3. **Não** use `application_fee_amount` diretamente na Subscription (não funciona)
4. Em vez disso, na **Invoice** gerada pela subscription, adicione o `application_fee_amount`:

```typescript
// Opção 1: Configurar application_fee_amount na subscription via invoice_settings
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  transfer_data: {
    destination: 'acct_seller_id',
    amount_percent: 85, // 85% vai pro seller, 15% fica na plataforma
  },
  // OU use application_fee_percent (do total)
  application_fee_percent: 15.0, // 15% de comissão na primeira invoice
});
```

Na prática, para subscriptions em marketplace, o mais comum é:
- Criar a subscription na sua conta (plataforma)
- Criar `Invoice` com `application_fee_amount` em cada ciclo
- Ou usar `transfer_data.amount_percent` na subscription para dividir automaticamente

## Cancelar assinatura

`POST /v1/subscriptions/{id}`

```json
{
  "cancel_at_period_end": true
}
```

Ou cancelar imediatamente:

```json
{
  "cancel_at_period_end": false
}
```

`DELETE /v1/subscriptions/{id}` — cancelamento imediato sem prorrateio.

## Listar assinaturas

`GET /v1/subscriptions`

Filtros: `?customer=cus_xxx`, `?status=active`, `?price=price_xxx`

## Atualizar assinatura

`POST /v1/subscriptions/{id}`

```json
{
  "items": [{
    "id": "si_xxx",
    "price": "price_novo"
  }]
}
```

## Webhooks relacionados a assinaturas

| Evento | Quando |
|---|---|
| `customer.subscription.created` | Assinatura criada |
| `customer.subscription.updated` | Assinatura atualizada (upgrade, downgrade) |
| `customer.subscription.deleted` | Assinatura cancelada |
| `invoice.paid` | Fatura paga com sucesso (importante: associar ao pedido) |
| `invoice.payment_failed` | Pagamento da fatura falhou — tentar retentar ou notificar |
| `payment_intent.payment_failed` | Tentativa de pagamento específica falhou |

## Fluxo de retentativa (dunning)

O Stripe tenta cobrar automaticamente:
- 1 hora depois da primeira falha
- 2 horas depois
- 6 horas depois
- 12 horas depois
- 24 horas depois
- 48 horas depois

Após 14 dias sem sucesso, a assinatura é cancelada.

## Exemplo (n8n)

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/subscriptions`
4. Auth: Header Auth
5. Body: Form-Data
   - `customer`: `{{$json.customerId}}`
   - `items[0][price]`: `price_xxx`
   - `trial_period_days`: `14`
