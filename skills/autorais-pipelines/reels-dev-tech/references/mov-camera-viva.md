# MOV — Câmera viva: push, pan, snap, whip e handheld

> No reel de referência **não existe plano sem câmera**. Mesmo no beat mais parado há
> 1–3% de push e 8–12 px de deriva. A câmera é o que separa "slide" de "vídeo".

## 1. API (`lib/mov.mjs`)

```js
camShot(g, lt, dur, {
  keys: [{ t: 0, zoom: 1 }, { t: 2.6, zoom: 1.075 }],  // t em segundos do bloco
  focus: [360, 560],     // ponto que fica parado durante o zoom
  drift: 9,              // px de deriva (2 senos, períodos diferentes)
  driftPeriod: 5.2,
  jit: 1.8,              // tremor fino (handheld)
  rot: 0.0016,           // rad de roll residual
  entryAmp: 140,         // deslize de entrada do corte
  grain: 0.13,
}, (gg) => { /* desenha a cena em 720x1280 */ });
```

O zoom é interpolado por `smootherstep` entre keys — nunca linear. Keyframes com
`t` fora do bloco são ignorados (último key vence).

## 2. Os cinco tipos de plano e quando usar

| tipo | keys (exemplo) | efeito | onde o ref usa |
|---|---|---|---|
| **push-in** | `1 → 1,08` ao longo do bloco | aproxima, cria intimidade | 0–2,5 s; 12–15 s |
| **pull-back** | `1,09 → 1,0` | revela contexto | 10–12 s (creme) |
| **snap de evidência** | `1 → 2,0 → 1` em 0,3 s | aponta o detalhe | 5,5 s ("O"), 23 s (curva), 71 s ("trema") |
| **pan/drift** | `x` desloca 40–80 px | leitura em movimento | 6–8 s (Finder) |
| **whip** | deslocamento vertical + ghosts na entrada | corte com energia | 19,5 s, 35 s, 69 s |

Regra de ritmo: **alternar** push / pull / snap entre blocos vizinhos. Três pushes
seguidos = zumbi andando.

## 3. Handheld: o que faz parecer filmado

```js
dx = noise1(t/5.2) * 9   + noise1(t*2.1) * 1.8;   // deriva + tremor
dy = noise1(t/5.2+0.37) * 9 + noise1(t*2.37) * 1.8;
rot = noise1(t/3.1) * 0.0016;
```

- `noise1` é soma de 3 senos (1,0 / 2,14 / 4,31 Hz) — não repete visivelmente e é
  determinístico (o frame `t` desenha sempre igual).
- **respiração** (`breath: 0.004`, período 3,2 s): o zoom ondula ±0,4%, como um dolly
  lentíssimo. Sobe o piso de movimento ~0,2–0,3 sem parecer tremor — é o truque mais
  barato para tirar o quadro do congelado.
- Tremor acima de 3 px vira "câmera trêmula" de celular na mão: feio. 1,5–2,5 px é o
  ponto em que o quadro "respira" sem tremer.
- Roll acima de 0,003 rad (~0,17°) já dá náusea em 9:16.

## 4. Entrada do corte (o peso que falta no corte seco)

O ref não corta "no talo": o plano novo **desliza** 60–200 px e assenta em 0,18 s, com
3 cópias fantasma a 18% de alpha. Isso gera o pico de 3–8 de movimento na virada e
faz o corte "bater".

```js
const off = (1 - M.outCubic(lt/0.18)) * 140;
for (let i=3;i>=1;i--) desenha(gg, off*(1+i*0.55), 0.18*(1-i/4.2));
desenha(gg, off, 1);
```

Alternar a direção do deslize entre blocos (`entryAmp` positivo/negativo). Sempre para
o mesmo lado = metrônomo.

## 5. Zoom de evidência — como não estourar

- 1,4–1,6× para "olhe isto"; 2,0–2,6× só para objeto pequeno e isolado.
- Sempre voltar ao 1,0 no fim do gesto (0,3 s) — ficar ampliado trava a leitura.
- Antes de ampliar, medir a caixa do elemento: `zoom · (x + w)` deve caber em 720.
  O ref corta o "%" do "99%" quando passa de 1,1 em título grande.

## 6. Checklist

- [ ] Todo bloco tem `keys` (nem que seja 1 → 1,05).
- [ ] Nenhum par de blocos vizinhos com o mesmo gesto de câmera.
- [ ] `focus` no assunto do beat, não sempre no centro (360,640).
- [ ] Entrada de corte presente em todos os blocos com `entryAmp` alternado.
- [ ] Nenhum plano com zoom >1,6 sobre texto que precisa ser lido por inteiro.
