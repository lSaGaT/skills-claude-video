# 3D, Three.js & shaders

**18 skills** · [← voltar ao índice](../README.md)

---

## 3d-asset-generation

**O que cria:** geração/roteamento de assets 3D de produção (Tripo, Hunyuan, SAM 3D, catálogo Kenney, Blender).

**Chaves técnicas:** rota por papel do asset (catálogo p/ scatter, text-to-3d p/ herói, image-to-3d), contrato de prompt por objeto isolado, QA obrigatório de malha no Blender (silhueta, UV, PBR, tri count, contato com chão), normalização de escala via target_height, exclusion_zones, densidade macro/meso/micro.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/3d-shaders/3d-asset-generation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/3d-asset-generation/`

---

## threejs-animation (OpenMontage)

**O que cria:** Animação Three.js: keyframe tracks, AnimationMixer/Action, blending e clipes de GLTF.

**Chaves técnicas:** Number/Vector/Quaternion/Color/BooleanKeyframeTrack, InterpolateLinear/Smooth/Discrete, AnimationMixer + clipAction, fadeIn/fadeOut/crossFadeTo, LoopRepeat/LoopOnce/LoopPingPong, clampWhenFinished, additive blending, clipes GLTF por nome.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-animation/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-animation/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-animation--openmontage/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-animation--openmontage/`

---

## threejs-fundamentals

**O que cria:** Setup de cena Three.js — câmeras, renderer WebGL, hierarquia Object3D e transformações.

**Chaves técnicas:** Perspective/Orthographic/Array/CubeCamera, WebGLRenderer (ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, alpha), Fog/FogExp2, Group/Mesh, renderOrder, layers, matrixAutoUpdate.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-fundamentals/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-fundamentals/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-fundamentals/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-fundamentals/`

---

## threejs-geometry

**O que cria:** Geometrias Three.js: primitivas, BufferGeometry custom e geometrias de path/texto.

**Chaves técnicas:** Box/Sphere/Plane/Cylinder/Torus/TorusKnot/Capsule/poliédricas, LatheGeometry, ExtrudeGeometry com bevel, TubeGeometry sobre CatmullRomCurve3, TextGeometry com bevel + center(), BufferAttribute (position/normal/uv/color), InstancedMesh.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-geometry/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-geometry/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-geometry/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-geometry/`

---

## threejs-interaction

**O que cria:** Interação Three.js: raycasting de mouse/touch, seleção de objetos e controles de câmera.

**Chaves técnicas:** Raycaster.setFromCamera + intersectObjects (layers, throttle de hover), conversão client→NDC, OrbitControls (damping, autorotate, limites), FlyControls, FirstPersonControls, PointerLockControls.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-interaction/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-interaction/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-interaction/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-interaction/`

---

## threejs-lighting

**O que cria:** Iluminação Three.js — tipos de luz, sombras e iluminação por ambiente.

**Chaves técnicas:** Ambient/Hemisphere/Directional/Point/Spot/RectAreaLight, shadow.mapSize/bias/normalBias/radius, PCFSoft/VSMShadowMap, frustum apertado p/ sombra, penumbra/decay do SpotLight.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-lighting/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-lighting/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-lighting/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-lighting/`

---

## threejs-loaders

**O que cria:** Carregamento de assets Three.js: GLTF/Draco/KTX2, texturas, HDR/EXR e progresso.

**Chaves técnicas:** LoadingManager (onStart/onProgress/onLoad/onError), GLTFLoader + DRACOLoader + KTX2Loader, RGBELoader/EXRLoader, PMREMGenerator.fromEquirectangular, CubeTextureLoader (6 faces), colorSpace sRGB vs linear, wrap/repeat/anisotropy.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-loaders/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-loaders/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-loaders/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-loaders/`

---

## threejs-materials

**O que cria:** Materiais Three.js — PBR, Phong, Toon e ShaderMaterial com propriedades avançadas.

**Chaves técnicas:** MeshStandardMaterial (roughness/metalness/normal/ao/displacement), MeshPhysicalMaterial (clearcoat, transmission/vidro, sheen, iridescence, anisotropy), MeshToonMaterial + gradientMap (cel shading), MeshPhong/Lambert, exemplos car paint e glass.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-materials/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-materials/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-materials/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-materials/`

---

## threejs-postprocessing

**O que cria:** Pós-processamento Three.js com EffectComposer: bloom, DOF, grão, vinheta, anti-aliasing.

**Chaves técnicas:** EffectComposer+RenderPass, UnrealBloomPass (strength/radius/threshold) + bloom seletivo por layer (darken/restore), FXAAShader/SMAAPass, SSAOPass, BokehPass (focus/aperture), FilmPass (grain/scanlines), VignetteShader, ColorCorrectionShader.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-postprocessing/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-postprocessing/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-postprocessing/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-postprocessing/`

---

## threejs-shaders

**O que cria:** Shaders GLSL custom em Three.js: ShaderMaterial, uniforms, varyings e deslocamento de vértices.

**Chaves técnicas:** ShaderMaterial vs RawShaderMaterial, uniforms (float/vec/Color/Matrix/sampler), varyings vertex→fragment, padrão de amostragem de textura, vertex displacement (ondas sin em pos.z).

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-shaders/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-shaders/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-shaders/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-shaders/`

