Object.assign(C.extras, {
'aula-5-1': {
  v: [['Como “dockerizar” uma aplicação Spring Boot (multi-stage)', 'https://www.youtube.com/watch?v=-UTkMgqCmnQ', 'EN'],
      ['Aplicação multi-container com Spring Boot e Docker Compose', 'https://www.youtube.com/watch?v=sdVwV0J0vMM', 'EN']],
  g: `Lembra do “na minha máquina funciona”? O Docker transforma a sua máquina num pacote. A imagem é como uma marmita lacrada: o mesmo conteúdo sai da cozinha, passa pela homologação e chega à produção. Só o tempero (a configuração) muda em cada lugar.`,
  l: ['O que vai em cada estágio do Dockerfile multi-stage: JDK, Maven, código-fonte, JRE, JAR final?',
      'Estágio de build: JDK, Maven (wrapper), código-fonte. Estágio final: só JRE e o JAR (em camadas). Nada de código-fonte ou Maven na imagem que vai para produção.'],
  q: [['Por que não rodar como root dentro do container?', 'Se alguém explorar uma falha da aplicação, ganha menos privilégios. É uma linha no Dockerfile e reduz bastante o risco.'],
      ['Buildpacks ou Dockerfile?', 'Buildpacks (<code>spring-boot:build-image</code>) geram boas imagens sem esforço. Escrever o Dockerfile ensina o que acontece por baixo. Em time, use o que for mais fácil de manter.']],
  c: 'Qual configuração do TicketFlow muda entre dev e produção? Liste e confira se nenhuma está fixa no código.',
  b: ['Imagem imutável; configuração por variável de ambiente.', 'Multi-stage deixa a imagem pequena e mais segura.', 'JVM em container: use MaxRAMPercentage.', 'Compose sobe o ambiente inteiro com um comando.']
},
'aula-5-2': {
  v: [['Proxy Reverso e Load Balancer com NGINX', 'https://www.youtube.com/watch?v=bFZurhL14LA', 'PT']],
  g: `Numa agência bancária lotada, um único caixa não dá conta. A solução não é contratar um caixa com quatro braços (escala vertical), e sim abrir mais guichês com uma fila única que distribui as pessoas (escala horizontal). O Nginx é a fila única; as réplicas da API são os guichês.`,
  l: ['Liste três coisas no TicketFlow que impediriam rodar 3 réplicas atrás do Nginx, e como cada uma foi (ou será) resolvida.',
      'Sessão em memória (JWT, Fase 3); lock em memória (versão no banco, Fase 3); job rodando em todas as réplicas (ShedLock, esta aula). Cache local de dados que mudam (Redis, aula 5.4).'],
  q: [['Por que <code>least_conn</code> e não round-robin?', 'Round-robin distribui por turno; <code>least_conn</code> manda para quem está com menos conexões abertas, o que ajuda quando algumas requisições demoram mais que outras.'],
      ['Rate limiting não vai irritar clientes legítimos?', 'Com limites bem escolhidos e um <code>burst</code>, um humano nunca percebe. Quem percebe é o robô que dispara 200 compras por segundo.']],
  c: 'Se uma das três réplicas cair durante a abertura de vendas, o que o comprador vê? Teste e descubra.',
  b: ['Escala horizontal exige aplicação stateless.', 'Nginx: proxy reverso, balanceador e limitador de taxa.', 'Jobs agendados precisam de lock compartilhado (ShedLock).', 'Teste derrubando uma réplica de propósito.']
},
'aula-5-3': {
  v: [['Guia para iniciantes do EXPLAIN ANALYZE', 'https://www.youtube.com/watch?v=31EmOKBP1PY', 'EN']],
  g: `Procurar um nome numa lista telefônica sem ordem alfabética significa ler página por página: é o <code>Seq Scan</code>. Com o índice alfabético, você abre direto na letra certa. Nesta aula você aprende a perguntar ao PostgreSQL <i>como</i> ele está procurando, e a dar a ele a lista telefônica certa.`,
  l: ['Para a consulta <code>WHERE evento_id = ? AND nome = ?</code>, qual índice composto você criaria? A ordem das colunas importa?',
      '<code>CREATE INDEX ON setor (evento_id, nome)</code>. A ordem importa: o índice serve para filtros que usam a primeira coluna (ou as duas), não só a segunda.'],
  q: [['Então é só criar índice em tudo?', 'Não. Cada índice deixa inserts e updates mais lentos e ocupa espaço. Crie a partir de consultas reais medidas.'],
      ['Pool maior não significa mais desempenho?', 'Até certo ponto. O banco tem poucos núcleos: conexões demais competem entre si. Pool pequeno com transações curtas costuma render mais.']],
  c: 'Qual a consulta mais executada no TicketFlow durante a abertura de vendas? Ela usa índice?',
  b: ['Meça antes de otimizar (<code>pg_stat_statements</code>).', '<code>EXPLAIN ANALYZE</code> mostra o plano real.', 'Índices compostos e parciais para consultas quentes.', 'Pool pequeno, transações curtas, <code>open-in-view</code> desligado.']
},
'aula-5-4': {
  v: [['Aprenda a usar cache nos seus projetos Spring Boot', 'https://www.youtube.com/watch?v=YcI9b-lgi7w', 'PT']],
  g: `O cardápio do restaurante fica impresso na mesa porque quase nunca muda: ninguém pergunta ao chef a cada cliente. Já “tem ainda o peixe do dia?” precisa ser perguntado à cozinha. No TicketFlow, a descrição do evento é o cardápio (cache), e a disponibilidade de lugares é o peixe do dia (banco).`,
  l: ['Classifique: pode ir para cache ou não? Descrição do evento, lista de atrações, disponibilidade exata para vender, preço do lote vigente, foto do local.',
      'Cache: descrição, atrações, foto. Com TTL curto e cuidado: preço do lote (muda em data conhecida). Nunca na decisão de venda: disponibilidade exata.'],
  q: [['E se o cache ficar desatualizado?', 'Por isso TTL sempre e <code>@CacheEvict</code> ao alterar. Para dados que não podem estar errados nem por segundos, não use cache.'],
      ['Por que Redis e não um <code>HashMap</code>?', 'Com três réplicas, cada uma teria o seu HashMap, com versões diferentes. O Redis é compartilhado por todas.']],
  c: 'Qual a pior consequência de servir um dado velho no TicketFlow? Use a resposta para decidir o TTL.',
  b: ['Cache-aside: lê do cache, se faltar busca no banco.', 'Sempre defina TTL; invalide ao alterar.', 'Nunca cacheie a decisão de venda.', 'Versione o nome do cache quando o formato mudar.']
},
'aula-5-5': {
  v: [['Observando uma aplicação Spring Boot com Actuator, Prometheus, Grafana e Zipkin', 'https://www.youtube.com/watch?v=aqwGRRgiMPI', 'EN'],
      ['Tracing distribuído no Spring Boot com OpenTelemetry e Micrometer', 'https://www.youtube.com/watch?v=lbrZ25eKUoI', 'EN']],
  g: `Dirigir à noite sem painel: você não sabe a velocidade, o combustível nem se o motor está esquentando. Rodar o TicketFlow em produção sem observabilidade é igual. Logs contam o que aconteceu, métricas mostram tendências, traces mostram o caminho de cada requisição.`,
  l: ['A média de latência da compra é 200 ms, mas os clientes reclamam de lentidão. Que métrica você olharia e por quê?',
      'Os percentis altos (p95, p99). A média esconde a cauda: se 5% das compras levam 4 s, a média ainda parece boa.'],
  q: [['Qual a diferença entre log e métrica?', 'Log é um registro detalhado de um acontecimento; métrica é um número agregado no tempo. Alertas funcionam melhor com métricas; investigação, com logs e traces.'],
      ['Amostrar 100% dos traces em produção é um problema?', 'Pode custar caro em volume. Em produção, 10% costuma bastar; em dev e testes de carga, 100%.']],
  c: 'Que métrica de negócio do TicketFlow faria o organizador acordar às 3 da manhã se mudasse de repente?',
  b: ['Três pilares: logs, métricas, traces.', 'Método RED: taxa, erros e duração em percentis.', 'Métricas de negócio mostram o que as técnicas escondem.', 'traceId no log liga o erro ao caminho completo.']
},
'aula-5-6': {
  v: [['Básico de testes de carga com k6 e Grafana em 20 minutos', 'https://www.youtube.com/watch?v=gvounvDSDGg', 'EN'],
      ['Build Maven no GitHub Actions', 'https://www.youtube.com/watch?v=vBEcTN5lwJc', 'EN']],
  g: `Uma ponte nova não é inaugurada sem teste de carga: caminhões cheios atravessam antes do público. O seu “dia da inauguração” é a abertura das vendas. Nesta aula você enche a ponte de caminhões, mede, e automatiza a inspeção a cada mudança com um pipeline.`,
  l: ['Escreva a hipótese de carga do TicketFlow em uma frase, com números.',
      'Ex.: “Com 3 réplicas, a API atende 300 compras por segundo durante 60 s com p95 abaixo de 800 ms, erro abaixo de 1% e zero overbooking.”'],
  q: [['Por que rodar o teste de carga de outra máquina?', 'Se o gerador de carga e a API dividem a mesma CPU, você mede a briga entre eles, não a API.'],
      ['O pipeline precisa rodar testes de mutação a cada push?', 'Pode ficar pesado. Uma opção é rodar PIT só no domínio ou só na branch principal. O importante é que rode com frequência conhecida.']],
  c: 'O que o seu pipeline de hoje (no trabalho) verifica antes de liberar uma versão? O que falta?',
  b: ['Teste de carga começa com hipótese e critérios.', 'Compare cenários com números, um de cada vez.', 'O pipeline é a definição executável de “pronto”.', 'Publique a imagem só depois de tudo verde.']
},
'aula-6-1': {
  v: [['Quando usar Monolitos vs Microsserviços', 'https://www.youtube.com/watch?v=ooJjxNsQnK4', 'PT'],
      ['Migração de Monolito para Microservices com Strangler Application Pattern', 'https://www.youtube.com/watch?v=tYVKIIshKPk', 'PT']],
  g: `A figueira-estranguladora cresce em volta de uma árvore antiga, devagar, até que a árvore de dentro pode ir embora sem que a floresta perceba. É assim que se extrai um serviço de um monólito: sem derrubar tudo num fim de semana, um caminho de cada vez.`,
  l: ['Para cada contexto do TicketFlow (Catálogo, Vendas, Pagamentos, Notificações), diga se vale extrair como serviço agora e por quê.',
      'Pagamentos: sim (conformidade e isolamento de dados sensíveis). Notificações: talvez (assíncrono, falha isolada). Vendas e Catálogo: não agora (acoplados, mesmo time, sem necessidade de escala diferente).'],
  q: [['Microsserviços não são “o jeito moderno”?', 'São uma ferramenta com custo alto: rede, consistência eventual, observabilidade distribuída. Para muitos times, monólito modular bem feito entrega mais.'],
      ['Por que cada serviço precisa do próprio banco?', 'Se dois serviços leem a mesma tabela, uma mudança de schema quebra os dois. Aí você tem os custos de microsserviços sem a independência.']],
  c: 'No sistema em que você trabalha, qual parte teria o melhor argumento para virar um serviço separado?',
  b: ['Microsserviços resolvem problemas de organização e escala, com custo.', 'Extraia onde a fronteira já está clara.', 'Strangler Fig: substituição incremental, sem big bang.', 'Banco por serviço, sempre.']
},
'aula-6-2': {
  v: [['Spring Boot Resilience4j: Circuit Breaker e Retry', 'https://www.youtube.com/watch?v=4sL00jc5BPc', 'EN']],
  g: `O disjuntor da sua casa desarma quando há sobrecarga, antes que a fiação pegue fogo. O circuit breaker faz o mesmo: se o Pagamentos começa a falhar, ele “desarma” e responde rápido por um tempo, em vez de deixar todas as compras esperando até travar o sistema.`,
  l: ['Sem idempotência, o que acontece se o retry reenviar uma cobrança cuja resposta se perdeu na rede?',
      'O cliente pode ser cobrado duas vezes. A primeira cobrança deu certo, mas a resposta não chegou. A chave de idempotência faz o serviço devolver o resultado anterior em vez de cobrar de novo.'],
  q: [['Qual timeout usar?', 'Baseie-se no p99 da dependência em condições normais, com folga. Sem medição, comece com 1 a 2 segundos e ajuste olhando as métricas.'],
      ['Fallback não esconde erros?', 'Pode esconder, se for mal usado. Um bom fallback deixa o estado explícito (“pagamento em análise”) e tem um processo para conciliar depois.']],
  c: 'Qual dependência externa do sistema em que você trabalha não tem timeout configurado? O que acontece quando ela fica lenta?',
  b: ['Timeout em toda chamada remota.', 'Retry com backoff e jitter, só em operação idempotente.', 'Circuit breaker falha rápido e protege os dois lados.', 'Provoque falhas (Toxiproxy) para conhecer o comportamento real.']
},
'aula-6-3': {
  v: [['Produzindo e consumindo mensagens com Kafka usando Spring Boot 3', 'https://www.youtube.com/watch?v=lU7IxE2ivis', 'PT']],
  g: `Telefonar exige que a outra pessoa atenda agora. Mandar mensagem permite que ela leia quando puder. A compra não precisa esperar o e-mail ser enviado: ela publica “ingresso vendido” e segue em frente. O serviço de notificações lê quando puder. Mas cuidado: às vezes a mesma mensagem chega duas vezes.`,
  l: ['Por que usar o id do pedido como chave da mensagem no Kafka?',
      'Mensagens com a mesma chave vão para a mesma partição, o que preserva a ordem dos eventos de um mesmo pedido (criado antes de pago, pago antes de cancelado).'],
  q: [['Kafka garante “exatamente uma vez”?', 'Em cenários específicos e com configuração cuidadosa. Na prática de integração entre serviços, projete para “pelo menos uma vez” e faça consumidores idempotentes.'],
      ['Kafka ou RabbitMQ?', 'Kafka brilha em log de eventos, retenção e reprocessamento; RabbitMQ em filas de tarefas com roteamento flexível. Os princípios desta aula valem para os dois.']],
  c: 'Que outro efeito da compra poderia virar um consumidor do mesmo evento sem mexer em uma linha de Vendas?',
  b: ['Assíncrono desacopla no tempo.', 'Chave define a partição e preserva a ordem.', 'Pelo menos uma vez: consumidor idempotente.', 'Falhas repetidas vão para a DLT, sem travar a partição.']
},
'aula-6-4': {
  v: [['O que é o padrão Transactional Outbox?', 'https://www.youtube.com/watch?v=5YLpjPmsPCA', 'EN'],
      ['O que é o padrão Saga em microsserviços?', 'https://www.youtube.com/watch?v=eTTCIJZNPdo', 'EN']],
  g: `Reservar uma viagem: voo, hotel e carro, cada um num sistema diferente. Se o carro não estiver disponível, você não “dá rollback” no voo: você <b>cancela</b> o voo. Saga é isso: uma sequência de passos locais, cada um com sua ação de desfazer. E o Outbox garante que nenhum aviso entre os passos se perca.`,
  l: ['Escreva a saga da compra do TicketFlow em três passos, cada um com a sua compensação.',
      '1) Criar pedido e reservar lugares (compensação: cancelar pedido e liberar lugares). 2) Cobrar (compensação: estornar). 3) Emitir ingressos (passo final).'],
  q: [['Por que não usar uma transação distribuída (2PC)?', 'Porque trava recursos de vários serviços enquanto espera todos, e o sistema fica tão disponível quanto o mais frágil deles. Sagas trocam isso por consistência eventual.'],
      ['O Outbox não pode publicar o mesmo evento duas vezes?', 'Pode, se a aplicação cair depois de publicar e antes de marcar como enviado. Por isso os consumidores precisam ser idempotentes. Duplicar é aceitável; perder, não.']],
  c: 'No sistema em que você trabalha, onde se grava no banco e se envia mensagem em seguida, sem Outbox? O que acontece se cair no meio?',
  b: ['Dual write perde ou inventa eventos.', 'Outbox grava estado e evento na mesma transação.', 'Saga: transações locais com compensações.', 'Orquestração deixa o fluxo explícito e depurável.']
},
'aula-6-5': {
  v: [['CQRS em 5 minutos', 'https://www.youtube.com/watch?v=SvjdJoNPcHs', 'EN'],
      ['Consumer Driven Contracts: Spring Cloud Contract e Pact', 'https://www.youtube.com/watch?v=4FgE4A3nHc0', 'EN']],
  g: `O caixa do supermercado é ótimo para registrar vendas, péssimo para responder “quanto vendemos de café por hora no último mês”. Para isso existe um relatório montado à parte. CQRS é ter um modelo para escrever (o caixa) e outro para ler (o relatório), cada um bom no seu trabalho.`,
  l: ['Qual o custo de o painel do organizador ser alimentado por eventos e não ler direto das tabelas de pedido?',
      'Consistência eventual (o painel pode atrasar alguns segundos) e mais peças para manter (consumidor, tabela própria, idempotência). Em troca, consultas rápidas e sem disputar com as vendas.'],
  q: [['CQRS exige Event Sourcing?', 'Não. São padrões independentes. Dá para ter read models alimentados por eventos e continuar guardando o estado atual nas tabelas.'],
      ['Teste de contrato substitui teste de integração?', 'Não. Ele verifica o formato da conversa entre serviços sem subir os dois juntos. Os testes de integração de cada serviço continuam necessários.']],
  c: 'Qual tela de relatório do sistema em que você trabalha disputa o banco com as operações do dia a dia?',
  b: ['CQRS separa modelo de escrita e de leitura.', 'Read model aceita atraso em troca de consultas rápidas.', 'Contratos orientados ao consumidor evitam quebras silenciosas.', 'Propague o traceparent por HTTP e mensageria.']
},
'aula-F-1': {
  v: [['Atributos de Qualidade, Constraints e Trade-offs', 'https://www.youtube.com/watch?v=w7DcvdyvAPU', 'PT'],
      ['Architecture Decision Records, com Mark Richards', 'https://www.youtube.com/watch?v=LMBqGPLvonU', 'EN']],
  g: `Até aqui você seguiu um roteiro. Agora é a prova de direção sem instrutor no banco do passageiro. Domínio novo, decisões novas. O que importa não é repetir o TicketFlow com outros nomes, e sim <b>decidir de novo</b>, com consciência dos trade-offs.`,
  l: ['Para o domínio que você escolheu, quais são as três características arquiteturais mais importantes? Escreva uma decisão que decorre de cada uma.',
      'Exemplo (prazos processuais): correção → regras de contagem em value objects com testes exaustivos; auditabilidade → histórico imutável de alterações; facilidade de mudança → calendário de feriados atrás de uma porta.'],
  q: [['Posso reaproveitar código do TicketFlow?', 'Ideias e padrões, sim. Copiar classes e renomear, não: o valor do projeto final está em modelar outro domínio do zero.'],
      ['E se meu domínio for simples demais para DDD?', 'Escolha um com pelo menos uma regra difícil (concorrência, cálculo ou estado). Se não houver, a decisão certa pode ser uma arquitetura mais simples, e isso também vale ponto no ADR.']],
  c: 'Qual problema do seu dia a dia você sempre quis resolver com software, mas nunca teve tempo?',
  b: ['Escolha um domínio que você conhece bem.', 'No máximo três características prioritárias.', 'Backlog em fatias verticais, ordenado por risco.', 'ADRs desde o primeiro dia.']
},
'aula-F-2': {
  v: [['Architecture Fitness Functions, com Mark Richards', 'https://www.youtube.com/watch?v=HouuoLsHUAc', 'EN']],
  g: `Construir um sistema é como subir uma escada carregando caixas: se você sobe com caixas demais, tropeça. Fatias pequenas, cada uma testada e revisada, levam você ao topo sem derrubar nada. Esta aula é o seu ritmo de subida.`,
  l: ['Escreva a sua definição de pronto para uma fatia, em no máximo 6 itens.',
      'Ex.: teste de unidade da regra; teste de integração do caminho; ArchUnit verde; métrica de negócio (se aplicável); ADR (se houve decisão); revisão do mentor com nota ≥ 8.'],
  q: [['E se a revisão do mentor discordar de uma decisão minha?', 'Ótimo: discuta, registre os argumentos no ADR e decida. Mentor revisa; quem decide e assume o trade-off é você.'],
      ['Como saber se estou indo rápido demais?', 'Se as fatias estão saindo sem testes ou sem ADR, ou se o pipeline fica vermelho com frequência, diminua o tamanho das fatias.']],
  c: 'Qual verificação automática (fitness function) faria mais diferença no seu projeto final?',
  b: ['Uma ou duas fatias por sessão.', 'Definição de pronto é inegociável.', 'Fitness functions verificam características arquiteturais.', 'Provoque uma falha relevante e documente.']
},
'aula-F-3': {
  v: [['O modelo C4 para visualizar arquitetura, com Simon Brown', 'https://www.youtube.com/watch?v=KvoBrUd1-5E', 'EN'],
      ['Tradeoffs de arquitetura', 'https://www.youtube.com/watch?v=4MJf_qe1hoM', 'PT']],
  g: `Um arquiteto que não consegue explicar o próprio sistema em cinco minutos ainda não terminou o trabalho. Você vai gravar essa explicação, porque falar em voz alta revela as partes que você ainda não entendeu de verdade. E isso é ótimo: é onde está o próximo aprendizado.`,
  l: ['Em uma frase, qual decisão do seu projeto final você mais gostaria de defender numa banca? E qual mais teme ser questionada?',
      'Não há resposta única. A que você mais teme é justamente a que merece um ADR mais caprichado e um ensaio com o mentor no papel de banca.'],
  q: [['Preciso mostrar código no vídeo?', 'Pouco. Mostre o diagrama, duas decisões e a prova (testes, painel, falha). Código entra só para ilustrar uma regra importante.'],
      ['Certificação Java vale a pena para quem já trabalha com arquitetura?', 'Ela valida a base da linguagem e ajuda em alguns processos seletivos. Para arquitetura, o que mais pesa é o portfólio com decisões justificadas.']],
  c: 'Daqui a três meses, o que você quer conseguir fazer no trabalho que hoje ainda não consegue?',
  b: ['Explique problema, prioridades, C4, duas decisões e a prova.', 'Trade-offs valem mais que lista de tecnologias.', 'Grave, publique e peça uma banca ao mentor.', 'Planeje o próximo passo: certificação, cloud, arquitetura evolutiva.']
}
});
C.vscodeVideos = [['Configurando o VS Code para o Java', 'https://www.youtube.com/watch?v=vDCGeZehtQg', 'PT'],
                  ['Como configurar o VS Code para Java no Windows 11', 'https://www.youtube.com/watch?v=_u997D73UDA', 'EN']];
