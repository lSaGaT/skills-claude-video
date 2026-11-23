# Produtos e Preços (Products & Prices)

O Stripe usa um modelo de dois níveis: **Product** (o que está sendo vendido) e **Price** (quanto custa e de que forma). Um produto pode ter vários preços (ex: mensal, anual, promocional).

## Criar Produto

`POST /v1/products`

```json
{
  "name": "Camiseta Preta",
  "description": "Camiseta 100% algodão, tamanho G",
  "images": ["https://seusite.com/camiseta.jpg"],
  "metadata": {
    "seller_id": "seller_123",
    "sku": "CAM-PRT-G"
  },
  "active": true
}
```

## Criar Preço (avulso — pagamento único)

`POST /v1/prices`

```json
{
  "product": "prod_xxx",
  "unit_amount": 5000,
  "currency": "brl",
  "metadata": {
    "seller_percent": "85"
  }
}
```

## Criar Preço (recorrente — assinatura)

```json
{
  "product": "prod_xxx",
  "unit_amount": 2990,
  "currency": "brl",
  "recurring": {
    "interval": "month",
    "interval_count": 1
  }
}
```

`interval`: `day`, `week`, `month`, `year`
`interval_count`: quantas unidades do intervalo (ex: `interval: month`, `interval_count: 3` = trimestral)

## Preço com tier (por volume)

```json
{
  "product": "prod_xxx",
  "currency": "brl",
  "billing_scheme": "tiered",
  "tiers": [
    { "up_to": 100, "unit_amount": 1000 },
    { "up_to": 1000, "unit_amount": 800 },
    { "up_to": "inf", "unit_amount": 500 }
  ],
  "tiers_mode": "graduated"
}
```

## Criar Produto + Preço inline (tudo de uma vez)

Se você não tem um Product ID ainda, pode criar o produto junto com o preço:

```json
{
  "unit_amount": 1990,
  "currency": "brl",
  "product_data": {
    "name": "Camiseta Azul"
  }
}
```

## Listar produtos

`GET /v1/products`

Filtros: `?active=true`, `?limit=10`, `?shippable=true`

## Listar preços de um produto

`GET /v1/prices?product=prod_xxx`

## Atualizar produto / preço

`POST /v1/products/{id}`
`POST /v1/prices/{id}`

## Preços no contexto de Marketplace

Em um marketplace, cada **seller** pode definir seus próprios preços. A abordagem depende do modelo:

- **Seu marketplace define preços**: você cria os produtos e preços na sua conta Stripe normalmente.
- **Seller define os preços**: você pode criar uma Price por seller (com metadados) ou usar o preço que o seller informa no momento da compra.

Para split automático com `application_fee_amount`, você não precisa associar % no Price — o back-end calcula a taxa na hora de criar o PaymentIntent (ver `references/connect.md`).

## Exemplo (n8n)

1. HTTP Request node
2. Method: `POST`
3. URL: `https://api.stripe.com/v1/products`
4. Auth: Header Auth
5. Body: Form-Data
   - `name`: Camiseta Preta
   - `description`: Camiseta 100% algodão
