// sintetizar-carimbo.mjs — gera o SFX de impacto (carimbo) em audio/carimbo.mp3
// Uso: node sintetizar-carimbo.mjs   (requer ffmpeg-static instalado)
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

if (!existsSync(ffmpegPath)) { console.log('ffmpeg não encontrado — rode: node node_modules/ffmpeg-static/install.js'); process.exit(1); }

// ruído branco de 40ms (a "batida") + senoide grave 58Hz decaindo (o "bum")
const r = spawnSync(ffmpegPath, [
  '-y', '-v', 'error',
  '-f', 'lavfi', '-i', 'anoisesrc=d=0.04:c=white:r=44100:a=0.9',
  '-f', 'lavfi', '-i', 'sine=f=58:d=0.5:r=44100',
  '-filter_complex', '[0:a]afade=t=out:st=0.005:d=0.035,apad=whole_dur=0.5[n];[1:a]volume=2.4,afade=t=out:st=0.03:d=0.45[b];[n][b]amix=inputs=2:duration=first:normalize=0',
  '-c:a', 'libmp3lame', '-b:a', '160k', 'audio/carimbo.mp3',
], { stdio: 'inherit' });
console.log(r.status === 0 ? 'OK: audio/carimbo.mp3 (0,55s de impacto grave).' : 'Falhou ao sintetizar.');
process.exit(r.status ?? 1);
