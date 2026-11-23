# Erros e Limites

## Formato padrão de resposta
```json
{ "errors": { /* só aparece se deu erro */ }, "data": { /* só aparece se deu certo (ou parcialmente) */ } }
```

## Erro de query GraphQL inválida (campo obrigatório faltando, tipo errado)
```json
{
  "errors": [{
    "message": "Variable \"$folder\" got invalid value null at \"folder.name\"; Expected non-nullable type \"String!\" not to be null.",
    "locations": [{ "line": 1, "column": 31 }]
  }]
}
```
Isso é erro de sintaxe/schema — geralmente bug no código que monta a query, não erro de negócio.

## Erro de recurso não encontrado
```json
{
  "errors": [{ "message": "Folder not found", "path": ["folder"] }],
  "data": { "folder": null }
}
```

## Erro de validação (regra de negócio)
Identificado por `message: "validation"`, com o detalhe em `extensions.validation`:
```json
{
  "errors": [{
    "message": "validation",
    "path": ["createFolder"],
    "extensions": {
      "validation": { "folder.name": ["field_required"] },
      "category": "validation"
    }
  }],
  "data": { "createFolder": null }
}
```
No código, sempre cheque `error.extensions?.validation` antes de tentar parsear a mensagem — é onde fica o motivo estruturado.

## Tabela de mensagens de validação possíveis
| Código | Significado |
|---|---|
| `unauthorized` | Token inválido/expirado |
| `document_not_found` | Documento não existe (ou não pertence à sua organização) |
| `folder_not_found` | Pasta não existe |
| `document_signed` | Documento já foi assinado (tentando alterar algo que não pode mais mudar) |
| `not_your_turn` | Assinatura sequencial (`sortable: true`) — ainda não chegou a vez desse signatário |
| `must_be_a_string` / `must_be_an_array` / `not_a_valid_date` / `must_be_a_valid_email_address` / `must_be_a_file` | Tipo de campo errado |
| `failed_to_upload` / `could_not_upload_file` | Erro no envio do arquivo |
| `field_required` | Campo obrigatório faltando |
| `unavailable_credits` | Plano sem créditos de documento disponíveis |
| `unavailable_verifications_credits` | Sem créditos de verificação adicional (SMS, biometria etc.) |
| `may_not_be_greater_than` / `must_be_at_least` | Limite de caracteres |
| `format_is_invalid` / `invalid_date` | Formato incorreto |
| `without_permission` | Precisa ser admin da organização pra essa ação |
| `must_be_a_valid_file` | Extensão de arquivo não permitida |
| `not_a_member_of_organization` | Usuário não pertence à mesma organização |
| `signature_not_found` | Tentando `signDocument` num documento onde o dono do token não é signatário |

## Rate limit
**60 requisições por minuto.** Ao estourar:
```json
{ "message": "Too Many Attempts." }
```
com status HTTP `429`. Em fluxos n8n que processam lote (ex: enviar 50 contratos de uma vez), adicione um `Wait` node entre as chamadas ou processe em batches menores.
