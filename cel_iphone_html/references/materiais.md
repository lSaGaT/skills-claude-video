# Banco de materiais — ground truth (teardown GLB Binkies)

Valores extraídos por parsing direto do `apple_iphone_18_pro_max_burgundy.glb`. São os valores **exatos** do modelo original; use-os sem arredondar. Cores em glTF são **lineares** — os hex são aproximações sRGB só para você conferir mentalmente.

## Convenções do pipeline original

- Prefixo `BASE_*` = material de biblioteca compartilhado entre cores.
- Prefixo `COLOUR_Cherry_*` = material do variant de cor (interno "Cherry" = marketing "Burgundy"). **Para trocar a cor do aparelho, troque só os fatores `color` desta família.**
- Fonte: shader proprietário `IBL2` (configurador Binkies). Parâmetros de shader que não sobrevivem no glTF (anéis procedurais, emissive HDR) estão anotados em cada material quando relevantes.

## Tradução glTF → three.js `MeshPhysicalMaterial`

| glTF | three.js | Observação |
|---|---|---|
| `baseColorFactor` | `color.setRGB(r, g, b)` | `setRGB` já espera linear por padrão (working space = LinearSRGB). **Não** use `new THREE.Color(hex)` para os valores da tabela — passe os fatores lineares |
| `baseColorTexture` | `map` + `tex.colorSpace = THREE.SRGBColorSpace` | texturas de cor são sRGB |
| `metallicFactor` | `metalness` | |
| `roughnessFactor` | `roughness` | |
| `alphaMode: BLEND` + alpha do fator | `transparent: true; opacity: a; depthWrite: false` | sempre defina `renderOrder` — veja ordem no fim do arquivo |
| `KHR_materials_ior` | `ior` | |
| `KHR_materials_clearcoat` | `clearcoat` / `clearcoatRoughness` | |
| `KHR_materials_iridescence` | `iridescence` / `iridescenceIOR` / `iridescenceThicknessRange = [100, 400]` | mínimo 100 é o default do spec |
| `KHR_materials_anisotropy` | `anisotropy` / `anisotropyRotation = 0` | |
| `emissiveFactor` + `emissiveTexture` | `emissive = branco`, `emissiveMap`, `emissiveIntensity` | HDR original (2000 tela, 381 flash) precisa ser reduzido (~1,2 e ~2,5) ou a tela "estoura" com ACES |
| `normalTexture` scale | `normalMap` + `normalScale.set(s, s)` | |
| `occlusionTexture` | `aoMap` | |
| `BASE_Glass` (alpha 0.0) | **`transmission: 1, thickness: 0.5, ior: 1.63, roughness: 0.045`** | alpha 0.0 do original é invisível total; a intenção é vidro óptico — use transmission |

**Regra de vidro**: vidro "de verdade" (câmera, tela) = `transmission` (refração real). Vidro "colorido translúcido" (traseira, flash) = `opacity` + `transparent`, como no original — mantém a cor saturada.

**Ordem de render (`renderOrder`)** para os transparentes, de trás para frente:
backPanel(1) → backCamGlass(2) → lensOuter(3) → flashRef(4) → flashMatte(5) → flashGlass(6) → flashGradient(7) → frontGlass(8). Opaques ficam em 0.

## Os 34 materiais

### Família Cherry (variant Burgundy)

| Material | color (linear) | ≈hex | metal | rough | alpha | Extensões / notas |
|---|---|---|---|---|---|---|
| `COLOUR_Cherry_Backpanel` | 0.0582, 0.0104, 0.0161 | #421A22 | 0 | 0.3 | 0.825 | ior 1.4390 — vidro traseiro |
| `COLOUR_Cherry_Side_Panel` | 0.1220, 0.0582, 0.0677 | #62524A | 1 | 0.27 | 1 | normalMap frame-noise (scale 0.1) — frame |
| `COLOUR_Cherry_Side_Panel_Gloss` | 0.1332, 0.0528, 0.0677 | #66414A | 1 | 0.2 | 1 | faixa de brilho do frame |
| `COLOUR_Cherry_Aniso` | 0.0738, 0.0356, 0.0461 | #4D353D | 1 | 0.3 | 1 | **anisotropy 0.77** — parafusos pentalobe (decal) |
| `COLOUR_Cherry_Screws` | 0.0738, 0.0356, 0.0461 | #4D353D | 1 | 0.2209 | 1 | corpo dos parafusos |
| `COLOUR_Cherry_Antenna` | 0.0738, 0.0199, 0.0242 | #4D272B | 0 | 0.6 | 1 | linhas de antena (plástico fosco) |
| `COLOUR_Cherry_Plastic` | 0.1036, 0.0161, 0.0303 | #5B2231 | 0 | 0.35 | 1 | cavidade USB |
| `COLOUR_Cherry_Apple` | 0.0987, 0.0329, 0.0415 | #59333A | 0 | 0.045 | 1 | logo Apple polido |
| `COLOUR_Cherry_Screen` | 0.0316, 0.0316, 0.0316 | #323232 | 0 | 1.0 | 1 | clearcoat 0.25/0.0; emissiveMap screen-burgundy.jpg |
| `COLOUR_Cherry_Side_Button_Detail` | 0.0846, 0.0161, 0.0278 | #52222E | 0 | 0.1 | 1 | botão power |
| `COLOUR_Cherry_Button_Detail_Border` | 0.0385, 0.0127, 0.0170 | #371E23 | 1 | 0.045 | 1 | aro metálico do botão |

