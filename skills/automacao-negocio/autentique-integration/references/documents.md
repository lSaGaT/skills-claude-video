# Documentos

## Criar documento (createDocument)

Mutation completa (ver o padrão multipart no SKILL.md principal — essa é a única operação que precisa de upload):

```graphql
mutation CreateDocumentMutation(
  $document: DocumentInput!,
  $signers: [SignerInput!]!,
  $file: Upload!
) {
  createDocument(
    document: $document,
    signers: $signers,
    file: $file,
    organization_id: 123,   # opcional — cria em outra organização, senão usa a atual
    folder_id: "a1b2c3",    # opcional — já cria arquivado numa pasta
    sandbox: true            # opcional — documento de teste, não consome crédito (ver seção Sandbox)
  ) {
    id
    name
    refusable
    sortable
    created_at
    signatures { public_id name email created_at action { name } link { short_link } user { id name email } }
  }
}
```

Tamanho máximo do arquivo: **5MB no plano free, 20MB no profissional**.

### Campos de `document` (DocumentInput)

```json
{
  "name": "Contrato de prestação de serviço",
  "message": "Mensagem customizada enviada no email do signatário",
  "reminder": "WEEKLY",
  "sortable": true,
  "footer": "BOTTOM",
  "refusable": true,
  "qualified": true,
  "scrolling_required": true,
  "stop_on_rejected": true,
  "new_signature_style": true,
  "show_audit_page": false,
  "ignore_cpf": true,
  "ignore_birthdate": true,
  "email_template_id": 1234,
  "deadline_at": "2026-11-24T02:59:59.999Z",
  "cc": [{ "email": "financeiro@nodoprime.com.br" }],
  "expiration": { "days_before": 7, "notify_at": "20/01/2027" },
  "configs": {
    "notification_finished": true,
    "notification_signed": true,
    "signature_appearance": "ELETRONIC",
    "keep_metadata": true,
    "lock_user_data": true
  },
  "locale": { "country": "BR", "language": "pt-BR", "timezone": "America/Sao_Paulo", "date_format": "DD_MM_YYYY" }
}
```

Principais campos, tradução rápida:
- `sortable: true` — signatários assinam na ordem em que aparecem no array `signers` (senão, todos recebem ao mesmo tempo).
- `refusable: true` — permite que o signatário recuse assinar.
- `stop_on_rejected: true` — se alguém recusar, os demais deixam de poder assinar.
- `reminder`: `WEEKLY` ou `DAILY` — lembrete automático pra quem não assinou.
- `deadline_at` — bloqueia assinatura depois dessa data.
- `qualified: true` — usa assinatura qualificada com certificado digital (ICP-Brasil), diferente da assinatura eletrônica simples.
- `locale.country` diferente de `BR`: signatários por SMS não são suportados, `new_signature_style`/`ignore_cpf` viram `true` automaticamente, e campos de CPF na página são ignorados.

### Posicionar campos de assinatura na página (`positions`)

Dentro de cada signer, em `positions`:
```json
"positions": [{ "x": "5.0", "y": "90.0", "z": 1, "element": "SIGNATURE" }]
```
- `x`, `y`: posição em % da página (0 a 100).
- `z`: número da página, começa em 1.
- `element`: `SIGNATURE`, `NAME`, `INITIALS`, `DATE`, `CPF`.

Pra descobrir os valores certos: crie um documento de exemplo pelo painel, posicione visualmente, depois consulte via query (ver seção Queries abaixo) pra copiar os valores exatos.

### Criar documento a partir de "template"
Não existe endpoint pra usar templates do painel diretamente via API. O caminho é: manter um HTML fixo com variáveis marcadas (ex: `$NomeSignatario$`), substituir programaticamente pelos valores reais, e mandar esse HTML gerado como o `file` do `createDocument` — funciona como qualquer outro arquivo.

## Editar documento (updateDocument)

```graphql
mutation ($id: UUID!, $document: UpdateDocumentInput!) {
  updateDocument(id: $id, document: $document) {
    id name message reminder refusable sortable stop_on_rejected
    new_signature_style show_audit_page expiration_at deadline_at
    email_template_id footer cc
    configs { notification_finished notification_signed signature_appearance }
    created_at
  }
}
```
Mesma estrutura de campos do `DocumentInput` na criação (não dá pra trocar o arquivo em si, só metadados/configurações).

## Consultar documento(s) (query)

```graphql
query {
  document(id: "ID_DO_DOCUMENTO") {
    id
    name
    signatures {
      public_id
      name
      email
      signed
      rejected
      positions { element x y z }
    }
  }
}
```

Buscar vários de uma vez (GraphQL permite aliases):
```graphql
query {
  primeiro: document(id: "ID_1") { name }
  segundo: document(id: "ID_2") { name }
}
```

Listar todos os documentos (com filtro por pasta):
```graphql
query {
  documents(folder_id: "ID_DA_PASTA") {
    data { id name signatures_count signed_count rejected_count }
  }
}
```

**Não use isso pra polling de status.** A doc oficial é explícita: prefira webhooks (ver `references/webhooks.md`) pra saber quando um documento foi assinado — é mais rápido e evita bater no rate limit de 60 req/min à toa.

## Remover documento
```graphql
mutation ($id: UUID!) {
  deleteDocument(id: $id) { id }
}
```

## Transferir documento (mudar de organização/dono)
Mutation `transferDocument` — útil se você gerencia múltiplas organizações Autentique (ex: uma por cliente) e precisa mover um documento entre elas.

## Sandbox (testar sem gastar crédito)
Basta adicionar `sandbox: true` no `createDocument` (ver exemplo acima). Documentos sandbox são excluídos automaticamente depois de alguns dias e **não aparecem** na listagem padrão de documentos — pra incluir, passe `showSandbox: true` na query `documents`, ou `onlySandbox: true` pra ver só os de teste.
