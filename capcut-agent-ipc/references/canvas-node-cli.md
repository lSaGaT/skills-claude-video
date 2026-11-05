# canvas-node-cli (referência traduzida)

## Cabeçalho

| Campo | Valor |
| --- | --- |
| ID original da skill | `canvas-node-cli` |
| Nome original (frontmatter) | `canvas-node-cli` |
| Idioma original | Chinês (simplificado), com frontmatter em inglês |
| Caminho de origem (cópia somente leitura) | `C:\Users\Conectare\rea\capcut-re\evidence\skills-native\packaged\skills\canvas-node-cli\SKILL.md` e `...\canvas-node-cli\references\commands.md` |
| Origem da instalação | Skill empacotada dentro do CapCut Desktop 9.7 (Windows) |

**Resumo do propósito.** `canvas-node-cli` é uma skill do CommonAgent que permite ao agente embutido ler e modificar o *painel de Assets* (素材区) e o *Canvas persistente* do projeto aberto no CapCut chamando `lyra-cli-ipc canvas` pela ferramenta Bash. Toda escrita é protegida por valores de `revision` por nó/por canvas/por asset obtidos em leituras anteriores. Cobre explicitamente NÃO a edição de Timeline/conteúdo de draft (essa é a `timeline-draft-cli`) nem seleção, zoom e pan restritos ao viewport. O Host (runtime do agente do CapCut) injeta automaticamente endpoint, identidade e contexto de capability da sessão; o agente nunca deve construir, ler ou repassar esses valores por conta própria.

---

## Contrato operacional (traduzido)

### Regras de execução

- Cada chamada da ferramenta Bash executa exatamente **um** comando CLI; não encadeie comandos de shell.
- Comandos de negócio sempre adicionam `--output json`; verifique o exit code do processo, o stdout **e** o stderr.
- O endpoint, a identidade e a capability da Session atual são injetados automaticamente pelo Host e pelo executor de ferramentas. Não leia, não exiba, não construa e não repasse nenhum valor `COMMON_AGENT_CANVAS_*`, socket ou Action interno.
- Não leia, não deduza e não repasse `artifact.ref`. Só o `resource.from` devolvido por `asset get --include-local-path` é um caminho local utilizável.
- `--project-id` serve apenas para **afirmar** o projeto atual; não permite trocar nem acessar outro projeto.
- Com argumentos incertos, rode antes `lyra-cli-ipc canvas <nível> --help` ou `canvas capabilities`.
- `--help` é um comando local que dispensa Session; `capabilities` é um comando de negócio e precisa rodar dentro do Bash/PowerShell da Session atual do CommonAgent.

### Fluxo padrão

1. Leia assets ou o canvas conforme a tarefa pedir. Se a capacidade estiver incerta, rode primeiro:

   ```bash
   lyra-cli-ipc canvas capabilities --output json
   ```

   Confirme que o exit code é `0` e que o `schema` é `agent-hub.canvas-capabilities.v1`; então escolha as operações com base em `commands`, `node_types`, `asset_kinds` e `concurrency`.

2. Guarde os identificadores e a revision necessários para esta operação:
   - Leitura de Canvas: `canvas_revision` de topo, `page_ids`, `data.nodes[]`.
   - Node: `object_id`, `revision`, `parent_frame_id`, `layout`.
   - Asset: `asset_id`, `revision`, `status`.
3. Para delete, agrupamento em frame, move ou mudanças estruturais em lote, valide antes com os mesmos argumentos mais `--dry-run`.
4. Execute a escrita real usando a revision recém-lida.
5. Depois de uma escrita bem-sucedida, faça `read` de novo para confirmar as relações pai/filho finais, o layout e a revision.

### Parsing correto do JSON

- Os IDs de Node nos resultados de **leitura** são `data.nodes[].object_id`.
- Os IDs de Node novos/afetados em **create e outras escritas** são `results[].node_id`, **não** `object_id`.
- Os resultados de escrita também trazem `results[].revision` e o novo `canvas_revision` de topo.
- A origem de uma duplicação é `results[].source_node_id`.
- Se `missing_object_ids` ou `missing_asset_ids` vier não vazio, não presuma que os objetos pedidos existem.
- `dry_run: true` significa apenas que o preview passou; o preview **não** foi aplicado e não pode ser tratado como baseline para uma escrita posterior.

### Controle de concorrência

