# Parte: lateral direita do frame + botão power

Ler antes: `references/materiais.md`.

## Dimensões (mm)

| Elemento | Extensão |
|---|---|
| Frame inteiro (`Side_Panel`) | x ±39,5 · y 0…163,3 · z −4,4…+4,35 · cantos r≈13 · largura da banda ~1,5 |
| Botão power (`Side_Button`) | lado direito x +38,7…+39,0 (protrai ~0,3) · y 43,1…59,8 (16,7 de comprimento) · z ±1,3 |
| Aro do botão (`Side_Button_Detail_Border`) | x +37,6…+39,0 · y 42,9…60,0 · z ±1,5 (recess 0,5 ao redor) |
| Faixa gloss | faixa horizontal fina na lateral inferior (y≈0…0,1) — realce polido |

## Receita do frame (uma vez, usada por toda a.skill)

O frame é a peça mais importante (43% da geometria original). Construção robusta:

```js
function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = 0; // base em y=0
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

// Frame: extrusão de rounded-rect 78,97 × 163,36 r=13, altura 8,75 (z −4,4…+4,35)
const frameGeo = new THREE.ExtrudeGeometry(roundedRect(78.97, 163.36, 13), {
  depth: 8.75, bevelEnabled: true,
  bevelThickness: 0.9, bevelSize: 0.9, bevelSegments: 6, curveSegments: 48
});
frameGeo.rotateX(Math.PI / 2);       // extrude anda em Z; vire para o eixo do aparelho
frameGeo.translate(-39.485, 0, 4.35 + 0.9); // ajuste fino até z −4,4…+4,35
```

Material `COLOUR_Cherry_Side_Panel`: `metalness 1`, `roughness 0.27`, `normalMap: frame-noise-normal.png` com `normalScale (0.1, 0.1)` — o micro-escovado.

## Botão power

1. **Recess**: rounded-rect vertical (2,8 × 18,2 r=1,4) **afundado** no frame (Booleano fake: desenhe como caixa levemente recuada com material do próprio frame, `side: BackSide` não funciona bem — em vez disso modele o aro como quadro extrudado fino).
2. **Aro** (`Button_Detail_Border`): quadro extrudado (outer 2,8×18,2, inner 2,2×17,4) metálico `metalness 1, roughness 0.045`.
3. **Botão**: rounded-box 2,2 × 17 × 1,3 deslocado x+0,3 para fora. Material `COLOUR_Cherry_Side_Button_Detail` (plástico, rough 0.1).
4. Protrusão do botão: só ~0,3 mm além do frame — sutil, não exagere.

## Antenas (linhas plásticas)

O mesh `Antenna` original percorre y 15,4…159,5 nos dois lados. Coloque **faixas plásticas de 1,6 mm** de largura levemente ao nível do frame (±0,05 para fora), material `COLOUR_Cherry_Antenna` (fosco, rough 0.6): duas na lateral direita (y≈20…28 e y≈100…108) e mais duas perto do topo/baixo conforme o real. Detalhe que vende o realismo.

## Faixa gloss

Na base da lateral, uma faixa horizontal polida (`COLOUR_Cherry_Side_Panel_Gloss`, rough 0.2, mesma cor #66414A) de ~1 mm — quebra a monotonia do metal escovado.
