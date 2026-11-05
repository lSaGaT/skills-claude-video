# MOV — Perfil de movimento: medir "está vivo?" com número

> O defeito "copiado e colado" não é opinião: dá para medir. Esta referência define a
> métrica, os valores do reel de referência (81,41 s) e o teste de aceitação da réplica.

## 1. A métrica

Para cada quadro `n`, calcula-se a **diferença média absoluta** em relação ao quadro `n-1`,
em escala de cinza reduzida (180×320):

```
mov(n) = mean( |gray(n) - gray(n-1)| )      // 0 = quadro congelado
```

- 30 fps → 1 s = 30 amostras. Média por segundo = "quanto a tela muda por segundo".
- Independe de cor, de paleta e de conteúdo: mede **movimento aparente**.
- Implementação pronta: `_replica/analise/movimento.mjs` (varredura completa) e
  `_replica/analise/cmp-mov.mjs <arquivo> <de> <até>` (compara com o ref por segundo).

## 2. Os números do reel de referência (medidos)

| grandeza | valor |
|---|---|
| média global | **2,74 / s** |
| piso em fundo chapado (falar calmo, texto parado) | **0,15 – 0,35** |
| beat "vivo" normal (typing, cursor, câmera) | **0,8 – 2,0** |
| transição de beat (derrete, whip, corte com peso) | **3,5 – 8,0** |
| picos (zoom de evidência, card gigante) | **9 – 28** |

Picos medidos no ref: `5s=11,5` (zoom do "O"), `10s=7,3`, `12s=8,4` (creme→preto),
`15-16s=3,7/6,4` (letras do MOTION voando), `26-27s=4,1/4,8`, `30-32s=6,9/8,0/5,4`
(parede de cards entrando), `35s=3,2`, `49-51s=9,0/23,8/28,1` (card gigante),
`62s=6,4` (clique→morph), `69s=7,5` (whip).

**Não existe um único segundo abaixo de 0,15 no ref.** Ele nunca congela — nem quando
o texto está "parado".

## 3. Diagnóstico da réplica anterior (o caso que gerou esta referência)

| | ref | réplica 1ª versão |
|---|---|---|
| média | 2,74 | **0,51 (19%)** |
| segundos mortos (<30% da média) | 0 | **71 de 81** |

A causa não era falta de cenas: era **falta de vida dentro da cena**. O padrão do código
era `enter()` → elemento aparece → congelamento até o próximo beat. Nenhum grão, nenhuma
câmera, nenhum cursor, nenhum caret.

## 4. Regra de aceitação (rodar antes de entregar)

```bash
node _replica/analise/cmp-mov.mjs saida.mp4 0 81
```

Aprovar só quando:

- [ ] média do nosso vídeo entre **85% e 115%** da média do ref;
- [ ] **nenhum segundo abaixo de 0,3** (piso de grão + câmera garante isso);
- [ ] cada pico do ref (tabela §2) tem um pico nosso em ±0,3 s;
- [ ] nenhum segundo nosso acima de ~250% do ref naquele mesmo segundo (movimento
      gratuito também denuncia: dá sensação de tremor/nervoso).

## 5. Como levantar o piso sem sujar a imagem

Ordem de eficácia (custo → resultado):

1. **grão** (`grain()` em `lib/mov.mjs`, alpha 0,10–0,15): sobe o piso ~0,3–0,5 em
   qualquer fundo chapado. Alpha 0,55 (primeira tentativa) deu 1,9 — engolia o desenho.
2. **câmera** com `drift` 8–12 px e `jit` 1,5–2,5 px: ≈0,2–0,4.
3. **idle** de elementos (`sway()` ±1,5–3 px, período 2,5–4 s): ≈0,1–0,3.
4. typing/caret/cursor: picos locais de 1–3.

> Se o material de referência for de fundo branco/creme, o grão cai para 0,05–0,08 —
> ruído claro em fundo claro aparece muito mais.

## 6. O que NÃO resolve

- Cortar mais rápido: muda a cadência, não a vida dentro do plano.
- Adicionar mais cenas: o ref prova que 81 s cabem em 22 blocos — o que muda é o
  movimento **dentro** de cada bloco.
- Fade-in/fade-out genérico: um fade de 200 ms em 2 s de bloco deixa 1,8 s morto.
