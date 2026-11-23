# Pix

## Pix em uma cobrança já criada
`billingType: "PIX"` ao criar a cobrança (ver `payments.md`), depois `GET /v3/payments/{id}/pixQrCode` pra pegar o QR dinâmico.

## Chaves Pix da conta
- `POST /v3/pix/addressKeys` — cria uma chave Pix pra sua conta Asaas
- `GET /v3/pix/addressKeys` — lista chaves
- `GET /v3/pix/addressKeys/{id}` — recupera uma
- `DELETE /v3/pix/addressKeys/{id}` — remove

## QR Code estático (valor livre, reaproveitável)
- `POST /v3/pix/qrCodes/static` — cria QR fixo (ex: pra colocar num totem, cartão de visita)
- `DELETE /v3/pix/qrCodes/static/{id}`

## Consultar chave Pix de terceiros
`POST /v3/pix/keys/{key}` — retorna dados do titular de uma chave Pix (usado antes de fazer uma transferência).

## Pagar um QR Code (transferência via Pix Copia-e-Cola)
`POST /v3/pix/qrCodes/decode` — decodifica um QR Code recebido
`POST /v3/pix/qrCodes/pay` — efetiva o pagamento do QR decodificado

## Pix Automático vs Pix Recorrente — não confundir
- **Pix Recorrente**: parecido com assinatura, mas usa o trilho de recorrência do próprio Pix. Menos controle de retry.
- **Pix Automático**: fluxo de autorização mais robusto (o cliente autoriza uma vez, você dispara instruções de pagamento depois), pensado pra substituir cartão em assinaturas. Endpoints em `/v3/pixAutomatico/*` — se o Lucas for implementar isso, vale puxar a doc oficial (`https://docs.asaas.com/docs/automatic-pix-1`) porque o fluxo tem várias etapas de autorização.

## Webhooks específicos de Pix
Eventos de pagamento Pix chegam como `PAYMENT_RECEIVED` / `PAYMENT_CONFIRMED` igual qualquer outra cobrança — não tem evento "PIX_RECEIVED" separado.
