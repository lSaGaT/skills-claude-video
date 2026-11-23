# Pix (Brasil)

O Stripe **suporta Pix no Brasil** — pagamento instantâneo do Banco Central. O cliente paga via QR Code, e o dinheiro cai na hora (em segundos).

> **Disponibilidade:** Disponível para contas Stripe no Brasil e também para contas internacionais que vendem para clientes brasileiros.

## Habilitar Pix

1. Stripe Dashboard → Settings → Payment methods
2. Buscar "Pix" e ativar
3. Pronto — está disponível no Checkout e Elements

## Aceitar Pix via Checkout (recomendado)

Ative Pix no Dashboard e ele aparece automaticamente como opção no Checkout. **Não precisa de código extra.**

```json
{
  "mode": "payment",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "payment_method_types": ["card", "pix"], // opcional
  "success_url": "https://seudominio.com/sucesso",
  "cancel_url": "https://seudominio.com/carrinho"
}
```

## Aceitar Pix via PaymentIntent (API Direta)

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // R$ 50,00 em centavos
  currency: 'brl', // OBRIGATÓRIO: Pix só funciona em BRL
  payment_method_types: ['pix'],
  metadata: {
    order_id: '12345'
  },
});
```

### Confirmar e obter QR Code

```typescript
// 1. Criar PaymentIntent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'brl',
  payment_method_types: ['pix'],
});

// 2. Confirmar (se tiver os dados prontos)
await stripe.paymentIntents.confirm(paymentIntent.id, {
  payment_method: 'pm_xxx', // ou criar na hora
});

// 3. Recuperar os detalhes do Pix (QR Code)
const intent = await stripe.paymentIntents.retrieve(paymentIntent.id);
const pix = intent.next_action?.pix_display_qr_code;

console.log({
  qrCode: pix?.image_url_png,       // URL da imagem do QR Code
  qrCodeData: pix?.data,            // Código copia-e-colas
  expiresAt: pix?.expires_at,       // Timestamp de expiração
});
```

**Importante:** Pix é assíncrono. O cliente precisa escanear o QR Code e pagar no app do banco. Você precisa de webhook para saber quando o pagamento foi confirmado.

## Pix Automático (Recorrente)

O Stripe suporta **Pix Automático** para cobranças recorrentes. O cliente autoriza um **mandato** (autorização) no banco, e você pode cobrar todo mês.

### Fluxo

1. **Criar SetupIntent** ou **Checkout em modo `setup`** para coletar autorização do cliente
2. Cliente autoriza o mandato no banco
3. Stripe salva o `payment_method` do tipo `pix`
4. Você usa esse `payment_method` para criar PaymentIntents futuros

```typescript
// Passo 1: Criar SetupIntent para Pix Automático
const setupIntent = await stripe.setupIntents.create({
  payment_method_types: ['pix'],
  metadata: {
    customer_id: 'cus_xxx',
  },
});

// Passo 2: Cliente autoriza (via link do Stripe)
// Retorna client_secret para usar no front-end

// Passo 3: Depois de autorizado, criar pagamento recorrente
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'brl',
  customer: 'cus_xxx',
  payment_method: 'pm_xxx', // método Pix autorizado
  off_session: true, // cobrar sem interação do cliente
  confirm: true,
});
```

### Via Checkout (mais fácil)

```json
{
  "mode": "setup",
  "payment_method_types": ["pix"],
  "success_url": "https://seudominio.com/sucesso",
  "cancel_url": "https://seudominio.com/carrinho",
  "metadata": {
    "customer_id": "cus_xxx"
  }
}
```

## Expiração do QR Code

Por padrão, o QR Code Pix expira em **4 horas**. Você pode customizar:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'brl',
  payment_method_types: ['pix'],
  payment_method_options: {
    pix: {
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    },
  },
});
```

Ou em segundos:

```json
{
  "payment_method_options": {
    "pix": {
      "expires_after_seconds": 1800 // 30 minutos
    }
  }
}
```

Mínimo: 10 segundos. Máximo: 3 dias (259.200 segundos).

## Webhooks do Pix

```typescript
switch (event.type) {
  case 'payment_intent.succeeded': {
    // Pix pago com sucesso!
    const pix = event.data.object;
    // Liberar pedido
    break;
  }
  case 'payment_intent.payment_failed': {
    // Pix expirou ou falha na autorização
    break;
  }
  case 'payment_intent.processing': {
    // Pix está pendente (QR Code gerado, aguardando pagamento)
    break;
  }
}
```

Para Pix, preste atenção especial:
- `payment_intent.succeeded` = Pix confirmado e dinheiro na conta ✅
- `payment_intent.payment_failed` = Pix expirou sem pagamento ❌
- **Checkout**: além dos eventos acima, ouça `checkout.session.async_payment_succeeded` e `checkout.session.async_payment_failed`

## IOF para Contas Internacionais

Se sua conta Stripe **não é brasileira** e você vende para clientes no Brasil, o Stripe aplica **IOF de 3,5%** automaticamente.

Por padrão, o IOF é **repassado ao cliente** (o valor que o cliente vê já inclui o IOF). Para absorver o custo:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'brl',
  payment_method_types: ['pix'],
  payment_method_options: {
    pix: {
      amount_includes_iof: 'always', // absorve IOF (sai do seu líquido)
    },
  },
});
```

## Testar Pix

Em **modo teste**, você pode simular Pix com emails especiais:

| Email (colocar no campo de email do cliente) | Resultado |
|---|---|
| `qualquer-coisa@example.com` | Pagamento confirma em 3 segundos |
| `qualquer-coisa@example.com?delay=60` | Pagamento confirma em 60 segundos |
| `qualquer-coisa@example.com?expire=1` | Pix expira sem pagamento |

## Exemplo (n8n) — Criar cobrança Pix via API

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/payment_intents`
4. Auth: Header Auth
5. Body: Form-Data
   - `amount`: `5000`
   - `currency`: `brl`
   - `payment_method_types[0]`: `pix`
   - `metadata[order_id]`: `{{$json.orderId}}`

6. Depois de criar, usar outro HTTP Request para recuperar:
   - `GET /v1/payment_intents/{{$json.id}}`
   - Extrair `next_action.pix_display_qr_code.image_url_png` ou `data`
