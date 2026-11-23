# Parte: flash + LiDAR (stack de 6 camadas)

Ler antes: `references/materiais.md` e `ilha-cameras.md`.

## Dimensões (mm) — o flash fica FORA da ilha, direto no vidro traseiro

| Camada (de fora para dentro) | Centro | Ø | Material | Alpha |
|---|---|---|---|---|
| Vidro (`Back_Flash_Glass`) | (−25,25, 149,65) | 6,7 | `BASE_Flash_Glass` (azulado, rough 0.05) | 0.27 |
| Refletor (`Back_Flash_Ref`) | idem | 4,7 | `BASE_Flash_Ref` (rough 0.8 — anéis de difração) | 0.72 |
| Halo decal (`Gradient`) | (−22,1, 136,3) | 4 × 4 | `BASE_Flash_Ref_Gradient` + alphaMap radial | 0.09 |
| Versão fosca (`Back_Flash_Glass_Matte`) | idem vidro | 6,6 | `BASE_Flash_Glass duplicate` | 0.89 |
| Concha (`Back_Flash_Base`) | idem | 6,7 | `BASE_Flash_Base` (metal claro) | opaco |
| LED (`Back_Flash_Light`) | (−25,25, 149,6) | 1,8 | `BASE_Flash_Light` (emissive âmbar) | opaco |
| **LiDAR** (`Back_IR_Glass`) | (−25,25, 129,2) | 6,7 | `BASE_Sensor` (fosco + clearcoat) | opaco |

Z: as camadas ficam entre −7,1 e −6,4 (dentro do stack do vidro traseiro/ilha). O LED emite; a fonte original usa `emissiveIntensity 381` (HDR) — use ~2,5 com ACES.

## Receita (three.js)

1. **Concha**: cilindro Ø 6,7 × 0,8 em z −6,5, `BASE_Flash_Base` (metalness 1, rough 0.25, cor clara #C6C6C4).
2. **LED**: disco Ø 1,8 em z −6,4, material emissive: `color` #D0B065, `emissive.setRGB(0.1362, 0.1242, 0.0940)`, `emissiveIntensity 2.5`. Toggle ligado/desligado = só zerar `emissiveIntensity`.
3. **Refletor**: disco Ø 4,7 em z −7,0, alpha 0.72, rough 0.8. Os anéis de difração originais (`ringcount 7000`) → canvas com círculos concêntricos alternados (linear gradient radial modulado) como `map` em grayscale; a textura sutil quebra o brilho uniforme.
4. **Halo decal**: plano 4×4 com `alphaMap` = `flash-gradient.png` (branco, alpha radial 0→255 — é o arquivo real extraído), color #E7B25B, alpha 0.09, `renderOrder = 7`, `polygonOffset: true, polygonOffsetFactor: -1` (substitui o `decalOffsetMetres: 6e-06` do original).
5. **Vidro do flash**: disco Ø 6,7 em z −7,1, alpha 0.27 azulado #7C8288, rough 0.05, `renderOrder = 6`; e a versão fosca (alpha 0.89, rough 0.27, #D0D1D3) por cima em −7,0, `renderOrder = 5`.
6. **LiDAR**: disco Ø 6,7 em (−25,25, 129,2, z −6,9), `BASE_Sensor` — quase preto, rough 0.98, clearcoat 0.25/0.0. Fosco total, opaco.

## Detalhe fino

- **Respeite a ordem dos transparentes** (`materiais.md`): gradient(7) > glass(6) > matte(5) > ref(4) — senão o halo some atrás do vidro.
- O flash está no canto superior **esquerdo** do dorso (x negativo), simétrico à ilha à direita — layout clássico iPhone Pro.
- O LiDAR é sempre "desligado" visualmente (vidro IR escuro) — só o flash emite.
- Sem o halo decal, o flash fica "plano"; com ele (alpha 0.09), ganha a névoa âmbar do refletor real.
