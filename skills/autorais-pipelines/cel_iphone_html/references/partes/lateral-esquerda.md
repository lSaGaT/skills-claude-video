# Parte: lateral esquerda do frame + detalhes

Ler antes: `references/materiais.md` e `lateral-direita.md` (mesma construção de frame — não duplique código; o frame é um único mesh).

## Dimensões (mm)

| Elemento | Extensão | Observação |
|---|---|---|
| Frame (mesma extrusão da lateral direita) | x −39,5 · y 0…163,3 | material `COLOUR_Cherry_Side_Panel` |
| `Holes` (slot/mic esquerdo) | x = −38,4 · y 41,6…42,7 | 2 quads mínimos no original — detalhe de slot/mic |
| Linhas de antena | 2 faixas na esquerda | y≈25…33 e y≈90…98, largura 1,6 |

## Receita

1. **Frame**: use a mesma extrusão de `lateral-direita.md` — é um mesh único que envolve os 4 lados. Esta página só descreve o que fica na **esquerda**.
2. **Slot/mic** (`Holes`): elipse/quadro fino 1 × 1,2 mm em (−38,4, 42,2), material `BASE_Black` (ior 1.0 = preto absoluto, zero reflexão). No original são só 2 quads — é um detalhe quase invisível, mas presente.
3. **Linhas de antena**: mesmas faixas de 1,6 mm da direita, material `COLOUR_Cherry_Antenna`.
4. **Importante**: o modelo original **não tem botões de volume nem mute switch** (simplificação de configurador). Se quiser um iPhone mais fiel ao hardware real, adicione: rocker de volume (y 55…95, mesmo estilo do botão power, comprimento 40) e Action button (y 40…48). Mantenha o estilo do botão power para consistência.

## Detalhe fino

- A lateral esquerda é a que menos aparece em renders 3/4; invista o polígono na direita e no verso.
- O escovado (normalMap noise scale 0.1) precisa da mesma orientação nas duas laterais — use o mesmo material, não clones com rotações diferentes, senão o grão "muda" de lado.
