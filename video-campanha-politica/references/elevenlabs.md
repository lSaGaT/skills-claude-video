# ElevenLabs — notas práticas (conta testada em out/2026)

## Status típico da conta (plano grátis)

- A chave é válida mas pode ter escopo restrito: `GET /v1/user/subscription` retorna 401 "missing_permissions user_read" — isso NÃO significa chave inválida. Teste direto no endpoint de TTS.
- Vozes pré-made que funcionam no plano grátis: **George** `JBFqnCBsd6RMkjVDRZzb` (narrativo) e **Daniel** `onwK4e9ZLuTAKqWW03F9` (autoritativo — ideal para denúncia/campanha), com o modelo **eleven_v4** (melhor qualidade) e `eleven_multilingual_v2`.
- Vozes da biblioteca comunitária (ex.: Rachel `21m00Tcm4TlvDq8ikWAM`) retornam **402 "paid_plan_required"** no plano grátis.
- Modelos: `eleven_v4` (padrão, aceita só stability/similarityBoost), `eleven_multilingual_v2` (estável para long-form), `eleven_flash_v2_5` (barato/rápido).

## Uso (SDK JS — já instalado nos projetos)

```js
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
const audio = await client.textToSpeech.convert(voiceId, {
  text, modelId: 'eleven_v4', outputFormat: 'mp3_44100_128',
  voiceSettings: { stability: 0.45, similarityBoost: 0.75 },
});
await pipeline(Readable.fromWeb(audio), createWriteStream(saida));
```

## Pegadinhas

1. **Windows/Git Bash corrompe acentos em JSON inline** no curl ("invalid_unicode"). Solução: gravar o corpo JSON em arquivo UTF-8 (o Write tool grava UTF-8 correto) e enviar com `curl -d @arquivo.json`.
2. **Escreva números e datas por extenso** nas falas ("dezenove de novembro", "cinquenta e nove dias") — a síntese pronuncia certinho.
3. Você não consegue ouvir o áudio gerado; valide tamanho do arquivo (128 kbps ≈ 16 KB/s → duração ≈ bytes/16000) e deixe o usuário aprovar o tom.
4. Custo: cada regeneração de bloco consome a cota mensal de caracteres. Plano grátis ≈ 10k caracteres/mês — um vídeo de 2,5 min usa ~3 mil.
5. `stability` baixo (0.4–0.5) = mais expressivo/ríspido (bom para denúncia); alto (0.7+) = monótono.

## Script de teste

`scripts/testar-elevenlabs.mjs` testa a chave contra vozes/modelos conhecidos e imprime OK/ERRO por combinação. Rode sempre antes de gerar a narração de um projeto novo (o status de plano/vozes pode mudar).
