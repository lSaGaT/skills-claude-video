// testar-elevenlabs.mjs — valida a chave da ElevenLabs contra vozes/modelos conhecidos
// Uso: ELEVENLABS_API_KEY=sk_... node testar-elevenlabs.mjs
// (ou edite a chave abaixo). Consome ~40 caracteres de cota.
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const apiKey = process.env.ELEVENLABS_API_KEY || 'COLE_SUA_CHAVE_AQUI';
if (apiKey === 'COLE_SUA_CHAVE_AQUI') { console.log('Defina ELEVENLABS_API_KEY ou edite o script.'); process.exit(1); }

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
