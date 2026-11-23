# Parte: parte inferior (USB-C, parafusos, speakers)

Ler antes: `references/materiais.md` e `lateral-direita.md` (frame).

## Dimensões (mm — tudo na borda y=0)

| Elemento | Extensão | Material |
|---|---|---|
| Porta USB-C (`USB_*`) | centro x=0 · largura total 9,6 · z ±1,9 | 4 materiais empilhados |
| Pentalobe ×2 (`Screws` + `Screws_Aniso`) | centros x = ±6,9 · Ø 1,4…2,8 · y=0 | parafuso + decal anisotrópico |
| Speakers/mic (`Side_Panel_Speakers`) | x ±23,5 · grade de furos | `BASE_Speakers` |
| Antenas inferiores | 2 faixas perto da porta | `COLOUR_Cherry_Antenna` |

## Receita USB-C (4 camadas, de fora para dentro)

1. **Moldura** (`USB_Border`): rounded-rect vazado (9,6 × 3,8 r=1,9, furo interno 8 × 2,4 r=1,2), plástico cherry fosco (rough 0.6), em y=0, z ±1,9.
2. **Cavidade** (`USB_Base`): caixa interna escura `COLOUR_Cherry_Plastic` (rough 0.35) recuando 2 mm para dentro.
3. **Conector metálico** (`USB_Metal`): rounded-rect 8 × 2,4 r=1,2 metálico `BASE_Chrome_Dark` (metalness 1, rough 0.2209), recuo 2,5 mm.
4. **Pinos** (`USB_Pin`): 24 caixinhas 0,25 × 0,8 × 0,3 dentro da cavidade, **`BASE_Copper`** (metalness 1, roughness 0.045 — cobre polido espelhado; é o material mais reflexivo do aparelho, junto com o logo).

## Receita parafusos pentalobe

1. **Corpo**: cilindro Ø 2,8 × 0,3 mm deitado na base (eixo Z), `COLOUR_Cherry_Screws` (metal 1, rough 0.2209).
2. **Decal anisotrópico**: disco Ø 1,4 sobre cada parafuso com **`anisotropy 0.77`**, metal 1, rough 0.3, cor #4D353D. `anisotropyRotation`: para o efeito de escovado concêntrico, gere a geometria do disco com UVs radiais (círculo com `RingGeometry` tem UVs planas — melhor um shader simples ou aceitar aproximação).
3. **Assinatura visual**: os anéis concêntricos do original vêm de shader procedural (`ringcount 50000`). Aproximação em HTML: normalMap de anel gerado em canvas (círculos concêntricos senoidais em tons de cinza → encode para normal) com `normalScale` baixo. O efeito "metal escovado circular" é o que importa.

## Receita speakers inferiores

- **Grades**: 6 furos Ø 1 de cada lado (x de −27…−20 e +20…+27, y=0) — cilindros escuros `BASE_Speakers` (metal 0.18, rough 0.4) afundados, OU canvas com pontinhos como `map` num slot.
- Entre porta e speakers ficam as **antenas inferiores** (2 faixas plásticas).

## Detalhe fino

- A base é a segunda face mais fotografada (depois das câmeras) — o USB-C tem 4 materiais distintos no original; não economize neles.
- Parafusos em x = ±6,9, **fora** da moldura USB (9,6/2 = 4,8 → parafuso a 6,9 fica claro da porta).
- Os pinos de cobre (rough 0.045) refletem o IBL — se a cena estiver escura, eles somem. Garanta um environment com contrastes (ver SKILL.md, iluminação).
