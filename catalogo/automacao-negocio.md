# Automação & APIs de negócio

**4 skills** · [← voltar ao índice](../README.md)

---

## asaas-integration 🏠

**O que cria:** Código de integração com a API Asaas (pagamentos BR) — cobranças, Pix, assinaturas, NF-e, negativação.

**Chaves técnicas:** header access_token + User-Agent; sandbox $aact_hmlg_ vs prod $aact_prod_ (401 clássico); GET payments/{id}/pixQrCode (QR dinâmico); webhooks com authToken + validação do header asaas-access-token; idempotência via externalReference; endpoints sandbox para forçar estados de teste.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/automacao-negocio/asaas-integration/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/automacao-negocio/asaas-integration/`

---

## autentique-integration 🏠

**O que cria:** Integração com a API Autentique (assinatura eletrônica BR) — 100% GraphQL, documentos e signatários.

**Chaves técnicas:** endpoint único /v2/graphql (query/mutation); multipart operations/map/file (graphql-multipart-request-spec) para upload de documento; positions x/y em % da página + z página; verificações SMS/biometria/foto de documento; webhooks com HMAC; rate limit 60 req/min (429).

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/automacao-negocio/autentique-integration/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/automacao-negocio/autentique-integration/`

---

## evolution-api 🏠

**O que cria:** Referência de endpoints da Evolution API v2 (WhatsApp via Baileys) — instâncias, envio de mensagens, webhooks.

**Chaves técnicas:** apikey global vs hash de instância; sendText/sendMedia/sendAudio/sticker/lista/botões/enquete; mídia em base64 puro (sem prefixo data:); JID de grupo @g.us no campo number; número DDI+DDD só dígitos; webhook responde 200 imediato + processamento async; evento CONNECTION_UPDATE confirma pareamento.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/automacao-negocio/evolution-api/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/automacao-negocio/evolution-api/`

---

## stripe-integration 🏠

**O que cria:** Integração com a API Stripe — Checkout, PaymentIntent, assinaturas, cupons, Pix, cripto e Connect/marketplace.

**Chaves técnicas:** Checkout hospedado (allow_promotion_codes, Pix/cripto nativos); Destination Charges + application_fee_amount (split marketplace); header Stripe-Account; body form-urlencoded (não JSON) com valores em centavos; Idempotency-Key; validação stripe-signature; checkout.session.async_payment_succeeded p/ Pix assíncrono.

**Origem:** casa (autoral — nascida em produção real)

**Como instalar:** Copie a pasta `skills/automacao-negocio/stripe-integration/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente).

**Pasta no repo:** `skills/automacao-negocio/stripe-integration/`

