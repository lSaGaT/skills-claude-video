# Webhooks

## Como configurar
Diferente do Asaas e da Evolution API, **não existe mutation pra criar webhook via API** — o cadastro do endpoint é feito manualmente no Painel Autentique (área de desenvolvedor / chaves de API), selecionando quais eventos você quer escutar.

## Formato do evento
Toda notificação chega como POST HTTPS com JSON contendo um objeto `event`:
```json
{
  "id": "...",
  "object": "webhook",
  "name": "nome-do-endpoint-cadastrado",
  "format": "json",
  "url": "https://seu-endpoint.com/webhooks",
  "event": {
    "id": "21fbcec9-e1b5-4dca-afbb-022061e9ea88",
    "object": "event",
    "organization": 1,
    "type": "document.updated",
    "data": { "object": { /* documento, assinatura ou membro completo */ }, "previous_attributes": { /* campos que mudaram */ } },
    "created_at": "2024-08-26T18:03:27.387179Z"
  }
}
```
Pra eventos `*.updated`, `data.previous_attributes` mostra só os campos que mudaram — útil pra diffs sem precisar comparar o objeto inteiro.

## Eventos disponíveis

**Documento**
| Evento | Quando |
|---|---|
| `document.created` | Documento criado |
| `document.updated` | Documento editado (nome, configs etc.) |
| `document.deleted` | Documento removido permanentemente |
| `document.finished` | Todos os signatários completaram — **o principal evento pra saber que o contrato foi 100% assinado** |

**Assinatura**
| Evento | Quando |
|---|---|
| `signature.created` | Nova solicitação de assinatura criada pra um signatário |
| `signature.updated` | Mudança na solicitação (ex: status) |
| `signature.deleted` | Signatário pendente foi removido |
| `signature.viewed` | Signatário abriu o documento pela primeira vez |
| `signature.accepted` | Signatário assinou com sucesso |
| `signature.rejected` | Signatário recusou assinar |
| `signature.biometric_approved` / `signature.biometric_unapproved` / `signature.biometric_rejected` / `signature.biometric_reset` | Fluxo de verificação biométrica manual/automática |
| `signature.delivery_failed` | Erro ao mandar o email pro signatário |

**Membro**
| Evento | Quando |
|---|---|
| `member.created` | Novo membro entrou na organização |
| `member.deleted` | Membro removido |

## Ordem dos eventos NÃO é garantida
A criação de um documento pode disparar `document.updated`, `document.created`, `signature.created`, `signature.viewed` em qualquer ordem. Seu handler não deve assumir sequência — se receber um evento sem ter o objeto pai ainda, consulte a API pra buscar o que falta (ex: buscar o documento pelo `document.created` se ele chegou fora de ordem).

## Verificar que o evento veio mesmo do Autentique (HMAC)
Todo webhook carrega o header `x-autentique-signature`. Valide contra o secret configurado antes de processar:
```typescript
import crypto from "crypto";

function verifyAutentiqueSignature(headers: Record<string, string>, rawBody: string, secret: string): boolean {
  const signature = headers["x-autentique-signature"];
  if (!signature) return false;
  const calculated = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(calculated, "hex"), Buffer.from(signature, "hex"));
}
```
Em n8n, isso vira um node "Code" logo após o Webhook trigger, antes de qualquer lógica que mude dado no seu sistema.

## Boas práticas (iguais às do Asaas/Evolution — vale repetir)
- **Responda 200 rápido**, processe pesado de forma assíncrona.
- **Trate duplicatas**: guarde o `event.id` já processado, ou combine `data.object.id` + `event.type` como chave de idempotência — o Autentique pode reenviar o mesmo evento.
- **Escute só os eventos que precisa** — não assine tudo por padrão, sobrecarrega seu endpoint à toa.
- **Isente a rota de CSRF** se seu framework validar isso por padrão (comum em Laravel/Django/Rails) — webhook é uma chamada de servidor pra servidor, não tem sessão de usuário.

## Retry em caso de falha
Se seu endpoint não responder 2xx, o Autentique tenta reenviar até 3 vezes (depois de 60s, 120s e 300s). Se todas falharem, o evento fica disponível na lista de "webhooks que falharam" no painel por até 14 dias — dá pra consultar e reprocessar manualmente.
