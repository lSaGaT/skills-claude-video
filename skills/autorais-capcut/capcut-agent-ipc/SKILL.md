---
name: capcut-agent-ipc
description: Controlar o CapCut Desktop aberto via o próprio plano de controle IPC do agente nativo dele (lyra-cli-ipc) — canvas nodes, timeline add-draft, shadow drafts, assets do projeto. Use quando o CapCut estiver aberto e o pedido for manipular o projeto que está NO app (não arquivos draft soltos). Antes de usar, valide a sessão (exit code 2 = sem sessão ativa; veja o passo de verificação).
---

# CapCut Agent IPC

O CapCut 9.7 embarca um runtime de agente (Bun) com um plano de controle sobre
**named pipe Windows determinística**: `\\.\pipe\vecreator-lyra-cli-v1-capcut`
(observado no código `common_agent`: `KW_("capcut")`). O CLI oficial é
`lyra-cli-ipc` (launcher `.cmd` que chama o `lyraCliIpcClient.mjs` via
`bun.exe` embutido).

## Verificação de disponibilidade (rode SEMPRE antes)

```bash
# 1) a pipe existe?
powershell -NoProfile -Command "[System.IO.Directory]::GetFiles('\\\\.\\pipe\\') | Where-Object { $_ -match 'vecreator' }"
# 2) o runtime do agente subiu? (só sobe quando o painel de IA do app é aberto)
netstat -ano | grep 5175
```

- Pipe **ausente** → o agente nativo não está ativo: o usuário precisa abrir o
  painel de IA do CapCut (Agent Hub). Sem isso, nada desta skill funciona.
- `lyra-cli-ipc ... --help` é local e funciona sem sessão; qualquer comando
  **de negócio** requer Session do agente.

## Executar comandos

Launcher (ajuste `AGENT_RUNTIME_BUN_COMMAND` para o bun do app):

```bash
export AGENT_RUNTIME_BUN_COMMAND="C:\Users\<user>\AppData\Local\CapCut\Apps\9.7.0.4153\bun.exe"
cmd //c "C:\Users\<user>\AppData\Local\CapCut\Apps\9.7.0.4153\Resources\common_agent\bin\lyra-cli-ipc.cmd" \
    canvas capabilities --output json
```

## Superfície de comandos (de `--help`, offline — fonte: `evidence\lyra-cli-help-snapshot.txt`)

| Comando | O que faz |
|---|---|
| `canvas capabilities` | lista comandos/tipos de node/asset permitidos (`agent-hub.canvas-capabilities.v1`) |
| `canvas asset list \| get` | assets do projeto atual; `get --include-local-path` → caminho local confiável |
| `canvas read` | lê nodes do Canvas (`data.nodes[].object_id`, `canvas_revision`) |
| `canvas node create\|update\|delete\|transform\|move\|duplicate\|frame\|unframe` | mutações com CAS por revision |
| `timeline add-draft` | insere um draft Asset na timeline nativa (nested/expanded; append/at+ripple/overwrite) |
| `workspace status\|switch` | lê/troca a aba de workspace exibida |
| `draft shadow create\|list\|focus\|duplicate\|import\|delete` | rascunhos ocultos p/ trabalho do agente |
| `--product capcut\|jianying` | escolhe o endpoint (a pipe) |
| `--endpoint <path>` | override da pipe/socket |

## Regras de chamada (do contrato das skills nativas — leia também
`evidence\skills-native-translated\timeline-draft-cli.md` e `canvas-node-cli.md`)

1. **Um comando por invocação**; sempre `--output json`; confira exit code + stderr.
2. **Dry-run antes de escrever** (`--dry-run` com os mesmos argumentos).
3. **CAS**: mutações de node exigem `--expected-revision` (do node); move/
   duplicate/frame exigem `--expected-canvas-revision` (do canvas); criação a
   partir de asset exige revision do asset + do canvas.
4. **`--request-id` único** por escrita em `timeline add-draft` (idempotência —
   o nativo deduplica por request id).
5. Nunca leia/injete `COMMON_AGENT_CANVAS_*` manualmente — é identidade do Host;
   fora de uma sessão real o comando falha com exit code 2 (esperado).
6. Códigos: `*_revision_conflict` → releia e replaneje (nunca reforce revision
   antiga); `timeline_cli_busy`/`draft_busy` → aguarde; `outcomeUnknown=true` →
   **não repita** a submissão, verifique manualmente.

## O que funciona fora da sessão (estado da arte nesta RE)

- `--help` e a detecção da pipe funcionam sempre.
- Comandos de negócio exigem a sessão que o CapCut injeta no agente próprio
  (env `COMMON_AGENT_CANVAS_SESSION_ID/INSTANCE_ID/CAPABILITY`,
  `COMMON_AGENT_OPERATION_*`). A síntese externa dessas variáveis é **unknown**
  (ledger E-03) — teste empiricamente com o painel de IA aberto; se falhar com
  exit code 2, o caminho alternativo é editar o draft por arquivo
  (skill capcut-draft-core) com o projeto fechado no app.

## Referências

- `evidence\LEDGER.md` (E-02/E-03/E-04) — protocolo do `videoeditor-service`
  (domínios `system|player|draft|edit|job|voice_input`, envelope JSON por linha)
  e superfície HTTP do `app-server` (:5175)
- `evidence\lyra-cli-help-snapshot.txt` — helps capturados
- `evidence\skills-native-translated\` — contratos completos das skills nativas
