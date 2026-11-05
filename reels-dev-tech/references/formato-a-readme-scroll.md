# Formato A — README Scroll (o cavalo de batalha)

14 dos 23 reels de referência usam exatamente este template. É o formato mais rentável:
o conteúdo já existe (o README), o custo é montagem, e a "sensação de prova real" é alta.

## O que aparece na tela

1. Fundo em gradiente (magenta → roxo → azul) sangrando 2,5% nas bordas, com glow.
2. Janela de navegador falsa, raio 3% da largura, fundo `#0d1117`:
   - barra superior (5% da altura): favicon do GitHub, título truncado `GitHub - usuario/repo…`, botão `+`;
   - pílula de endereço: cadeado + `github.com/usuario/repo`.
3. Viewport do README (captura real, largura = viewport), rolando em **saltos**.
4. Caixas de destaque amarelas sobre o elemento citado (contorno, não preenchimento).
5. Legenda cinética no terço inferior, sobre scrim preto.
6. Cartão final com a pílula do repo + "NOS COMENTÁRIOS".

## Medidas (escala 1080×1920; multiplique por 0,667 para 720×1280)

| item | valor |
|---|---|
| sangria da moldura | 27 px |
| raio da janela | 34 px |
| barra do navegador | 96 px |
| pílula de URL | 69 px de altura, raio 35 |
| início da legenda | y = 1245 |
| legenda | 69 px, peso 800, caixa alta, entrelinha 1,15, tracking −0,02 em, largura máx. 900 px |
| acento | `#ffd84d` (texto) ou pílula amarela com texto `#0d1117` |
| destaque no conteúdo | 4,5 px `#ffd400`, raio 15, inset −9 |
| scrim | gradiente `rgba(0,0,0,0)` → `#000` de y=1100 a 1920 |
| scroll por beat | 120–300 px (escala 1080); rolamento na virada da fala, duração proporcional à distância (300 ms–1,15 s, ~2.400 px/s) |
| hold da caixa | 1,5–3 s; 1 ou 2 caixas simultâneas |

## Ritmo (o detalhe que separa 6/10 de 8/10)

- **1 linha de legenda por 0,8–1,3 s.** Nunca uma linha por cena.
- A linha **entra inteira** (sem build-in palavra a palavra); o que se move é o **acento**:
  a palavra-chave amarela avança dentro da mesma linha conforme a locução.
- O scroll **para** enquanto a legenda muda. Movimento e leitura nunca competem.
- Cada linha tem no máximo 3 palavras. Se a ideia não cabe em 3 palavras, viram 2 linhas (2 beats).
- Duas linhas simultâneas só no fim de frase (fecho), nunca no meio.
- O autor de referência abre com dor/contradição; a primeira caixa de destaque só aparece no beat 2.

## Como montar (receita técnica)

1. Capturar o README num PNG alto, largura = viewport (1080), com Chrome headless:
   `puppeteer-core` → `page.setViewport({width:1080, deviceScaleFactor:1})` → `fullPage:true`.
   Guarde também, no momento da captura, o `boundingClientRect` de cada elemento que você
   vai destacar (parágrafo, célula de tabela, bloco de código) → essas coordenadas são as
   `boxes` do JSON de cena.
2. Marcar os beats no JSON (schema abaixo), com o tempo vindo do áudio.
3. Rodar `scripts/render-readme-scroll.mjs roteiro.json`. Ele desenha moldura, janela,
   scroll, caixas, legenda e cartão final, e encoda direto (canvas → raw → x264).
4. Mixar a voz + trilha por cima (`ffmpeg -shortest`), normalizar a −14 LUFS.

### Schema do JSON de cena

```json
{
  "size": [1080, 1920],
  "fps": 30,
  "repo": "bradautomates/claude-video",
  "url": "github.com/bradautomates/claude-video",
  "pageImage": "page.png",
  "beats": [
    { "t": 0.0, "dur": 1.4, "scroll": 0,
      "caption": "SEU AGENTE", "accent": [1], "mode": "text" },
    { "t": 1.4, "dur": 2.2, "scroll": 120,
      "caption": "SO ENTENDE TEXTO", "accent": [2],
      "boxes": [[48, 210, 984, 120]] },
    { "t": 3.6, "dur": 2.6, "type": "endcard", "caption": "NOS COMENTARIOS" }
  ]
}
```

- `scroll` é absoluto (px da página); o renderer rola do valor anterior **na virada da fala**, com duração proporcional à distância (ajuste curto é discreto; salto longo rola mais rápido) e fica **parado** entre rolamentos. Sem drift: deriva por beat dá tranco na virada.
- `boxes` em coordenadas da imagem da página; desenhadas só depois de `scroll` aplicado. O traço do contorno anima **uma vez**, na entrada da caixa; se a fala seguinte aponta para a mesma caixa, o contorno fica completo (nunca redesenha o círculo a cada linha).
- `accent` = índices das palavras (0-based, na ordem da legenda) que recebem o amarelo.
- `type: "endcard"` troca para o fecho (fundo preto, pílula do repo, frase final).
- `mode: "pill"` põe fundo amarelo atrás da palavra em vez de colorir o texto.

## Copy do beat (o que funcionou 23 vezes)

- dor → "Seus agentes de IA esquecem tudo entre uma sessão e outra."
- nome → "Chama-se ai-memory-installer."
- promessa → "Sobe a memória num VPS Ubuntu com Cloudflare Tunnel e hardening automático."
- prova → "45 mil estrelas em 11 dias." / "passou nos 3.205 testes originais."
- ressalva → "Ainda é alfa." / "Uso autorizado apenas."
- compatibilidade → "Claude Code, Codex, Cursor."
- fecho → "Link fixado no primeiro comentário."

## Erros a evitar

- rolagem contínua (parece gravação amadora e briga com a leitura);
- rolar com velocidade igual para toda distância: salto longo precisa rolar mais rápido, senão vira teletransporte;
- reanimar o contorno da caixa a cada linha de legenda (o círculo refazido a cada segundo vira estrobo);
- deriva/drift de scroll "para não congelar": o reset na virada da fala dá tranco visível;
- legenda com mais de 3 palavras ou duas ideias;
- caixa de destaque em elemento que a fala não citou;
- slate/título de template aparecendo no topo do quadro;
- captura com barra de rolagem visível (esconda com CSS).
