# Voz, TTS, música & áudio

**18 skills** · [← voltar ao índice](../README.md)

---

## acestep

**O que cria:** geração de música AI com ACE-Step 1.5 (BGM, jingles com vocal, covers, stems).

**Chaves técnicas:** presets por cena (corporate-bg, tension, hopeful, cta 135BPM E Maior, upbeat-tech, lofi), lyrics com tags [Verse]/[Chorus]/[Build]/[Drop], UPPERCASE=intensidade vocal, cover com --cover-strength 0-1, stem extraction (vocals/drums/bass...), duração precisa ±0.1s, mix BGM a 10-20% sob narração, --brand + --seed fixo p/ identidade sonora.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/acestep/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/acestep/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/acestep/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/acestep/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/acestep/`

---

## agents

**O que cria:** constrói agentes de voz conversacionais na plataforma ElevenLabs (CLI/SDK, tools, widget).

**Chaves técnicas:** conversation_config (first_message, prompt/llm, tts voice_id), templates, webhook/client tools, built-in tools (end_call, transfer_to_number), widget embed, outbound Twilio, turn eagerness.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/agents/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/agents/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/agents/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/agents/`

---

## azure-speech-to-text

**O que cria:** transcrição Azure Fast Transcription com timestamps por palavra e diarização.

**Chaves técnicas:** multipart POST de arquivo local síncrono, word_timestamps flat [{word,start,end,probability}], diarize/max_speakers, profanity_filter, schema idêntico ao transcriber (faster-whisper) → drop-in p/ subtitle_gen.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/azure-speech-to-text/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/azure-speech-to-text/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/azure-speech-to-text/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/azure-speech-to-text/`

---

## azure-text-to-speech

**O que cria:** TTS neural Azure (SSML prosody, estilos express-as) p/ narração.

**Chaves técnicas:** rate/pitch SSML (narração -4% a -8%), styles narration-professional/calm/newscast, mp3 48kHz/192k vs wav 48kHz PCM p/ mixer, vozes Multilingual, fallback elevenlabs→openai→piper, re-render determinístico por voz+SSML.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/azure-text-to-speech/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/azure-text-to-speech/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/azure-text-to-speech/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/azure-text-to-speech/`

---

## doubao-tts

**O que cria:** TTS Volcengine Doubao Speech 2.0 com timestamps por frase/palavra p/ legendas.

**Chaves técnicas:** endpoint async v3 submit/query, sentences[].words[] timing como fonte de verdade das legendas, enable_timestamp, speech_rate 0-100 (100=2x), grouping por frase semântica (não por contagem de caracteres), metadata JSON salvo.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/voz-audio/doubao-tts/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/doubao-tts/`

---

## elevenlabs

**O que cria:** voz/SFX/música ElevenLabs + pipeline Remotion sincronizado por manifest de durações.

**Chaves técnicas:** modelos (multilingual_v2 estável 29 línguas; flash/turbo com SSML <break> ≤3s; v3 expressivo), voice settings por estilo (natural 0.75-0.85 stability / YouTuber 0.3-0.5 + speed 1.0-1.1), pausas: paragraph breaks ~0.3-0.5s ou silêncio via ffmpeg (ellipsis não é pausa confiável), pronúncia fonética (Janus→Jan-us) e <phoneme> IPA, IVC clone, SFX ≤22s, music compose force_instrumental, manifest.json → Series.Sequence por duração de áudio.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/elevenlabs/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/elevenlabs/SKILL.md · claude-code-video-toolkit (https://github.com/digitalsamba/claude-code-video-toolkit) — claude-code-video-toolkit/.claude/skills/elevenlabs/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/elevenlabs/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/elevenlabs/`

---

## fish-audio-tts

**O que cria:** TTS fish.audio S1/S2 com vozes clonadas (reference_id) e emotion tags inline.

**Chaves técnicas:** model via HTTP header (s2.1-pro/s2-pro/s1), tags [laugh]/[whispers] inline no S2, billing por byte UTF-8 (CJK 3-4x), latency normal/balanced/low, normalize p/ números/moeda, prosody speed/volume, temperature 0.9 expressivo.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/voz-audio/fish-audio-tts/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/fish-audio-tts/`

---

## hyperframes-media

**O que cria:** Motor único de áudio/mídia do HyperFrames — TTS multi-provider, BGM, SFX, transcrição e captions.

**Chaves técnicas:** scripts/audio.mjs (audio_request.json→audio_meta.json), cadeia TTS HeyGen (word timestamps nativos)→ElevenLabs→Kokoro, BGM retrieve HeyGen / generate Lyria-MusicGen detached, SFX retrieval min_score 0.4 + biblioteca 21 arquivos (volume 0.35 sob voz), transcribe Whisper (--model obrigatório senão traduz), tts-to-captions, captions authoring (word grouping, layout) + motion (karaoke, marker effects, audio-reactive), remove-background (cutout com furos, não inpaint)

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/voz-audio/hyperframes-media/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/hyperframes-media/`

---

## lyria

**O que cria:** Gera e valida música com Google Lyria 3 (Clip 30s / Pro ~3min) via Gemini Interactions API.

**Chaves técnicas:** prompt estruturado (propósito→gênero→BPM/tonalidade→instrumentação→estrutura [Intro]/[Verse]/[Chorus]→janelas timestamp sincronizadas ao edit→mix/ending→exclusões), política vocal instrumental completa, ffprobe da duração real + master derivado com fade, Clip $0.04 / Pro $0.08, SynthID

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Como instalar:** Copie a pasta `skills/voz-audio/lyria/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/lyria/`

---

## music (ElevenLabs · OpenMontage)

**O que cria:** Gera música (instrumental, com letra ou jingle) por prompt na ElevenLabs Music API.

