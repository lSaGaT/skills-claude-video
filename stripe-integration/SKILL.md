---
name: stripe-integration
description: Especialista em integrar com a API do Stripe (gateway de pagamentos global) — Checkout (página hospedada), pagamentos únicos, assinaturas, clientes, produtos/preços, cupons de desconto, Pix (Brasil), pagamentos com cripto (USDC), webhooks e especialmente Stripe Connect (marketplace/plataforma com pagamentos de terceiros). Cobre criação de contas conectadas, taxas de aplicação (application_fee_amount), Destination Charges e split de pagamentos entre plataforma e sellers. Use sempre que o usuário pedir para criar, integrar, debugar ou escrever código que fale com o Stripe, seja via n8n (HTTP Request node) ou TypeScript/Node — mesmo que ele não diga "Stripe API" explicitamente, só mencione pagamento internacional, marketplace, Pix, cripto, cupom de desconto, checkout, connected account ou split de pagamento nesse contexto.
---

# Stripe — Integração via API

Skill completa para escrever código de integração com a API do Stripe. Documentação oficial: https://docs.stripe.com/api — sempre que precisar confirmar um payload exato ou endpoint não coberto aqui, use web_fetch nessa doc antes de inventar campos.

## Antes de escrever qualquer código

1. Pergunte (ou confirme pelo contexto) se é **Test Mode** ou **Live Mode** — muda a chave de API (`sk_test_` vs `sk_live_`).
2. Pergunte que stack: **n8n** (HTTP Request node) ou **TypeScript/Node** direto.
3. Identifique o recurso desejado e veja o arquivo correspondente em `references/`.

## Autenticação

- Header obrigatório: `Authorization: Bearer <SECRET_KEY>`
- **Test Mode**: `sk_test_...` — cartões de teste funcionam (ver tabela em `references/payments.md`)
- **Live Mode**: `sk_live_...` — dinheiro real
- **Publishable key** (`pk_...`): usada no front-end (Stripe.js), NÃO é secreta
- A chave secreta nunca deve ser exposta no front-end, logs ou commits. Em n8n, usar Credentials (Header Auth); em Node, `process.env.STRIPE_SECRET_KEY`.
- Para agir em nome de uma conta conectada (Stripe Connect), adicione o header `Stripe-Account: {{CONNECTED_ACCOUNT_ID}}`

## Padrão usando a lib oficial (TypeScript/Node — recomendado)

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Pagamento simples
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // R$ 20,00 em centavos
  currency: 'brl',
  customer: 'cus_xxx',
  payment_method: 'pm_xxx',
  confirm: true,
});

// Com Connect (marketplace)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000,
  currency: 'brl',
  application_fee_amount: 1000, // R$ 10,00 de comissão
  transfer_data: { destination: 'acct_xxx' },
});
```

## Padrão estático (fetch puro)

```typescript
const STRIPE_BASE_URL = 'https://api.stripe.com/v1';

