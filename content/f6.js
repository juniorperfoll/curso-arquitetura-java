C.fases.push({
  n: 6, curto: 'Microsserviços', titulo: 'Microsserviços, mensageria e resiliência', semanas: 'Semanas 19 a 22',
  resumo: 'Strangler Fig, comunicação síncrona e assíncrona, Resilience4j, sagas, Outbox, idempotência, CQRS e tracing distribuído.',
  objetivo: 'Quebrar o monólito <i>somente onde os bounded contexts justificam</i> e lidar com o que a rede traz: falhas parciais, consistência eventual e mensagens duplicadas.',
  entrega: 'Pagamentos como serviço, saga da compra, Outbox e ADR (tag v0.5-distribuido)',
  checklist: [
    'ADR justificando por que só Pagamentos vira serviço (e o que continua no monólito modular)',
    'Serviço <code>ticketflow-pagamentos</code> extraído com Strangler Fig, banco próprio',
    'Chamada síncrona protegida com timeout, retry e circuit breaker (Resilience4j)',
    'Kafka (ou RabbitMQ) no Compose; evento <code>IngressoVendido</code> publicado via Outbox',
    'Consumidor de notificações idempotente (mesma mensagem duas vezes = um e-mail)',
    'Saga da compra: reservar, cobrar, confirmar ou compensar (liberar lugares)',
    'Read model CQRS para o painel do organizador',
    'Teste de contrato entre Vendas e Pagamentos',
    'Trace único atravessando gateway, Vendas, Kafka e Pagamentos',
    'Falha provocada com Toxiproxy e comportamento documentado'
  ],
  leituras: ['<i>Microservices Patterns</i>, Chris Richardson: capítulos 3, 4 e 7', '<a href="https://microservices.io/patterns/">microservices.io/patterns</a>: Saga, Transactional Outbox, CQRS, API Gateway', '<i>Building Microservices</i>, Sam Newman, 2ª ed.: capítulos 1 a 4', 'Documentação do Resilience4j e do Spring Kafka'],
  aulas: [
  {
    titulo: 'Quando (não) usar microsserviços e o Strangler Fig', duracao: '2 h 30', resumo: 'Critérios honestos para distribuir e como extrair um serviço sem big bang.',
    objetivos: ['Avaliar custos e benefícios de microsserviços', 'Escolher o primeiro serviço a extrair', 'Aplicar o padrão Strangler Fig'],
    teoria: `
<h3>Os benefícios são organizacionais primeiro</h3>
<p>Microsserviços permitem que <b>times</b> implantem de forma independente, escalem partes diferentes de forma diferente e isolem falhas. O preço: rede não confiável, consistência eventual, observabilidade distribuída, mais pipelines, versionamento de contratos e custo de infraestrutura. Para um time pequeno, um monólito modular bem feito costuma ganhar.</p>
<h3>Bons motivos para extrair um serviço</h3>
<ul><li>Necessidade de escala muito diferente do resto.</li><li>Ciclo de mudança ou time diferente.</li><li>Requisitos de segurança ou conformidade isolados (dados de pagamento, PCI).</li><li>Tecnologia diferente justificada.</li></ul>
<p>No TicketFlow, <b>Pagamentos</b> atende ao terceiro motivo e tem fronteira clara (contexto genérico com ACL). Vendas e Catálogo continuam juntos.</p>
<h3>Strangler Fig</h3>
<p>Como a figueira que envolve a árvore: crie o novo serviço ao lado, desvie o tráfego de uma funcionalidade por vez (pelo gateway ou por uma porta no monólito), e remova o código antigo quando nada mais o usa. Sem reescrita “big bang”.</p>
<div class="callout"><b>Banco por serviço</b>Cada serviço é dono dos seus dados. Dois serviços lendo a mesma tabela é um monólito distribuído: o pior dos dois mundos.</div>`,
    codigo: [
      { titulo: 'A troca acontece numa porta que já existe', src: String.raw`// Antes: implementação local (módulo pagamentos dentro do monólito)
@Component
@ConditionalOnProperty(name = "ticketflow.pagamentos.modo", havingValue = "local", matchIfMissing = true)
class PagamentoLocalAdapter implements CobrarPagamento { ... }

// Depois: o mesmo contrato, agora chamando o serviço remoto
@Component
@ConditionalOnProperty(name = "ticketflow.pagamentos.modo", havingValue = "remoto")
class PagamentoRemotoAdapter implements CobrarPagamento {
    private final PagamentosClient client;   // interface @HttpExchange
    @Override
    public ResultadoCobranca cobrar(PedidoId pedido, MeioPagamento meio, Dinheiro valor) {
        return client.cobrar(new CobrancaRequest(pedido.valor(), meio.token(), valor.valor())).paraDominio();
    }
}
// A arquitetura hexagonal da Fase 4 torna a extração uma troca de adaptador.` }
    ],
    exercicio: {
      titulo: 'Extraia Pagamentos',
      enunciado: `<ol><li>Escreva o ADR <code>0007-extrair-pagamentos.md</code> com os motivos e o que fica no monólito.</li>
<li>Crie o projeto <code>ticketflow-pagamentos</code> (Spring Boot), com banco próprio no Compose e endpoints <code>POST /cobrancas</code> e <code>POST /cobrancas/{id}/estorno</code>.</li>
<li>Implemente o <code>PagamentoRemotoAdapter</code> com um cliente declarativo <code>@HttpExchange</code>.</li>
<li>Alterne entre local e remoto por propriedade e rode a suíte de integração nos dois modos.</li>
<li>Remova o modo local quando tudo estiver verde.</li></ol>`,
      dicas: ['Cliente declarativo: interface com <code>@PostExchange("/cobrancas")</code> e um <code>HttpServiceProxyFactory</code> criado sobre um <code>RestClient</code>. No Boot 4 há <code>@ImportHttpServices</code>, que simplifica isso.', 'Propague o token JWT ou use autenticação entre serviços (client credentials). Para o curso, uma chave de API em header basta, guardada em variável de ambiente.'],
      solucao: String.raw`@HttpExchange("/cobrancas")
public interface PagamentosClient {
    @PostExchange CobrancaResponse cobrar(@RequestBody CobrancaRequest req);
    @PostExchange("/{id}/estorno") void estornar(@PathVariable String id, @RequestBody EstornoRequest req);
}

@Configuration
class PagamentosClientConfig {
    @Bean
    PagamentosClient pagamentosClient(RestClient.Builder builder, @Value("#{environment.PAGAMENTOS_URL}") String url,
                                      @Value("#{environment.PAGAMENTOS_API_KEY}") String chave) {
        RestClient rest = builder.baseUrl(url).defaultHeader("X-Api-Key", chave)
                .requestFactory(ClientHttpRequestFactoryBuilder.jdk().build(
                        ClientHttpRequestFactorySettings.defaults().withReadTimeout(Duration.ofSeconds(2))))
                .build();
        return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(rest)).build()
                .createClient(PagamentosClient.class);
    }
}`
    },
    quiz: [
      { p: 'Dois serviços compartilhando as mesmas tabelas resultam em:', o: ['Alta coesão', 'Um monólito distribuído', 'Microsserviços ideais', 'CQRS'], c: 1, e: 'Acoplamento de dados anula a independência de deploy e de evolução.' },
      { p: 'O padrão Strangler Fig consiste em:', o: ['Reescrever tudo de uma vez', 'Substituir funcionalidades aos poucos, desviando o tráfego para o novo serviço', 'Duplicar o banco', 'Usar um único serviço gigante'], c: 1, e: 'Migração incremental, com retorno rápido e risco controlado.' },
      { p: 'Por que a arquitetura hexagonal facilitou a extração?', o: ['Porque usa Kafka', 'Porque a dependência do pagamento já era uma porta com adaptador trocável', 'Porque elimina a rede', 'Não facilitou'], c: 1, e: 'Trocar o adaptador local pelo remoto não toca o domínio nem os casos de uso.' }
    ]
  },
  {
    titulo: 'Comunicação síncrona e resiliência', duracao: '3 h', resumo: 'Timeouts, retries, circuit breaker e bulkhead com Resilience4j, testados com falhas reais.',
    objetivos: ['Configurar timeouts em todas as chamadas remotas', 'Aplicar retry com backoff e jitter só em operações idempotentes', 'Usar circuit breaker e bulkhead', 'Provocar falhas com Toxiproxy'],
    teoria: `
<h3>As falácias da computação distribuída</h3>
<p>A rede não é confiável, a latência não é zero, a largura de banda não é infinita. Toda chamada remota pode demorar, falhar ou ter sucesso sem você saber.</p>
<h3>As defesas, em ordem de importância</h3>
<ol><li><b>Timeout</b> em toda chamada. Sem ele, uma dependência lenta consome todas as threads (ou conexões) e derruba você junto.</li>
<li><b>Retry</b> com backoff exponencial e <b>jitter</b>, apenas para erros transitórios e operações <b>idempotentes</b>. Retentar uma cobrança não idempotente pode cobrar duas vezes.</li>
<li><b>Circuit breaker</b>: após uma taxa de falhas, “abre” e falha rápido por um tempo, dando fôlego à dependência; depois testa em “meio aberto”.</li>
<li><b>Bulkhead</b>: limita a concorrência para uma dependência, para que ela não esgote recursos de outras partes.</li>
<li><b>Fallback</b>: resposta degradada quando faz sentido (ex.: pedido fica “pagamento em análise” em vez de erro).</li></ol>
<h3>Idempotência da cobrança</h3>
<p>Envie uma <b>chave de idempotência</b> (o id do pedido) em toda cobrança. O serviço de Pagamentos guarda a chave e, se receber de novo, devolve o resultado anterior. Só assim o retry é seguro.</p>`,
    codigo: [
      { titulo: 'Resilience4j no adaptador', src: String.raw`@Component
class PagamentoRemotoAdapter implements CobrarPagamento {

    @CircuitBreaker(name = "pagamentos", fallbackMethod = "emAnalise")
    @Retry(name = "pagamentos")
    @Bulkhead(name = "pagamentos")
    @Override
    public ResultadoCobranca cobrar(PedidoId pedido, MeioPagamento meio, Dinheiro valor) {
        return client.cobrar(pedido.valor().toString(),                     // Idempotency-Key
                new CobrancaRequest(meio.token(), valor.valor())).paraDominio();
    }

    // mesmo retorno + a exceção no final
    private ResultadoCobranca emAnalise(PedidoId pedido, MeioPagamento m, Dinheiro v, Throwable causa) {
        return new ResultadoCobranca.EmAnalise(IdTransacao.pendente(pedido));  // conciliação depois
    }
}` },
      { titulo: 'Configuração', lang: 'yaml', src: String.raw`resilience4j:
  retry:
    instances:
      pagamentos:
        max-attempts: 3
        wait-duration: 200ms
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2
        enable-randomized-wait: true
        retry-exceptions: [java.net.SocketTimeoutException, org.springframework.web.client.ResourceAccessException]
        ignore-exceptions: [dev.ticketflow.vendas.domain.PagamentoRecusadoException]
  circuitbreaker:
    instances:
      pagamentos:
        sliding-window-size: 20
        failure-rate-threshold: 50
        slow-call-duration-threshold: 1500ms
        slow-call-rate-threshold: 50
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 3
  bulkhead:
    instances:
      pagamentos:
        max-concurrent-calls: 50` }
    ],
    exercicio: {
      titulo: 'Quebre o Pagamentos de propósito',
      enunciado: `<ol><li>Adicione Toxiproxy ao Compose entre Vendas e Pagamentos.</li>
<li>Implemente a chave de idempotência no serviço de Pagamentos (tabela com chave única e resposta guardada).</li>
<li>Configure Resilience4j como acima e exponha os estados do circuito nas métricas.</li>
<li>Cenários: latência de 3 s, 50% de erros, serviço fora. Para cada um, rode um teste de carga curto e registre: p95 de Vendas, estado do circuito, pedidos “em análise”, cobranças duplicadas (deve ser zero).</li>
<li>Crie um job que concilia pedidos “em análise” consultando Pagamentos depois.</li></ol>`,
      dicas: ['Toxiproxy tem API HTTP: <code>curl -X POST localhost:8474/proxies/pagamentos/toxics -d \'{"type":"latency","attributes":{"latency":3000}}\'</code>.', 'Métricas: <code>resilience4j_circuitbreaker_state</code> no Prometheus.'],
      solucao: String.raw`// Serviço de Pagamentos: idempotência por chave
@Transactional
public CobrancaResponse cobrar(String chave, CobrancaRequest req) {
    return idempotencia.findById(chave)
            .map(RegistroIdempotente::resposta)                  // já processado: devolve o mesmo
            .orElseGet(() -> {
                CobrancaResponse r = provedor.cobrar(req);
                idempotencia.save(new RegistroIdempotente(chave, r)); // PK = chave; corrida vira violação de unicidade
                return r;
            });
}
// Em corrida, a segunda transação falha na PK: capture DataIntegrityViolationException e leia o registro salvo.`
    },
    quiz: [
      { p: 'Qual defesa é a mais básica e obrigatória em chamadas remotas?', o: ['Circuit breaker', 'Timeout', 'Cache', 'Bulkhead'], c: 1, e: 'Sem timeout, uma dependência lenta prende recursos indefinidamente.' },
      { p: 'Quando é seguro fazer retry de uma cobrança?', o: ['Sempre', 'Quando a operação é idempotente, com chave de idempotência', 'Nunca', 'Só às sextas'], c: 1, e: 'Sem idempotência, retry pode cobrar o cliente duas vezes.' },
      { p: 'O que o circuit breaker faz quando aberto?', o: ['Retenta mais vezes', 'Falha rápido sem chamar a dependência por um tempo', 'Desliga a aplicação', 'Envia para fila'], c: 1, e: 'Protege a dependência e o chamador de esperar à toa.' }
    ]
  },
  {
    titulo: 'Mensageria com Kafka e consumidores idempotentes', duracao: '3 h 30', resumo: 'Tópicos, partições, chaves, garantias de entrega e como lidar com duplicatas.',
    objetivos: ['Publicar e consumir eventos com Spring Kafka', 'Entender partições, ordenação por chave e grupos de consumidores', 'Tratar entrega pelo menos uma vez com consumidores idempotentes e DLT'],
    teoria: `
<h3>Por que assíncrono</h3>
<p>Notificações, pontos de fidelidade, painel do organizador e contabilidade não precisam acontecer dentro da compra. Publicar um evento desacopla no tempo: se o serviço de e-mail estiver fora, a compra continua.</p>
<h3>Kafka em cinco conceitos</h3>
<ul><li><b>Tópico</b>: log de eventos, dividido em <b>partições</b>.</li><li><b>Chave</b>: mensagens com a mesma chave vão para a mesma partição e mantêm ordem. Use o id do pedido.</li><li><b>Grupo de consumidores</b>: cada partição é lida por um consumidor do grupo; mais instâncias = mais paralelismo, até o número de partições.</li><li><b>Offset</b>: posição lida; confirmada após processar.</li><li><b>Retenção</b>: mensagens ficam por um tempo, permitindo reprocessar.</li></ul>
<h3>Garantias</h3>
<p>Na prática você terá <b>pelo menos uma vez</b>: em falhas, mensagens podem chegar duplicadas. A resposta é o <b>consumidor idempotente</b>: registre o id do evento processado e ignore repetidos, na mesma transação do efeito.</p>
<h3>Erros</h3>
<p>Retente algumas vezes com backoff; depois envie para uma <b>Dead Letter Topic</b> (DLT) para análise, sem travar a partição.</p>
<div class="callout info"><b>RabbitMQ também serve</b>Se preferir RabbitMQ: exchanges e filas no lugar de tópicos e partições, e o mesmo raciocínio de idempotência e DLQ. Os conceitos desta aula valem para os dois.</div>`,
    codigo: [
      { titulo: 'Contrato do evento (versão explícita)', src: String.raw`public record IngressoVendidoV1(UUID eventoId, String tipo, int versao, UUID pedidoId,
                                UUID eventoShow, String setor, BigDecimal preco, Instant ocorridoEm) {
    public static IngressoVendidoV1 de(IngressoVendido e) {
        return new IngressoVendidoV1(UUID.randomUUID(), "IngressoVendido", 1, e.pedido().valor(),
                e.evento().valor(), e.setor(), e.preco().valor(), e.ocorridoEm());
    }
}` },
      { titulo: 'Consumidor idempotente com retry e DLT', src: String.raw`@Component
class NotificacaoConsumer {

    @RetryableTopic(attempts = "4", backoff = @Backoff(delay = 1000, multiplier = 2), dltTopicSuffix = ".dlt")
    @KafkaListener(topics = "vendas.ingresso-vendido", groupId = "notificacoes")
    @Transactional
    void consumir(IngressoVendidoV1 evento) {
        if (processados.existsById(evento.eventoId())) return;          // duplicata: ignora
        emails.enfileirarConfirmacao(evento.pedidoId());                  // efeito
        processados.save(new EventoProcessado(evento.eventoId(), Instant.now())); // mesma transação
    }

    @DltHandler
    void falhou(IngressoVendidoV1 evento, @Header(KafkaHeaders.EXCEPTION_MESSAGE) String erro) {
        log.error("evento {} foi para DLT: {}", evento.eventoId(), erro);
    }
}` },
      { titulo: 'Kafka no Compose (KRaft, sem Zookeeper)', lang: 'yaml', src: String.raw`  kafka:
    image: apache/kafka:3.8.1
    ports: ["9092:9092"]
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1` }
    ],
    exercicio: {
      titulo: 'Notificações por evento',
      enunciado: `<ol><li>Suba Kafka no Compose e crie o tópico <code>vendas.ingresso-vendido</code> com 6 partições.</li>
<li>Crie o serviço (ou módulo) <code>notificacoes</code> que consome o evento e “envia” e-mail (grava numa tabela).</li>
<li>Prove a idempotência: publique o mesmo evento 3 vezes e verifique 1 e-mail.</li>
<li>Faça o consumidor falhar para um pedido específico e veja a mensagem chegar na DLT depois dos retries.</li>
<li>Teste com <code>@EmbeddedKafka</code> ou Testcontainers Kafka.</li></ol>`,
      dicas: ['Publicação simples (ainda sem Outbox): <code>kafkaTemplate.send("vendas.ingresso-vendido", pedidoId.toString(), evento)</code>.', 'Use <code>JsonSerializer</code> e <code>JsonDeserializer</code> com pacotes confiáveis configurados.'],
      solucao: String.raw`@SpringBootTest
@Testcontainers
class NotificacaoIdempotenteIT {

    @Container @ServiceConnection
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("apache/kafka:3.8.1"));

    @Autowired KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired EmailRepository emails;

    @Test
    void mesmoEventoTresVezesGeraUmEmail() {
        var evento = new IngressoVendidoV1(UUID.randomUUID(), "IngressoVendido", 1, UUID.randomUUID(),
                UUID.randomUUID(), "Pista", new BigDecimal("200.00"), Instant.now());
        for (int i = 0; i < 3; i++) kafkaTemplate.send("vendas.ingresso-vendido", evento.pedidoId().toString(), evento);

        await().atMost(Duration.ofSeconds(10))
               .untilAsserted(() -> assertThat(emails.countByPedidoId(evento.pedidoId())).isEqualTo(1));
    }
}`
    },
    quiz: [
      { p: 'Como garantir a ordem dos eventos de um mesmo pedido no Kafka?', o: ['Usar um tópico por pedido', 'Usar o id do pedido como chave da mensagem', 'Ter uma partição só, sempre', 'Não é possível'], c: 1, e: 'Mesma chave, mesma partição, ordem preservada.' },
      { p: 'Com entrega “pelo menos uma vez”, o consumidor precisa ser:', o: ['Rápido', 'Idempotente', 'Síncrono', 'Stateless'], c: 1, e: 'Duplicatas vão acontecer; processar duas vezes não pode duplicar o efeito.' },
      { p: 'Para que serve a DLT?', o: ['Armazenar todos os eventos', 'Isolar mensagens que falham repetidamente sem travar a partição', 'Aumentar o paralelismo', 'Criptografar eventos'], c: 1, e: 'Permite analisar e reprocessar depois.' }
    ]
  },
  {
    titulo: 'Sagas e Transactional Outbox', duracao: '4 h', resumo: 'Consistência entre serviços sem transação distribuída, sem perder eventos.',
    objetivos: ['Explicar por que 2PC não é usado entre microsserviços', 'Modelar a saga da compra com orquestração e compensações', 'Implementar o Transactional Outbox'],
    teoria: `
<h3>O problema do dual write</h3>
<p>Salvar o pedido no banco e publicar no Kafka são duas operações. Se a aplicação cai entre elas, ou o evento se perde, ou o evento sai sem o pedido existir. Lembra da pergunta da aula 4.5? É aqui que ela é respondida.</p>
<h3>Transactional Outbox</h3>
<p>Na <b>mesma transação</b> do pedido, grave o evento numa tabela <code>outbox</code>. Um processo separado lê a tabela e publica no broker, marcando como enviado. Ou use CDC (Debezium lendo o log do banco). O evento pode sair duplicado (por isso consumidores idempotentes), mas nunca se perde.</p>
<h3>Saga</h3>
<p>Uma transação de negócio que atravessa serviços vira uma sequência de transações locais, cada uma com uma <b>compensação</b>:</p>
<table><thead><tr><th>Passo</th><th>Serviço</th><th>Compensação</th></tr></thead><tbody>
<tr><td>1. Criar pedido e reservar lugares</td><td>Vendas</td><td>Cancelar pedido e liberar lugares</td></tr>
<tr><td>2. Cobrar</td><td>Pagamentos</td><td>Estornar</td></tr>
<tr><td>3. Emitir ingressos</td><td>Vendas</td><td>(passo final, sem compensação)</td></tr></tbody></table>
<p><b>Orquestração</b>: um coordenador (em Vendas) comanda os passos e reage às respostas. Mais fácil de entender e depurar. <b>Coreografia</b>: cada serviço reage a eventos dos outros. Menos acoplamento central, mas o fluxo fica espalhado. Para o TicketFlow, orquestração.</p>`,
    codigo: [
      { titulo: 'Outbox: gravação na mesma transação', src: String.raw`@Component
class OutboxPublicarEventos implements PublicarEventos {   // adaptador da porta da Fase 4
    private final OutboxRepository outbox;
    private final JsonMapper json;

    @Override
    @Transactional(propagation = Propagation.MANDATORY)    // exige a transação do caso de uso
    public void publicar(List<EventoDominio> eventos) {
        for (var e : eventos) {
            var msg = Mensagens.paraContrato(e);                 // ex.: IngressoVendidoV1
            outbox.save(new OutboxEntry(UUID.randomUUID(), topicoDe(e), chaveDe(e), json.writeValueAsString(msg), Instant.now()));
        }
    }
}

@Component
class OutboxRelay {
    @Scheduled(fixedDelay = 500)
    @SchedulerLock(name = "outboxRelay", lockAtMostFor = "PT30S")
    @Transactional
    void enviar() {
        for (var e : outbox.proximosNaoEnviados(100)) {       // SELECT ... FOR UPDATE SKIP LOCKED
            kafka.send(e.topico(), e.chave(), e.payload()).join();
            e.marcarEnviado(Instant.now());
        }
    }
}` },
      { titulo: 'Orquestrador da saga', src: String.raw`@Component
class SagaCompra {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void aoCriarPedido(PedidoCriadoEvento e) {
        comandos.enviar(new CobrarPedido(e.pedidoId(), e.total(), e.meio()));   // via outbox
    }

    @KafkaListener(topics = "pagamentos.resultado", groupId = "saga-compra")
    @Transactional
    void aoReceberResultado(ResultadoCobrancaV1 r) {
        if (jaProcessado(r.eventoId())) return;
        Pedido pedido = pedidos.porId(new PedidoId(r.pedidoId())).orElseThrow();
        switch (r.status()) {
            case "APROVADO" -> { pedido.pagar(r.idTransacao(), clock); pedido.emitirIngressos(clock); }
            case "RECUSADO" -> { pedido.cancelar("Pagamento recusado: " + r.motivo(), clock); disponibilidade.liberar(pedido); }
            default -> throw new IllegalStateException("Status desconhecido " + r.status());
        }
        pedidos.salvar(pedido);
        publicar.publicar(pedido.eventosPendentes());
        marcarProcessado(r.eventoId());
    }
}` }
    ],
    exercicio: {
      titulo: 'Compra como saga com Outbox',
      enunciado: `<ol><li>Crie a tabela <code>outbox</code> por migration, o adaptador e o relay (use <code>FOR UPDATE SKIP LOCKED</code> para várias réplicas).</li>
<li>Mude a compra: o pedido nasce <code>Criado</code> com lugares reservados e a cobrança vira um comando assíncrono para Pagamentos.</li>
<li>Pagamentos responde com <code>pagamentos.resultado</code>; o orquestrador confirma ou compensa.</li>
<li>Teste: derrube o Kafka, faça compras, suba o Kafka e prove que nenhum evento se perdeu.</li>
<li>Teste: pagamento recusado libera os lugares.</li>
<li>Desenhe o diagrama de sequência da saga (feliz e compensação) em <code>docs/arquitetura/</code>.</li></ol>`,
      dicas: ['A API agora responde 202 Accepted com o pedido em “aguardando pagamento”; o cliente consulta o status ou recebe uma notificação.', 'Pedidos “Criado” que nunca recebem resposta são expirados pelo job da Fase 5, que também libera os lugares.'],
      solucao: String.raw`-- migration
CREATE TABLE outbox (
    id          UUID PRIMARY KEY,
    topico      VARCHAR(200) NOT NULL,
    chave       VARCHAR(200) NOT NULL,
    payload     JSONB        NOT NULL,
    criado_em   TIMESTAMP    NOT NULL,
    enviado_em  TIMESTAMP
);
CREATE INDEX ix_outbox_pendente ON outbox (criado_em) WHERE enviado_em IS NULL;

-- consulta do relay (no repositório, via @Query nativa)
SELECT * FROM outbox WHERE enviado_em IS NULL
ORDER BY criado_em LIMIT :limite FOR UPDATE SKIP LOCKED;`
    },
    quiz: [
      { p: 'O que o Outbox resolve?', o: ['Performance do Kafka', 'A perda ou inconsistência entre gravar no banco e publicar o evento', 'Autenticação entre serviços', 'Ordenação global'], c: 1, e: 'Evento e estado são gravados atomicamente; a publicação vem depois, com garantia.' },
      { p: 'Numa saga, se o pagamento é recusado, o que acontece com a reserva?', o: ['Fica para sempre', 'É desfeita por uma compensação', 'O banco faz rollback distribuído', 'O cliente precisa ligar'], c: 1, e: 'Cada passo tem uma ação compensatória.' },
      { p: 'Qual vantagem da orquestração sobre a coreografia?', o: ['Nenhum serviço central', 'O fluxo fica explícito num lugar, mais fácil de entender e depurar', 'Menos mensagens sempre', 'Dispensa idempotência'], c: 1, e: 'Coreografia espalha o fluxo; orquestração o concentra.' }
    ]
  },
  {
    titulo: 'CQRS, contratos e tracing distribuído', duracao: '3 h', resumo: 'Read models para consultas, testes de contrato entre serviços e o trace ponta a ponta.',
    objetivos: ['Separar modelo de escrita e de leitura com CQRS', 'Proteger contratos entre serviços com testes de contrato', 'Propagar contexto de tracing através de HTTP e Kafka'],
    teoria: `
<h3>CQRS</h3>
<p>O modelo de escrita (agregados) é ótimo para garantir regras e ruim para consultas como “vendas por setor por hora no último mês”. Com CQRS, um <b>read model</b> separado é alimentado por eventos e desenhado para a consulta: uma tabela desnormalizada, uma view materializada ou outro banco. Custo: consistência eventual (o painel pode estar alguns segundos atrasado) e mais peças.</p>
<p><b>Event Sourcing</b> (guardar os eventos como fonte da verdade) é um passo além, opcional e com custo alto. Estude, mas só adote com motivo forte (auditoria completa, reconstrução de estado).</p>
<h3>Contratos</h3>
<p>Quando Vendas depende do formato da resposta de Pagamentos, uma mudança inocente quebra produção. <b>Testes de contrato</b> orientados ao consumidor (Pact ou Spring Cloud Contract) registram o que o consumidor espera e verificam o provedor no build dele.</p>
<h3>Tracing ponta a ponta</h3>
<p>Com Micrometer Tracing, o contexto (<code>traceparent</code> do W3C) é propagado automaticamente em <code>RestClient</code> e, com observação habilitada, no <code>KafkaTemplate</code> e nos listeners. Resultado: um único trace desde o Nginx até o e-mail enviado.</p>`,
    codigo: [
      { titulo: 'Read model alimentado por eventos', src: String.raw`@Component
class PainelOrganizadorProjecao {

    @KafkaListener(topics = "vendas.ingresso-vendido", groupId = "painel-organizador")
    @Transactional
    void projetar(IngressoVendidoV1 e) {
        if (processados.existsById(e.eventoId())) return;
        jdbc.update("""
            INSERT INTO painel_vendas_hora (evento_id, setor, hora, quantidade, faturamento)
            VALUES (?, ?, date_trunc('hour', ?::timestamptz), 1, ?)
            ON CONFLICT (evento_id, setor, hora)
            DO UPDATE SET quantidade = painel_vendas_hora.quantidade + 1,
                          faturamento = painel_vendas_hora.faturamento + EXCLUDED.faturamento
            """, e.eventoShow(), e.setor(), e.ocorridoEm().toString(), e.preco());
        processados.save(new EventoProcessado(e.eventoId(), Instant.now()));
    }
}` },
      { titulo: 'Tracing no Kafka', lang: 'yaml', src: String.raw`spring:
  kafka:
    template:
      observation-enabled: true
    listener:
      observation-enabled: true
management:
  tracing:
    sampling:
      probability: 1.0` },
      { titulo: 'Contrato com Spring Cloud Contract (lado do provedor)', lang: 'yaml', src: String.raw`# pagamentos/src/test/resources/contracts/cobranca_aprovada.yml
request:
  method: POST
  url: /cobrancas
  headers: { Content-Type: application/json, Idempotency-Key: "7f1c5a4e-0f4b-4a9e-9a1d-2b3c4d5e6f70" }
  body: { token: "tok_ok", valor: 200.00 }
response:
  status: 200
  headers: { Content-Type: application/json }
  body: { id: "tx-1", status: "APROVADO" }` }
    ],
    exercicio: {
      titulo: 'Painel, contrato e um trace inteiro',
      enunciado: `<ol><li>Crie o read model <code>painel_vendas_hora</code> e o endpoint <code>GET /organizador/eventos/{id}/painel</code> que lê só dele.</li>
<li>Escreva um contrato para a cobrança aprovada e outro para a recusada; gere os stubs no Pagamentos e use-os nos testes de Vendas.</li>
<li>Ative a observação no Kafka e mostre no Tempo/Jaeger um trace com: Nginx (se instrumentado) ou API, caso de uso, relay da outbox, consumidor de Pagamentos, resultado, consumidor de notificações.</li>
<li>Faça uma mudança que quebre o contrato e veja o build do provedor falhar.</li>
<li>Crie a tag <code>v0.5-distribuido</code>.</li></ol>`,
      dicas: ['O relay da outbox publica fora do contexto da requisição original. Para manter o trace, guarde o <code>traceparent</code> na linha da outbox e restaure-o ao publicar.', 'Spring Cloud Contract gera testes no provedor com base no contrato: <code>mvn verify</code> no Pagamentos já os roda.'],
      solucao: String.raw`// Guardar e restaurar contexto de trace na outbox
outbox.save(new OutboxEntry(id, topico, chave, payload, Instant.now(), traceparentAtual()));

private String traceparentAtual() {
    var span = tracer.currentSpan();
    if (span == null) return null;
    var ctx = span.context();
    return "00-" + ctx.traceId() + "-" + ctx.spanId() + "-01";
}

// no relay: adiciona o header ao ProducerRecord
var registro = new ProducerRecord<String, String>(e.topico(), e.chave(), e.payload());
if (e.traceparent() != null) registro.headers().add("traceparent", e.traceparent().getBytes(StandardCharsets.UTF_8));
kafka.send(registro).join();`
    },
    quiz: [
      { p: 'Qual o principal custo do CQRS com read model alimentado por eventos?', o: ['Mais regras de negócio', 'Consistência eventual e mais componentes', 'Impossibilidade de usar SQL', 'Menos segurança'], c: 1, e: 'A leitura pode estar atrasada em relação à escrita.' },
      { p: 'Testes de contrato orientados ao consumidor servem para:', o: ['Testar performance', 'Detectar no build do provedor mudanças que quebram consumidores', 'Substituir testes de unidade', 'Gerar documentação comercial'], c: 1, e: 'O contrato registra a expectativa do consumidor e é verificado do outro lado.' },
      { p: 'O header W3C usado para propagar o contexto de trace é:', o: ['<code>X-Trace</code>', '<code>traceparent</code>', '<code>Authorization</code>', '<code>Idempotency-Key</code>'], c: 1, e: 'Padrão W3C Trace Context, suportado pelo OpenTelemetry e pelo Micrometer.' }
    ],
    desafio: '<p>Leia sobre Event Sourcing em microservices.io e peça ao mentor um exercício: modelar o agregado <code>Disponibilidade</code> com Event Sourcing, só em memória, e comparar com a versão atual.</p>'
  }
  ]
});
