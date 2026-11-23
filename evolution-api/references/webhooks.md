# Webhooks e Eventos

## Configurar webhook por instância
`POST /webhook/set/{instance}`
```json
{
  "url": "https://seu-n8n.com/webhook/whatsapp",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": ["MESSAGES_UPSERT", "CONNECTION_UPDATE", "SEND_MESSAGE"]
}
```
- `webhook_by_events: true` faz a Evolution acrescentar o nome do evento no fim da URL (ex: `.../whatsapp/messages-upsert`) — útil se quiser separar triggers diferentes no n8n por webhook node.
- `webhook_base64: true` manda mídia recebida já em base64 no payload, em vez de só a URL temporária.

## Buscar webhook configurado
`GET /webhook/find/{instance}`

## Webhook global (via .env do servidor, não por API)
```bash
WEBHOOK_GLOBAL_URL=''
WEBHOOK_GLOBAL_ENABLED=false
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true
```
Dispara pra todas as instâncias do servidor. Normalmente prefira webhook por instância (mais fácil de rotear no n8n por cliente/projeto).

## Eventos suportados

| Evento | Dispara quando |
|---|---|
| `APPLICATION_STARTUP` | Servidor Evolution inicializa |
| `QRCODE_UPDATED` | Novo QR Code gerado |
| `CONNECTION_UPDATE` | Status da conexão muda (open/close/connecting) — **acompanhe sempre esse pra saber se a sessão realmente conectou** |
| `MESSAGES_UPSERT` | Mensagem recebida (o principal pra triggar um bot) |
| `MESSAGES_UPDATE` | Mensagem atualizada (ex: editada) |
| `MESSAGES_DELETE` | Mensagem apagada |
| `SEND_MESSAGE` | Confirmação de que uma mensagem SUA foi enviada |
| `CONTACTS_SET` / `CONTACTS_UPSERT` / `CONTACTS_UPDATE` | Sincronização de contatos |
| `PRESENCE_UPDATE` | Contato ficou online/digitando/gravando |
| `CHATS_SET` / `CHATS_UPDATE` / `CHATS_UPSERT` / `CHATS_DELETE` | Mudanças na lista de conversas |
| `GROUPS_UPSERT` / `GROUPS_UPDATE` | Grupo criado ou atualizado |
| `GROUP_PARTICIPANTS_UPDATE` | Participante entrou/saiu/foi promovido/rebaixado em um grupo |
| `NEW_TOKEN` | Token JWT da instância foi renovado |

## Payload de MESSAGES_UPSERT — o que checar primeiro no n8n
- `data.key.fromMe` — se `true`, é uma mensagem que você mesmo mandou (ignore no fluxo de resposta automática, senão o bot responde a si mesmo).
- `data.key.remoteJid` — identifica o contato/grupo.
- `data.message.conversation` (texto simples) ou `data.message.extendedTextMessage.text` (texto com preview de link/citação) — o campo de texto muda conforme o tipo, sempre cheque os dois.
- Use um node "Test Execution" no n8n pra inspecionar o payload real antes de montar a lógica — o JSON aninhado varia bastante por tipo de mensagem (texto, áudio, imagem).

## Responder rápido é obrigatório
A Evolution espera 200 OK do seu endpoint de webhook rapidamente. Se a lógica de resposta for pesada (chamar LLM, consultar banco), responda 200 primeiro e processe assíncrono — do contrário a Evolution pode re-tentar ou acumular atraso.
