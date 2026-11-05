# CapCut / JianYing draft_content.json schema cheat sheet: every top-level key, what it does, version differences

_A field-by-field reference for the CapCut / JianYing project format — what's in `materials`, what's in `tracks`, which version added which field, and the jq one-liners that pull data out cleanly._

_Last tested: May 2026 (capcut-cli v0.5.0; CapCut 6.x–9.x, JianYing 5.9.0). See Changelog at the bottom._

> If this saves you a reverse-engineering session, follow [@renezander030](https://github.com/renezander030) — more notes on the CapCut / JianYing draft format and the CLI that edits it.
>
> Source for every field below: [github.com/renezander030/capcut-cli](https://github.com/renezander030/capcut-cli) — `docs/draft-schema/` (~3,700 lines), distilled here.

## Fixture scope and encrypted online templates

| Draft source | Evidence |
|---|---|
| CapCut International 6.x–9.x local drafts | Historical local fixtures, May 2026 |
| JianYing 5.9 local drafts | Historical local fixtures, May 2026 |
| JianYing 5.9 online templates | Reader-reported encrypted; not reproduced here |
| Other versions/template sources | Detect before editing; no universal unencrypted guarantee |

The [reader comment and owner reply](https://gist.github.com/renezander030/80823f1d47081c312d2c1f9edd20dc22#comments) establish the online-template exception as user evidence, not an official format specification. Verify JSON/encryption on a copied draft before applying this schema. No current GUI version was rerun.

## TL;DR — every top-level key

| Key | What it stores | Which `capcut` command touches it |
|---|---|---|
| `id` | draft UUID | `init` (sets it once) |
| `name` | user-visible project name | `init`, `info` (read) |
| `duration` | timeline length in microseconds | every add-/cut-/import- command recomputes it |
| `fps` | 24 / 25 / 30 / 50 / 60 | `init` |
| `canvas_config.{width,height,ratio}` | pixel canvas + "9:16" / "16:9" / "1:1" / "4:5" | `init` |
| `platform.app_source` | `"cc"` (CapCut) or `"lv"` (JianYing) — drives enum namespace | read by `version`, `enums` |
| `platform.app_version` | exact app version that wrote the draft | read by `version`, `decrypt`, `lint` |
| `tracks[]` | ordered list of timeline lanes; array order = z-order | `tracks`, `segments`, `add-*` |
| `tracks[].segments[]` | the clips themselves; reference materials by `material_id` | `segments`, `segment <id>`, `set-text`, `mix-mode`, `audio-fade`, etc. |
| `materials.videos[]` | video clips AND images (discriminator: `type: "video"` vs `"photo"`) | `add-video`, `materials --type videos`, `material <id>` |
| `materials.audios[]` | VO, music, SFX, recordings | `add-audio`, `add-sfx`, `audio-fade` |
| `materials.texts[]` | text bodies + per-range styling (content field is JSON-in-JSON) | `add-text`, `set-text`, `text-style`, `text-ranges`, `bubble-text`, `import-srt`, `import-ass`, `caption` |
| `materials.stickers[]` | sticker references (resource_id from CapCut library) | `add-sticker` |
| `materials.video_effects[]` | scene effects AND filter chain | `add-effect`, `add-filter`, `chroma` |
| `materials.material_animations[]` | intro/outro/combo animations on video/image segments | (companion of video segment via `extra_material_refs`) |
| `materials.transitions[]` | transition between segments | (companion of segment) |
| `materials.masks[]` (legacy) / `materials.common_masks[]` (new) | shape masks; field name depends on app version | `mask`, `migrate` |
| `materials.canvases[]` | background blur / background colour | (companion of video segment) |
| `materials.speeds[]` | playback speed envelopes | (companion of video segment) |
| `materials.audio_fades[]` | fade-in / fade-out objects on audio segments | `audio-fade` (v0.5) |
| `materials.placeholder_infos[]` | missing-asset placeholders | written by CapCut when source file is gone |
| `materials.vocal_separations[]` | VO/music split metadata | written by CapCut's separator |
| `materials.sound_channel_mappings[]` | stereo/mono routing | usually CapCut-set defaults |
| `materials.smart_crops[]` / `manual_deformations[]` | aspect-ratio crops + manual deformations | CapCut-set; rarely edited |
| `cover` (a.k.a. `cover_info`) | the thumbnail frame for the draft | `add-cover` (v0.5) |
| `extra_info` | app-specific scratchpad | preserve, don't edit |
| `last_modified_platform` | last app that touched the draft | informational |
| `new_version` | non-null on some CapCut International builds | informational |
| `free_render_index_mode_on` | always `false` for CLI-created drafts | preserve, don't edit |

The format is **flat and decoupled**: a `segment` in a `track` does not contain its material inline — it carries a `material_id` UUID that points into one of the `materials.<category>[]` arrays. To answer "what is this clip?", you do `segment.material_id` → `materials.<type>` → find by `id`.

## Recommended workflow

You don't need to memorise the schema. You need three things:

1. **`capcut info <project>`** for the read overview (track counts, material counts, duration).
2. **`jq` one-liners** for ad-hoc extraction (see [Useful jq one-liners](#useful-jq-one-liners) below).
3. **`capcut <command>`** for any write — the CLI knows which schema fields go together (e.g. `audio-fade` writes both `materials.audio_fades[]` and a `segment.extra_material_refs[]` pointer).

Hand-editing `draft_content.json` is reasonable for `info`-level inspection. It is **not** reasonable for writes — text content lives in a JSON-encoded `content` string with UTF-16 byte-offset ranges, and getting it wrong silently breaks the draft.

## The 30-second mental model

```jsonc
{
  "id": "test-project-001",
  "name": "Test Project",
  "duration": 10000000,               // microseconds total timeline
  "fps": 30,
  "canvas_config": {
    "width": 1080, "height": 1920,
    "ratio": "9:16"
  },
  "platform": {
    "app_source": "cc",               // "cc" = CapCut International; "lv" = JianYing (CN)
    "app_version": "9.0.0",
    "os": "mac"
  },
  "tracks": [                         // top of array = bottom of z-stack
    { "id": "...", "type": "video", "segments": [...] },
    { "id": "...", "type": "text",  "segments": [...] },
    { "id": "...", "type": "audio", "segments": [...] }
  ],
  "materials": {
    "videos":             [...],      // video files AND images
    "audios":             [...],
    "texts":              [...],      // one per text segment, JSON-in-JSON content
    "stickers":           [...],
    "video_effects":      [...],
    "material_animations":[...],
    "transitions":        [...],
    "masks":              [...],      // legacy
    "common_masks":       [...],      // new — see version table below
    "canvases":           [...],
    "speeds":             [...],
    "audio_fades":        [...],      // v0.5 ships writes here
    "placeholder_infos":  [...],
    "vocal_separations":  [...]
  },
  "extra_info": { ... },
  "free_render_index_mode_on": false
}
```

## Segment shape — the 4 fields that matter most

Every segment in every track type has roughly this shape:

```jsonc
{
  "id": "...-segment-uuid",
  "material_id": "...-material-uuid",         // (1) what this segment IS
  "target_timerange": {                       // (2) where it plays on the timeline
    "start": 0, "duration": 5000000
  },
  "source_timerange": {                       // (3) what slice of the source
    "start": 0, "duration": 5000000
  },
  "extra_material_refs": [                    // (4) companion materials: speeds, masks,
    "uuid1", "uuid2"                          //     animations, transitions, audio_fades
  ],
  "clip": { "rotation": 0, "alpha": 1.0, "scale": {...}, "transform": {...}, "flip": {...} },
  "speed": 1.0, "volume": 1.0, "visible": true,
  "render_index": 0, "render_uniform_index": -1
}
```

- `material_id` → primary `materials.<type>[].id` — defines what the segment is.
- `target_timerange` → microseconds; position on the timeline.
- `source_timerange` → microseconds; trim into the source material.
- `extra_material_refs[]` → array of UUIDs into the **companion** materials (speeds, masks, audio_fades, transitions). The companion pattern is how CapCut keeps the schema "flat enough" to merge across versions.

## Track types

| `type` | Used by | Notes |
|---|---|---|
| `video` | `add-video` (video files + still images) | most segments live here |
| `audio` | `add-audio`, `add-sfx` | `seg.clip` must be `null` |
| `text` | `add-text`, `set-text`, `text-style`, `text-anim`, `text-ranges`, `bubble-text`, `import-srt`, `import-ass`, `caption` | each segment has exactly one text material |
| `image` | rare — JianYing-only static image lane | CapCut puts images on video track |
| `sticker` | `add-sticker` | references CapCut library `resource_id` |
| `effect` | `add-effect`, `add-filter` | scene effect / filter applied to the frame |
| `subtitle` | reserved for CapCut auto-subtitle | `import-srt` uses `text` by default |
| `filter` | filter chain | not exposed directly yet |

Tracks created by `capcut-cli` get sensible defaults. Rename via `--track-name <name>` on `add-*` commands. Subsequent `add-*` with the same name reuses the existing track.

## The text material — JSON-in-JSON

This is the trickiest material. The actual text and per-range styling live inside a **JSON-encoded string** called `content`:

```jsonc
{
  "id": "text-mat-uuid",
  "type": "text",
  "content": "{\"text\":\"Hello\",\"styles\":[...],\"layer_weight\":1,\"effect\":[]}",
  "font_name": "", "font_size": 8.0,
  "text_color": "#FFFFFFFF",
  "border_color": "#000000FF", "border_width": 0.0,
  "has_shadow": false, "shadow_color": "#000000FF", "shadow_distance": 8.0,
  "background_color": "#00000000",
  "text_alignment": 1,    // 0=left, 1=centre, 2=right
  "vertical": false
}
```

And the parsed `content`:

```jsonc
{
  "text": "Hello world",
  "styles": [
    {
      "range": [0, 10],                                    // UTF-16 BYTE offsets, not chars
      "fill": { "content": { "solid": { "color": [1.0, 0.84, 0.0] } } },
      "font": { "id": "...", "path": "..." },
      "size": 18, "bold": true, "italic": false
    }
  ],
  "layer_weight": 1,
  "effect": []
}
```

**The `range` array is in UTF-16 little-endian byte offsets.** For ASCII, byte index = character index. For Chinese / emoji, each char is 2 bytes (BMP) or 4 bytes (non-BMP). `capcut set-text` and `capcut text-ranges` handle the conversion — hand-editing `content` is the source of most CapCut "text disappeared" bugs.

## Version differences — what changed between releases

| Field | CapCut 6.x–9.x (`app_source: cc`) | JianYing 5.9 (`app_source: lv`) | JianYing 6.0+ (`app_source: lv`) | Notes |
|---|---|---|---|---|
| `draft_content.json` file format | plain JSON | plain JSON | **encrypted blob** | See [encryption gist](https://gist.github.com/renezander030/521e6c6e8590a2a6e917009d9313bc55) |
| `materials.masks[]` (legacy `mask_field`) | yes (≤9.5) | yes | encrypted | `capcut migrate` for ≥9.6 |
| `materials.common_masks[]` (new `mask_field`) | yes (≥9.6) | — | encrypted | `capcut mask` writes legacy; `migrate` converts |
| `materials.audio_fades[]` | yes (tested local fixtures) | yes (5.9) | encrypted | `capcut audio-fade` writes here (v0.5) |
| `materials.texts[].content.styles[].range[]` | byte-offset (UTF-16 LE) | byte-offset | byte-offset | `text-ranges` (v0.3+) |
| `new_version` (top-level) | sometimes non-null on Intl. builds | null | encrypted | informational |
| `cover` / cover-image validation | lenient ≤9.x, stricter on 10.x+ | n/a | n/a + 10.3 mac "内容已损坏" bug | `add-cover` (v0.5) |
| transitions enum namespace | CapCut slugs | JianYing slugs | encrypted | `enums --jianying` switches |

Run `capcut version <project>` to get an exact verdict:

```bash
capcut version ./project
# → {"app":"cc","app_version":"9.0.0",
#    "support":{"status":"tested"},
#    "schema":{"mask_field":"common_masks","has_text_ranges":true,
#              "has_audio_fades":true,"new_version_field":null,
#              "last_modified_platform":"mac"}}
```

## Useful jq one-liners

These run against any unencrypted `draft_content.json` (or `draft_info.json` on macOS):

```bash
# project overview — name, duration in seconds, fps, canvas
jq '{name, duration_s: (.duration/1e6), fps, canvas: .canvas_config}' draft_content.json

# every text segment with its rendered string
jq '.materials.texts[] | {id, content: (.content | fromjson | .text)}' draft_content.json

# every track with type and segment count
jq '.tracks[] | {id, type, name, segments: (.segments | length)}' draft_content.json

# every segment on the video track with start + duration in seconds
jq '.tracks[] | select(.type=="video") | .segments[] |
    {id, start_s: (.target_timerange.start/1e6),
     dur_s: (.target_timerange.duration/1e6),
     material_id}' draft_content.json

# join segment → material to get the source video filename
jq '.materials.videos as $v | .tracks[] | select(.type=="video") | .segments[] |
    {seg: .id, mat: .material_id,
     path: ($v[] | select(.id==(. // ""))) }' draft_content.json   # see capcut-cli `segment <id>` for proper join

# detect encryption stance + version
jq '{app: .platform.app_source, ver: .platform.app_version,
     has_common_masks: (.materials.common_masks != null),
     has_audio_fades: (.materials.audio_fades != null)}' draft_content.json

# every audio segment with fade durations
jq '.materials.audio_fades[]?' draft_content.json
```

For the joins (segment → material), prefer `capcut segment <id>` and `capcut material <id>` — they walk `extra_material_refs[]` for you and return the resolved companion bundle.

## How `capcut info` / `tracks` / `materials` / `segments` / `texts` map to the schema

| Command | What it reads | Output shape |
|---|---|---|
| `capcut info <project>` | top-level fields + track counts + per-material counts | summary JSON |
| `capcut tracks <project>` | `tracks[]` | array of `{id, type, name, segment_count}` |
| `capcut materials <project>` | every key under `materials.*` | per-category counts |
| `capcut materials <project> --type texts` | `materials.texts[]` | array of materials |
| `capcut segments <project> [--track <type>]` | `tracks[].segments[]` filtered by track type | array of timed segments |
| `capcut texts <project>` | text segments joined with text materials | array of `{id, start_us, duration_us, text}` |
| `capcut segment <project> <id>` | one segment + its primary material + all companions | resolved bundle |
| `capcut material <project> <id>` | one material in full | raw material object |
| `capcut version <project>` | `platform.*` + schema flags | version verdict + support status |
| `capcut decrypt <project>` | heuristic on file shape | `{encrypted, app, app_version, workaround}` |

Reading is what the schema is for. Writing is what the CLI is for.

## Full reference

The schema cheat sheet above is a distillation. The full reference is in [`capcut-cli/docs/draft-schema/`](https://github.com/renezander030/capcut-cli/tree/master/docs/draft-schema) — seven files, ~3,700 lines, covering every field including the ones I left out (animations sub-structure, clip transform math, keyframe shape, mask geometry, vocal separation params). Grep that directory for any field name you've seen in a draft.

## Related

- [Driving CapCut / JianYing video drafts from an LLM agent (PAAN #4)](https://gist.github.com/renezander030/866bd85789c5902471f8f5fc86d09342) — agent-style edit pipeline on top of this schema
- [JianYing 6.0+ encryption: detection and workarounds](https://gist.github.com/renezander030/521e6c6e8590a2a6e917009d9313bc55) — what to do when you can't read the draft at all
- [pyJianYingDraft](https://github.com/GuanYixuan/pyJianYingDraft) — the Python alternative; their docstrings are another good schema source

## Reader contributions

If you find a field that's not in this cheat sheet (or in the full `docs/draft-schema/`), comment with:

- The field path (e.g. `materials.video_effects[].adjust_params[]`)
- A sample value
- The app + version it appeared in
- What it controls in the CapCut / JianYing UI

Particularly wanted: full anatomy of `clip.transform` for non-trivial keyframed motion, and the `vocal_separations[]` payload shape on JianYing 5.9.

## Changelog

### 2026-10-04
- Fixture scope and encrypted online templates; source review is separate from historical runtime tests.


### 2026-05-25
- Initial publication. Distilled from `capcut-cli/docs/draft-schema/` for capcut-cli v0.5.0.
- Covers CapCut 6.x–9.x, JianYing 5.9.0; encryption-blocked versions noted but not field-resolved.




---

*Independent project — not affiliated with or endorsed by ByteDance. "CapCut"/"JianYing" are trademarks of their owner; used nominatively.*
## Series

Companion reference for **Production AI Automation Notes**: [#1 index](https://gist.github.com/renezander030/9069db775e494ffd2cdd5a09adf83add) and [#15 approval evidence](https://gist.github.com/renezander030/ad81c7a805a09a844983f881e2c487e5). No new series slot is assigned.

Follow [@renezander030](https://github.com/renezander030) for tested implementation notes.
