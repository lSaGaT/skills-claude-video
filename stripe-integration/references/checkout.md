# Stripe Checkout — Página de Pagamento Hospedada

Stripe Checkout é uma página de pagamento **pronta e hospedada pelo Stripe**. Você não precisa construir formulário de cartão, lidar com PCI compliance ou validar campos — o Stripe faz tudo. Ideal para quem quer começar rápido.

> **Quando usar:** Prefira Checkout sempre que possível. É mais seguro, mais rápido de implementar e reduz sua responsabilidade PCI. Use PaymentIntents + Elements direto apenas se precisar de um design totalmente customizado.

## Fluxo básico

1. **Backend**: cria um `Checkout Session` via API
2. **Redireciona o usuário** para a URL do Stripe (`https://checkout.stripe.com/...`)
3. **Cliente paga** na página do Stripe
4. **Webhook**: Stripe envia `checkout.session.completed`
5. **Você libera o pedido**

## Criar Checkout Session

`POST /v1/checkout/sessions`

```json
{
  "mode": "payment",
  "line_items": [
    {
      "price": "price_xxx",
      "quantity": 2
    }
  ],
  "success_url": "https://seudominio.com/sucesso?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://seudominio.com/carrinho",
  "customer": "cus_xxx",
  "metadata": {
    "order_id": "12345",
    "seller_id": "seller_123"
  }
}
```

### Modos de Checkout

| `mode` | Quando usar |
|---|---|
| `payment` | Cobrança única (produto, serviço) |
| `subscription` | Assinatura recorrente |
| `setup` | Salvar cartão/método para cobrar depois (off-session) |

## Linha de Itens (line_items)

### Com price ID existente

```json
{
  "line_items": [
    {
      "price": "price_xxx",
      "quantity": 1
    }
  ]
}
```

### Com price_data inline (criar preço na hora)

```json
{
  "line_items": [
    {
      "price_data": {
        "currency": "brl",
        "product_data": {
          "name": "Camiseta Preta",
          "description": "Camiseta 100% algodão",
          "images": ["https://seudominio.com/camiseta.jpg"]
        },
        "unit_amount": 7990
      },
      "quantity": 2
    }
  ]
}
```

### Ajustar quantidade

Você pode permitir que o cliente mude a quantidade no checkout:

```json
{
  "line_items": [
    {
      "price": "price_xxx",
      "quantity": 1,
      "adjustable_quantity": {
        "enabled": true,
        "minimum": 1,
        "maximum": 10
      }
    }
  ]
}
```

## Checkout com Marketplace (Connect)

Para cobrar em nome de um seller e já aplicar a comissão:

```json
{
  "mode": "payment",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "payment_intent_data": {
    "application_fee_amount": 1500,
    "transfer_data": {
      "destination": "acct_connected_id"
    }
  },
  "success_url": "https://seudominio.com/sucesso",
  "cancel_url": "https://seudominio.com/carrinho"
}
```

No modo `subscription`:

```json
{
  "mode": "subscription",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "subscription_data": {
    "application_fee_percent": 15.0,
    "transfer_data": {
      "destination": "acct_connected_id"
    }
  },
  "success_url": "https://seudominio.com/sucesso",
  "cancel_url": "https://seudominio.com/carrinho"
}
```

## Cupons e Descontos no Checkout

```json
{
  "mode": "payment",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "discounts": [
    {
      "coupon": "coupon_xxx"
    }
  ],
  "allow_promotion_codes": true,
  "success_url": "...",
  "cancel_url": "..."
}
```

- `discounts`: aplica cupons fixos (criados por API)
- `allow_promotion_codes: true`: mostra campo \"Código de desconto\" no checkout — o cliente digita o código

## Campos Customizados

Você pode coletar informações extras no checkout:

```json
{
  "custom_fields": [
    {
      "key": "cpf",
      "label": { "type": "custom", "custom": "CPF" },
      "type": "text",
      "optional": false
    },
    {
      "key": "presente",
      "label": { "type": "custom", "custom": "É presente?" },
      "type": "dropdown",
      "dropdown": {
        "options": [
          { "value": "sim", "label": "Sim" },
          { "value": "nao", "label": "Não" }
        ]
      }
    }
  ]
}
```

## Métodos de Pagamento

Por padrão, o Stripe mostra os métodos que você habilitou no Dashboard (cartão, Pix, Apple Pay, Google Pay, etc).

Para forçar métodos específicos:

```json
{
  "payment_method_types": ["card", "pix"],
  "mode": "payment",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "success_url": "...",
  "cancel_url": "..."
}
```

## Webhook — checkout.session.completed

**Sempre** use webhooks para confirmar o pagamento. Não confie só no redirect do success_url (o usuário pode fechar a página antes do redirect).

```typescript
// Webhook handler
switch (event.type) {
  case 'checkout.session.completed': {
    const session = event.data.object;
    const orderId = session.metadata.order_id;
    // Liberar pedido
    break;
  }
  case 'checkout.session.async_payment_succeeded': {
    // Para métodos como Pix que são assíncronos
    const session = event.data.object;
    break;
  }
  case 'checkout.session.async_payment_failed': {
    // Pagamento falhou (ex: Pix expirou)
    break;
  }
}
```

**Importante:** Para métodos de pagamento assíncronos (Pix, boleto, transferência), o evento `checkout.session.completed` dispara **antes** do pagamento ser confirmado. Use `checkout.session.async_payment_succeeded` para saber quando o dinheiro realmente entrou.

## Stripe Embedded Checkout (UI Incorporada)

Além da página hospedada, você pode **incorporar o checkout direto na sua página** usando Stripe.js:

```html
<!-- Front-end -->
<script src="https://js.stripe.com/v3/"></script>
<div id="checkout"></div>

<script>
  const stripe = Stripe('pk_test_xxx');
  
  // Backend retorna o client_secret do Checkout Session
  fetch('/criar-checkout', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret
      }).then((checkout) => {
        checkout.mount('#checkout');
      });
    });
</script>
```

```typescript
// Backend
const session = await stripe.checkout.sessions.create({
  ui_mode: 'embedded', // ← ESSENCIAL para embedded
  mode: 'payment',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  return_url: 'https://seudominio.com/sucesso?session_id={CHECKOUT_SESSION_ID}',
});

res.json({ clientSecret: session.client_secret });
```

## Parâmetros úteis do Checkout Session

| Parâmetro | Descrição |
|---|---|
| `locale` | Idioma (`auto`, `pt-BR`, `en`, `es`, etc) |
| `billing_address_collection` | `required` ou `auto` |
| `shipping_address_collection` | `{ allowed_countries: ["BR"] }` |
| `phone_number_collection` | `{ enabled: true }` |
| `customer_creation` | `always` ou `if_required` |
| `tax_id_collection` | `{ enabled: true }` — CPF/CNPJ |
| `expires_at` | Timestamp de expiração da sessão (máx 24h) |
| `consent_collection` | `{ terms_of_service: "required" }` |

## Exemplo (n8n) — Criar Checkout Session

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/checkout/sessions`
4. Auth: Header Auth
5. Body: Form-Data
   - `mode`: `payment`
   - `line_items[0][price]`: `price_xxx`
   - `line_items[0][quantity]`: `1`
   - `success_url`: `https://seudominio.com/sucesso`
   - `cancel_url`: `https://seudominio.com/carrinho`
   - `allow_promotion_codes`: `true`
   - `metadata[order_id]`: `{{$json.orderId}}`

6. Output: pegar a `url` e redirecionar o usuário
