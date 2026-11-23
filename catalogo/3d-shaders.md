# 3D, Three.js & shaders

**18 skills** · [← voltar ao índice](../README.md)

---

## 3d-asset-generation

**O que cria:** geração/roteamento de assets 3D de produção (Tripo, Hunyuan, SAM 3D, catálogo Kenney, Blender).

**Chaves técnicas:** rota por papel do asset (catálogo p/ scatter, text-to-3d p/ herói, image-to-3d), contrato de prompt por objeto isolado, QA obrigatório de malha no Blender (silhueta, UV, PBR, tri count, contato com chão), normalização de escala via target_height, exclusion_zones, densidade macro/meso/micro.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/3d-asset-generation/` para `~/.claude/skills/`

---

## threejs-animation (OpenMontage)

**O que cria:** Animação Three.js: keyframe tracks, AnimationMixer/Action, blending e clipes de GLTF.

**Chaves técnicas:** Number/Vector/Quaternion/Color/BooleanKeyframeTrack, InterpolateLinear/Smooth/Discrete, AnimationMixer + clipAction, fadeIn/fadeOut/crossFadeTo, LoopRepeat/LoopOnce/LoopPingPong, clampWhenFinished, additive blending, clipes GLTF por nome.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-animation/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-animation/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-animation/` para `~/.claude/skills/`

---

## threejs-fundamentals

**O que cria:** Setup de cena Three.js — câmeras, renderer WebGL, hierarquia Object3D e transformações.

**Chaves técnicas:** Perspective/Orthographic/Array/CubeCamera, WebGLRenderer (ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, alpha), Fog/FogExp2, Group/Mesh, renderOrder, layers, matrixAutoUpdate.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-fundamentals/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-fundamentals/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-fundamentals/` para `~/.claude/skills/`

---

## threejs-geometry

**O que cria:** Geometrias Three.js: primitivas, BufferGeometry custom e geometrias de path/texto.

**Chaves técnicas:** Box/Sphere/Plane/Cylinder/Torus/TorusKnot/Capsule/poliédricas, LatheGeometry, ExtrudeGeometry com bevel, TubeGeometry sobre CatmullRomCurve3, TextGeometry com bevel + center(), BufferAttribute (position/normal/uv/color), InstancedMesh.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-geometry/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-geometry/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-geometry/` para `~/.claude/skills/`

---

## threejs-interaction

**O que cria:** Interação Three.js: raycasting de mouse/touch, seleção de objetos e controles de câmera.

**Chaves técnicas:** Raycaster.setFromCamera + intersectObjects (layers, throttle de hover), conversão client→NDC, OrbitControls (damping, autorotate, limites), FlyControls, FirstPersonControls, PointerLockControls.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-interaction/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-interaction/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-interaction/` para `~/.claude/skills/`

---

## threejs-lighting

**O que cria:** Iluminação Three.js — tipos de luz, sombras e iluminação por ambiente.

**Chaves técnicas:** Ambient/Hemisphere/Directional/Point/Spot/RectAreaLight, shadow.mapSize/bias/normalBias/radius, PCFSoft/VSMShadowMap, frustum apertado p/ sombra, penumbra/decay do SpotLight.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-lighting/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-lighting/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-lighting/` para `~/.claude/skills/`

---

## threejs-loaders

**O que cria:** Carregamento de assets Three.js: GLTF/Draco/KTX2, texturas, HDR/EXR e progresso.

**Chaves técnicas:** LoadingManager (onStart/onProgress/onLoad/onError), GLTFLoader + DRACOLoader + KTX2Loader, RGBELoader/EXRLoader, PMREMGenerator.fromEquirectangular, CubeTextureLoader (6 faces), colorSpace sRGB vs linear, wrap/repeat/anisotropy.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-loaders/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-loaders/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-loaders/` para `~/.claude/skills/`

---

## threejs-materials

**O que cria:** Materiais Three.js — PBR, Phong, Toon e ShaderMaterial com propriedades avançadas.

**Chaves técnicas:** MeshStandardMaterial (roughness/metalness/normal/ao/displacement), MeshPhysicalMaterial (clearcoat, transmission/vidro, sheen, iridescence, anisotropy), MeshToonMaterial + gradientMap (cel shading), MeshPhong/Lambert, exemplos car paint e glass.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-materials/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-materials/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-materials/` para `~/.claude/skills/`

---

## threejs-postprocessing

**O que cria:** Pós-processamento Three.js com EffectComposer: bloom, DOF, grão, vinheta, anti-aliasing.

