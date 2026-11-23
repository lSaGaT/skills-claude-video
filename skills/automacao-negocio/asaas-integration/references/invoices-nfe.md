# Notas Fiscais (NF-e de serviço)

Emissão de nota fiscal de serviço via Asaas. Fluxo tem uma etapa de **configuração obrigatória** antes de conseguir emitir qualquer nota.

## 1. Configurar informações fiscais da conta (uma vez só)

Antes de emitir a primeira nota, veja o que a prefeitura do seu município exige:
`GET /v3/fiscalInfo/municipalOptions`

Com isso em mãos, cadastre as informações fiscais da conta:
`POST /v3/fiscalInfo`
```json
{
  "email": "fiscal@nodoprime.com.br",
  "municipalInscription": "11356",
  "simplesNacional": true,
  "culturalProjectsPromoter": false
}
```
Campos obrigatórios variam por município (alguns pedem certificado digital, outros usuário/senha) — sempre consultar `municipalOptions` antes, os campos que terminam em `Help` na resposta são só texto explicativo, não devem ser reenviados.

Alternativa: usar o Portal Nacional (NFS-e nacional) em vez da prefeitura local:
`POST /v3/fiscalInfo/nationalPortal` com `{ "enabled": true }` — atenção, trocar de portal reseta as configurações fiscais já feitas.

## 2. Buscar o serviço municipal
`GET /v3/invoices/municipalServices` — lista os serviços com código (geralmente 4-5 dígitos) que a prefeitura reconhece. Filtro `?description=` pra buscar por texto. Se usar Portal Nacional, essa lista não fica disponível via API — o código do serviço tem que ser informado manualmente (consultar contador ou o próprio Portal Nacional).

## 3. Agendar / emitir a nota fiscal
`POST /v3/invoices`
```json
{
  "payment": "pay_637959110194",
  "serviceDescription": "Desenvolvimento de sistema sob demanda",
  "observations": "Referente aos trabalhos de julho/2026",
  "value": 300.00,
  "deductions": 0,
  "effectiveDate": "2026-07-15",
  "municipalServiceId": "21234",
  "municipalServiceName": "Análise e desenvolvimento de sistemas",
  "taxes": { "retainIss": false, "iss": 3, "cofins": 3, "csll": 1, "inss": 0, "ir": 1.5, "pis": 0.65 }
}
```
- É **obrigatório** enviar pelo menos um entre `payment` (vinculada a uma cobrança), `installment` (vinculada a um parcelamento) ou `customer` (nota avulsa, sem cobrança associada).
- `effectiveDate` no futuro = a nota fica **agendada**, não emite na hora.
- Se quiser antecipar a emissão de uma nota já agendada: `POST /v3/invoices/{id}/authorize`

## Emissão automática pra assinaturas
Em vez de chamar `POST /v3/invoices` manualmente a cada cobrança gerada pela assinatura, dá pra configurar regra automática:
`POST /v3/subscriptions/{id}/invoiceSettings`
```json
{
  "municipalServiceId": "21234",
  "municipalServiceName": "Análise e desenvolvimento de sistemas",
  "effectiveDatePeriod": "ON_PAYMENT_CONFIRMATION",
  "value": 300.00,
  "taxes": { "iss": 3 }
}
```
`effectiveDatePeriod`: `ON_PAYMENT_CONFIRMATION` (só emite depois que o cliente pagar — mais seguro), `ON_PAYMENT_DUE_DATE`, `BEFORE_PAYMENT_DUE_DATE` (exige `daysBeforeDueDate`: 5/10/15/30/60), ou `ON_NEXT_MONTH`.

## Outras operações
- `GET /v3/invoices` — listar
- `GET /v3/invoices/{id}` — recuperar uma
- `PUT /v3/invoices/{id}` — atualizar (antes de emitida)
- `DELETE /v3/invoices/{id}/cancel` — cancelar (depende de suporte da prefeitura — checar `supportsCancellation` em `municipalOptions`)

## Gotcha
Regras de PIS/COFINS mudam a partir de 30/06/2026 pra quem não é Simples Nacional e emite via Portal Nacional — se o cliente do Lucas não for optante do Simples, vale checar `taxes.pisCofinsRetentionType`/`taxes.pisCofinsTaxStatus` na doc antes de montar o payload.