**Chaves técnicas:** music.compose (prompt + music_length_ms), music.composition_plan.create (planos por seção/estilo editáveis antes de compor), music.compose_detailed (áudio+plan+metadados), music.upload p/ inpainting, erro bad_prompt com prompt_suggestion.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/music/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/music/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/music--openmontage/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/music--openmontage/`

---

## setup-api-key

**O que cria:** Fluxo guiado para obter, validar e salvar a ELEVENLABS_API_KEY em .env.

**Chaves técnicas:** checagem prévia de key existente, validação GET /v1/user com header xi-api-key, persistência/rotação em .env, confirmação de sucesso

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/setup-api-key/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/setup-api-key/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/setup-api-key/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/setup-api-key/`

---

## sound-effects

**O que cria:** Gera SFX por texto na ElevenLabs (text-to-sound-effects) com duração, loop e aderência controlada.

**Chaves técnicas:** text_to_sound_effects.convert, duration_seconds 0.5–30s, prompt_influence 0–1, loop seamless (modelo v2), formatos mp3/pcm/opus/ulaw, dicas de prompt (especificidade, combinar elementos, mood, estilo "8-bit retro jump").

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/sound-effects/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/sound-effects/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/sound-effects/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/sound-effects/`

---

## speech-to-text

**O que cria:** Transcreve áudio com ElevenLabs Scribe v2: 90+ línguas, timestamps por palavra e diarização.

**Chaves técnicas:** scribe_v2 / scribe_v2_realtime (~150ms), timestamps_granularity="word" (start/end por palavra), diarize=True, keyterm prompting (até 100 termos, ex. marcas), detecção automática de idioma, realtime com commit manual/VAD, tipos word/spacing/audio_event.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/speech-to-text/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/speech-to-text/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/speech-to-text/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/speech-to-text/`

---

## text-to-speech (HeyGen · OpenMontage)

**O que cria:** Gera áudio de fala via TTS HeyGen Starfish com seleção de voz, speed/pitch e timestamps por palavra.

**Chaves técnicas:** GET /v1/audio/voices, POST /v1/audio/text_to_speech, speed 0.5–1.5, pitch -50..50, locale pt-BR, resposta com word_timestamps, elevenlabs_settings (model eleven_v3, similarity_boost, stability, style), preferência MCP mcp__heygen__*.

**Origem:** OpenMontage · [https://github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)

**Também em:** OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.agents/skills/text-to-speech/SKILL.md · OpenMontage (https://github.com/calesthio/OpenMontage) — OpenMontage/.claude/skills/text-to-speech/SKILL.md

**Como instalar:** Copie a pasta `skills/voz-audio/text-to-speech/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/calesthio/OpenMontage.

**Pasta no repo:** `skills/voz-audio/text-to-speech/`

---

## suggest-sfx

**O que cria:** desenho de SFX por beats: plano declarativo sfx-plan.json + biblioteca reutilizável + mix com ducking e gate de audição do usuário.

**Chaves técnicas:** cue at_s=(frame local+from)/fps ou palavra exata; library-first catalog.json/palette.json; layering riser→impact nos 2-3 hero beats; calibração shorts (whoosh −3, pops 0..+3, stamps 0..+7); sidechain duck; verificação RMS +4dB janela 0.3s; transientes +3-5dB

**Origem:** claude-faceless-shorts-creator

**Como instalar:** Copie a pasta `skills/voz-audio/suggest-sfx/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: `editor-chefe/skills/claude-faceless-shorts-creator`.

**Pasta no repo:** `skills/voz-audio/suggest-sfx/`

---

## soundtrack

**O que cria:** trilha sintetizada em código (Web Audio/OfflineAudioContext) dentro da página, sincronizada aos cortes, com checagem automática.

**Chaves técnicas:** tempo map por cena (cortes em downbeat); marcar cortes com harmonia, não volume (startle > +6dB; +3-5dB com acorde = corte limpo); sem acento extra no downbeat do corte; camadas entrando 1-2 por bar; break de silêncio antes do payoff; window.CUES; sync-check.mjs valida OFF-BEAT ±100ms e STARTLE +6dB; com música externa, move-se a cena pelo offset reportado.

**Origem:** javascript-animation-skills · [https://github.com/iart-ai/javascript-animation-skills](https://github.com/iart-ai/javascript-animation-skills)

**Como instalar:** Copie a pasta `skills/voz-audio/soundtrack/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/iart-ai/javascript-animation-skills.

**Pasta no repo:** `skills/voz-audio/soundtrack/`

---

## music (Strudel · Mortiflix)

**O que cria:** engine de música Strudel — blueprint, score MIDI por canal, instrumentos, audition e master.

**Chaves técnicas:** blueprint.json (BPM/offset_sec/hits/intensity), spotting map (direct hit/anticipation/aftermath), harmony lock, MIDI por canal, ducking sidechaincompress ffmpeg, loudnorm -14 LUFS, showspectrumpic

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/voz-audio/music--mortiflix-oss/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/voz-audio/music--mortiflix-oss/`

---

## voiceover

**O que cria:** narração ElevenLabs/Qwen com takes checados por ASR, timing por palavra, SFX e mix.

**Chaves técnicas:** vo.mjs speak/build, audio tags [warm]/[whispers] do Eleven v4, IPA entre slashes, checagem ASR 92% sem 3-word run, voice/timing.json por palavra, sound.mjs sfx/music (--loop/--influence), ducking -18dB, -14 LUFS

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** Copie a pasta `skills/voz-audio/voiceover/` deste repo para `~/.claude/skills/` (ou `.agents/skills/`, conforme seu agente). Corpo de origem: https://github.com/GTKottman/mortiflix-oss.

**Pasta no repo:** `skills/voz-audio/voiceover/`