| Operação | Baseline obrigatório |
| --- | --- |
| `update`, `delete`, `transform` | `revision` mais recente do Node alvo → `--expected-revision` |
| `move`, `duplicate`, `frame`, `unframe` | `canvas_revision` mais recente → `--expected-canvas-revision` |
| Create a partir de Asset | `revision` mais recente do Asset **mais** `canvas_revision` mais recente |
| `create` simples | Sem parâmetro de revision explícito; ainda assim releia para confirmar após o sucesso |

Em caso de `canvas_cli_revision_conflict`, `canvas_cli_canvas_revision_conflict` ou `canvas_cli_asset_revision_conflict`: releia o estado atual e replaneje. Nunca repita às cegas com revisions antigos.

### Segurança de assets

- Só coloque no Canvas Assets com `status=ready`.
- `missing` significa que o arquivo de origem, a autorização ou o Host Artifact não está mais disponível; não tente contornar isso.
- Quando precisar de um arquivo local, peça `--include-local-path`. Se `local_path_status=unavailable`, não chute caminhos nem volte para locais internos de cache.
- Ao continuar a paginação, mantenha filtro, ordenação e limit inalterados; em `canvas_cli_cursor_stale`, recomece da primeira página.

### Tratamento de falhas

- Com exit code diferente de zero, extraia primeiro o `error.code` do stderr; não parseie stdout vazio.
- Erros de entrada/comando: rode o `--help` correspondente e corrija uma vez.
- Conflitos de revision/cursor: releia; não reaproveite parâmetros antigos.
- Asset indisponível ou objeto inexistente: explique ao usuário o Asset/Node específico e pare as operações seguintes que dependam dele.
- Exit code `2` com mensagem de endpoint de Canvas/Session context ausente: confira se o comando rodou dentro de uma Session ativa do CommonAgent; esse erro é **esperado** em terminal comum. Não configure variáveis de ambiente à mão.
- Se erros de Host/Session/capability persistirem dentro de uma Session ativa: repita `canvas capabilities` **uma vez**; se ainda falhar, reporte o exit code e o stderr sanitizados. Não mude para o IPC interno.
- stdout/stderr não devem conter diagnósticos do launcher de sandbox do macOS; se aparecerem, trate-os apenas como relatório de regressão do executor, nunca como JSON do Canvas.

---

## Referência de comandos (de `references/commands.md`)

Todos os exemplos de negócio retornam JSON. Uma chamada Bash roda exatamente um comando.

### Ajuda e capacidades

```bash
lyra-cli-ipc canvas --help
lyra-cli-ipc canvas capabilities --output json
lyra-cli-ipc canvas asset --help
lyra-cli-ipc canvas node --help
lyra-cli-ipc canvas node move --help
```

Comandos de ajuda são gerados localmente; o exit code deve ser `0`. `capabilities` exige uma Session ativa. Uma resposta bem-sucedida contém no mínimo:

```json
{
  "schema": "agent-hub.canvas-capabilities.v1",
  "commands": {
    "asset": ["list", "get"],
    "read": ["canvas", "node"],
    "node": ["create", "update", "delete", "transform", "move", "duplicate", "frame", "unframe"]
  },
  "pagination": {
    "default_limit": 100,
    "maximum_limit": 500
  }
}
```

Leia também `node_types`, `asset_kinds` e `concurrency`; não infera capacidades só a partir do exemplo mínimo acima.

### Painel de Assets

Listagem de assets paginada; `kind`, `source` e `status` são flags repetíveis:

```bash
lyra-cli-ipc canvas asset list --kind video --status ready --query "hero" --sort updated-at --order desc --limit 100 --output json
```

A próxima página deve manter filtro, ordenação e limit inalterados:

```bash
lyra-cli-ipc canvas asset list --kind video --status ready --query "hero" --sort updated-at --order desc --limit 100 --cursor <NEXT_CURSOR> --output json
```

Ler um ou mais assets por UUID:

```bash
lyra-cli-ipc canvas asset get --id <ASSET_UUID> --id <ASSET_UUID_2> --output json
```

Peça o caminho local confiável apenas quando processar o arquivo for realmente necessário:

```bash
lyra-cli-ipc canvas asset get --id <ASSET_UUID> --include-local-path --output json
```

Valores de filtro disponíveis:

