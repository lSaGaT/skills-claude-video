# MOV — Grão, atmosfera e o piso de movimento

> Todo quadro do reel de referência tem ruído. Não é sujeira de compressão: é grão
> aplicado, e é ele que faz um fundo preto chapado parecer filmado em vez de renderizado.
> Medido: fundo parado no ref dá 0,15–0,35 de diferença entre quadros; sem grão dá 0,00.

## 1. Grão (obrigatório, em cima de TUDO)

```js
import { grain } from "./lib/mov.mjs";
// depois do desenho do bloco, fora da câmera (o grão não deve herdar zoom)
grain(g, tGlobal, { alpha: 0.13, seed: 3 });
```

Implementação (`lib/mov.mjs`): 6 máscaras de ruído 760×1320 geradas **uma vez** no boot
(`createImageData`), alternadas a cada frame com deslocamento inteiro pseudoaleatório.
Custo: 1 `drawImage` por quadro — pode rodar a 30 fps sem suar.

Receita do alpha:

| situação | alpha |
|---|---|
| fundo preto + texto branco (padrão do ref) | **0,12 – 0,15** |
| fundo creme / claro | **0,05 – 0,08** |
| cena com muito texto miúdo | 0,08 – 0,10 |
| transição/impacto | +0,05 por 3 frames (opcional) |

Por que não ruído "de verdade" por pixel a cada frame: gera arquivo gigante (o encoder
gasta bits no ruído). Ruído pré-renderizado + deslocamento dá o mesmo efeito visual e
mantém o H.264 em ~1 MB/10 s.

## 2. Dot grid (a textura de fundo do ref)

- passo 26 px (escala 720), ponto 1,6 px, branco a **7,5%** sobre preto.
- Na versão clara: preto a 5,5%.
- O grid **acompanha a câmera** (está dentro do `camShot`), então o push já o move e cria
  paralaxe aparente contra o texto. Nunca animar o grid por conta própria: parece papel
  de parede.

## 3. Brilho (glow) que respira

O ref tem um radial laranja atrás do assunto. Ele nunca é estático:

```js
const pulso = 1 + 0.05 * Math.sin(t * 1.7);        // 3 s por ciclo
bg(g, t, { gx: 360, gy: 700, glowA: 0.15 * pulso, gr: 560 });
```

Sem isso, o gradiente é um adesivo. Com 5% de variação, o canto escuro "ferve" de leve e
o quadro parece filmado.

## 4. Sheen (varredura de luz)

Uma faixa branca a 5% atravessando a cena a cada 3–4 s, em diagonal, por 0,9 s
(`sheen()` em `lib/mov.mjs`). Usar só em planos longos (>3 s) e com conteúdo escuro;
em plano curto vira tique.

## 5. Vinheta

`vignette(g, 0.35–0.5)` depois do bloco, antes do grão. No ref a borda superior é sempre
mais escura que o centro — é isso que faz o texto branco "saltar" no feed.

## 6. Ordem de camadas (não inverter)

```
camShot( fundo → conteúdo → grão NÃO )
  └─ bloco desenha: bg, glow, dot grid, elementos
vinheta           (em coordenadas de tela, fora da câmera)
grão              (por último, fora da câmera)
texto de UI fixo  (só se existir: legenda/CTA fora da câmera)
```

Grão **fora** da câmera: se entrar dentro, o push amplia o ruído junto e ele vira
"formigamento" nos primeiros 2 s de cada plano.

## 7. Checklist

- [ ] Grão presente em todos os blocos (inclusive no creme, com alpha menor).
- [ ] Glow variando ≥3% ao longo do bloco.
- [ ] Vinheta antes do grão.
- [ ] Nenhum bloco com fundo 100% uniforme e imóvel.
- [ ] Arquivo final ≤ ~120 MB para 81 s (se estourar, o grão está forte demais).
