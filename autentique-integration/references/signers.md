# Signatários

## Ações possíveis (`action` no SignerInput)
| Action | Significado |
|---|---|
| `SIGN` | Assina o documento |
| `SIGN_AS_A_WITNESS` | Assina como testemunha |
| `APPROVE` | Aprova (fluxo de aprovação interna, sem assinar) |
| `RECOGNIZE` | Reconhece/confirma ciência, sem assinar |

## Métodos de envio (`delivery_method`)
| Valor | Comportamento |
|---|---|
| (omitido, com `email` informado) | Envia link de assinatura por e-mail |
| `DELIVERY_METHOD_SMS` | Envia link por SMS (requer `phone`) |
| `DELIVERY_METHOD_WHATSAPP` | Envia link por WhatsApp (requer `phone`) |
| `DELIVERY_METHOD_LINK` | Não envia nada — a API retorna o link no campo `link.short_link` da resposta, e você distribui manualmente (útil se você mesmo quer mandar via Evolution API, por exemplo) |

Exemplo com os 3 canais na mesma criação de documento:
```json
{
  "signers": [
    { "email": "cliente@example.com", "action": "SIGN" },
    { "name": "Fulano de Tal", "action": "SIGN" },
    { "phone": "+5531999999999", "delivery_method": "DELIVERY_METHOD_WHATSAPP", "action": "SIGN" },
    { "phone": "+5531999999998", "delivery_method": "DELIVERY_METHOD_SMS", "action": "SIGN" }
  ]
}
```
Quando o signatário é adicionado só com `name` (sem `email`/`phone`), o link de assinatura vem no atributo `link` do documento retornado — precisa ser distribuído manualmente.

## Adicionar signatário a um documento já criado (createSigner)
```graphql
mutation ($document_id: UUID!, $signer: SignerInput) {
  createSigner(document_id: $document_id, signer: $signer) {
    public_id
    name
    email
    delivery_method
    action { name }
    link { id short_link }
    created_at
  }
}
```
```json
{
  "document_id": "ID_DO_DOCUMENTO",
  "signer": { "email": "novo-signatario@example.com", "action": "SIGN" }
}
```

## Remover signatário (removeSigner)
Só funciona pra signatário que **ainda não assinou** — não dá pra remover quem já assinou o documento.
```graphql
mutation ($public_id: UUID!) {
  removeSigner(public_id: $public_id) { public_id }
}
```
`public_id` é o identificador da assinatura (não do documento) — vem no retorno do `createDocument` ou `createSigner`.

## Reenviar assinaturas (resendSignatures)
Reenvia o email/SMS/WhatsApp de solicitação de assinatura pra quem ainda não assinou. Útil pra fluxo de "cobrar assinatura pendente" via n8n depois de X dias sem resposta.

## Criar link de assinatura avulso (createSignatureLink)
Gera (ou re-gera) um link de assinatura pra um signatário específico, útil quando você quer trocar o método de entrega depois que o documento já foi criado (ex: signatário perdeu o email, você gera o link e manda direto por WhatsApp via Evolution API).

## Assinar documento via API (signDocument)
```graphql
mutation ($id: UUID!) {
  signDocument(id: $id) {
    document { id name }
  }
}
```
**Atenção**: essa mutation só assina **com a conta dona do token da API** — não serve pra simular a assinatura de outra pessoa dentro do seu app. Só funciona se a própria conta/empresa (dono do token) estiver na lista de `signers` daquele documento; senão retorna o erro `signature_not_found`.

## Verificações de segurança adicionais (`security_verifications`)
Vão dentro do objeto do signer, na criação do documento ou ao adicionar signatário:
```json
{
  "email": "cliente@example.com",
  "action": "SIGN",
  "configs": { "cpf": "12345678900" },
  "security_verifications": [
    { "type": "SMS", "verify_phone": "+5531999999999" },
    { "type": "MANUAL" }
  ]
}
```

| `type` | O que exige do signatário |
|---|---|
| `SMS` | Validar um código enviado por SMS (`verify_phone` opcional, senão o próprio signatário informa) |
| `MANUAL` | Anexar foto de documento + selfie; aprovação manual sua ou de alguém da organização |
| `UPLOAD` | Anexar frente e verso de documento de identidade |
| `LIVE` | Documento + selfie + prova de vida (vídeo); compara automaticamente |
| `PF_FACIAL` | Selfie validada contra a base do SERPRO usando o CPF informado |
| `BIOMETRIC_AND_TEXT_EXTRACTION` | Foto de documento + selfie, comparação facematch |
| `LIVENESS_AND_TEXT_EXTRACTION` | Prova de vida + foto de documento, com extração automática de dados |

- `configs.cpf`: trava a assinatura pra só aceitar quem tem exatamente esse CPF.
- Pode combinar várias verificações no mesmo signatário, mas só uma entre `MANUAL`, `UPLOAD`, `LIVE`, `PF_FACIAL` (são mutuamente exclusivas).
- Verificações consomem **créditos adicionais** de verificação — checar custo no painel antes de ativar em massa.
- Por padrão, se o signatário estourar tentativas em `UPLOAD`/`LIVE`/`PF_FACIAL`/`BIOMETRIC_AND_TEXT_EXTRACTION`, cai automaticamente pra aprovação `MANUAL`. Pra desativar esse fallback e já marcar como rejeitado em vez disso: `"fallback_behavior": "DISABLE_FALLBACK"`.