**Chaves técnicas:** EffectComposer+RenderPass, UnrealBloomPass (strength/radius/threshold) + bloom seletivo por layer (darken/restore), FXAAShader/SMAAPass, SSAOPass, BokehPass (focus/aperture), FilmPass (grain/scanlines), VignetteShader, ColorCorrectionShader.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-postprocessing/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-postprocessing/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-postprocessing/` para `~/.claude/skills/`

---

## threejs-shaders

**O que cria:** Shaders GLSL custom em Three.js: ShaderMaterial, uniforms, varyings e deslocamento de vértices.

**Chaves técnicas:** ShaderMaterial vs RawShaderMaterial, uniforms (float/vec/Color/Matrix/sampler), varyings vertex→fragment, padrão de amostragem de textura, vertex displacement (ondas sin em pos.z).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-shaders/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-shaders/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-shaders/` para `~/.claude/skills/`

---

## threejs-textures

**O que cria:** Texturas Three.js: UV, wrap/repeat, DataTexture, CanvasTexture, VideoTexture e cubemaps.

**Chaves técnicas:** colorSpace sRGB p/ albedo, Repeat/MirroredRepeat/ClampToEdge, repeat/offset/rotation com center, minFilter/magFilter (Nearest = pixelado), DataTexture de gradiente, CanvasTexture desenhada + needsUpdate, VideoTexture, KTX2Loader, PMREM equirectangular.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-textures/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-textures/SKILL.md

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-textures/` para `~/.claude/skills/`

---

## threejs-world-generation

**O que cria:** Gera mundos 3D Three.js determinísticos a partir de briefs — terreno, regiões semânticas, landmarks e fly-through de câmera.

**Chaves técnicas:** world_spec (escala, 3-7 regiões, landmarks com IDs, camera path); tiers blockout/production; scatter com seed determinística; gates HyperFrames check; pipeline Blender PNG + ffmpeg packaging; issue queue com loops de refinamento ≤3

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** `git clone https://github.com/calesthio/OpenMontage` → copie `<repo>/.agents/skills/threejs-world-generation/` para `~/.claude/skills/`

---

## blender-3d

**O que cria:** Blender do estúdio Mortiflix com toolkits MoBlend/Nova FX/Camera/Animate via mfx3d.

**Chaves técnicas:** mfx3d.call toolkit commands, create_cloner MoGraph, presets Nova FX partículas/fogo/faíscas, render_contact_sheet, analyze_framing, Eevee previews/Cycles final, springs easing, render queue mfx render

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** `git clone https://github.com/GTKottman/mortiflix-oss` → copie `<repo>/harness/skills/blender-3d/` para `~/.claude/skills/`

---

## title-sequence-3d

**O que cria:** title sequence 3D cinematográfica 8-15s em Three.js — dolly por cena iluminada com neon e título final.

**Chaves técnicas:** dolly lenta único movimento, UnrealBloomPass sutil, logos em canvas texture/plane, som em código (drone+hit), chuva seeded, título bold condensed com palavra no accent

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** `git clone https://github.com/charlie947/motion-graphics-skills` → copie `<repo>/skills/title-sequence-3d/` para `~/.claude/skills/`

---

## three-best-practices

**O que cria:** guia de performance Three.js com 120+ regras priorizadas.

**Chaves técnicas:** InstancedMesh/BatchedMesh; dispose recursivo; Draco/Meshopt/KTX2; LOD; TSL/WebGPU; postpro merge pass; shader mediump; fake shadows

**Origem:** three-best-practices

**Como instalar:** Coleção local em `editor-chefe/skills/three-best-practices/` (sem remote) — copie `SKILL.md/` para `~/.claude/skills/`

---

## particle-system

**O que cria:** sistemas de partículas canvas/GPU: confetti, neve, fumaça, flow fields, constelação.

**Chaves técnicas:** semi-implicit Euler + dt clampado; forças attract/repel/spring; curl noise divergence-free; confetti burst = rotação + retângulos + gravity + drag; spatial grid O(n) p/ linhas de conexão; Three.js Points + ShaderMaterial additive; seeded RNG mulberry32 + fixed timestep p/ frame reprodutível

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/webgl-animation-skills` → copie `<repo>/skills/particle-system/` para `~/.claude/skills/`

---

## shader-glsl

**O que cria:** fragment shaders GLSL: noise/fbm, SDF, transições de imagem, glitch.

**Chaves técnicas:** cosine palette IQ a+b*cos; fbm + domain warp; dissolve por threshold de noise vs u_progress; displacement UV; glitch row-shift + RGB channel offset; SDF + smoothstep(fwidth) AA; Three.js ShaderMaterial full-screen quad

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/webgl-animation-skills` → copie `<repo>/skills/shader-glsl/` para `~/.claude/skills/`

---

## threejs-animation (webgl-skills)

**O que cria:** animação 3D Three.js: render loop, GLTF mixer, camera, instancing, disposal.

**Chaves técnicas:** clock.getDelta() frame-independent; crossFadeTo() entre clips; camera damp lerp 1-exp(-lambda*dt); InstancedMesh setMatrixAt; scroll→camera via CatmullRomCurve3; dispose traversal (materials arrays + texture slots)

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** `git clone https://github.com/iart-ai/webgl-animation-skills` → copie `<repo>/skills/threejs-animation/` para `~/.claude/skills/`

