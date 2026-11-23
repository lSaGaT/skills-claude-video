# Schema REAL do CapCut 9.7.0.4153 — observado no draft "1104" (ground truth)

Fonte: `User Data\Projects\com.lveditor.draft\1104\draft_content.json` (158 KB,
projeto criado na UI pelo usuário, 2026-11-04). Diferenças críticas vs. docs
públicas (6.x–9.x/JianYing) marcadas com **[DIFERE]**.

## Top-level (chaves reais)

`canvas_config` `color_space(int)` `config` `cover` `create_time` `draft_type`
`duration` `extra_info` `fps` `free_render_index_mode_on` `function_assistant_info`
`group_container` `id` `is_drop_frame_timecode` `keyframe_graph_list` `keyframes`
`last_modified_platform` `lyrics_effects` `materials` `mixed_track_mode_on`
`mutable_config` `name` `new_version` `path` `platform` `relationships`
`render_index_track_mode_on` `retouch_cover` `smart_ads_info` `source`
`static_cover_image_path` `time_marks` `tracks` `uneven_animation_template_info`
`update_time` `version`

- `version: 360000` (int do formato)
- `draft_type: "video"`, `source: "default"`
- `platform`: `{os, os_version:"10.0.19045", app_id:359289, app_version:"9.7.0",
  app_source:"cc", device_id, hard_disk_id, mac_address}` — **[DIFERE]** docs
  públicas: mais campos de identidade do dispositivo.
- `keyframes`: dict com listas por categoria **[DIFERE]** — `videos, audios,
  texts, stickers, filters, adjusts, handwrites, effects` (não `{materials, id_infos}`).
- `canvas_config`: `{ratio:"original", width:1920, height:1080, background:None}`.

## Materials — categorias reais (9.7)

`audios` `beats` `canvases` **`common_mask`** **[DIFERE: singular, não
`common_masks`]** `effects` **[DIFERE: é a categoria dos FILTROS]** `loudnesses`
`material_animations` `material_colors` `placeholder_infos` `realtime_denoises`
`sound_channel_mappings` `speeds` `stickers` `text_templates` `texts`
`video_effects` `vocal_beautifys` `vocal_separations`

### Mapeamento filter vs effect (9.7 real)

| UI | Categoria no draft | `type` do material |
|---|---|---|
| **Filtro** (color grade) | `materials.effects[]` | `"filter"` (+ `sub_type`, `value`, `visible`) |
| **Efeito** (scene effect) | `materials.video_effects[]` | `"video_effect"` |

Ambos com **ids numéricos de catálogo** (`effect_id`/`resource_id` =
"7426269857357763089") e `path` → `User Data\Cache\effect\<id>\<md5>`,
`category_id`/`category_name` (ex.: "Halloween🎃", "Filmes").

### Shapes observados (campos principais)

- **videos[]**: `{id, unique_id, type:"video"|"photo", duration, path, media_path:"",
  has_audio, width, height, category_name:"local", material_name, material_url:"",
  crop_ratio:"free", crop_scale:1.0, stable:{stable_level:2,...}, matting/crop...}`
- **audios[]**: `{id, unique_id, type:"video_original_sound"|"music", name, duration,
  path, wave_points:[], music_id, source_platform:0, video_id (link ao vídeo de origem)…}`
- **texts[]**: ~130 campos. Principais: `{id, type:"text", content (JSON-in-JSON),
  font_name:"", font_path, font_id, font_size:15.0, text_color:"#ffffffff",
  text_size, alignment:1 (text_alignment:None), typesetting, letter_spacing,
  line_spacing, has_shadow, border_*, background_*, underline, words, base_content,
  language:"pt-BR"}`. `content` real: `{"text": "...", "styles": [...]}` com
  style `{"fill":{"content":{"render_type":"solid","solid":{"color":[1,1,1]}}},
  "range":[0,43]}` — range = byte offsets UTF-16 (43 chars ASCII = 43 bytes ✓).
- **text segment**: `clip: {scale:{x,y}, rotation, rotation3d:[], transform:{x,y},
  flip:{vertical,horizontal}, alpha}`; default `transform.y: -0.73`;
  `render_index: 14008` (texto), vídeo: `render_index: 0`, `track_render_index: 0`.
