# Clientes (Customers)

Todo objeto financeiro no Asaas (cobrança, assinatura, parcelamento) pertence a um `customer`. Sempre crie ou localize o cliente antes.

## Criar cliente
`POST /v3/customers`

Campos principais:
```json
{
  "name": "João da Silva",
  "cpfCnpj": "24971563792",
  "email": "joao@example.com",
  "phone": "4738010919",
  "mobilePhone": "47999999999",
  "address": "Rua Um",
  "addressNumber": "100",
  "postalCode": "89223005",
  "externalReference": "id-no-seu-sistema"
}
```
Só `name` é obrigatório, mas `cpfCnpj` é fortemente recomendado (necessário pra boleto/Pix em muitos casos).

## Listar clientes
`GET /v3/customers`
Filtros úteis: `?cpfCnpj=`, `?email=`, `?externalReference=`, `?name=`

Use isso ANTES de criar um cliente novo pra evitar duplicar (o Asaas não bloqueia CPF/CNPJ duplicado automaticamente).

## Recuperar um único cliente
`GET /v3/customers/{id}`

## Atualizar cliente existente
`POST /v3/customers/{id}` (sim, é POST, não PUT/PATCH)

## Remover cliente
`DELETE /v3/customers/{id}`
Retorna `{ "deleted": true, "id": "..." }`. Cliente removido pode ser restaurado.

## Restaurar cliente removido
`POST /v3/customers/{id}/restore`

## Notificações de um cliente
`GET /v3/customers/{id}/notifications` — retorna as configurações de notificação (email/SMS) daquele cliente especificamente.
