# MOV — Cursor e clique: o ator mais barato do formato

> O reel de referência tem cursor em ~18 dos 22 beats. Ele é o que transforma um mock
> estático em "alguém está usando isso agora". Cursor parado é pior que cursor ausente.

## 1. API

```js
import { cursorTravel, ringClick } from "./lib/mov.mjs";

cursorTravel(g, lt, [
  { t: 0.4,  x: 700, y: 520 },
  { t: 1.1,  x: 520, y: 402 },
  { t: 2.0,  x: 300, y: 700, click: true },
], { label: "EDITOR CHEFE", scale: 0.92, arc: 0.12 });
```

- posições interpoladas com `inOutCubic` (nunca linear — linear é o principal
  denunciador de "animação de robô");
- **arco**: deslocamento perpendicular ≈ 6–14% da distância (`arc: 0.12`);
- **antecipação** antes de clique: recua 6 px e afunda 4 px nos 0,16 s anteriores;
- **trail**: 3 pontos brancos a 18% no rastro quando a velocidade é alta;
- `click: true` dispara `ringClick` — dois anéis expandindo na cor de destaque.

## 2. Distância → duração

| distância (px em 720) | duração |
|---|---|
| 60–150 | 0,22 – 0,30 s |
| 150–350 | 0,35 – 0,50 s |
| 350–700 | 0,55 – 0,80 s |
| >700 (travessia de tela) | quebrar em 2 tramos com ponto intermediário |

Regra: `dur ≈ 0,3 · (dist/200)^0.5`. Cursor que atravessa a tela em 0,2 s parece teletransporte.

## 3. Pílula de rótulo

- retângulo `#f1561c`, raio 6, texto branco 700/17 px, 9 px de padding;
- aparece **depois** do cursor chegar (0,15–0,3 s de atraso), não junto;
- some quando o cursor sai do repouso;
- nome sempre consistente (é "quem está usando"). Se a marca é X, o rótulo é X em todos
  os beats — trocar de nome no meio quebra a ficção.

## 4. Clique = causa → efeito (a transição mais valiosa)

O ref quase nunca corta "por fora": ele **provoca**. Todo clique tem consequência
animada nos 200–400 ms seguintes:

| clique | consequência |
|---|---|
| "Abrir" no modal | modal cai (squash 0,2) e a janela pedida sobe |
| arrastar arquivo na lixeira | lixeira "recebe": borda acende + arquivo encolhe |
| prompt digitado | card novo entra em 0,35 s |
| cor escolhida | blob morfa laranja→roxo em 0,18 s + dock atualiza |
| coração | ♥ cinza→vermelho com pop 1,0→1,25→1,0 |

Se o clique não muda nada em 300 ms, é decoração — melhor tirar.

## 5. Agendamento dentro do bloco

```js
const T = 1.35;            // quando o clique acontece (segundos do bloco)
cursorTravel(g, lt, [{t: T-0.5, x: x0, y: y0}, {t: T, x: xc, y: yc, click: true}]);
if (lt > T) { /* consequência com outBack a partir de T */ }
```

Nunca amarrar a consequência ao cursor "chegar" por interpolação: usar o tempo do evento.
Assim, se o cursor for reposicionado, o efeito continua cravado.

## 6. Onde o cursor NÃO deve estar

- em cima de texto que o viewer precisa ler (colocar à direita/abaixo do bloco de texto);
- no mesmo lugar em dois beats seguidos (o ref move sempre ≥150 px entre beats);
- sobre a legenda ou a área do CTA.

## 7. Checklist

- [ ] ≥1 cursor por beat (exceto os 2–3 beats de pico tipográfico).
- [ ] Todo trajeto com arco, nenhum em linha reta.
- [ ] Todo clique com consequência em ≤400 ms.
- [ ] Pílula nunca sobreposta ao texto principal.
- [ ] Cursor sai de cena (fade 0,15 s) antes do melt, ou o melt o leva junto.
