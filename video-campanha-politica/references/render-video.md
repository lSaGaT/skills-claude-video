# render-video.mjs — schema de cenas e configuração

Roda dentro da pasta do projeto (que contém `cenas.json`, `config.json` opcional, `fonts/`, narração e `fontes/` de carimbos):

```bash
node render-video.mjs            # renderiza video-final.mp4
node render-video.mjs --preview 37.6   # exporta só um frame em preview.png
```

Dependências: `@napi-rs/canvas`, `ffmpeg-static` (+ `node node_modules/ffmpeg-static/install.js`), `ffprobe-static`. Fontes Montserrat em `fonts/` (4 pesos: ExtraBold, Black, Bold, SemiBold).

## config.json (todos os campos opcionais)

```json
{
  "saida": "video-final.mp4",
  "badge": "FONTES: ANVISA · BUTANTAN · OMS",
  "arte": "arte-campanha.png",
  "fontesDir": "fonts",
  "somCarimbo": "audio/carimbo.mp3",
  "gap": 0.35, "lead": 0.3, "tail": 2.5
}
```

`arte` = arte oficial da campanha (paisagem, ex. 1200×630) usada no cena tipo `campanha`. `gap/lead/tail` = silêncios entre blocos, antes do primeiro e depois do último (segundos).

## cenas.json — array de cenas (1 cena = 1 bloco de narração)

Campos comuns a todas as cenas: `audio` (MP3 do bloco), `tipo`, `fundo` (`"claro"` azul royal, padrão; `"escuro"` azul-marinho para ataques), `carimbos` (opcional).

**`carimbos[]`** (efeito estampa com som de impacto — som mixado automaticamente no pouso):
```json
{ "imagem": "fontes/05-g1-20201119-lote-120-mil-doses.png", "x": 330, "y": 890, "largura": 550, "t0": 0.60, "rotacao": -4 }
```
`x/y` = centro do carimbo (canvas 1080×1920); `t0` = fração da duração do áudio da cena (0 a 1) em que pousa.

### tipo: "titulo" — gancho / motivacional
`heroi` {texto, cor, t0} — palavra-herói (y 480); `linhas[]` {texto, cor, t0} — linhas de apoio a partir de y 700; `pergunta` {texto, cor, t0} — linha gigante final (y 1160) que apaga as linhas anteriores.

### tipo: "lista" — ranking/dados
`cabecalho` (y 220); `itens[]` (strings, pills sequenciais a partir de y 400, máx 5); `remate` {texto, cor, t0} — aparece (y 620) e APAGA os itens; `final` {texto, t0} — linha branca (y 1170).

### tipo: "checklist" — prova do "outro lado"
`cabecalho`, `corCabecalho`; `itens[]` (pills com ✓ verde, a partir de y 430, máx 4); `linhasFinais[]` {texto, cor, t0, grande} — textos na base (y 1545+, `grande` = 86px, senão 50px).

### tipo: "contador" — o número impacto
`cabecalho[]` (2 linhas no topo); `rotulo` ("BRASIL"); `valor` (número que rola de 0 até ele, ex. 59); `sufixo` ("DIAS"); `itens[]` {texto, t0} — comparações em tom claro (y 1090+, máx 2); `destaques[]` {texto, t0} — linhas amarelas (y 1370+, máx 2).

### tipo: "empilhada" — ataque com desmonte final
`elementos[]` construídos em sequência (cursor de y 240):
- `{"tipo":"linha","texto","cor","t0"}` — avança ~75 px
- `{"tipo":"pill","texto","t0"}` — pill amarelo, avança 150 px
- `{"tipo":"citacao","texto","autor","t0"}` — card branco com linha vermelha, avança 240 px
`remate` {texto, t0} — linha amarela que permanece; `palavraFinal` {texto, t0} — palavra gigante (ex. "PONTO.") que APAGA os elementos (o remate e os carimbos ficam).

### tipo: "campanha" — fechamento (sem badge)
`linhasTopo[]` {texto, t0}; `voto` {legenda, numero, t0} — "V O T E" + número gigante; `arte` {legenda, t0} — sobe o `config.arte` num card com sombra + legenda; `pill` {texto, t0} — pill amarelo final.

## Cores (nomes nos campos `cor`)

`destaque` (amarelo), `branco`, `verde`, `vermelho`, `apoio` (cinza-azulado). Herói e linhas grandes sempre em Black (900); itens Bold (700).

## Regras de tempo

Todos os `t0` são **frações da duração do áudio da cena** (0 a 1). Sincronize: ouça/estime em que fração da fala o dado é citado e ponha o carimbo/elemento ali (o som de carimbo é mixado automaticamente em `start + t0*dur + 0.16s`, o instante do pouso).

## QA obrigatório (o render não substitui olhos)

Extraia frames de cada cena do MP4 final e olhe (estourou lateral? cor trocada? carimbo cobrindo texto essencial?). Confira o pico do carimbo com volumedetect (~0 dB na janela do pouso).
