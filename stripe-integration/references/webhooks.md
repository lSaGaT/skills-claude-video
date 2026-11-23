# Webhooks

O Stripe envia eventos assíncronos via webhook sempre que algo relevante acontece. **Você deve obrigatoriamente verificar a assinatura do webhook** para garantir que o evento veio do Stripe e não é uma requisição forjada.

## Configurar Webhook

### Pelo Dashboard (recomendado)
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://seu-dominio.com/webhook/stripe`
3. Selecionar eventos
4. Obter o **Signing Secret** (`whsec_xxx`) — salve como variável de ambiente

### Pela API

`POST /v1/webhook_endpoints`

```json
{
  "url": "https://seudominio.com/webhook/stripe",
  "enabled_events": [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "customer.subscription.created",
    "invoice.paid"
  ],
  "api_version": "2024-12-18",
  "description": "Webhook principal do marketplace"
}
```

## Verificar Assinatura do Webhook

Essa é **a etapa mais importante** e a mais esquecida. Sem verificação, qualquer um pode forjar eventos.

### TypeScript

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Em um endpoint POST /webhook/stripe
async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const body = await req.text(); // raw body — IMPORTANTE: não usar JSON.parse ainda

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar o evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Atualizar pedido no banco
      break;

    case 'payment_intent.payment_failed':
      // Notificar cliente
      break;

    case 'account.updated':
      const account = event.data.object;
      // Atualizar status do seller
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.json({ received: true });
}
```

### n8n

No n8n você precisa de um **Webhook Response node** + **Code node** para verificar a assinatura:

1. **Webhook node**: Response mode = `Response Headers`, para poder devolver 200 rápido
2. **Code node**: Verificar assinatura (Stripe manda o raw body no header ou você pega via express)
3. Depois processar o evento

> **Nota:** No n8n, a verificação de assinatura do Stripe é mais complicada porque o n8n transforma o body. A melhor prática é usar uma função no Code node que reconstrói o body raw. Alternativa: usar o Stripe CLI para encaminhar eventos localmente.

## Eventos mais usados

### Pagamentos

| Evento | Quando dispara |
|---|---|
| `payment_intent.created` | PaymentIntent criado |
| `payment_intent.succeeded` | Pagamento confirmado com sucesso |
| `payment_intent.payment_failed` | Pagamento falhou |
| `payment_intent.canceled` | PaymentIntent cancelado |
| `charge.refunded` | Estorno processado |

### Assinaturas

| Evento | Quando dispara |
|---|---|
| `customer.subscription.created` | Assinatura criada |
| `customer.subscription.updated` | Assinatura atualizada |
| `customer.subscription.deleted` | Assinatura cancelada |
| `invoice.paid` | Fatura paga |
| `invoice.payment_failed` | Fatura não paga |
| `invoice.finalized` | Fatura finalizada (pronta para cobrança) |

### Connect / Marketplace

| Evento | Quando dispara |
|---|---|
| `account.updated` | Dados do seller atualizados (onboarding, etc.) |
| `account.application.authorized` | Seller autorizou sua plataforma |
| `account.application.deauthorized` | Seller revogou acesso |
| `payout.paid` | Saque foi pago (seller recebeu) |
| `payout.failed` | Saque falhou (dados bancários errados) |
| `transfer.created` | Transferência criada |
| `transfer.failed` | Transferência falhou |

### Clientes

| Evento | Quando dispara |
|---|---|
| `customer.created` | Cliente criado |
| `customer.updated` | Cliente atualizado |
| `customer.deleted` | Cliente deletado |
| `payment_method.attached` | Método de pagamento vinculado |

## Idempotência

O Stripe pode reenviar o mesmo evento. Sempre trate seu handler como idempotente:

```typescript
// Verificar se já processou este evento
const alreadyProcessed = await db.query(
  'SELECT id FROM processed_events WHERE stripe_event_id = ?',
  [event.id]
);
if (alreadyProcessed) return res.json({ received: true }); // ignorar duplicata

// Processar...
await db.insert('processed_events', { stripe_event_id: event.id });
```

## Stripe CLI (testar webhooks localmente)

Para testar webhooks sem expor seu servidor:

```bash
# Instalar: https://stripe.com/docs/stripe-cli
stripe login

# Escutar eventos e encaminhar para seu localhost
stripe listen --forward-to localhost:3000/webhook/stripe

# Disparar evento de teste
stripe trigger payment_intent.succeeded
```

## Boas práticas

1. **Sempre verificar a assinatura** (`stripe-signature`)
2. **Responder 200 rápido** — se a lógica for pesada, processe assíncrono (fila)
3. **Usar idempotência** — mesmo evento pode chegar mais de uma vez
4. **Logar eventos não esperados** — útil para debugging
5. **Não confiar só no webhook** — ter uma reconciliação diária (ex: listar PaymentIntents do dia e comparar com seu banco de dados)