- **speeds[]**: `{id, type:"speed", mode:0, speed:1.0, curve_speed:null}`
- **canvases[]**: `{id, type:"canvas_color", color:"", blur:0.0, image:"", album_image:""…}`
- **common_mask[]**: `{id, type:"mask", category:"video", resource_id:"7374021450748924432",
  constant_material_id, name:"Retângulo", resource_type:"rectangle", path→Cache\effect…}`
- **material_colors[]**: `{id, is_color_clip:false, is_gradient:false, solid_color:"",
  gradient_colors:[], gradient_percents:[], gradient_angle:90.0, width, height}`
- **beats[]**: `{id, type:"beats", enable_ai_beats, gear:404, mode:404, user_beats:[],
  ai_beats:{melody_url/path, beats_url/path, melody_percents:[0.6], beat_sp…}}`
- **loudnesses[]**: `{id, enable:true, time_range:{start,duration}, file_id, target_loudness…}`
- **vocal_separations[]**: `{id, type:"vocal_separation", choice:0, removed_sounds:[], time_range…}`
- **sound_channel_mappings[]**: `{id, type:"none", audio_channel_mapping:0, is_config_open:false}`
- **vocal_beautifys[]**: `{id, type:"vocal_beautify", enable, time_range,
  production_path:"##_draftpath_placeholder_…"}` — placeholder de path dentro do draft.
- **realtime_denoises[]**: `{id, type:"realtime_denoise", is_denoise:true,
  denoise_mode:1.0, denoise_rate:0.85, path→Apps\...\(modelo)…}`
- **text_templates[]**: ~40 campos (effect_id/resource_id/aigc_config/resources…).
- **material_animations[]**: 8 itens (animações aplicadas pelo usuário).

### Segment shape (todos os track types compartilham ~50 campos)

`caption_info` `cartoon` `clip` `color_correct_alg_result` `common_keyframes`
`desc` `digital_human_template_group_id` `enable_adjust` `enable_adjust_mask`
`enable_color_adjust_pro` `enable_color_correct_adjust` `enable_color_curves`
`enable_color_match_adjust` `enable_color_wheels` `enable_hsl` `enable_hsl_curves`
`enable_lut` `enable_mask_shadow` `enable_mask_stroke` `enable_smart_color_adjust`
`enable_video_mask` `extra_material_refs` `group_id` `hdr_settings`
`hdr_vivid_settings` `id` `intensifies_audio` `is_loop` `is_placeholder`
`is_tone_modify` `keyframe_refs` `last_nonzero_volume` `lyric_keyframes`
`material_id` `raw_segment_id` `render_index` `render_timerange` `responsive_layout`
`reverse` `segment_color_tag` `source` `source_timerange` `speed` `state`
`target_timerange` `template_id` `template_scene` `track_attribute`
`track_render_index` `uniform_scale` `visible` `volume`

### Companions típicos de um segmento de vídeo (refs reais)

`speeds` + `placeholder_infos` + `canvases` + `sound_channel_mappings` +
`material_colors` + `vocal_separations` (6 refs no draft de teste).

## Tracks reais do projeto-exemplo

`video(8 seg)` `sticker(1)` `filter(5)` `effect(1)` `filter(6)` `filter(1)`
`sticker(5)` `text(1)` `text(1)` `text(1)` `audio(1)` — filtros/efeitos ficam em
**tracks dedicadas** (vários tracks `filter` simultâneos no 9.7).

## Outros arquivos da pasta de draft (9.7)

`Resources/`, `Timelines/`, `adjust_mask/`, `common_attachment/`, `loudness/`,
`matting/`, `qr_upload/` (dirs) · `attachment_editing.json`,
`attachment_pc_common.json`, `crypto_key_store.dat[.bak]`, `draft.extra`,
`draft_agency_config.json`, `draft_biz_config.json`, `draft_content.json[.bak]`,
`draft_cover.jpg`, `draft_meta_info.json`, `draft_settings`,
`draft_virtual_store.json`, `key_value.json`, `performance_opt_info.json`

## Confirmações vs. público

- `extra_material_refs` ✓; microssegundos ✓; tracks array order = z-order ✓;
  texto JSON-in-JSON com ranges UTF-16 ✓; `render_index` de texto ~14000 ✓.
- **Correções ao público**: `common_mask` singular; filtros em `effects[]`;
  `keyframes` dict-por-categoria; segmento ~50 campos; plataforma com device ids.
