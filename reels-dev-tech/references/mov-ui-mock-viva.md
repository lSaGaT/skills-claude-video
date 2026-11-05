# MOV — UI-mock vivo (janelas, chips, listas, gráficos, comentários)

> O ref vive de mocks de UI (Finder, Projetos, editor, comments, barras). O que dá vida n04 é o LAYOUT — é a micro-interação.

## 1. Janelas e cards

- Entra: scale 0.92→1 outBack 350–450ms + leve rise 16–24px; abaixo das janelas uma sombra que GRPÓS (elicidade: sombra cresce 20↔10% na entrada).
- Dropdown/resultado: chips/list(items) entram em stagger 150–250ms um a um (Finder 19,9→20,9s: slots vazios →.pop 1 arquivo, depois outro).
- Janela "focus-selecionável": título barrinha com fade mais lento que o body (interior chega antes da esqueleto).
- Resize do mock (65–66s): largura anda step a step com badge azul "396 × 560" piscando no grid — badge troca número com flip vertical (outQuinta).

## 2. Hover & cursor dentro do mock

- Píllula hover "Clique" STICKS no cursor e passeia; hover highlight (row gentilil glow) troca de row com a pílula.
- Placeholder "Peça uma alteração…" entra já na entrada da field; cursor de texto I-beam pisca OCR (blink 2Hz determinístico: `Math.floor(t/0.5)%2`).
- Digitação no chat: progressione texto caret laranja block; prompt responde com chip roxo listado (21x) com typing próprio.

## 3. Cliques e ripples

```js
// ripple: 1–2 anéis + alpha caindo, 600–800ms
export function ripple(ctx, x, y, t, t0, rMax = 420, color = '#a06bfb') {
  const p = tr(t, t0, 0.8);
  if (p >= 1 || p < 0) return;
  for (let i = 0; i < 2; i++) {
    const pi = tr(t, t0 + i * 0.12, 0.75);
    if (pi >= 1) continue;
    ctx.strokeStyle = color; ctx.globalAlpha *= (1 - pi) * 0.6;
    ctx.lineWidth = (6 - 4 * pi) * S;
    ctx.beginPath(); ctx.arc(x, y, EASE.outCirc(pi) * rMax * S, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
```
- No clique real (62,5s): ripple + **morf instantâneo de cor** do elemento clicado (círculo laranja→roxo same-frame) + dock de dots atualiza cor. Mudança de estado SEM easing (pop) + ripple em volta = sensação de computador.

## 4. Dados/gráficos vivos

- Contador grande (%: 13→99%): número outExpo; quando um ring arredonda, ...
- Barras (chart 63,8–69s): arrulkam/entram com stagger por índice e altura outExpo; **bola branca quica entre as pontas das barras** (bounce squash) alternando velocidade conforme badge "1x → 2x → 4x" (badge conta com tween 350ms).
- Waveform (51–56s): barras crescem do centro; playhead vermelho salta (marcador), barras perto do playhead pulsam mais; timestamp mono anima (00:15:27 / 01:24:21).
- Progress card "Renderizando… 13%": % outExpo + barra fill + "tempo restante" mono tick.

## 5. Listas que morrem

- Delete row (76–77s): clip tomba — rotate ±15–25° + translate offscreen com easeIn + tilt crescente; row vizinha fecha gap (translateY complementar).
- Drop na lixeira (23–24s): arquivo persegue cursor até a lixeira com arco; chegou, pop na lixeira (scale 1.15→1).
- Strike "timeline" (76,4s) + rows tombam: é derrete + tomba (2 saídas encadenadas — beats longas têm 2 gestos herói).

## 6. Comentários/Avatares (73–80,8s)

- Card "Comentários" entra reposicionado (glass dark) com avatar teal dot.
- Comment "MOTION" typed no input; ENTER → sobe pra lista com bounce (outBack) e coração ♥ cinza→VERMELHO pop no clique cursor (80,4s).
- Título "comenta" + palavra gigante "MOTION" roxa acalmia prazo caída: entra por cima da UI com blur pesado e bounce alto (y: −equivocamente 300px→0, outBack 1.5 amplitude) e depois fica com micro-sway.
- Caption final serif-cursivo "que eu te mostro como fiz." typed com much slower cadência (90ms/letra).
