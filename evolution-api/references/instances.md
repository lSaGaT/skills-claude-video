# Instâncias

## Criar instância
`POST /instance/create`

```json
{
  "instanceName": "nodoprime-cliente-x",
  "token": "opcional-token-fixo",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```
- Requer a API Key global no header `apikey`.
- Resposta traz `hash` (token da instância — guarde, é o que você usa nos endpoints de mensagem dali pra frente) e, se `qrcode: true`, o QR já no corpo da resposta.
- `integration`: `WHATSAPP-BAILEYS` (WhatsApp Web, o mais comum), `WHATSAPP-BUSINESS` (Cloud API oficial da Meta, via Evolution como camada única de integração).

## Listar instâncias
`GET /instance/fetchInstances`
Filtro opcional: `?instanceName=` pra buscar uma específica.

## Conectar / obter QR Code
`GET /instance/connect/{instance}`
Retorna o QR Code (base64) pra escanear. Use isso pra reconectar uma instância que caiu, sem precisar recriar.

## Status da conexão
`GET /instance/connectionState/{instance}`
Retorna `open` (conectado), `connecting` ou `close`. Bom pra healthcheck periódico.

## Definir presença (online/digitando)
`POST /instance/setPresence/{instance}`
```json
{ "presence": "composing" }
```
Valores: `available`, `unavailable`, `composing` (digitando...), `recording` (gravando áudio), `paused`. Útil pra simular digitação antes de responder num bot, deixa mais natural.

## Reiniciar instância
`PUT /instance/restart/{instance}`

## Logout (desconecta sessão, mantém a instância)
`DELETE /instance/logout/{instance}`
Depois disso, dá pra reconectar com `GET /instance/connect/{instance}` (novo QR Code).

## Deletar instância (irreversível)
`DELETE /instance/delete/{instance}`
Remove a instância e os dados de sessão. Se só quer desconectar temporariamente, use logout, não delete.