### Biblioteca BASE

| Material | color (linear) | ≈hex | metal | rough | alpha | Extensões / notas |
|---|---|---|---|---|---|---|
| `BASE_Cam_Lens_Front/01/02/03` | 0.8434 ×3 | #E3E3E3 | 0 | 0.15 | 1 | **iridescence 0.2 / ior 1.3 / [100,400]**; map = lens-front/lens-01/02/03.jpg |
| `BASE_Cam_Lens_Outer` | 0.0135 ×3 | #0B0B0B | 0 | 0.15 | 0.45 | iridescence igual; capa translúcida externa da lente |
| `BASE_Glass` | 0.0511 ×3, **α 0** | — | 0 | 0.045 | 0.0 | ior 1.6316 — vidro óptico; **use transmission:1** |
| `BASE_Glass_Black` | 0.0033 ×3 | #0B0B0B | 0 | 1.0 | 1 | clearcoat 0.25/0.0 — bezel frontal |
| `BASE_Sensor` | 0.0033 ×3 | #0B0B0B | 0 | 0.98 | 1 | clearcoat 0.25/0.0 — sensores/IR |
| `BASE_Black` | 0.0161 ×3 | #1D1D1D | 0 | 1.0 | 1 | **ior 1.0** (zero Fresnel) — buracos pretos absolutos |
| `BASE_Grey` | 0.0050, 0.0050, 0.0084 | #0B0C0F | 0 | 0.82 | 1 | ior 1.3810; normalMap sparkle (scale 0.15) — cavas internas |
| `BASE_Grey_02` | 0.0135, 0.0135, 0.0152 | #0F0F12 | 0 | 0.8 | 1 | igual Grey — 2ª cavidade |
| `BASE_Chrome_Dark` | 0.0781 ×3 | #1D1D1D | 1 | 0.2209 | 1 | conector USB metálico |
| `BASE_Copper` | 0.4820, 0.4045, 0.2888 | #D8A878 | 1 | 0.045 | 1 | pinos USB polidos |
| `BASE_Speakers` | 0.1801, 0.1768, 0.1768 | #605E5E | 1 | 0.4 | 1 | normalMap+aoMap speaker (grade 32×32) |
| `BASE_Speakers_Front` | 0.0111 ×3 | #0B0B0B | 1 | 0.4 | 1 | earpiece |
| `BASE_Flash_Base` | 0.6055, 0.6055, 0.5924 | #C6C6C4 | 1 | 0.25 | 1 | concha do flash |
| `BASE_Flash_Light` | 0.6320, 0.4313, 0.1304 | #D0B065 | 0 | 0.045 | 1 | emissive âmbar [0.1362, 0.1242, 0.0940] — LED |
| `BASE_Flash_Ref` | 0.5860, 0.5860, 0.5174 | #B4B49B | 0 | 0.8 | 0.72 | refletor; original: anéis concêntricos (100000 freq / 7000 anéis) |
| `BASE_Flash_Ref_Gradient` | 0.7083, 0.5480, 0.2158 | #E7B25B | 0 | 0.5 | 0.09 | decal halo; alphaMap radial (flash-gradient.png) |
| `BASE_Flash_Glass` | 0.2977, 0.3066, 0.3204 | #7C8288 | 0 | 0.05 | 0.27 | vidro do flash |
| `BASE_Flash_Glass duplicate` | 0.6388, 0.6456, 0.6592 | #D0D1D3 | 0 | 0.27 | 0.89 | versão fosca |
| `BASE_Cam_Edge_Black` | 0.0055 ×3 | #0B0B0B | 0 | 0.1 | 1 | anel preto da ilha |

### Texturas (em `assets/textures/`)

| Arquivo | Pixels | Role |
|---|---|---|
| `screen-burgundy.jpg` | 512×1024 | emissiveMap da tela (wallpaper) |
| `lens-01/02/03.jpg`, `lens-front.jpg` | 32–128 | map das lentes (multicoating) |
| `frame-noise-normal.png` | 128×128 | normalMap do frame (scale 0.1) |
| `sparkle-normal.png` | 256×256 | normalMap das cavas (scale 0.15) |
| `speaker-normal.png` + `speaker-ao.png` | 32×32 | grade de furos dos speakers |
| `flash-gradient.png` | 512×512 | máscara radial do halo do flash (branco, alpha 0→255) |

### Parâmetros IBL2 que precisam de shader custom (réplica 1:1)

- `concentricNormalFrequency`/`ringcount`: flash 100000/7000; parafusos 400000/50000 — anéis concêntricos procedurais
- `emissiveIntensity` HDR: tela 2000, flash 381
- `texturerepeat`: 80 (backpanel) · 100 (frame) · 500 (aniso) · 600 (speakers)
- `maskantialiasing` 0,01–0,66; `bumpiness` 0,01–5,0

Para HTML, aproxime os anéis com `anisotropyRotation` radial ou um normalMap de anel gerado em canvas; o efeito visual é o que importa.