async function stripeRequest<T>(
  method: string,
  path: string,
  data?: Record<string, any>,
  options?: { stripeAccount?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (options?.stripeAccount) headers['Stripe-Account'] = options.stripeAccount;

  const body = data ? new URLSearchParams(data).toString() : undefined;
  const res = await fetch(`${STRIPE_BASE_URL}${path}`, { method, headers, body });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(`Stripe API error ${res.status}: ${JSON.stringify(error)}`);
  }
  return res.json();
}
```

## Mapa completo de recursos — ver references/

### Pagamentos e Checkout

| Recurso | Arquivo | Quando usar |
|---|---|---|
| **Checkout (página hospedada)** | `references/checkout.md` | **Recomendado** — página pronta do Stripe, sem precisar montar UI, com suporte a cupom, Pix, cripto, etc |
| **Checkout Embedded** | `references/checkout.md` | Checkout incorporado direto na sua página com Stripe.js |
| **Pagamentos (PaymentIntent)** | `references/payments.md` | API direta para cobranças, estornos, captura manual, cartões de teste |
| **Pix (Brasil)** | `references/pix.md` | Pagamento instantâneo brasileiro via Stripe, QR Code, Pix Automático (recorrente) |
| **Cripto (USDC)** | `references/crypto.md` | Pagamentos com stablecoins (Ethereum, Solana, Polygon, Base) |

### Clientes, Produtos e Assinaturas

| Recurso | Arquivo | Quando usar |
|---|---|---|
| **Clientes** | `references/customers.md` | Armazenar dados, métodos de pagamento reutilizáveis |
| **Produtos e Preços** | `references/products.md` | Catálogo de produtos e preços avulso/recorrentes |
| **Assinaturas** | `references/subscriptions.md` | Cobrança recorrente, trial, múltiplos itens |

### Cupons e Descontos

| Recurso | Arquivo | Quando usar |
|---|---|---|
| **Cupons (%)** | `references/coupons.md` | Cupom percentual, valor fixo, duração (once/forever/repeating) |
| **Códigos Promocionais** | `references/coupons.md` | Código que cliente digita (ex: `PROMO10`), com limite de uso, expiração, valor mínimo |
| **Desconto no Checkout** | `references/coupons.md` | `allow_promotion_codes: true` ou `discounts: [{ coupon: "..." }]` |
| **Desconto em Assinatura** | `references/coupons.md` | Aplicar coupon direto na subscription |

### Marketplace / Connect

| Recurso | Arquivo | Quando usar |
|---|---|---|
| **Connect (Marketplace)** | `references/connect.md` | **Criar marketplace com sellers**: onboarding, destination charges, application_fee, split de pagamento, payouts, refunds |
| **Connect no Checkout** | `references/checkout.md` | Checkout com `payment_intent_data.transfer_data.destination` |

### Webhooks

| Recurso | Arquivo | Quando usar |
|---|---|---|
| **Webhooks** | `references/webhooks.md` | Verificação de assinatura, eventos de pagamento, Connect, assinaturas, checkout |

## Stripe Connect — Marketplace / Plataforma com Terceiros

Este é o principal diferencial do Stripe. Permite criar uma **plataforma (marketplace)** onde:

1. **Sellers** se cadastram via onboarding
2. **Clientes compram** dos sellers na sua plataforma
3. **Você ganha porcentagem** de cada venda (`application_fee_amount`)
4. **Stripe divide** o dinheiro automaticamente

**Fluxo completo em `references/connect.md`.**

## Stripe Checkout vs PaymentIntent

| Aspecto | Checkout (recomendado) | PaymentIntent (custom) |
|---|---|---|
| UI | Pronta (Stripe hospeda) | Você constrói |
| PCI Compliance | Stripe lida | Você precisa |
| Cupons | Nativo (`allow_promotion_codes`) | Manual |
| Pix / Cripto | Automático se habilitado | Manual (`payment_method_types`) |
| Customização | Limitada (campos, tema) | Total |
| Tempo de implementação | Horas | Dias |

**Regra geral:** Use **Checkout** sempre que possível. Só use PaymentIntent + Elements se precisar de um design totalmente customizado.

## Erros e gotchas mais comuns

- **400 `amount must be at least 50 cents`**: Stripe não aceita valores abaixo de R$ 0,50. Sempre validar.
- **`application_fee_amount` maior que o total**: Stripe rejeita. Calcule corretamente.
- **Content-Type**: Stripe espera `application/x-www-form-urlencoded`, não JSON!
- **Valores sempre em centavos**: R$ 10,00 = `1000`. R$ 10,50 = `1050`.
- **Idempotency Key**: use o header `Idempotency-Key` em POST para evitar duplicatas em retry.
- **Webhook precisa de verificação**: sempre validar `stripe-signature` com o `webhookSecret`.
- **Pix é assíncrono**: `checkout.session.completed` dispara antes do pagamento confirmar. Use `checkout.session.async_payment_succeeded`.
- **Conta conectada precisa de onboarding completo**: se o seller não completar, `transfer_data[destination]` falha.
- **Cripto é irreversível**: não tem estorno. Faça reembolso manual.
