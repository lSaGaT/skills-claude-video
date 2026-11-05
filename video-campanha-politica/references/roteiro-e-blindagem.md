# Roteiro e blindagem (fact-check armor)

## Como lapidar os fatos

1. **Separe três marcos que a esquerda/mídia costuma misturar:** quando se negociou/contratou, quando a remessa física chegou, quando começou a valer de fato (liberação/aplicação). O vídeo é forte justamente quando mostra a distância entre "recebeu primeiro" e "liberou depois".
2. **Trabalhe só com datas verificáveis e fonte nomeada** (órgão oficial, veículo grande, estudo). Cada número do vídeo deve ter uma manchete real que o prove — a print dessa manchete vira carimbo.
3. **Critério de comparação declarado:** diga (mesmo rápido) qual critério usa ("os cinco mais rápidos do Ocidente", "primeira campanha pública") — evita ataque de equivalência técnica.
4. **Peça as prints ao usuário** (resultados de busca com veículo + data visíveis). Salvar em `fontes/` como `NN-veiculo-AAAAMMDD-descricao.png`.

## Blindagem — onde a tese pode ser atacada

Toda vez que fechar o roteiro, escreva a seção "blindagem contra fact-check" no `roteiro.md`:

- Liste os 3 a 5 contra-ataques previsíveis nos comentários (incluindo os que atingem o próprio candidato — por exemplo, declarações antigas dele contra a vacina; tenha resposta pronta).
- Para cada um, uma formulação defensável: prefira focar em **números comparativos verdadeiros** ("59 dias entre a chegada e a primeira dose") a afirmar culpabilidade direta de instituição ("a Anvisa sentou no processo") — o primeiro sobrevive a fact-check, o segundo não.
- Cuidado com generalizações globais ("socialistas sempre por último" cai com China/Rússia; restrinja o escopo: "na América Latina").
- Verifique quem é o autor real de cada feito (ex.: doses chegarem via instituto de governo estadual ≠ acordo federal) e formule o texto atribuindo corretamente sem matar a tese ("o Brasil recebeu as doses" + "o governo federal tinha verba e contrato").

## Escrita das falas

- **1 fala = 1 beat visual:** cada bloco de narração cobre UMA imagem/carimbo/clipe. Bloco longo passando por cima de várias manchetes vira correção na revisão.
- **Atribuição no ÁUDIO, não só na tela:** dizer o nome de quem fez na narração ("O Bolsonaro pegou em 190 e elevou para 600"). "Quando ele chegou" soa ambíguo e o usuário devolve a correção — o texto na tela NÃO substitui o áudio.
- **Frase de ponte entre atos** ("Agora, olha o que o governo X entregou...", "Aí entrou o Y igual Ali Babá e seus 40 ladrões"): o usuário gosta da narrativa explícita, com humor sarcástico quando pedirem "tom sarcástico".
- Ritmo de denúncia: frases curtas, pergunta retórica no gancho, número-forte isolado.
- Gancho ideal: um fato verdadeiro surpreendente + pergunta ("Quem travou?").
- Fechamento: resumo em uma linha + CTA de compartilhar + campanha (se for o caso): "Pare de ser enganado. Vote NN. Vote Fulano para presidente."
- Números por extenso (para o TTS): "dezenove de novembro de dois mil e vinte".

## Falas do adversário em clipe

- Cortar SEMPRE em frases completas (recorte definido pela transcrição com timestamps), nunca no meio da frase — e cada corte ganha chip com veículo + ano na tela.
- Quando a transcrição (Whisper/YouTube) divergir da **legenda queimada** que já existe no vídeo original, a legenda queimada vence (caso real: "compra salada" vs Whisper "falada→farinha").
- Antes de fechar o corte, conferir ONDE o sujeito está no quadro do vídeo horizontal (extrair um frame do fonte): o crop 9:16 padrão pega o centro e pode cortar a pessoa — deslocar a janela (`cropF`) e mostrar preview.
- Temas que o próprio material mostra favorecer o adversário ficam FORA do vídeo (listar no roteiro, seção "o que NÃO usar") — usar = se entregar ao fact-check.
- Atribuição de feitos: conferir autor vs coautor nas ementas oficiais e escrever exatamente o que é ("COAUTOR" na tela quando a iniciativa é de outro parlamentar).

## Legenda de Instagram

- Sem travessões/jargões; parágrafos curtos; gancho na primeira linha (aparece antes do "mais").
- CTA de compartilhar; emojis moderados; 10–15 hashtags (tema + candidato + número de campanha).
- **Lembre o usuário da identificação de propaganda eleitoral exigida pelo TSE** na publicação.
