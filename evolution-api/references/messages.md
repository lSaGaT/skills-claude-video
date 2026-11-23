# Envio de Mensagens

Todos os endpoints abaixo são `POST {baseUrl}/message/{ação}/{instance}`, autenticados com `apikey` (token da instância).

## Texto simples
`POST /message/sendText/{instance}`
```json
{
  "number": "5531999999999",
  "text": "Olá! Como posso ajudar?",
  "delay": 1200,
  "linkPreview": true,
  "quoted": { "key": { "id": "ID_DA_MENSAGEM_ORIGINAL" }, "message": { "conversation": "texto citado" } }
}
```
- `delay` em ms — simula tempo de digitação antes de mandar (opcional, mas deixa a conversa mais natural).
- `quoted` é opcional, pra responder citando uma mensagem específica.

## Status (story)
`POST /message/sendStatus/{instance}`
```json
{ "type": "text", "content": "Bom dia!", "backgroundColor": "#317873", "font": 2, "allContacts": true }
```
`type`: `text`, `image`, `video`, `audio`, `document`.

## Mídia (imagem, vídeo, documento)
`POST /message/sendMedia/{instance}`
```json
{
  "number": "5531999999999",
  "mediatype": "image",
  "media": "https://exemplo.com/imagem.png",
  "caption": "Legenda opcional",
  "fileName": "imagem.png"
}
```
`media` aceita URL pública ou base64 puro (sem prefixo `data:...`). `mediatype`: `image`, `video`, `document`.

## Áudio (nota de voz)
`POST /message/sendWhatsAppAudio/{instance}`
```json
{ "number": "5531999999999", "audio": "<base64_puro_do_audio>", "encoding": true }
```
Precisa ser um áudio compatível com nota de voz do WhatsApp (geralmente ogg/opus); `encoding: true` deixa a Evolution cuidar da conversão.

## Sticker
`POST /message/sendSticker/{instance}`
```json
{ "number": "5531999999999", "sticker": "https://exemplo.com/figurinha.webp" }
```

## Localização
`POST /message/sendLocation/{instance}`
```json
{ "number": "5531999999999", "latitude": -19.9245, "longitude": -43.9352, "name": "Belo Horizonte", "address": "MG" }
```

## Contato (vCard)
`POST /message/sendContact/{instance}`
```json
{ "number": "5531999999999", "contact": [{ "fullName": "Fulano", "phoneNumber": "5531988887777" }] }
```

## Reação (emoji em uma mensagem)
`POST /message/sendReaction/{instance}`
```json
{ "key": { "remoteJid": "5531999999999@s.whatsapp.net", "id": "ID_DA_MENSAGEM", "fromMe": false }, "reaction": "👍" }
```

## Enquete
`POST /message/sendPoll/{instance}`
```json
{ "number": "5531999999999", "name": "Qual seu horário preferido?", "values": ["Manhã", "Tarde", "Noite"], "selectableCount": 1 }
```

## Lista (menu interativo)
`POST /message/sendList/{instance}`
```json
{
  "number": "5531999999999",
  "title": "Cardápio",
  "description": "Escolha uma opção",
  "buttonText": "Ver opções",
  "sections": [{ "title": "Pratos", "rows": [{ "title": "Feijoada", "description": "R$ 35", "rowId": "feijoada" }] }]
}
```

## Botões
`POST /message/sendButtons/{instance}`
```json
{
  "number": "5531999999999",
  "title": "Confirmar pedido?",
  "buttons": [{ "buttonId": "sim", "buttonText": { "displayText": "Sim" } }, { "buttonId": "nao", "buttonText": { "displayText": "Não" } }]
}
```

**Nota sobre botões e listas**: no conector Baileys (WhatsApp Web, o mais usado), esse tipo de mensagem interativa tem suporte limitado e o WhatsApp vem restringindo — funciona melhor no conector Cloud API oficial da Meta. Se o bot depender pesado de botões/listas, considere migrar pra `integration: WHATSAPP-BUSINESS` na criação da instância.

## Grupo — número é o JID do grupo
Pra mandar em um grupo, `number` recebe o JID do grupo (`120363012345678901@g.us`), não existe campo `groupJid` separado — erro comum, vide issues no GitHub oficial da Evolution API.

## Padrão de resposta (sucesso)
```json
{
  "key": { "remoteJid": "553199999999@s.whatsapp.net", "fromMe": true, "id": "BAE594145F4C59B4" },
  "message": { "extendedTextMessage": { "text": "Olá!" } },
  "messageTimestamp": "1717689097",
  "status": "PENDING"
}
```
