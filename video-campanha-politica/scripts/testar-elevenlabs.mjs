// testar-elevenlabs.mjs — valida a chave da ElevenLabs contra vozes/modelos conhecidos
// Uso: node testar-elevenlabs.mjs   (lê a chave do local canônico: config/agente.json
// da casa — acha subindo a árvore — ou env ELEVENLABS_API_KEY). Consome ~40 chars de cota.
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// chave do local canônico (config/agente.json subindo a árvore) → env → erro instruído
function chaveElevenlabs() {
  const E_PLACEHOLDER = (v) => !v || /^COLE_/i.test(v);
  let d = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const p = path.join(d, 'config', 'agente.json');
    if (existsSync(p)) {
      try {
        const k = JSON.parse(readFileSync(p, 'utf8'))?.elevenlabs?.apiKey;
        if (!E_PLACEHOLDER(k)) return k;
      } catch { }
    }
    const pai = path.dirname(d);
    if (pai === d) break;
    d = pai;
  }
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  console.error('SEM CHAVE ElevenLabs. Cole a sua UMA vez em config/agente.json → "elevenlabs"."apiKey".');
  process.exit(1);
}

const apiKey = chaveElevenlabs();

const client = new ElevenLabsClient({ apiKey });

// vozes pré-made que normalmente funcionam no plano grátis + candidatos a teste
const testes = [
  { nome: 'Daniel (autoritativo) + eleven_v4', voiceId: 'onwK4e9ZLuTAKqWW03F9', modelId: 'eleven_v4' },
  { nome: 'George (narrativo) + eleven_v4', voiceId: 'JBFqnCBsd6RMkjVDRZzb', modelId: 'eleven_v4' },
];

let ok = false;
for (const t of testes) {
  try {
    const audio = await client.textToSpeech.convert(t.voiceId, {
      text: 'Teste de voz em português.',
      modelId: t.modelId,
      outputFormat: 'mp3_44100_128',
    });
    let bytes = 0;
    for await (const chunk of audio) bytes += chunk.length;
    console.log(`OK   ${t.nome} (${bytes} bytes)`);
    ok = true;
  } catch (e) {
    console.log(`ERRO ${t.nome}: ${String(e).slice(0, 200)}`);
  }
}
if (!ok) {
  console.log('\nNenhuma voz funcionou. Verifique: chave inválida (401), sem créditos (402/quota),');
  console.log('ou voz restrita do plano. Notas completas em references/elevenlabs.md');
} else {
  console.log('\nChave funcionando. Use no audio/config.json a voz/modelo que passou no teste.');
}
