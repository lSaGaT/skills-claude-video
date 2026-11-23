# Modelo visual — tipografia cinética "TESOURAÇÃO"

Vídeo de referência original: campanha Flávio Bolsonaro 22 "TESOURAÇÃO" (55 s). 100% texto animado sobre música — narração é opcional (quando usada, dobra com o texto na tela).

## Estrutura em blocos (1 ideia por tela, 2–8 s por bloco)

| Bloco | Função | Assinatura visual |
|-------|--------|-------------------|
| 1. Gancho | Palavra-herói + provocação | Hero gigante em destaque, linhas construindo, cutucada verde no adversário |
| 2. Dados/ranking | Listas com datas | Pills escuros surgindo um a um, contador rolante |
| 3. Prova | O "outro lado" fez a lição de casa | Checklist com ✓ verde, carimbos de manchetes reais |
| 4. Gargalo/vilão | O número impacto | Contador gigante (ex.: 59) com motion blur, comparações |
| 5. Ataque | Adversários + citação da narrativa oponente | Fundo azul-marinho, pills amarelos, card branco de citação, "PONTO." gigante |
| 6. Motivacional | Subida emocional | Linhas grandes branco→amarelo |
| 7. Campanha | CTA final | "VOTE" + número gigante + arte oficial do candidato + pill de slogan + triângulo verde |

## Tokens

- **Cores:** fundo azul royal `#0053A0`; blocos de ataque em azul-marinho `#002E6D`; destaque amarelo `#FFC800`; branco para apoio; verde `#2FA84F` (checks/badges/cutucadas); vermelho `#E03A3E` (linha de citação e golpes); card `#0A3A6E`; badge escuro `#0B2A4A`.
- **Tipografia:** Montserrat, TUDO EM CAIXA ALTA. Pesos: Black (900) para heróis, ExtraBold (800) para cabeçalhos/linhas, Bold (700) para itens, SemiBold (600) para textos pequenos.
- **Contraste de escala:** palavra-herói em ~70% da largura; apoio em 1/4 disso.
- **Badge de fontes:** pill escuro fixo na base em TODAS as cenas (menos o fechamento de campanha): "FONTES: …" — assinatura de credibilidade do modelo.
- **Motivos:** faixa diagonal amarela no canto inferior direito; triângulo verde no fechamento; pills arredondados; cards brancos com linha vermelha no topo.
- **Formato:** 1080×1920, 30 fps; margens de segurança: ~90 px laterais, nada crítico nos 220 px do topo e 420 px da base.

## Princípios de edição

- 1 ideia por tela; entradas "pop" (escala 0.9→1 com overshoot easeOutBack); nada de transição lenta.
- O número-forte do vídeo (ex.: "59 DIAS") é o pico: contador animado + pausa seca na narração/música.
- Carimbos de manchetes reais pousam NO instante em que a narração cita o dado (leia `references/roteiro-e-blindagem.md`).

## Direção cinematográfica (padrão v2, validado no vídeo Flávio 22) — para vídeos RICOS

O usuário rejeitou fundo chapado ("sem vida") e carimbos rápidos demais. Vídeos novos seguem:

- **1 fala = 1 beat visual** — cada bloco de narração cobre UMA imagem/carimbo/clipe. Bloco longo sobre várias manchetes = correção garantida.
- **Manchete GRANDE com tempo de leitura:** card a ~86% da largura, mínimo 3 s na tela (narração + 1 s de silêncio). Nunca pisca-pisca.
- **Bloco centralizado verticalmente** na zona útil (320–1570 do canvas 1080×1920), gap ~95 entre cards, destaque fixo na base (y≈1660). Nunca ancorar cards no topo — o "buraco" no meio é devolvido como correção.
- **Fundo vivo:** foto real com Ken Burns + gradiente escuro; NUNCA cor chapada.
- **Gradação emocional por ato:** quente/dourado (nosso lado) → frio/dessaturado (adversário) → quente (candidato). A cor conta a virada.
- **Impacto:** shake de câmera + flash de 2 frames + SFX no pouso de cada card/carimbo; grão de filme leve + vinheta em tudo.
- **Clipes do adversário em tela cheia** com vinheta, chip de fonte/ano e legenda da frase; conferir cropF (onde o sujeito está no quadro horizontal) e cortar SEMPRE em frase completa.
- Detalhe técnico completo: `references/render-video-rich.md`.
