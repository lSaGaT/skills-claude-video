# Stripe Connect — Marketplace / Plataforma com Sellers

> **Este é o recurso mais importante se você quer criar um "shopping" / marketplace onde terceiros vendem e você ganha uma porcentagem.**

O Stripe Connect permite que sua plataforma:
1. Cadastre **sellers (vendedores/terceiros)** como "contas conectadas"
2. Receba **pagamentos dos clientes finais** em nome dos sellers
3. Retire automaticamente sua **comissão (percentual ou fixa)** de cada venda
4. Repasse o líquido para a conta do seller

## Escolha o tipo de conta conectada

| Tipo | Onboarding | Dashboard próprio | Melhor para |
|---|---|---|---|
| **Standard** | Stripe gerencia (redirect) | Seller vê dashboard Stripe | Marketplaces que não querem suporte de onboarding |
| **Express** | Stripe gerencia onboarding simplificado | Dashboard Stripe simplificado | Equilíbrio entre controle e facilidade |
| **Custom** | Você constrói o formulário (white-label) | Você controla toda UI | Controle total da experiência, requer PCI |

**Recomendação para maioria dos marketplaces:** **Express** — fácil onboarding, Stripe cuida da parte chata (verificação KYC), e você tem controle sobre a experiência.

## Fluxo completo (passo a passo)

### 1. Criar Conta Conectada (seller)

`POST /v1/accounts`

```json
{
  "type": "express",
  "country": "BR",
  "email": "seller@example.com",
  "business_type": "individual",
  "capabilities": {
    "transfers": { "requested": true }
  },
  "metadata": {
    "seller_name": "João Vendedor",
    "platform_seller_id": "seller_123"
  }
}
```

Tipos de conta: `standard`, `express`, `custom`

Países comuns: `BR` (Brasil), `US`, `MX`, `CO`, `AR`

### 2. Criar Link de Onboarding (para o seller completar cadastro)

`POST /v1/account_links`

```json
{
  "account": "acct_connected_id",
  "refresh_url": "https://seudominio.com/onboarding/refresh",
  "return_url": "https://seudominio.com/onboarding/complete",
  "type": "account_onboarding"
}
```

Retorna uma URL. Redirecione o seller para essa URL para ele:
- Preencher dados pessoais/fiscais
- Enviar documentos (CPF/CNPJ, comprovante de endereço)
- Vincular conta bancária para receber os pagamentos

**Eventos de webhook para acompanhar:**
- `account.updated` — dispara quando o status do onboarding muda
- `account.application.authorized` — seller autorizou sua plataforma
- `account.application.deauthorized` — seller revogou acesso

### 3. Receber Pagamento com Split (Destination Charge)

**Modelo recomendado para marketplaces.** O cliente paga o valor total, e o Stripe divide automaticamente entre plataforma e seller.

`POST /v1/payment_intents`

```json
{
  "amount": 10000,
  "currency": "brl",
  "customer": "cus_xxx",
  "application_fee_amount": 1500,
  "transfer_data": {
    "destination": "acct_connected_id"
  },
  "description": "Pedido #456 - Loja do João",
  "metadata": {
    "seller_id": "seller_123",
    "order_id": "456"
  },
  "confirm": true,
  "payment_method": "pm_xxx"
}
```

**O que acontece:**
- Cliente paga **R$ 100,00**
- **R$ 15,00** vai para sua plataforma (application_fee)
- **R$ 85,00** vai para o seller (transferência automática)
- As taxas do Stripe (~2-4%) são descontadas do seller (padrão) ou da plataforma (configurável em `on_behalf_of`)

### 4. Calcular Porcentagem na Sua Aplicação

O Stripe não aceita porcentagem diretamente no `application_fee_amount`. Você precisa **calcular o valor fixo** baseado na porcentagem:

```typescript
function calcularComissao(
  valorTotalCentavos: number,
  percentualPlataforma: number // ex: 15 = 15%
): number {
  return Math.round(valorTotalCentavos * (percentualPlataforma / 100));
}

// Exemplo: R$ 100,00 com 15% de comissão
const fee = calcularComissao(10000, 15); // = 1500 (R$ 15,00)

const paymentIntent = await stripe.paymentIntents.create({
  amount: totalCentavos,
  currency: 'brl',
  application_fee_amount: fee,
  transfer_data: { destination: sellerAccountId },
});
```

Se quiser calcular o **líquido do seller**:

```typescript
function calcularLiquidoSeller(
  valorTotalCentavos: number,
  percentualPlataforma: number
): number {
  return valorTotalCentavos - calcularComissao(valorTotalCentavos, percentualPlataforma);
}
```

### 5. Modelo Alternativo: Separate Charge and Transfer

Use quando você precisa cobrar o cliente **antes** de saber qual seller vai atender (ex: pedido é distribuído depois).

```typescript
// 1. Criar PaymentIntent sem transfer_data
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000,
  currency: 'brl',
  customer: 'cus_xxx',
});

// 2. Depois transferir para o seller manualmente
const transfer = await stripe.transfers.create({
  amount: 8500, // líquido do seller
  currency: 'brl',
  destination: 'acct_connected_id',
  transfer_group: paymentIntent.id,
  metadata: {
    order_id: '456',
    fee_amount: '1500'
  },
});
```