- `kind`: `image`, `video`, `audio`, `document`, `draft`
- `source`: `manual`, `generated`, `conversation`, `draft`
- `status`: `generating`, `ready`, `failed`, `missing`
- `sort`: `updated-at`, `created-at`, `name`

### Lendo Canvas e Nodes

Ler o Canvas inteiro:

```bash
lyra-cli-ipc canvas read --scope canvas --output json
```

Ler um ou mais Nodes:

```bash
lyra-cli-ipc canvas read --scope node --id <NODE_ID> --id <NODE_ID_2> --output json
```

Filtrar o Canvas:

```bash
lyra-cli-ipc canvas read --scope canvas --filter '{"node_types":["video","image"],"task_statuses":["succeed"],"has_resource":true}' --output json
```

Quando o JSON ficar longo demais, grave `--filter`, `--input` ou `--layouts` no workspace da Session atual e referencie com `@/workspace/...json`. Não referencie arquivos fora do workspace.

O `--parent-id` de movimentações para o nível raiz deve vir dos `page_ids` devolvidos pelo read; não chute `page_001`.

### Criação

Criar um Node básico:

```bash
lyra-cli-ipc canvas node create --type text --title "标题" --output json
```

O ID criado fica em `results[0].node_id`. Para escrever o corpo do texto, use a revision do resultado do create:

```bash
lyra-cli-ipc canvas node update --id <NEW_NODE_ID> --expected-revision <NEW_NODE_REVISION> --patch '{"content":"正文"}' --output json
```

Criar via entrada de objeto:

```bash
lyra-cli-ipc canvas node create --input '{"type":"image","title":"封面","reference_object_ids":["<SOURCE_NODE_ID>"]}' --output json
```

Colocar um Asset no Canvas:

```bash
lyra-cli-ipc canvas node create --asset-id <ASSET_UUID> --expected-asset-revision <ASSET_REVISION> --expected-canvas-revision <CANVAS_REVISION> --x 80 --y 120 --output json
```

Opcional `--parent-id <PAGE_OR_FRAME_ID>`. Tipos básicos de node: `text`, `image`, `video`, `audio`, `document`, `frame`; Assets também aceitam `draft`.

### Atualizar, transformar, excluir

Atualizar título ou corpo do texto:

```bash
lyra-cli-ipc canvas node update --id <NODE_ID> --expected-revision <NODE_REVISION> --patch '{"title":"新标题","content":"新正文"}' --output json
```

Mudar o layout:

```bash
lyra-cli-ipc canvas node transform --id <NODE_ID> --expected-revision <NODE_REVISION> --x 160 --y 120 --width 640 --height 360 --rotation 10 --scale-x 1 --scale-y 1 --z-index 5 --output json
```

Excluir:

```bash
lyra-cli-ipc canvas node delete --id <NODE_ID> --expected-revision <NODE_REVISION> --dry-run --output json
```

```bash
lyra-cli-ipc canvas node delete --id <NODE_ID> --expected-revision <NODE_REVISION> --output json
```

### Mover, duplicar, frame

Mover ou reordenar vários Nodes:

```bash
lyra-cli-ipc canvas node move --id <NODE_ID> --id <NODE_ID_2> --parent-id <PAGE_OR_FRAME_ID> --expected-canvas-revision <CANVAS_REVISION> --index 0 --output json
```

Mover para o layout de linhas de um Frame:

```bash
lyra-cli-ipc canvas node move --id <NODE_ID> --parent-id <FRAME_ID> --expected-canvas-revision <CANVAS_REVISION> --row-index 1 --create-row --row-offset-x 24 --layouts '{"<NODE_ID>":{"x":0,"y":0,"width":320,"height":180,"rotation":0,"scale_x":1,"scale_y":1,"z_index":0}}' --output json
```

`--layouts` aceita apenas os Nodes selecionados; os campos são `x`, `y`, `width`, `height`, `rotation`, `scale_x`, `scale_y`, `z_index`. Como o Frame reorganiza os filhos por linhas, sempre faça `read` após a escrita para conferir as coordenadas finais.

Duplicar:

```bash
lyra-cli-ipc canvas node duplicate --id <NODE_ID> --id <NODE_ID_2> --expected-canvas-revision <CANVAS_REVISION> --offset-x 32 --offset-y 32 --output json
```

Se a seleção contiver tanto um Frame ancestral quanto seus descendentes, apenas as raízes selecionadas mais externas são duplicadas; use `results[].source_node_id` para identificar a origem de cada cópia.

