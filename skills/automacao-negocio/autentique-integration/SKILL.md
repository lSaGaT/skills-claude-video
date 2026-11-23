---
name: autentique-integration
description: Especialista em integrar com a API do Autentique (plataforma brasileira de assinatura eletrônica de documentos/contratos) — criação e envio de documentos para assinatura, gerenciamento de signatários, verificações de segurança (SMS, biometria, foto de documento), webhooks de status e templates. A API é 100% GraphQL (não tem REST). Use sempre que o usuário pedir pra criar, integrar, debugar ou escrever código que fale com o Autentique, seja via n8n (HTTP Request node com body GraphQL) ou TypeScript/Node — mesmo que ele não diga "Autentique" explicitamente, só mencione assinatura de contrato, envio pra assinar, signatário, ou e-signature nesse contexto.
---

# Autentique — Integração via API (GraphQL)

Skill de integração com a API do Autentique. Doc oficial: https://docs.autentique.com.br/api — API é **exclusivamente GraphQL**, não existe REST. Se precisar de um campo ou mutation que não está coberto aqui, web_fetch a doc oficial antes de inventar.

## Antes de escrever qualquer código

1. Confirme se a operação envolve **upload de arquivo** (criar documento) — isso muda o formato da requisição pra `multipart/form-data`, todas as outras operações são JSON puro.
2. Veja o recurso em `references/`: documentos (criar/editar/consultar), signatários (adicionar/remover/reenviar/link), ou webhooks.
3. Lembre que é GraphQL: toda operação é uma `query` (leitura) ou `mutation` (escrita) enviada por `POST` pro mesmo endpoint único.

## Autenticação

- Endpoint único: `https://api.autentique.com.br/v2/graphql`
- Header: `Authorization: Bearer <API_TOKEN>` (token gerado no painel Autentique, em Chaves de API)
- Rate limit: **60 requisições por minuto**. Se estourar, a API retorna `429` com `{ "message": "Too Many Attempts." }` — em fluxos de n8n que processam lote de documentos, adicione um delay/throttle entre chamadas.

## Padrão de requisição — operações sem arquivo (JSON puro)

```typescript
const AUTENTIQUE_URL = "https://api.autentique.com.br/v2/graphql";

async function autentiqueRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(AUTENTIQUE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AUTENTIQUE_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Autentique GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}
```

## Padrão de requisição — criar documento (COM arquivo, multipart)

Criar documento é diferente: precisa mandar `multipart/form-data` seguindo o [graphql-multipart-request-spec](https://github.com/jaydenseric/graphql-multipart-request-spec), com 3 partes: `operations` (a query+variables em JSON, com `file: null`), `map` (indica qual variável recebe o arquivo) e `file` (o binário).

```typescript
import FormData from "form-data";
import fs from "fs";

async function createDocument(filePath: string, documentName: string, signerEmail: string) {
  const form = new FormData();
  const query = `
    mutation CreateDocumentMutation($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {
      createDocument(document: $document, signers: $signers, file: $file) {
        id
        name
        signatures { public_id name email link { short_link } }
      }
    }
  `;
  form.append("operations", JSON.stringify({
    query,
    variables: {
      document: { name: documentName },
      signers: [{ email: signerEmail, action: "SIGN" }],
      file: null,
    },
  }));
  form.append("map", JSON.stringify({ file: ["variables.file"] }));
  form.append("file", fs.createReadStream(filePath));

  const res = await fetch("https://api.autentique.com.br/v2/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AUTENTIQUE_API_TOKEN}`,
      ...form.getHeaders(),
    },
    body: form as any,
  });
  return res.json();
}
```

## Padrão de requisição (n8n)

- **Operações sem arquivo**: HTTP Request node, method POST, URL `https://api.autentique.com.br/v2/graphql`, Body Content Type = JSON, body = `{ "query": "...", "variables": {...} }`, header `Authorization: Bearer {{$credentials.autentiqueToken}}`.
- **Criar documento (com arquivo)**: HTTP Request node, Body Content Type = **Form-Data (multipart)**, com 3 campos: `operations` (JSON string, campo tipo texto), `map` (JSON string, campo tipo texto), `file` (campo tipo binary data, apontando pro binário recebido de um node anterior, ex: um "Read Binary File" ou o binário vindo de um HTTP Request/Google Drive anterior no fluxo).

## Mapa de recursos — ver references/

| Recurso | Arquivo | Cobre |
|---|---|---|
| Documentos | `references/documents.md` | Criar (com todas as opções), editar, consultar, remover, transferir, sandbox de testes |
| Signatários | `references/signers.md` | Ações (assinar/testemunhar/aprovar/reconhecer), métodos de envio (email/SMS/WhatsApp/link), adicionar/remover, reenviar, verificações de segurança (SMS, biometria, foto de documento) |
| Webhooks | `references/webhooks.md` | Eventos de documento/assinatura/membro, verificação HMAC, política de retry |
| Erros e limites | `references/errors-and-limits.md` | Formato de erro GraphQL, tabela de mensagens de validação, rate limit |

## Gotchas mais comuns

- **Não existe REST, só GraphQL.** Se o Lucas pedir "endpoint REST do Autentique", o certo é converter o pedido pra uma query/mutation GraphQL equivalente.
- **`signDocument` só assina como o dono do token da API** — não dá pra usar essa mutation pra simular assinatura de terceiros dentro do seu app. Serve só pra fluxos onde a própria empresa é signatária.
- **Signatário sem `email`, `phone` ou `delivery_method: LINK`** — se adicionar um signatário só com `name` (sem email/phone), o link de assinatura vem no campo `link` da resposta, e você precisa distribuir manualmente (ex: mandar você mesmo por WhatsApp via Evolution API).
- **Documento sandbox some depois de alguns dias** — bom pra testar, mas não serve como storage nem como fluxo real.
- **Listagem de documentos não deve ser usada pra polling de status.** Use webhooks — a doc é explícita sobre isso, consultar status via query repetidamente é desencorajado (e mais lento que webhook).
- **Posições de campo de assinatura (`positions`) usam % da página**, não pixels — `x`/`y` de 0 a 100, `z` é o número da página começando em 1. Pra descobrir a posição certa, é mais fácil criar um documento de exemplo pelo painel, posicionar visualmente, e depois consultar via query `document(id) { signatures { positions { x y z element } } }` pra copiar os valores.