---

## threejs-textures

**O que cria:** Texturas Three.js: UV, wrap/repeat, DataTexture, CanvasTexture, VideoTexture e cubemaps.

**Chaves técnicas:** colorSpace sRGB p/ albedo, Repeat/MirroredRepeat/ClampToEdge, repeat/offset/rotation com center, minFilter/magFilter (Nearest = pixelado), DataTexture de gradiente, CanvasTexture desenhada + needsUpdate, VideoTexture, KTX2Loader, PMREM equirectangular.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/threejs-textures/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/threejs-textures/SKILL.md

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-textures/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-textures/`

---

## threejs-world-generation

**O que cria:** Gera mundos 3D Three.js determinísticos a partir de briefs — terreno, regiões semânticas, landmarks e fly-through de câmera.

**Chaves técnicas:** world_spec (escala, 3-7 regiões, landmarks com IDs, camera path); tiers blockout/production; scatter com seed determinística; gates HyperFrames check; pipeline Blender PNG + ffmpeg packaging; issue queue com loops de refinamento ≤3

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-world-generation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/3d-shaders/threejs-world-generation/`

---

## blender-3d

**O que cria:** Blender do estúdio Mortiflix com toolkits MoBlend/Nova FX/Camera/Animate via mfx3d.

**Chaves técnicas:** mfx3d.call toolkit commands, create_cloner MoGraph, presets Nova FX partículas/fogo/faíscas, render_contact_sheet, analyze_framing, Eevee previews/Cycles final, springs easing, render queue mfx render

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/3d-shaders/blender-3d/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/3d-shaders/blender-3d/`

---

## title-sequence-3d

**O que cria:** title sequence 3D cinematográfica 8-15s em Three.js — dolly por cena iluminada com neon e título final.

**Chaves técnicas:** dolly lenta único movimento, UnrealBloomPass sutil, logos em canvas texture/plane, som em código (drone+hit), chuva seeded, título bold condensed com palavra no accent

**Origem:** motion-graphics-skills · [https://github.com/charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)

**Como instalar:** Copie a pasta `skills/3d-shaders/title-sequence-3d/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/charlie947/motion-graphics-skills.

**Pasta no repo:** `skills/3d-shaders/title-sequence-3d/`

---

## three-best-practices

**O que cria:** guia de performance Three.js com 120+ regras priorizadas.

**Chaves técnicas:** InstancedMesh/BatchedMesh; dispose recursivo; Draco/Meshopt/KTX2; LOD; TSL/WebGPU; postpro merge pass; shader mediump; fake shadows

**Origem:** three-best-practices

**Como instalar:** Copie a pasta `skills/3d-shaders/three-best-practices/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/three-best-practices`.

**Pasta no repo:** `skills/3d-shaders/three-best-practices/`

---

## particle-system

**O que cria:** sistemas de partículas canvas/GPU: confetti, neve, fumaça, flow fields, constelação.

**Chaves técnicas:** semi-implicit Euler + dt clampado; forças attract/repel/spring; curl noise divergence-free; confetti burst = rotação + retângulos + gravity + drag; spatial grid O(n) p/ linhas de conexão; Three.js Points + ShaderMaterial additive; seeded RNG mulberry32 + fixed timestep p/ frame reprodutível

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** Copie a pasta `skills/3d-shaders/particle-system/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/webgl-animation-skills.

**Pasta no repo:** `skills/3d-shaders/particle-system/`

---

## shader-glsl

**O que cria:** fragment shaders GLSL: noise/fbm, SDF, transições de imagem, glitch.

**Chaves técnicas:** cosine palette IQ a+b*cos; fbm + domain warp; dissolve por threshold de noise vs u_progress; displacement UV; glitch row-shift + RGB channel offset; SDF + smoothstep(fwidth) AA; Three.js ShaderMaterial full-screen quad

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** Copie a pasta `skills/3d-shaders/shader-glsl/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/webgl-animation-skills.

**Pasta no repo:** `skills/3d-shaders/shader-glsl/`

---

## threejs-animation (webgl-skills)

**O que cria:** animação 3D Three.js: render loop, GLTF mixer, camera, instancing, disposal.

**Chaves técnicas:** clock.getDelta() frame-independent; crossFadeTo() entre clips; camera damp lerp 1-exp(-lambda*dt); InstancedMesh setMatrixAt; scroll→camera via CatmullRomCurve3; dispose traversal (materials arrays + texture slots)

**Origem:** webgl-animation-skills · [https://github.com/iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills)

**Como instalar:** Copie a pasta `skills/3d-shaders/threejs-animation--webgl-animation/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/webgl-animation-skills.

**Pasta no repo:** `skills/3d-shaders/threejs-animation--webgl-animation/`

