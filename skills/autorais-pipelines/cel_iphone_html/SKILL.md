---
name: cel_iphone_html
description: >
  Comando para CRIAR IPHONE em HTML. Acione esta skill SEMPRE que a pessoa usar a palavra
  "iphone" em qualquer pedido de criação — frases curtas tipo "cria um iphone", "faz um
  iphone", "quero um iphone em html", "página de iphone", "monta um iphone", "desenha um
  iphone", "render de iphone", "réplica de iphone", "iphone 3d no navegador", "celular
  iphone em html" — e também variações como "criar celular Apple", "smartphone em three.js",
  "mockup de celular", "recriar o iphone do GLB". O gatilho é a intenção de
  criar/montar/desenhar/simular/renderizar um iphone ou celular em HTML/página web,
  MESMO que a frase seja só uma palavra. Também cobre: visualizar o asset existente,
  trocar variant de cor, extrair geometria de outro GLB de celular.
---

# cel_iphone_html — réplica fiel de iPhone a partir de teardown

## Princípio central (não negociável)

**A geometria extraída do GLB é a fonte da verdade. NÃO modele nada proceduralmente se o
asset existir.** Todo erro de "traseira errada", "lente no lugar errado", "botão sumido"
veio de aproximar geometria à mão. O fluxo correto é:

1. **Extrair** as malhas reais do GLB (script incluso) — vértices, normais, UVs e AO por vértice;
2. **Aplicar** os materiais exatos do teardown (fatores lineares, extensões KHR);
3. **Carregar** as texturas originais;
4. **Desenhar** — o renderer só carrega e compõe. Ele não inventa posição, tamanho ou camada.

Geometria procedural (references/partes/) é FALLBACK apenas para quando não há GLB do
modelo — e serve como documentação de estudo bloco a bloco (tampa traseira, vidros,
botões, laterais uma a uma, topo, base, USB, lentes, flash).

## Fontes de verdade (em `assets/`)

| Arquivo | Conteúdo |
|---|---|
| `iphone18-geometria.json` | 43 malhas reais do GLB: POSITION/NORMAL/UV/COLOR_0 + índices + nome do material, coordenadas de mundo em metros (Y-up), ordem original dos nós |
| `textures/` (10 arquivos) | texturas originais: `screen-burgundy.jpg` (512×1024, emissive da tela), `lens-01/02/03.jpg` + `lens-front.jpg` (coating das lentes), `frame-noise-normal.png` (escovado do frame), `sparkle-normal.png` (cavas), `speaker-normal.png` + `speaker-ao.png` (grade de furos), `flash-gradient.png` (máscara radial do halo) |
| `exemplo-iphone18-burgundy.html` | **implementação de referência funcional** — comece por ela, não do zero |

Banco completo dos 34 materiais (fatores lineares + extensões): `references/materiais.md`.
Estudo bloco a bloco: `references/partes/` (tela-e-vidros, tampa-traseira, lateral-direita,
lateral-esquerda, parte-superior, parte-inferior, ilha-cameras, flash-lidar).

## Fluxo de trabalho

1. **Regenerar a geometria** (se mudou o GLB de origem):
   ```bash
   python -I scripts/extrair_geometria_glb.py <caminho-do.glb> --all --out assets/iphone18-geometria.json
   ```
   O script extrai POSITION (6 casas = precisão 1 µm), NORMAL, TEXCOORD_0, COLOR_0 (AO baked
   em 30 das 43 malhas) e o nome do material de cada malha. `--list` mostra as malhas disponíveis.

2. **Servir por HTTP** (fetch de JSON não funciona em `file://`):
   ```bash
   cd assets && python -m http.server 8437
   # abrir http://127.0.0.1:8437/exemplo-iphone18-burgundy.html
   ```

3. **Renderer** (o exemplo mostra tudo; o essencial):
   - importmap three@0.160.0 (CDN jsdelivr), `OrbitControls` + `RoomEnvironment` via PMREM;
   - para cada malha do JSON: `BufferGeometry` com `position ×1000` (m → mm), `normal`, `uv`,
     `color` (quando existir) e `index`; material por nome na tabela `MATS`;
   - malhas com `color` → material clone com `vertexColors: true` (COLOR_0 = AO baked: escurece
     cavidades como no original).

4. **Verificação visual bloco a bloco** (câmeras de teste — rode todas antes de entregar):
   | Bloco | camera.position | controls.target |
   |---|---|---|
   | Frente 3/4 | (160, 150, 300) | (0, 78, 0) |
   | Verso 3/4 | (−150, 170, −290) | (0, 78, 0) |
   | Base (USB/speakers) | (0, −120, −140) | (0, 0, 0) |
   | Lateral direita (botão) | (320, 90, 60) | (39, 50, 0) |
   | Lateral esquerda | (−300, 120, 80) | (−39, 60, 0) |
   | Ilha de câmeras close | (−120, 210, −220) | (16, 139, −5) |
   Desligue `autoRotate` antes de capturar. O que deve aparecer em cada bloco está listado
   em `references/partes/`.

## Regras críticas de tradução glTF → three.js (cada uma já causou bug real)

1. **`BASE_Glass` (alpha 0 no GLB) → `transmission: 1` com TINT QUASE BRANCA.** O baseColor
   escuro do GLB (0.051) tinge tudo que passa pelo vidro → tela e câmeras ficam pretas.
   Usar `color (0.94, 0.96, 0.98)`.
2. **Emissive HDR clampado.** GLB original: tela `emissiveIntensity 2000`, flash 381. Em
   three.js use ~3.0 (tela) e ~2.5 (flash) com `ACESFilmicToneMapping`, exposure ~1.4.
3. **UVs do GLB já vêm com tiling baked** (frame UV 0…115 etc.) — texturas com
   `RepeatWrapping` e NENHUM repeat extra.
4. **Ordem dos transparentes** (`RENDER_ORDER`): backPanel 1 → vidros de câmera 2 →
   capa de lente 3 → flashRef 4 → flashMatte 5 → flashGlass 6 → halo gradient 7.
   Todos com `depthWrite: false`.
5. **`COLOR_0` = AO baked** em grayscale — ativar `vertexColors` só nas malhas que o têm;
   afeta o diffuse, NÃO o emissive (a tela continua brilhando).
6. **`anisotropy 0.77`** só nos parafusos (`COLOUR_Cherry_Aniso`); **`iridescence 0.2 /
   ior 1.3 / [100, 400] nm`** em todas as lentes (as 4 + capa externa).

## Adaptar para outros variants/modelos

- **Trocar de cor** (ex.: "Preto Titânio"): trocar SOMENTE os fatores `COLOUR_Cherry_*`
  em `references/materiais.md` + `MATS`. `BASE_*` permanece.
- **Outro modelo GLB**: rodar o extrator; se o material mudar de nome, atualizar a tabela
  `MATS` com os valores do novo teardown (mesmo método: parse do GLB → tabela).

## Fallback sem GLB (geometria procedural)

Só quando não existir asset extraído. Ler a receita do bloco em `references/partes/` e
construir com primitivas seguindo as dimensões documentadas (todas em mm, medidas reais
do teardown: corpo 78,97 × 163,36 mm, ilha 34,6 × 35,8 no canto superior direito, etc.).
Assumir que serão necessários vários ciclos de verificação visual — a geometria extraída
nunca precisa disso.
