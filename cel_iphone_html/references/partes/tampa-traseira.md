# Parte: tampa traseira (vidro burgundy + logo Apple)

Ler antes: `references/materiais.md`.

## Dimensões (mm)

| Elemento | Extensão | Z |
|---|---|---|
| Vidro traseiro (`Back_Panel`) | x ±35,0 · y 3,9…114,4 (70 × 110,5 — não cobre a ilha) | z −4,4…−3,2 (espessura real 1,2 mm) |
| Logo Apple (`Back_Logo`) | x −8,3…+8,0 · y 55,7…75,8 (≈16 × 20 mm) | z −4,4 (recortado no vidro) |

Na verdade o vidro traseiro real cobre todo o dorso exceto a região da ilha (o mesh original tem recorte para a ilha de câmeras). Para simplificar: dois retângulos — um abaixo da ilha (y 0…121) e uma faixa fina acima/à esquerda dela; ou um painel único com a ilha construída **por cima** (a ilha cobre o recorte). A segunda opção é visualmente equivalente e mais simples.

## Receita (three.js)

1. **Vidro traseiro**: slab rounded-rect 77 × 163 r=13, espessura 1,2 mm, z de −4,4 a −3,2.
   Material `COLOUR_Cherry_Backpanel` exato: `color.setRGB(0.0582, 0.0104, 0.0161)`, `roughness 0.3`, **`transparent: true, opacity: 0.825, depthWrite: false`**, `ior 1.4390`, `renderOrder = 1` (primeiro transparente).
   Alternativa mais rica: `transmission 0.18` + `color` igual — deixa ver o frame por baixo como no configurador.
2. **Logo Apple**: carregue `assets/logo-geometry.json` (geometria REAL extraída do GLB — 688 verts, coordenadas em metros, Y-up, z ≈ −4,4):

```js
const logo = await fetch('assets/logo-geometry.json').then(r => r.json());
const g = new THREE.BufferGeometry();
const pos = new Float32Array(logo.vertices.flat());
// GLB está em metros e a cena em mm → escala ×1000
g.setAttribute('position', new THREE.BufferAttribute(pos.map(v => v * 1000), 3));
g.setIndex(logo.indices);
g.computeVertexNormals();
const mesh = new THREE.Mesh(g, matCherryApple); // COLOUR_Cherry_Apple
```

   Se não tiver o JSON (outro modelo), desenhe o logo num canvas 2D e use como decal (`MeshBasicMaterial` + `polygonOffset`).
3. **Cores para outros variants**: só o vidro traseiro muda de cor — a tabela `COLOUR_Cherry_*` em `materiais.md` traz os fatores; o mesmo vidro em preto = (0.0582→0.03) etc. Mantenha `opacity 0.825`.
4. Mic traseiro (`Back_Mic`): disco Ø1 preto `BASE_Black` em (−25,3, 139,5, z −4,4).

## Detalhe fino

- O vidro é 82,5% opaco — **não** faça 100% transparente: o frame aparece por baixo nas bordas e dá a sensação de vidro real sobre metal.
- Roughness 0.3 + IBL faz o reflexo difuso suave do vidro fosco tipo iPhone 15/16. Para acabamento "gloss" de outro variant, roughness 0.1.
- O logo é polido (rough 0.045) e **opaco** — contraste sutil com o vidro atrás.
