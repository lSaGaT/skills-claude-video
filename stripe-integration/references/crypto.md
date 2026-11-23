# Pagamentos com Cripto (USDC / Stablecoins)

O Stripe suporta **pagamentos com stablecoins (USDC)** desde 2024/2025. O cliente paga com cripto da carteira dele, e você **recebe em dólar (USD)** na sua conta Stripe — sem risco de volatilidade.

> **Disponibilidade:** Atualmente suporta USDC nas redes **Ethereum, Solana, Polygon e Base**. Disponível para empresas em vários países, incluindo Brasil (para receber).

## Como funciona

1. Cliente opta por pagar com cripto no checkout
2. Stripe redireciona para conectar a carteira (MetaMask, WalletConnect, etc.)
3. Cliente aprova a transação USDC na carteira
4. Stripe converte para USD e credita na sua conta
5. Você recebe webhook `payment_intent.succeeded` normalmente

**Você nunca toca no cripto** — o Stripe gerencia toda a conversão e liquidação em moeda fiduciária.

## Habilitar Cripto no Dashboard

1. Stripe Dashboard → Settings → Payment methods
2. Buscar "Stablecoins" ou "Crypto"
3. Ativar `Stablecoins and Crypto`
4. Escolher redes suportadas (Ethereum, Solana, Polygon, Base)

## Aceitar Cripto via Checkout

Ative o método no Dashboard e o Stripe mostra automaticamente a opção de cripto no Checkout. **Não precisa mudar nada no código.**

```json
{
  "mode": "payment",
  "line_items": [{ "price": "price_xxx", "quantity": 1 }],
  "payment_method_types": ["card", "pix", "usdc"], // opcional: forçar métodos
  "success_url": "...",
  "cancel_url": "..."
}
```

## Aceitar Cripto via PaymentIntent (API Direta)

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // US$ 50,00 (em centavos de USD)
  currency: 'usd',
  payment_method_types: ['usdc'],
  metadata: {
    order_id: '12345'
  },
});
```

> **Importante:** Cripto é processado em **USD**, não BRL. Se sua loja é em reais, você precisa converter o valor antes de criar o PaymentIntent.

## Cripto com Connect (Marketplace)

Para receber cripto e repassar para sellers:

```json
{
  "amount": 10000,
  "currency": "usd",
  "payment_method_types": ["usdc", "card"],
  "application_fee_amount": 1500,
  "transfer_data": {
    "destination": "acct_connected_id"
  }
}
```

## Webhooks

| Evento | Quando |
|---|---|
| `payment_intent.succeeded` | Pagamento cripto confirmado (USD creditado) |
| `payment_intent.processing` | Transação pendente na blockchain |
| `payment_intent.payment_failed` | Transação falhou (saldo insuficiente, rede congestionada) |

## Testando Cripto

Stripe fornece uma rede de testes:

1. Use **chave de teste** (`sk_test_xxx`)
2. Ative cripto no Dashboard em modo teste
3. Use carteiras de teste (ex: Polygon Amoy testnet)
4. Use faucets para obter USDC de teste

## Exemplo (n8n) — PaymentIntent com USDC

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/payment_intents`
4. Auth: Header Auth
5. Body: Form-Data
   - `amount`: `5000`
   - `currency`: `usd`
   - `payment_method_types[0]`: `usdc`
   - `confirm`: `true`

## Limitações

- **Moeda**: apenas USD (não BRL). Precisa fazer conversão no backend se sua loja for em reais
- **Redes**: Ethereum, Solana, Polygon, Base
- **Taxa**: Stripe cobra taxa adicional para transações cripto (~1.5% + taxa padrão)
- **Estorno**: não é possível estornar pagamentos cripto (blockchain é irreversível) — faça reembolso manual
- **Disponibilidade**: pode não estar disponível para todos os tipos de conta Stripe