Agrupar pelo menos dois nós de mesmo pai em um Frame:

```bash
lyra-cli-ipc canvas node frame --id <NODE_ID> --id <NODE_ID_2> --expected-canvas-revision <CANVAS_REVISION> --label "Scene" --dry-run --output json
```

```bash
lyra-cli-ipc canvas node frame --id <NODE_ID> --id <NODE_ID_2> --expected-canvas-revision <CANVAS_REVISION> --label "Scene" --output json
```

Desfazer o Frame:

```bash
lyra-cli-ipc canvas node unframe --id <FRAME_ID> --expected-canvas-revision <CANVAS_REVISION> --output json
```

### Códigos de erro

Códigos de exit do processo: `0` sucesso, `1` falha de validação/negócio do Canvas, `2` erro de comando ou de contexto IPC, `5` timeout, `6` falha de rede/transporte.

| Código de erro | Tratamento |
| --- | --- |
| `canvas_cli_revision_conflict` | Releia o Node alvo. |
| `canvas_cli_canvas_revision_conflict` | Releia o Canvas inteiro. |
| `canvas_cli_asset_revision_conflict` | Releia o Asset e o Canvas. |
| `canvas_cli_cursor_stale` | Descarte o cursor; consulte de novo a partir da primeira página. |
| `canvas_cli_asset_unavailable` | Não coloque esse Asset. |
| `canvas_cli_project_mismatch` | Pare; a Session atual não pertence ao projeto afirmado. |
| `COMMON_AGENT_CANVAS_RPC_ENDPOINT` / Session / capability ausentes | Não exiba nem configure variáveis de ambiente à mão; confirme que a execução está dentro de uma Session ativa do CommonAgent, repita `canvas capabilities` uma vez e, se ainda falhar, pare. |

---

## Notas de portabilidade

- **O que ela aciona.** Um único binário, `lyra-cli-ipc`, com o grupo de subcomandos `canvas`. É a ponte de IPC entre o host do agente ("CommonAgent") e o processo do editor CapCut/Lyra. Todo o estado vive no runtime do CapCut; o CLI é sem estado.
- **Premissas de Host/sessão (dependentes do runtime do CapCut).** O comando espera que o Host injete `COMMON_AGENT_CANVAS_RPC_ENDPOINT` mais identidade de sessão/capability no ambiente da ferramenta Bash que ele inicia. Exit code `2` por falta de contexto IPC é *comportamento esperado fora do CapCut* — uma portabilidade para Claude Code não "resolve" isso exportando variáveis; precisa rodar dentro do produto ou contra um endpoint reimplementado que fale o mesmo protocolo. A flag `--project-id` afirma em vez de trocar de projeto.
- **Conteúdo genérico/portável.** A disciplina operacional é reaproveitável como está: sonda de capacidades (schema `agent-hub.canvas-capabilities.v1`), ler-revision-antes-de-escrever, `--dry-run` para operações destrutivas/estruturais, releitura após a escrita, distinção `results[].node_id` vs `data.nodes[].object_id`, regras de estabilidade de cursor na paginação e a tabela de códigos de erro. Tudo isso mapeia limpo para qualquer CLI CRUD com guarda de revision.
- **Descrição da skill (frontmatter), traduzida:** "Use when CommonAgent needs to inspect current-project Assets or read and mutate persistent Canvas nodes through lyra-cli-ipc. Do not use for Timeline or draft-content editing, or for viewport-only selection, zoom, and pan." — em português: "Usar quando o CommonAgent precisar inspecionar os Assets do projeto atual ou ler e alterar Canvas nodes persistidos via lyra-cli-ipc. Não usar para edição de Timeline ou de conteúdo de draft, nem para seleção, zoom e pan restritos ao viewport."
- **Formato da portabilidade para Claude Code.** Uma portabilidade envolveria o `lyra-cli-ipc canvas ...` (ou um CLI substituto com a mesma superfície de verbos/flags) numa skill que exija `--output json`, um comando por chamada Bash e a tabela de concorrência acima. O encanamento de sessão/endpoint precisa ser substituído pelo transporte que o ambiente portado fornecer; tudo o que envolve `COMMON_AGENT_CANVAS_*` e diagnósticos de sandbox do macOS é específico do host CapCut e deve ser descartado ou reescopado.
