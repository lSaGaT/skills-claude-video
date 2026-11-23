# Clientes (Customers)

No Stripe, o objeto `Customer` serve para armazenar informações do cliente, métodos de pagamento e vincular a assinaturas. Diferente do Asaas, o Customer no Stripe **não** é obrigatório para criar um PaymentIntent avulso — você pode passar `payment_method` diretamente sem customer. Mas é **fortemente recomendado** para:
- Associar métodos de pagamento reutilizáveis
- Criar assinaturas
- Histórico de cobranças
- Stripe Connect (vincular clientes a contas conectadas)

## Criar cliente

`POST /v1/customers`

```json
{
  "name": "João da Silva",
  "email": "joao@example.com",
  "phone": "+5547999999999",
  "address": {
    "line1": "Rua Um, 100",
    "city": "São Paulo",
    "state": "SP",
    "postal_code": "01000-000",
    "country": "BR"
  },
  "description": "Cliente do marketplace",
  "metadata": {
    "user_id": "12345",
    "origin": "marketplace"
  },
  "payment_method": "pm_xxx" // opcional: vincula método de pagamento existente
}
```

## Listar clientes

`GET /v1/customers`

Filtros úteis: `?email=joao@example.com`, `?limit=10`, `?created[gte]=1234567890`

## Recuperar cliente

`GET /v1/customers/{id}`

## Atualizar cliente

`POST /v1/customers/{id}` (Stripe usa POST para updates, não PUT)

## Deletar cliente

`DELETE /v1/customers/{id}`

Retorna `{"deleted": true, "id": "..."}`.

## Métodos de pagamento do cliente

### Listar métodos de pagamento de um cliente

`GET /v1/payment_methods?customer=cus_xxx&type=card`

### Anexar método de pagamento a um cliente

`POST /v1/payment_methods/{pm_id}/attach`

```json
{
  "customer": "cus_xxx"
}
```

### Desanexar método de pagamento

`POST /v1/payment_methods/{pm_id}/detach`

## Clientes no contexto Connect (Marketplace)

No Stripe Connect, o cliente pode ser:
- **Do cliente final da sua plataforma**: criado na sua conta (plataforma), associado a um pagamento que vai para o seller.
- **Da conta conectada (seller)**: se o seller precisa receber pagamentos de seus próprios clientes, o customer pode ser criado **na conta conectada** usando o header `Stripe-Account: acct_xxx`.

```typescript
// Criar customer na conta conectada
const customer = await stripe.customers.create(
  { name: "João", email: "joao@example.com" },
  { stripeAccount: "acct_connected_id" }
);
```

## Exemplo (n8n)

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/customers`
4. Auth: Header Auth (`Authorization: Bearer {{$env.STRIPE_SECRET_KEY}}`)
5. Body: Form-Data
   - `name`: `João da Silva`
   - `email`: `joao@example.com`
