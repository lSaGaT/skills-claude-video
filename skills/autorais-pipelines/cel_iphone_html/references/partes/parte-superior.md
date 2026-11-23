# Parte: parte superior (topo do aparelho)

Ler antes: `references/materiais.md` e `lateral-direita.md` (construção do frame).

## Dimensões (mm)

| Elemento | Extensão | Observação |
|---|---|---|
| Frame (topo do anel) | y = 163,3 · cantos r=13 | mesma extrusão única do frame |
| Earpiece (`Front_Speaker`) | x ±14,2 · y 161,7…162,1 · z +4,0 | fenda do alto-falante frontal |
| Linha de antena superior | faixa horizontal no topo | x −10…+10, largura 1,6 |

## Receita

1. **Earpiece**: rounded-rect fino (28,4 × 0,8 r=0,4) em z=+4,05, **material `BASE_Speakers_Front`** (metal escuro 0.011, rough 0.4) — no original é só 15 triângulos: um plano com a grade de furos na textura. Em HTML, um slot escuro liso funciona; se quiser os furos, gere um canvas 2D com pontinhos pretos e use como `map` + `alphaMap`.
2. **Antena superior**: faixa plástica horizontal fosca atravessando o topo do frame (material `COLOUR_Cherry_Antenna`).
3. **Nada mais**: a parte superior do original é limpa — sem conector, sem furos (o mic fica na base e nas costas).

## Detalhe fino

- A fenda do earpiece fica **na frente**, no topo do bezel — não na face superior do frame. Posição: logo acima da tela (y 161,7…162,1, a tela termina em 160,9).
- Altura da fenda: 0,4 mm aparente. Se fizer mais grossa, parece brinquedo.
