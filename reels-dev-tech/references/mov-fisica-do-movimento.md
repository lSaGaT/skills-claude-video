# MOV — Física do movimento: curvas, durações, antecipação, follow-through

> Fonte: auditoria quadro a quadro do reel de referência (81,41 s) + os 9 princípios de
> animação aplicados a motion graphics + `motion-graphics-skills` (efeitos 07/08/09:
> "spring stack", "magnetic dock", "masked type") + `iart-ai/web-animation-skills`.
> Regra do render: **cada frame é função pura de `t`** — nada de estado acumulado.

## 1. Tabela de curvas (valores para copiar)

| nome | expressão | uso |
|---|---|---|
| `outCubic` | `1-(1-t)³` | entrada padrão de texto pequeno |
| `outQuart` | `1-(1-t)⁴` | cards e janelas |
| `outExpo` | `1-2^(-10t)` | entrada "premium", contadores |
| `outQuint` | `1-(1-t)⁵` | câmera (assentar sem quicar) |
| `outBack` s=1,56 | `1+2,56(t-1)³+1,56(t-1)²` | pop com peso: pill, dot, badge |
| `inBack` | `2,56t³-1,56t²` | antecipação antes de arrancar |
| `inOutCubic` | — | voo do cursor, whip pan |
| `inOutQuint` | — | whip curto de 2–3 frames |
| `smooth` (smootherstep) | `6t⁵-15t⁴+10t³` | keyframes de câmera |
| `outElastic` | — | só no fecho (♥, badge) — 1 uso por vídeo |

Springs: default k=300 d=30 · bouncy k=400 d=17 · pesado k=120 d=20 · crítico k=500 d=50.
Sem spring library, aproximar por `1 - e^(-8t)·cos(12t)` (2 oscilações decaindo).

## 2. Durações por tipo (30 fps: 100 ms = 3 frames)

| gesto | duração |
|---|---|
| micro/UI (hover, dot, chip) | 100–250 ms |
| entrada de card/texto | 280–350 ms |
| pop com peso (outBack) | 350–450 ms |
| transição de beat | 160–400 ms |
| hero/display word | 400–800 ms |
| push de câmera | 800–2000 ms |
| zoom de evidência (ida e volta) | 300–450 ms ida + 300 volta |
| contador (%/frames) | 600–900 ms |
| stagger de lista | 40–80 ms/item (grid denso 20–40) |
| derrete de saída | 160–300 ms |

Distância → duração (scroll/voo/cursor): `ms ≈ 300·(dist/200px)^0,5`.

## 3. Os sete princípios que o olho cobra

1. **Antecipação** — todo salto grande começa com recuo (60–120 ms; scale dip 0,95 ou
   −6 px). Sem isso o movimento "teleporta".
2. **Follow-through** — partes secundárias (sombra, tooltip, ícone, sub-label) pousam
   40–80 ms **depois** do corpo, com `outCirc` e micro-overshoot.
3. **Arco** — nenhum deslocamento em linha reta: perpendicular de 6–14% da distância.
4. **Não gêmeos** — pares simétricos nunca no mesmo timing: 60–100 ms de defasagem e
   1–2 px de diferença de amplitude.
5. **Regra do ⅓** — no máximo ⅓ do elenco se movendo ao mesmo tempo; o resto em idle.
   Nenhuma distância percorre mais de ⅓ da tela sem keyframe intermediário.
6. **Idle vivo** — elemento parado respira (±1,5–3 px, 2,5–4 s) ou pulsa 3–6%.
7. **Rápido com significado lento** — a ação pode ser rápida desde que o *resultado*
   fique na tela. Contraste rápido↔segurado é o que dá ritmo.

## 4. Snippets

```js
export const EASE = {
  outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outBack: (t, s = 1.56) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  inBack:  (t, s = 1.56) => (s + 1) * t * t * t - s * t * t,
  smooth:  t => t * t * t * (t * (t * 6 - 15) + 10),
};
export const tr = (t, t0, dur, fn = EASE.outCubic) => fn(Math.min(1, Math.max(0, (t - t0) / dur)));
```

## 5. Checklist de QA de movimento

- [ ] Nenhum elemento entra só com fade (sempre deslocamento/scale junto).
- [ ] Direção de entrada alterna entre beats.
- [ ] Cada beat tem 1 gesto herói + ≥2 microgestos (ver `mov-beats-transicoes.md` §4).
- [ ] Follow-through nas partes secundárias.
- [ ] Nada pousa com velocidade ≠ 0; nada sai com v ≠ 0.
- [ ] Faixa de frames consecutivos (0,1 s) prova a continuidade — still de 0,5 s em 0,5 s
      não engana easing (mas é o mínimo para achar ONDE olhar).
