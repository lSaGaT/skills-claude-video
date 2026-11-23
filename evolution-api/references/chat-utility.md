# Utilitários de Chat

## Checar se número tem WhatsApp
`POST /chat/whatsappNumbers/{instance}`
```json
{ "numbers": ["5531999999999", "5531988887777"] }
```
Retorna, pra cada número, se existe (`exists: true/false`) e o JID correspondente. Rode isso antes de tentar mandar mensagem pra um número novo (ex: importado de uma planilha), evita erro silencioso em número inválido.

## Marcar mensagem como lida
`POST /chat/markMessageAsRead/{instance}`
```json
{ "readMessages": [{ "remoteJid": "5531999999999@s.whatsapp.net", "id": "ID_DA_MENSAGEM", "fromMe": false }] }
```

## Marcar mensagem como não lida
`POST /chat/markMessageAsUnread/{instance}`

## Arquivar conversa
`POST /chat/archiveChat/{instance}`
```json
{ "chat": "5531999999999@s.whatsapp.net", "archive": true }
```
