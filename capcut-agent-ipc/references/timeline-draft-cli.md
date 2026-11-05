# timeline-draft-cli (referência traduzida)

## Cabeçalho

| Campo | Valor |
| --- | --- |
| ID original da skill | `timeline-draft-cli` |
| Nome original (frontmatter) | `timeline-draft-cli` |
| Idioma original | Frontmatter em inglês (descrição), corpo em chinês |
| Caminho de origem (cópia somente leitura) | `C:\Users\Conectare\rea\capcut-re\evidence\skills-native\packaged\skills\timeline-draft-cli\SKILL.md` |
| Origem da instalação | Skill empacotada dentro do CapCut Desktop 9.7 (Windows) |

**Resumo do propósito.** `timeline-draft-cli` insere um draft Asset do painel de Assets do projeto atual na timeline nativa em foco do CapCut via `lyra-cli-ipc timeline add-draft`, com representação nested ou expanded e posicionamento append/ripple/overwrite. O escopo é estreito: adicionar um *draft asset existente* à timeline — não layout de Canvas nodes (essa é a `canvas-node-cli`) e nem abrir ou trocar de projeto. IDs do painel de Assets não são draft IDs nem Canvas Node IDs. O comando escreve na timeline em foco no momento e nunca troca nem substitui o projeto.

---

## Contrato operacional (traduzido)

### Limites de segurança

- O Host injeta automaticamente a identidade da Session e a capability; não leia, não construa e não repasse `COMMON_AGENT_CANVAS_*`, sockets, Actions internos nem caminhos de draft.
- Só é possível adicionar draft Assets disponíveis no painel de Assets do **projeto atual**; esse projeto precisa ser o que está aberto no cliente nativo (editor).
- O comando escreve na timeline em foco no momento; não troca nem substitui projetos. `--target-timeline-id` é apenas uma **afirmação (assert)**.
- `overwrite` apaga o conteúdo existente dentro do intervalo coberto; só pode ser usado **quando o usuário pedir overwrite explicitamente**. Sem posição especificada, use o `append` padrão.
- Um comando por chamada Bash, com `--output json`; verifique o exit code e o stderr.

### Fluxo de operação

1. Com parâmetros incertos, rode `lyra-cli-ipc timeline add-draft --help`. Esse comando dispensa Session e não conecta ao cliente nativo.
2. Localize o asset indicado pelo usuário com `lyra-cli-ipc canvas asset list --kind draft --output json`; se necessário, obtenha a revision mais recente com `canvas asset get --id <asset-id> --output json`. Nunca deduza um UUID pelo nome.
3. Rode `--dry-run` com o asset ID escolhido, a asset revision mais recente e o posicionamento planejado. Anote `timeline_id` e `expected_timeline_revision`.
4. Rode de novo sem `--dry-run`, acrescentando `--target-timeline-id`, `--expected-timeline-revision` e um `--request-id` novo. Só reporte "inserido" quando o exit code for 0 **e** `committed=true`.

Exemplo — anexar um draft nativo nested (substitua os placeholders pelos valores recém-lidos):

```bash
lyra-cli-ipc timeline add-draft --asset-id <asset-id> --expected-asset-revision <asset-revision> --dry-run --output json
```

```bash
lyra-cli-ipc timeline add-draft --asset-id <asset-id> --expected-asset-revision <asset-revision> --target-timeline-id <timeline-id> --expected-timeline-revision <timeline-revision> --request-id <unique-insert-id> --output json
```

### Posicionamento e representação

| Flag | Significado |
| --- | --- |
| `--representation nested` (padrão) | Adiciona como um sub-draft nativo, preservando o conteúdo interno multitrilha, sem renderizar em vídeo |
| `--representation expanded` | Desmonta as trilhas de topo do draft de origem; o aninhamento interno é preservado |
| `--placement append` (padrão) | Anexa após o término mais tardio entre todas as trilhas alvo; as flags de position/collision NÃO podem ser passadas junto |
| `--placement at --position-us <microssegundos> --collision ripple` | Divide no ponto de inserção se necessário; os clipes seguintes em todas as trilhas afetadas deslocam-se para depois pelo tempo do conteúdo de origem |
| `--placement at --position-us <microssegundos> --collision overwrite` | Sobrescreve `[ponto de inserção, ponto de inserção + duração de origem)` em todas as trilhas alvo; o conteúdo fora do intervalo é preservado |

