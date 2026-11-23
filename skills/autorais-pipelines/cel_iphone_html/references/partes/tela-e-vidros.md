# Parte: tela frontal, bezel e vidros frontais

Ler antes: `references/materiais.md` (regras de tradução e vidro).

## Dimensões (mm, origem na borda inferior central, Z+ = frente)

| Elemento | Extensão | Espessura/Z |
|---|---|---|
| Corpo (frame) | x ±39,5 · y 0…163,3 | z −4,4…+4,35 |
| Bezel frontal (`Front_Panel`) | x ±37,8 · y 1,2…162,1 | z +4,0…+4,3 (painel preto `BASE_Glass_Black`) |
| Tela (`Front_Screen`) | x ±36,5 · y 2,4…160,9 (73 × 158,5) | z +4,3 (plano emissive) |
| Vidro frontal | idem tela, r≈8 cantos | z +4,2…+4,35 (`transmission`, ior 1.63) |
| Dynamic Island (`Front_Sensor`) | x −7,7…+0,6 · y 152,6…158,3 | sensor preto fosco no topo da tela |
| Câmera frontal (`Front_Cam_Lens`) | centro ≈ (4,7, 155,4), Ø 1,5 | lente iridescente minúscula |

## Receita (three.js)

1. **Bezel**: `ExtrudeGeometry` de rounded-rect (73×158,5 → use 76×160, r=9) como slab 0,3 mm em z=+4,0, material `BASE_Glass_Black` (preto, rough 1.0, clearcoat 0.25).
2. **Tela**: `ShapeGeometry` rounded-rect 73×158,5 r=8 em z=+4,31. Material: `color` #323232 linear (0.0316), `roughness 1.0`, `clearcoat 0.25`, `clearcoatRoughness 0.0`, **`emissive: branco (0.9995)`, `emissiveMap: screen-burgundy.jpg` (`colorSpace SRGB`), `emissiveIntensity ≈ 1.2`**. O original clampa o HDR 2000 — 1,2 dá o brilho certo com `ACESFilmicToneMapping` e exposure 1.0.
3. **Vidro frontal**: slab 0,15 mm em z=+4,3 cobrindo a tela. Material `BASE_Glass` traduzido: `transmission 1, thickness 0.5, ior 1.6316, roughness 0.045`. `renderOrder = 8` (último transparente). Sem depthWrite.
4. **Dynamic Island**: rounded-rect pequeno (10×6,5 r=3) preto `BASE_Sensor` sobreposto à tela em z=+4,32 + câmera frontal: hemisfério achatado Ø1,5 com material de lente (iridescência — ver `ilha-cameras.md`).
5. **Earpiece** fica na borda superior do frame — ver `parte-superior.md`.

## Detalhe fino

- O original tem **AO por vértice** (COLOR_0 ~0,98 na tela — quase branco). Em HTML, ignore; a iluminação IBL já dá o contraste.
- A tela emite a textura na UV inteira (0,001…0,999) — mapeie a textura sem offset. Aspecto da textura (0,5) ≈ aspect da tela (0,46): distorção mínima e aceitável.
- O clearcoat 0.25/0.0 (fator/roughness iguais em toda a família "vidro preto") é a assinatura do vidro Apple: reflexo nítido sobre base fosca. Não troque por roughness baixo direto — perde o "duo-tone".
