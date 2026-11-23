# Áudio: narração, pronúncia e mixagem

## O que a referência faz

- Narração TTS PT-BR contínua, 150–175 palavras/min, sem pausa interna; pausa só na virada de beat.
- Piso de ruído entre palavras em −25 a −30 dB ⇒ há **trilha de fundo** rodando o vídeo inteiro.
- Voz em −10 a −15 dB RMS (dominante), trilha bem abaixo.
- Fade-out de ~1,5 s no fim (medido em v01/v07) e nenhuma respiração artificial entre frases.
- 4 dos 23 vídeos não têm narração (v11, v14, v17, v20) — só trilha + texto.

## Erros de pronúncia do autor (corrigir sempre)

| escrito | saiu no áudio | como escrever na fala |
|---|---|---|
| Grok | "Grock" | Grôk |
| nmap | "In-Map" | ên-mép |
| WhisperX | "Whisper X" | Uísper Éks |
| anidoodle | "Annie Doodle" | ani-dúdou |
| Metasploit | ok | Mêta-splôit |
| Ollama | "olama" | Oláma |

Regra: todo nome próprio, sigla ou comando entra na fala **escrito como se pronuncia**, não como se escreve.
Números e datas por extenso. Unidades faladas ("mil estrelas", não "45k").

## Estrutura de fala por beat

- 8–18 palavras; uma oração principal; sem "que" encadeado.
- Abre com a informação, fecha com o número ou o nome.
- Não repita na fala o que a legenda já diz palavra por palavra: a legenda é a versão curta, a fala é a versão completa.
- O fecho é sempre falado: "Link fixado no primeiro comentário."

## Mixagem (alvo)

| parâmetro | valor |
|---|---|
| loudness integrado | −14 LUFS |
| true peak | −1 dBFS |
| voz | −15 a −12 LUFS short-term |
| trilha | −28 a −24 LUFS sob a voz (ou −26 dB relativo) |
| fade | 1,5 s no fim do master |
| ducking | sidechain leve (−4 dB na trilha quando a voz entra), se a trilha for densa |

FFmpeg de referência:

```bash
ffmpeg -i voz.wav -i trilha.wav -filter_complex \
"[0:a]loudnorm=I=-15:TP=-1.5:LRA=11[v];[1:a]volume=0.18,tremolo=f=0.1:d=0.2[t];[v][t]amix=inputs=2:duration=longest:dropout_transition=0,alimiter=limit=0.9,afade=t=out:st=28:d=1.5[a]" \
-map "[a]" -c:a aac -b:a 192k audio-final.m4a
```

Depois `loudnorm=I=-14:TP=-1` no master completo.

## Se não houver TTS disponível

Siga o caminho do v11: vídeo sem narração, legenda em bolha de 2–3 palavras, trilha em −20 LUFS.
Perde-se densidade de informação, ganha-se velocidade de produção — mas o roteiro precisa ser reescrito para leitura, não para escuta.