### Retorno e tratamento de falhas

- `dry_run=true` é apenas um precheck de leitura; não prova que a importação do recurso, a desmontagem ou a edição real ocorreram.
- O sucesso devolve `added_segment_ids`, `removed_segment_ids` e `timeline_revision`. São identificadores nativos de clipe/histórico da timeline, **não** Canvas nodes.
- `timeline_cli_*conflict`, `timeline_cli_source_changed`, `timeline_cli_project_mismatch`: releia e replaneje; nunca sobrescreva automaticamente edições concorrentes.
- `timeline_cli_busy`: há outra tarefa de edição/importação em andamento; espere ela terminar e deixe o usuário decidir se tenta de novo.
- Nos comandos nativos comuns de Draft, `draft_busy` é uma rejeição antes da execução; o cliente JS tenta no máximo 3 vezes dentro do mesmo limite de tempo total, e busy persistente mantém `retryable: true`. O `timeline add-draft` desta skill usa **v2** e segue a regra de `timeline_cli_busy` acima.
- Em timeout ou queda de conexão, não repita às cegas com um request ID novo. Enquanto o processo nativo estiver vivo, o mesmo request ID com parâmetros idênticos tem proteção contra execução duplicada; após um restart do processo, confira a timeline primeiro.
- `timeline_cli_rollback_failed`: pare as edições seguintes e reporte que é preciso verificação manual; NÃO afirme que a timeline ficou inalterada.
- Se o comando nativo estiver indisponível, explique que é necessário um cliente mais novo com essa funcionalidade; NÃO volte para a criação de Canvas nodes fingindo ser inserção na timeline.

---

## Notas de portabilidade

- **O que ela aciona.** O mesmo binário `lyra-cli-ipc` da `canvas-node-cli`, mas o grupo de subcomandos `timeline` (apenas `timeline add-draft` nesta skill). O estado do lado do editor (timeline em foco, draft assets, IDs de clipe/histórico) vive inteiramente no processo nativo do CapCut; o CLI é uma ponte IPC v2. Ela compõe com a `canvas-node-cli` — a descoberta de assets usa `canvas asset list --kind draft` / `canvas asset get`.
- **Premissas de Host/sessão (dependentes do runtime do CapCut).** Como a `canvas-node-cli`, depende do contexto de sessão do tipo `COMMON_AGENT_CANVAS_*` injetado pelo Host, de uma Session ativa do CommonAgent e de um projeto aberto no editor nativo. O modelo de escrita (afirmar a timeline em foco via `--target-timeline-id`, `--expected-timeline-revision`, idempotência por `--request-id` atrelada ao tempo de vida do processo nativo) pressupõe que o Host consiga associar comandos Bash à sessão do editor.
- **Conteúdo genérico/portável.** A escada dry-run → execução real com um `--request-id` novo, o portão de sucesso `committed=true`, a proteção contra execução duplicada por request ID + parâmetros idênticos, a regra de "nunca simular uma edição de timeline disfarçando em outro subsistema" e a regra de honestidade do `timeline_cli_rollback_failed` são padrões transferíveis para qualquer CLI portado que mute um documento vivo com guarda de revision.
- **Descrição da skill (frontmatter), traduzida:** "Insert a current-project draft Asset into the focused native timeline using lyra-cli-ipc, either nested or expanded, with append, ripple or overwrite placement. Use for adding an existing draft to the timeline, not for Canvas node layout or opening/replacing a project." — em português: "Inserir um draft Asset do projeto atual na timeline nativa em foco usando lyra-cli-ipc, em representação nested ou expanded, com posicionamento append, ripple ou overwrite. Usar para adicionar um draft existente à timeline, não para layout de Canvas nodes nem para abrir/substituir projetos." (O frontmatter já está em inglês na fonte.)
- **Formato da portabilidade para Claude Code.** Uma portabilidade precisa da superfície `lyra-cli-ipc timeline` (ou de um IPC de editor equivalente) mais a dependência de descoberta de assets em `canvas asset list/get`. Atente para a armadilha de versionamento documentada na fonte: os comandos nativos legados de Draft rejeitam com `draft_busy` e uma política de 3 tentativas do cliente JS, enquanto o `timeline add-draft` v2 rejeita com `timeline_cli_busy` — uma portabilidade não deve misturar os dois regimes de erro.
