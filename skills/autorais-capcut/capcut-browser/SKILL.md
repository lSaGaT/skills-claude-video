---
name: capcut-browser
description: Usar o browser gerenciado que acompanha o agente do CapCut (capcut-browser) — abrir URLs, tirar snapshots acessíveis de página, clicar/preencher/rolar com refs de elementos e verificação de navegação. Use somente quando o runtime do agente do CapCut estiver ativo (painel de IA aberto) e a skill capcut-agent-ipc já confirmou o ambiente. Para automação web genérica fora do CapCut, use as ferramentas nativas do agente em vez desta.
---

# CapCut Browser (gerenciado)

Port do contrato da skill nativa `capcut-browser` do CapCut 9.7
(fonte completa: `evidence\skills-native-translated\capcut-browser.md`).
O binário é invocado pelo Host do agente com identidade de sessão; como o
`lyra-cli-ipc`, exige sessão ativa do agente do CapCut.

## Chamada

Um único argumento JSON contendo `commandId`, `action`, `args` (+ `pageId`/
`snapshotId` para ações de interação). No Windows use stdin UTF-8:

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
@{ commandId = 'open-1'; action = 'open'; args = @('https://example.com') } |
  ConvertTo-Json -Compress | capcut-browser --stdin
```

## Ações e argumentos

| Ação | `args` |
|---|---|
| `open`, `goto` | uma URL HTTP/HTTPS dentro das origins concedidas |
| `snapshot`, `status`, `pause`, `resume`, `close` | array vazio |
| `find`, `type`, `press` | uma string |
| `click`, `check` | ref de elemento atual (ex.: `e123`, `f1e123`) |
| `fill`, `select` | ref de elemento + valor |
| `mousewheel` | dois inteiros em string (px horizontal, vertical) |

## Ciclo correto

1. `open` → a resposta traz `observation` com `url`, `title` e refs.
2. Leia `observation.text` antes de decidir; para `click/fill/type/press/
   select/check/mousewheel` use os refs **da observação mais recente** +
   `pageId`/`snapshotId` atuais.
3. Interações retornam nova observação. `stale_snapshot` → tire snapshot novo
   e redecida. `truncated=true` → use o `path` retornado com Read, ou `find`
   para filtrar.
4. Após `click`/`press`, **verifique url E conteúdo** antes de declarar
   navegação concluída; se a url ainda é a página de origem, não conclua.
5. `commandId` estável reconecta ao resultado; ID novo para operação nova;
   `command_conflict` = mesmo id com conteúdo diferente.
6. `outcomeUnknown=true` → **nunca repita** a submissão; observe ou peça ao
   usuário para verificar.

## Estados que exigem parada

- `network_permission_required` → a sessão precisa conceder rede (ferramenta
  `request_permissions` do agente; fora dela, pare e informe o usuário).
- `authentication_required` → o usuário precisa autenticar.
- `browser_not_authorized` / `browser_run_unavailable` → reporte, não faça
  fallback para launcher de OS (`start`, `Start-Process`) nem invente sucesso.
- `page_not_ready`/`new_tab_not_ready` com `stopped=false` → sessão pausa;
  instrua o usuário a restaurar/continuar; só use `resume` após confirmação.

## Notas

- O browser abre **minimizado em segundo plano** (padrão no Windows); avise ao
  usuário como restaurá-lo (ícone na barra de tarefas) mesmo sem login pedido.
- Em mensagens ao usuário, chame de "o browser", não "CapCut Browser".
- Primeira versão do CLI: sem JS arbitrário, screenshots, uploads/downloads,
  abas múltiplas ou dialogs.
