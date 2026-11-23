# Parte: ilha de câmeras + lentes (o coração visual)

Ler antes: `references/materiais.md` (materiais de lente e iridescência).

## Dimensões (mm) — medidas REAIS do GLB

| Elemento | Extensão | Material |
|---|---|---|
| Ilha/plateau (footprint) | x −0,5…+33 · y 121…157,5 (≈34,6 × 35,8, cantos r≈11) | topo `BASE_Grey`, laterais `COLOUR_Cherry_Side_Panel` |
| Anel preto interno (`Back_Cam_Edge_black`) | segue o contorno interno do plateau | `BASE_Cam_Edge_Black` (rough 0.1) |
| Lente 1 (tele) | centro (24,65, 149,05) · anel Ø 5,6 · vidro Ø 1,5 | anel `BASE_Grey_02` + vidro `BASE_Cam_Lens01` |
| Lente 2 (ultra) | centro (24,7, 129,7) · anel Ø 11,8 · vidro Ø 3,2 | anel `BASE_Cam_Aperture` (Grey) + `BASE_Cam_Lens02` |
| Lente 3 (main) | centro (6,5, 139,4) · anel Ø 10 · vidro Ø 6,4 | anel + `BASE_Cam_Lens03` |
| Vidro protetor (`Back_Cam_Glass`) | cobre a ilha inteira, Ø externo | `BASE_Glass` (transmission), z −9,2 |
| Capa translúcida das lentes (`Back_Cam_Lens_Outer`) | sobre cada vidro | alpha 0.45 + iridescência |

A ilha fica no **canto superior direito do dorso** e sobe **4,8 mm** além do vidro traseiro (z −4,4 → −9,2).

## Receita (three.js)

1. **Plateau**: extrusão de rounded-rect 34,6 × 35,8 r=11, altura 4,8, encostada atrás (z −4,4…−9,2). Material das laterais: cherry metal (o `Back_Cam_Edge` original usa `COLOUR_Cherry_Side_Panel`!). Face superior: plano com `BASE_Grey` + sparkle normal (scale 0.15).
2. **Anel preto**: faixa interna seguindo o contorno (3 mm) — `BASE_Cam_Edge_Black` (rough 0.1, quase preto liso).
3. **Cada lente** (3 assemblies):
   a. **Anel externo**: `TorusGeometry` ou cilindro anelar (extrude ring) na cor da cava, altura ~0,8, saliente do plateau.
   b. **Domo do vidro**: hemisfério achatado — `SphereGeometry(r, 48, 24, 0, 2π, 0, π/2)` escalado em Y (achatado ~0,4), material de lente:

```js
// BASE_Cam_Lens01 — a receita de lente (idêntica para as 4, só muda o map)
new THREE.MeshPhysicalMaterial({
  color: new THREE.Color().setRGB(0.8434, 0.8434, 0.8434),
  metalness: 0.0, roughness: 0.15,
  map: loadTex('assets/textures/lens-01.jpg'),     // coating
  iridescence: 0.2, iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],           // nm — coating antirreflexo
});
```

   c. **Capa translúcida** (`Back_Cam_Lens_Outer`): hemisfério um pouco maior (×1,15) com `transparent, opacity 0.45, roughness 0.15, iridescence 0.2/1.3/[100,400]`, `renderOrder = 3`. **Este é o segredo visual**: a dupla camada iridescente é o que dá o "olho de vidro" das lentes Apple.
4. **Vidro protetor da ilha**: plano rounded-rect com `transmission 1, ior 1.63, roughness 0.045` em z −9,2, `renderOrder = 2` — cobre plateau e lentes.
5. Os domos e anéis devem ficar **sob** o vidro (z > −9,2) para o vidro refletir por cima.

## Detalhe fino

- As 3 lentes têm tamanhos DIFERENTES de vidro no original (1,5 / 3,2 / 6,4 mm) mas anéis de tamanhos similares — respeite isso: anéis grandes com domos proporcionais.
- `iridescenceThicknessRange` [100, 400] nm com `iridescenceIOR 1.3` produz o tom azul/roxo/caracol típico. Se ficar fraco, suba `iridescence` para 0.35 mas **não** mude o IOR.
- A textura de coating (32–128 px) é quase uniforme — serve de variação sutil; o efeito dominante é a iridescência.
- O `Back_Cam_Aperture` (Ø 11,8) é a abertura da lente principal: anel escuro FOSCO (rough 0.82) — por dentro dele, o fundo é `BASE_Black` (buraco preto absoluto, ior 1.0).
