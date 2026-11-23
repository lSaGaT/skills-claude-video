# Cupons, Descontos e Códigos Promocionais

O Stripe tem um sistema completo de descontos com dois níveis:
- **Coupon**: define a lógica do desconto (% ou valor fixo)
- **Promotion Code**: código que o cliente digita (ex: `PROMO10`), vinculado a um coupon

## Cupons (Coupons)

### Criar cupom percentual

`POST /v1/coupons`

```json
{
  "percent_off": 15,
  "duration": "once",
  "name": "15% off na primeira compra"
}
```

### Criar cupom de valor fixo

```json
{
  "amount_off": 2000,
  "currency": "brl",
  "duration": "once",
  "name": "R$ 20,00 de desconto"
}
```

### Duração do cupom

| `duration` | Comportamento |
|---|---|
| `once` | Aplica apenas na primeira cobrança/fatura |
| `forever` | Aplica em todas as cobranças (assinaturas) |
| `repeating` | Aplica por `duration_in_months` meses |

Exemplo com `repeating`:

```json
{
  "percent_off": 10,
  "duration": "repeating",
  "duration_in_months": 3,
  "name": "10% off nos primeiros 3 meses"
}
```

### Cupom com limite de uso

```json
{
  "percent_off": 20,
  "duration": "once",
  "max_redemptions": 100,
  "name": "20% off - limitado a 100 usos"
}
```

### Cupom que expira

```json
{
  "percent_off": 10,
  "duration": "once",
  "redeem_by": 1750000000, // timestamp: data de expiração
  "name": "10% off - válido até dezembro"
}
```

## Códigos Promocionais (Promotion Codes)

Um **Promotion Code** é o código que o cliente digita (ex: `BLACKFRIDAY`). Vários códigos podem apontar para o mesmo cupom.

### Criar código promocional

`POST /v1/promotion_codes`

```json
{
  "coupon": "coupon_xxx",
  "code": "BLACKFRIDAY2025",
  "max_redemptions": 50,
  "expires_at": 1768000000,
  "metadata": {
    "campanha": "black-friday-2025"
  }
}
```

### Código válido apenas para primeira compra

```json
{
  "coupon": "coupon_xxx",
  "code": "BEMVINDO15",
  "restrictions": {
    "first_time_transaction": true
  }
}
```

### Código com valor mínimo

```json
{
  "coupon": "coupon_xxx",
  "code": "FRETE10",
  "restrictions": {
    "minimum_amount": 5000,
    "minimum_amount_currency": "brl"
  }
}
```

Só funciona se o carrinho for >= R$ 50,00.

### Listar códigos promocionais ativos

`GET /v1/promotion_codes?active=true&code=BLACKFRIDAY`

## Aplicar Descontos

### No Checkout Session

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

- `discounts`: aplica cupom específico **sem o cliente digitar**
- `allow_promotion_codes: true`: mostra campo de cupom no checkout para o **cliente digitar** o código

### No PaymentIntent (desconto manual)

O PaymentIntent **não aceita** `discounts` diretamente. Para aplicar desconto em pagamento único:
1. Calcule o valor com desconto no seu backend
2. Passe o `amount` já com desconto no PaymentIntent
3. Registre o cupom usado nos `metadata`

```typescript
// Cálculo manual do desconto
const valorOriginal = 10000; // R$ 100,00
const percentualDesconto = 15; // 15%
const valorComDesconto = Math.round(valorOriginal * (1 - percentualDesconto / 100));
// = 8500 (R$ 85,00)

const paymentIntent = await stripe.paymentIntents.create({
  amount: valorComDesconto,
  currency: 'brl',
  metadata: {
    coupon_id: 'coupon_xxx',
    discount_percent: '15',
    original_amount: '10000'
  },
});
```

### Na Assinatura (Subscription)

```typescript
// Na criação da subscription com cupom
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  coupon: 'coupon_xxx', // aplica cupom em todas as faturas (conforme duration)
});

// Adicionar código promocional na criação
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  promotion_code: 'promo_code_xxx', // ou passar o código: promotion_code
});
```

## Listar / Atualizar / Deletar

| Ação | Endpoint |
|---|---|
| Listar cupons | `GET /v1/coupons` |
| Recuperar cupom | `GET /v1/coupons/{id}` |
| Deletar cupom | `DELETE /v1/coupons/{id}` |
| Listar promo codes | `GET /v1/promotion_codes` |
| Recuperar promo code | `GET /v1/promotion_codes/{id}` |

## Validar Código Promocional (antes de criar sessão)

Para verificar se um código digitado pelo cliente é válido:

```typescript
async function validarPromoCode(code: string, valorTotal: number) {
  const codes = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
  });

  if (codes.data.length === 0) return { valido: false, motivo: 'Código não encontrado' };

  const promo = codes.data[0];
  
  // Verificar expiração
  if (promo.expires_at && promo.expires_at < Math.floor(Date.now() / 1000)) {
    return { valido: false, motivo: 'Código expirado' };
  }

  // Verificar valor mínimo
  if (promo.restrictions?.minimum_amount && valorTotal < promo.restrictions.minimum_amount) {
    return {
      valido: false,
      motivo: `Valor mínimo: R$ ${(promo.restrictions.minimum_amount / 100).toFixed(2)}`
    };
  }

  // Verificar limite de usos
  if (promo.max_redemptions && promo.times_redeemed >= promo.max_redemptions) {
    return { valido: false, motivo: 'Código esgotado' };
  }

  return { valido: true, coupon: promo.coupon };
}
```

## Exemplo (n8n) — Aplicar desconto com allow_promotion_codes

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/checkout/sessions`
4. Auth: Header Auth
5. Body: Form-Data
   - `mode`: `payment`
   - `line_items[0][price]`: `price_xxx`
   - `line_items[0][quantity]`: `1`
   - `allow_promotion_codes`: `true`
   - `success_url`: `https://seudominio.com/sucesso`
   - `cancel_url`: `https://seudominio.com/carrinho`

O Stripe exibe automaticamente o campo de cupom no checkout. O cliente digita e o Stripe valida.
