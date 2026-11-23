// gerar-narracao.mjs — gera um MP3 por bloco a partir de audio/blocos.json
// Uso: node gerar-narracao.mjs [--blocos audio/blocos-v3.json] [--out audio/narracao-v3] [--pular-primeiro]
//   --blocos         caminho do JSON de blocos (padrão audio/blocos.json)
//   --out            pasta de saída dos MP3 (padrão audio/narracao)
//   --pular-primeiro pula blocos cujo MP3 já existe (regeneração barata, 1 fala por beat)
// Config de voz em audio/config.json (voiceId, modelId, voiceSettings, languageCode).
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { createWriteStream, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : padrao;
};
const pular = process.argv.includes('--pular-primeiro');

const config = JSON.parse(readFileSync('audio/config.json', 'utf8'));
const blocosPath = arg('blocos', 'audio/blocos.json');
const outDir = arg('out', 'audio/narracao');
const blocos = JSON.parse(readFileSync(blocosPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

const client = new ElevenLabsClient({ apiKey: config.apiKey || process.env.ELEVENLABS_API_KEY });

for (const b of blocos) {
  const out = `${outDir}/${b.arquivo}.mp3`;
  if (pular && existsSync(out)) { console.log('pula', out); continue; }
  process.stdout.write(`Gerando ${out} (${b.texto.length} caracteres)... `);
  const audio = await client.textToSpeech.convert(config.voiceId, {
    text: b.texto,
    modelId: config.modelId,
    outputFormat: 'mp3_44100_128',
    voiceSettings: config.voiceSettings,
    ...(config.languageCode ? { languageCode: config.languageCode } : {}),
  });
  await pipeline(Readable.fromWeb(audio), createWriteStream(out));
  console.log('OK');
  await new Promise(r => setTimeout(r, 1200)); // respeita rate limit
}
console.log(`Concluído: narração em ${outDir}/ — regra de ouro: 1 bloco = 1 beat = 3–7s (máx 11s).`);