### 6. Transferências e Saques (Payouts)

#### Transferir para conta conectada manualmente

`POST /v1/transfers`

```json
{
  "amount": 8500,
  "currency": "brl",
  "destination": "acct_connected_id",
  "description": "Repasse pedido #456"
}
```

#### Criar payout (saque para conta bancária do seller)

Pode ser feito **pela conta conectada** (se for Express/Standard com dashboard) ou **pela sua plataforma** agindo em nome do seller:

```typescript
// Agindo em nome da conta conectada
const payout = await stripe.payouts.create(
  {
    amount: 50000,
    currency: 'brl',
    metadata: { seller_id: 'seller_123' },
  },
  { stripeAccount: 'acct_connected_id' }
);
```

### 7. Verificar Status de Saques

`GET /v1/payouts?destination=acct_connected_id`

### 8. Estornos (Refunds) em Marketplace

```typescript
// Estorno com reversão da transferência
await stripe.refunds.create({
  payment_intent: 'pi_xxx',
  reverse_transfer: true, // puxa dinheiro de volta do seller
  refund_application_fee: true, // devolve a comissão
});
```

- `reverse_transfer: false` → estorno sai do **saldo da plataforma** (seller não é afetado)
- `reverse_transfer: true` → estorno sai do **saldo do seller** (se ele tiver saldo)
- `refund_application_fee: true` → devolve a comissão que você ganhou

## Calculadora de Comissão

| Total (R$) | Sua % | Sua comissão | Seller recebe | Taxa Stripe (ex: 3%) |
|---|---|---|---|---|
| 100,00 | 10% | 10,00 | 90,00 | ~3,00 (do seller) |
| 100,00 | 15% | 15,00 | 85,00 | ~3,00 (do seller) |
| 100,00 | 20% | 20,00 | 80,00 | ~3,00 (do seller) |
| 50,00 | 15% | 7,50 | 42,50 | ~1,50 (do seller) |

## Configuração de Taxas Stripe no Connect

Por padrão, as taxas do Stripe são deduzidas do **seller** (conta conectada). Para que a **plataforma** assuma as taxas:

```json
// No PaymentIntent
{
  "amount": 10000,
  "currency": "brl",
  "application_fee_amount": 1500,
  "transfer_data": {
    "destination": "acct_xxx"
  },
  "on_behalf_of": "acct_xxx"
}
```

Com `on_behalf_of`, as taxas saem da conta da plataforma, e o seller recebe o valor líquido cheio.

## Webhooks do Connect

| Evento | Quando | O que fazer |
|---|---|---|
| `account.updated` | Status do onboarding mudou | Atualizar status do seller no seu banco |
| `account.application.authorized` | Seller autorizou sua plataforma | Marcar como ativo |
| `account.application.deauthorized` | Seller revogou acesso | Desativar seller |
| `payout.paid` | Saque foi enviado | Notificar seller |
| `payout.failed` | Saque falhou (dados bancários errados) | Notificar seller para corrigir |
| `transfer.created` | Transferência criada | Registrar no financeiro |
| `transfer.failed` | Transferência falhou | Logar erro |

## Exemplo (n8n) — Criar Account + Onboarding Link

**Passo 1 — Criar conta conectada:**
1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/accounts`
4. Auth: Header Auth
5. Body: Form-Data
   - `type`: `express`
   - `country`: `BR`
   - `email`: `{{$json.email}}`
   - `capabilities[transfers][requested]`: `true`

**Passo 2 — Criar link de onboarding:**
1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/account_links`
4. Auth: Header Auth
5. Body: Form-Data
   - `account`: `{{$json.id}}`
   - `refresh_url`: `https://seudominio.com/refresh`
   - `return_url`: `https://seudominio.com/sucesso`
   - `type`: `account_onboarding`
6. Output: pegar a `url` e redirecionar o seller

## Exemplo (n8n) — PaymentIntent com Split

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/payment_intents`
4. Auth: Header Auth
5. Body: Form-Data
   - `amount`: `{{$json.totalCentavos}}`
   - `currency`: `brl`
   - `customer`: `{{$json.customerId}}`
   - `application_fee_amount`: `{{$json.fee}}`
   - `transfer_data[destination]`: `{{$json.sellerAccountId}}`
   - `description`: `Pedido marketplace`
   - `confirm`: `true`
   - `payment_method`: `{{$json.paymentMethodId}}`

## Erros comuns no Connect

- **`account` não tem `transfers` habilitada**: o seller não completou o onboarding ou não solicitou a capability. Verifique `capabilities[transfers][requested]` na criação e acompanhe `account.updated`.
- **`application_fee_amount` maior que o total**: o Stripe rejeita. Calcule corretamente.
- **`destination` inválido**: a conta conectada não existe ou foi desativada.
- **Transferência falha por saldo insuficiente**: o seller pode não ter saldo disponível. Stripe impede transferências negativas.
- **Payout falha por dados bancários errados**: comum no onboarding inicial. Stripe notifica via webhook `payout.failed`.
