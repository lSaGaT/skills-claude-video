# Referência-mestra: mapa de tempo do reel de referência (81,41s)

> Produto da auditoria densa: contact sheets de 6 fps em `_replica/densa/t01..t17.jpg`
> (17 folhas, uma por janela de 5 s; tile i = início da folha + 0,167·i s) e folhas
> comparativas de 0,5 s em `_replica/folhas/f01..f21.jpg` (REF em cima, NOSSO embaixo).
> Uso 1: **réplica** — técnica por janela. Uso 2: **treinamento da skill** — cada linha
> é o que o ref faz de fato, medido, não estimado.

| t (s) | Beat / conteúdo | Movimento observado (o que a câmera/elocução faz) |
|---|---|---|
| 0–1,3 | "ESSE" | Palavra nasce de OUTLINE ghost c/ cursor "Clique" rodando à esquerda; streak elíptico do cursor em 0,33s |
| 1,3–3,3 | "ESSE VÍDEO" + caption "que você tá vendo" | Typing letra-a-letra (letra em progresso CINZA); cursor voa com Clique chip; push-in constante |
| 3,3–5,3 | "agora" (pill laranja) | Pill cresce de largura conforme digita; camera push continua |
| 5,3–6,0 | Derrete do bloco | Wipe vertical com blur-ghost pesado + compressão (glitch) |
| 6,0–8,3 | "ele não foi EDITADO" | Caption mono digita; "EDITADO" ima: rascunho borrado→sólido (scale 1.1→1 + ghosts); strike vermelho desenha 8,0–8,4s |
| 8,3–11,7 | icons de "programas" + "O" | Icons/pills pop; depois ZOOM DE EVIDÊNCIA no "O" laranja (1.0→1.12, bloom, 13–14,5s) |
| 11,7–14,9 | (cont.) | Fim: iris/lente circular dark fecha-em sobre cursor branco |
| 14,9–18,3 | "Isso porque Claude Opus 5.5" | Caption typed; pill laranja "Claude" digita crescendo p/ direita; versões riscadas com ∼...( altreto double strike); cursor fixo à esquerda |
| 18,3–20,5 | "ele faz MOTION GRAPHICS" | LETRAS entram de direções diferentes c/ blur horizontal forte; shapes orbitando; "GRAPHICS" completa + sublinhar desenha |
| 20,5–26,3 | "mas não do jeito 'normal'" + timeline mock | Janela mock timeline entra; playhead desliza; hover pill "Clique" corre linha-a-linha; caption typing com aspas serif laranja "normal" |
| 26,3–30,0 | modal "Abrir?" + Editor de curva + keyframe | Modal pop; clique em "Abrir"; curva bezier com handles; 🚫 sobre handle; "não chora 😭": emoji cai; render card 13%→43%→66%→81% |
| 30,0–35,0 | render 91→99% + "99%" GIGANTE | % outExpo; "99%" entra com aberração RGB + 🤡 cai; "O que ele faz" caption typed no fim |
| 35,0–40,0 | "escrever código" + editor HTML | Caret laranja typed; colchetes { } desenha; mini editor entra; sticker 3D "ESSE VÍDEO OO" flutuando/perspectiva lenta rotaciona |
| 40,0–45,0 | site "mola.html" construído | Título pop, blob laranja entra no card; resize da janela com badge "396×560"; mobile; cantoneira ⌐¬ de câmera; ball bounce |
| 45,0–50,0 | "frame por frame" + pilha de frames | Filmstrip; pilha embaralha→converge; card video.mp4-01:29; caption typed palavra-a-palavra |
| 50,0–55,0 | "IA que tá falando sobre ela mesma" | Paragraph typing com pills "IA"; rabisco circular laranja em "ela mesma" + "(ela mesma)" serif; phone-in-phone recursivo; derrete streak "deu um nó" |
| 51–56,5 | "deu um nó" + "relaxa" | Trefoil knot stroke-draw próprio (segmentado); desata em espiral→loop; squiggle desenha; waveform entra com playhead + mono fps counter |
| 56,5–60,3 | "o melhor de tudo" + card zip | Estrela ✦ twinkle; "muito leve" serif; card fino wobble input; badge "96KB" sprint da direita; "muito fácil"; seleção de texto azul "alterar" |
| 60,3–63,8 | "MOTION EM HTML" card + chat | Dots de cor entra stagger; input field; digita "muda a cor pro rosa"; clique → ripple rings ROXO + morf laranja→roxo instant + dock update |
| 63,8–70,0 | chart + "quer mais rápido?" | Barras grow stagger + bola quicando entre pontas; underline dupla desenha sob "rápido?"; chip prompt roxo; badge 1x→2x→4x contando |
| 70,0–75,0 | "e se quiser que uma determinada palavra aqui" | Typed com I-beam; "trema" com seleção azul crescendo; toolbar B/U/Tremer com ✓ pronto; "trem a" letters spread + RGB shake persistente |
| 75,0–80,0 | editor "do futuro"→"não tem timeline" | Clips rows entram; "não" pill + strike em "timeline"; clips tombam (rotate offscreen); prompt bar digita |
| 78,5–81,41 | "só uma boa conversa." + Comentários | Chat bubble pop; glow roxo profundo; comentário "MOTION" typed→sobe; ❤ cinza→vermelho pop; MOTION gigante roxo caí bounce; hold final |

## Picos de movimento medidos (diferença entre quadros, 180×320 gray)

| t (s) | pico | o que acontece |
|---|---|---|
| 5 | 11,5 | snap-zoom de evidência no "O" laranja |
| 10 | 7,3 | corte para o bloco creme (estouro de branco) |
| 12 | 8,4 | creme → preto no talo |
| 15–16 | 3,7 / 6,4 | letras do MOTION GRAPHICS voando de direções diferentes |
| 26–27 | 4,1 / 4,8 | 99% com aberração RGB + melt do beat |
| 30–32 | 6,9 / 8,0 / 5,4 | parede de cards entrando torta |
| 35 | 3,2 | `<html>` com zoom |
| 49–51 | 9,0 / 23,8 / 28,1 | card de texto gigante tomando a tela e voltando |
| 62 | 6,4 | clique → ripple → morf laranja→roxo |
| 69 | 7,5 | whip para o editor de vídeo |
| **média** | **2,74** | piso em fundo chapado: 0,15–0,35 |

## Lições de direção (para qualquer réplica)

1. 22+ beats em 81 s ⇒ cadência de ~3,5 s por visual. Se a sua cena tem 6 blocos em 81 s,
   a conta está errada antes de qualquer detalhe.
2. Todo beat tem 2+ técnicas sobrepostas (câmera + typing + cursor + pop). Nunca uma só.
3. Varie a natureza do gesto herói entre beats: zoom de evidência → card gigante →
   iris circular → whip → typing. Repetir o mesmo herói dois beats seguidos fatiga.
4. Quatro camadas de texto: display branco grande / legenda cinza / pill laranja /
   serif-itálico (nota do autor). Elas nunca competem no mesmo segundo.
5. A paleta roxa entra no terceiro ato (63 s+): a cor acompanha a virada de assunto
   (do "editor" para a "IA").
