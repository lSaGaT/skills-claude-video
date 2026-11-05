# MOV — Anatomia de beat e transições (nada nasce pronto: rascunho → pouso → vida → derrete)

> Auditoria do ref mostra a MESMA gramática em todos os 22+ beats. Esta referência é a
> gramática. "Movimento natural" = todo elemento passa por quatro estados, e a cena
> nunca fica sem pelo menos um deles ativo.

## 1. Os quatro estados

### 1.1 Rascunho (draft) — 250–450 ms
O elemento nasce **imperfeito** e se corrige.
- Display grande ("EDITADO", "99%"): 4–6 cópias fantasma com offsets determinísticos
  (`hash01`), convergindo + alpha ramp + scale 1,10→1,0 → `draftText()`.
- UI (pill, janela, card): entra de 0,90–0,94 com `outBack` → `popIn()`.
- Texto de fala: nasce **cinza** e vira branco → `typing()` / `typeStep()`.

### 1.2 Pouso — 80–160 ms
Overshoot de 3–6% e volta. Um freeze de 2–3 frames logo após o pouso dá "peso de
impacto" (é o que o olho lê como pancada). Em título grande, o overshoot é o que
denuncia qualidade: `outBack` com s=1,56, nunca s>2.

### 1.3 Vida (hold) — o estado que a primeira réplica ignorou
Nada fica parado:
- câmera empurra/deriva (sempre);
- grão (sempre);
- texto digita, caret pisca, contador sobe, playhead corre, barra cresce;
- elemento parado tem `sway()` ±1,5–3 px (período 2,5–4 s);
- glow pulsando ≥3%.

### 1.4 Derrete (exit) — 160–300 ms
A cena colapsa para baixo/diagonal: ghosts com offsetY crescente (18→84 px), alpha
decrescente, squash Y 0,78 e escurecimento final. Em beats com glitch, somar aberração
RGB ±2 px.

> Não é fade. Fade sozinho lê como "PowerPoint".

## 2. Costura entre beats

| tipo | como | onde o ref usa |
|---|---|---|
| **entrada deslizante** (padrão) | plano novo entra 40–200 px e assenta em 0,18 s, com ghosts | ~todos os cortes |
| **derrete-diagonal** | §1.4 no fim do bloco | 5,5 s; 55 s |
| **iris circular** | círculo escuro fecha sobre o foco | 14,9 s; fim do creme |
| **whip** | deslocamento vertical rápido + streaks | 19,5 s; 35 s; 69 s |
| **match cut** | elemento sai e entra na mesma posição de tela | 38→39 s |
| **causa→efeito** | um clique/digitação provoca o beat novo | 27 s; 62 s; 80 s |

Direções de entrada **alternam** entre blocos. Três entradas do mesmo lado = metrônomo.

## 3. Contrato entre blocos (calibragem)

- fronteira do bloco: calibrar **bilateralmente** (ex.: B18/B19 em 70,00 exato;
  B21/B22 em 76,65). Stills em `t0-0,1` e `t0+0,1` provam de que lado cada bloco aparece.
- nenhum vão: o desenho de um bloco nunca "vazio" entre `t1` do anterior e `t0` do seu.
- a entrada do próximo **começa antes** do fim visual do anterior (o derrete é a ponte).
- bloco curto (<2,5 s) usa derrete de 0,16 s, senão o melt come 15% do plano (foi um
  bug real: B11 de 2,0 s estava derretendo em t=43,8).

## 4. Orçamento de movimento por beat

Cada beat precisa de **1 gesto herói + 2 microgestos**:

| gesto herói | microgestos |
|---|---|
| palavra display entrando (draft) | caret piscando + câmera |
| janela nova (popIn) | cursor viajando + glow |
| zoom de evidência | grão + sway do card |
| card gigante / whip | cursor + legenda digitando |

Beats com só o herói e nada mais = 40% do movimento do ref (medido).

## 5. Checklist

- [ ] Todo elemento entra por draft/popIn, nenhum por fade puro.
- [ ] Todo beat tem câmera + grão + ≥1 microgesto além do herói.
- [ ] Todo bloco termina com derrete/whip/iris (exceto o fecho).
- [ ] Direção de entrada alterna.
- [ ] Nenhum elemento pousa com velocidade ≠ 0 (ease-out manda); nada sai com v>0.
