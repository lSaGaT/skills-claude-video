# MOV — Texto vivo: typing, passos, caret e o bug que embolou a réplica

> O texto é o principal ator desse formato. No ref, praticamente **todo** texto entra
> digitado — e o que já estava na tela continua vivo (caret, crescimento, cor).

## 1. O bug que arruinou a primeira réplica

Padrão errado, muito comum:

```js
if (a1 > 0) textT(g, "são feitas", ...);
if (a2 > 0) textT(g, "são feitas em", ...);      // ← desenha por cima
if (a3 > 0) textT(g, "são feitas em html", ...); // ← por cima de novo
```

Resultado: letras sobrepostas em negrito duplo, "sãofeitasemhtml" embolado. Além de
feio, **destrói a leitura** — é o defeito mais visível de uma réplica amadora.

## 2. A solução: `typeStep()` (texto cumulativo)

```js
import { typeStep } from "./lib/mov.mjs";

typeStep(g, [
  [0.05, "são feitas"],
  [0.50, "são feitas em"],
  [0.72, "são feitas em html"],
], t, { size: 56, font: "AB", align: "center", x: 360, y: 470,
        color: C.white, novo: "#e8603a", tracking: -2 });
```

Como funciona: acha o passo vigente, desenha **só ele**, e anima apenas o **delta**
(caracteres novos) com alpha + subida de 0,35 em `size` durante 140 ms. O texto anterior
permanece — é exatamente o que o ref faz (a palavra cresce, não pisca).

Parâmetros úteis: `instant` (0,14 padrão), `novo` (cor do trecho recém-digitado),
`caretOn` (mostra caret no fim enquanto digita).

## 3. Typing letra a letra (`typing()` do kit)

Para títulos que nascem letra por letra com letra "em progresso" cinza:

```js
typing(g, "VÍDEO", 52, 619, { size: 181, font: "AB", t: lt, t0: 0.6,
        ms: 82, solid: 0.2, color: C.white, cinza: "#8a8a8e" });
```

- `ms` é o intervalo por letra. Referência: 60–85 ms para display (100–180 px),
  40–55 ms para mono/código, 90–110 ms para serif grande (240 px).
- `solid` é quanto tempo a letra fica cinza antes de virar branca (0,16–0,22 s).
- Velocidade percebida: 12–16 letras/s. Acima disso o olho não lê; abaixo, dá sono.

## 4. Caret (o "de graça" que quase todo mundo esquece)

- pisca a **2,2 Hz** (`Math.floor(t * 2.2) % 2`), barra de `0,09·size` de largura e
  `0,94·size` de altura, na cor de destaque (laranja) quando o caret é "do sistema",
  preto quando é do documento (o bloco creme do ref usa caret preto).
- o caret **acompanha a última letra**: passe a posição devolvida por `typing()`
  (`{ hx }`) ou por `typeStep` (retorno `w`).
- caret que não pisca (sólido) = parece bug de render.

## 5. Palavra-a-palavra em parágrafo (`wordReveal()`)

Para blocos de 5–8 linhas (o "O texto que você tá lendo…"):

```js
wordReveal(g, "O texto que você tá lendo agora foi animado por uma IA", x, y, {
  size: 27, font: "MXB", gap: 0.075, maxW: 420, corAtual: C.orange,
});
```

- `gap` 0,06–0,09 s por palavra: a linha "se escreve" na velocidade da fala.
- a palavra recém-entrada aparece em `corAtual` por 0,24 s e vira branca — é o que dá
  a sensação de digitação mesmo quando as palavras entram em bloco.
- quebra de linha automática em `maxW`; nunca deixar uma palavra sozinha na última linha
  (ajustar `maxW`).

## 6. Hierarquia tipográfica do ref (medida)

| camada | fonte | tamanho (720) | cor | uso |
|---|---|---|---|---|
| display | Inter Display Black | 100–181 | branco | 1–3 palavras por beat |
| destaque | Inter Display Black | mesmo | `#f1561c` | a palavra que carrega o sentido |
| legenda | Montserrat Bold | 26–42 | `#8a8890` → branco | fala |
| nota | Instrument Serif Italic | 34–78 | `#cfcdc4` / roxo | comentário do autor |
| código | IBM Plex Mono | 19–38 | `#e0663a` | editor falso |

Regra do ref: **uma leitura por vez**. Duas hierarquias competindo no mesmo segundo
(display + legenda + nota todas entrando juntas) = confusão.

## 7. Checklist

- [ ] Nenhum texto desenhado duas vezes no mesmo `y` (ver `typeStep`).
- [ ] Todo texto de fala entra por passo/typing, não por fade inteiro.
- [ ] Caret visível em pelo menos uma camada por beat de escrita.
- [ ] Nenhuma palavra nova sem `novo` (cor de destaque) por 0,2 s.
- [ ] Largura medida antes de centralizar: `measureT()` — nunca hardcode do centro.
