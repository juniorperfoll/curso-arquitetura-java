C.fases.push({
  n: 4, curto: 'Clean Arch e DDD', titulo: 'Arquitetura de aplicações: Clean Architecture, Hexagonal e DDD', semanas: 'Semanas 11 a 14',
  resumo: 'Isolar o domínio das tecnologias, modelar com DDD estratégico e tático, e proteger a arquitetura com testes.',
  objetivo: 'Isolar o domínio das tecnologias, para que trocar banco, framework ou mensageria não exija reescrever regras de negócio. Você vai pegar o MVC da Fase 3 e migrá-lo, sentindo na pele os ganhos e os custos.',
  entrega: 'TicketFlow em módulos limpos, mapa de contextos, C4 e ArchUnit (tag v0.3-clean)',
  checklist: [
    'Event Storming do processo de compra documentado (foto ou board)',
    'Três <i>bounded contexts</i> definidos: Catálogo de Eventos, Vendas e Pagamentos, com mapa de contextos',
    'Projeto reorganizado em <code>domain</code>, <code>application</code>, <code>infrastructure</code> e <code>web</code> (módulos ou pacotes por contexto)',
    'Casos de uso como classes de aplicação com portas de entrada e de saída',
    'Entidade de domínio separada da entidade JPA, com mapper na infraestrutura',
    'Agregado <code>Pedido</code> garantindo invariantes; referência a outros agregados por id',
    'Evento de domínio <code>IngressoVendido</code> publicado e consumido',
    'Camada anticorrupção para o gateway de pagamento',
    'Regras ArchUnit quebrando o build se o domínio importar Spring ou JPA',
    'Diagramas C4 níveis 1 e 2 e ADR comparando MVC com a versão limpa'
  ],
  leituras: ['<i>Arquitetura Limpa</i>, Robert C. Martin: partes III a V', '<i>Domain-Driven Design Distilled</i>, Vaughn Vernon (livro curto e direto)', '<i>Get Your Hands Dirty on Clean Architecture</i>, Tom Hombergs', '<a href="https://c4model.com">c4model.com</a> e a documentação do Spring Modulith'],
  extra: `<h3>Mapa mental da fase</h3><p>Clean Architecture e Hexagonal respondem <b>como organizar o código</b> para proteger o domínio. DDD responde <b>como entender e dividir o domínio</b>. Elas se complementam: DDD define <i>o que</i> fica no centro, e a arquitetura define <i>como</i> o centro fica protegido.</p>`,
  aulas: [
  {
    titulo: 'Por que arquitetura: a regra da dependência', duracao: '2 h', resumo: 'O que é arquitetura, o custo do acoplamento e a regra que organiza tudo.',
    objetivos: ['Explicar o objetivo da arquitetura de software em termos de custo de mudança', 'Enunciar e aplicar a regra da dependência', 'Comparar camadas tradicionais, Clean, Hexagonal e Onion'],
    teoria: `
<h3>Arquitetura é sobre o custo de mudar</h3>
<p>Robert Martin resume: o objetivo da arquitetura é minimizar o esforço humano para construir e manter o sistema. Uma boa arquitetura <b>adia decisões</b> de detalhes (qual banco, qual framework, qual fila) e mantém as regras de negócio baratas de mudar.</p>
<h3>Camadas tradicionais e o problema escondido</h3>
<p>No MVC clássico: <code>Controller → Service → Repository → Banco</code>. Parece organizado, mas a seta aponta para o banco: o serviço depende das entidades JPA, que dependem do schema. Mudar a persistência mexe nas regras. Testar regras exige banco ou mocks pesados.</p>
<h3>A regra da dependência</h3>
<p><b>Dependências de código-fonte só podem apontar para dentro</b>, em direção às políticas de mais alto nível. O centro (entidades e regras) não sabe nada sobre o que está fora (web, banco, filas). Quando o centro precisa de algo de fora, ele define uma <b>interface</b> e a camada externa a implementa. É o DIP aplicado em escala de sistema.</p>
<table><thead><tr><th>Estilo</th><th>Vocabulário</th><th>Ideia central</th></tr></thead><tbody>
<tr><td>Clean Architecture</td><td>Entidades, casos de uso, adaptadores de interface, frameworks</td><td>Círculos concêntricos, dependências para dentro</td></tr>
<tr><td>Hexagonal (Ports &amp; Adapters)</td><td>Portas de entrada e saída, adaptadores primários e secundários</td><td>A aplicação no centro, tudo o mais pluga nas portas</td></tr>
<tr><td>Onion</td><td>Domain model, domain services, application services, infraestrutura</td><td>Camadas em cebola, mesma regra</td></tr></tbody></table>
<p>As três dizem a mesma coisa com palavras diferentes. Neste curso usamos o vocabulário de <b>portas e adaptadores</b> no código e o de <b>casos de uso</b> na aplicação.</p>
<div class="callout"><b>Não é de graça</b>Mais interfaces, mais mapeamentos, mais classes. Para um CRUD simples, o MVC é a escolha certa. Arquitetura limpa se paga quando há regras de negócio de verdade e vida longa pela frente.</div>`,
    codigo: [
      { titulo: 'A seta, em pastas (estrutura da Fase 4)', lang: 'shell', src: String.raw`ticketflow-domain/src/main/java/dev/ticketflow/vendas/     <- Java puro, sem Spring
├── domain/            # Pedido, Ingresso, StatusPedido, Disponibilidade, Dinheiro
└── application/       # casos de uso: ComprarIngressosService, CancelarPedidoService
    └── port/
        ├── in/        # portas de entrada: ComprarIngressosUseCase
        └── out/       # portas de saída: SalvarPedido, CobrarPagamento, PublicarEventos

ticketflow-api/src/main/java/dev/ticketflow/vendas/        <- Spring Boot
├── infrastructure/    # adaptadores: JPA, HTTP, Kafka, configuração dos beans
└── web/               # controllers e DTOs

Regra: domain <- application <- (web, infrastructure)` }
    ],
    exercicio: {
      titulo: 'Diagnóstico do seu MVC',
      enunciado: `<ol><li>Desenhe (papel, Excalidraw ou PlantUML) o grafo de dependências atual do <code>ticketflow-api</code>: quem importa quem.</li>
<li>Marque cada seta que aponta do negócio para a tecnologia (ex.: serviço importando <code>SetorEntity</code>).</li>
<li>Liste 3 mudanças prováveis (trocar gateway de pagamento, expor via mensageria, trocar banco de relatórios) e estime quais arquivos cada uma tocaria hoje.</li>
<li>Escreva o ADR <code>0003-adotar-arquitetura-hexagonal.md</code> com contexto, decisão e consequências (inclua os contras).</li></ol>`,
      dicas: ['No VS Code, pesquise com Ctrl+Shift+F por <code>import dev.ticketflow.api.persistence</code> dentro de <code>ticketflow-api/src/main/java/dev/ticketflow/api/service</code>: cada resultado é uma seta do negócio para a tecnologia.', 'Um bom ADR cita alternativas consideradas e por que foram rejeitadas.'],
      solucao: [{ titulo: 'docs/adr/0003-adotar-arquitetura-hexagonal.md', lang: 'shell', src: String.raw`# 3. Adotar arquitetura hexagonal no contexto de Vendas

## Contexto
As regras de venda (capacidade, preço, cancelamento) estão em serviços que
dependem de entidades JPA. Trocar o gateway de pagamento exige mudar 6 classes.
Testar regras exige Spring e banco.

## Alternativas
1. Manter MVC em camadas: simples, mas mantém o acoplamento.
2. Hexagonal completa em todos os contextos: consistente, mas caro para o Catálogo,
   que é quase um CRUD.
3. Hexagonal só em Vendas e Pagamentos; Catálogo continua em camadas.

## Decisão
Alternativa 3.

## Consequências
+ Regras de venda testáveis sem Spring, em milissegundos.
+ Troca de gateway vira um novo adaptador.
- Mapeamento duplo (domínio <-> JPA) e mais classes.
- O time precisa entender duas estruturas diferentes.` }]
    },
    quiz: [
      { p: 'A regra da dependência diz que dependências de código apontam:', o: ['Para fora, em direção ao banco', 'Para dentro, em direção às regras de negócio', 'Em qualquer direção, desde que sem ciclos', 'Para o framework'], c: 1, e: 'O centro não conhece os detalhes; os detalhes conhecem o centro.' },
      { p: 'Clean, Hexagonal e Onion são:', o: ['Concorrentes incompatíveis', 'Variações da mesma ideia de isolar o domínio', 'Padrões só para microsserviços', 'Frameworks Java'], c: 1, e: 'Vocabulários diferentes para a mesma regra.' },
      { p: 'Quando o MVC em camadas simples é a melhor escolha?', o: ['Nunca', 'Em CRUDs com poucas regras de negócio', 'Só em microsserviços', 'Só com Spring'], c: 1, e: 'Arquitetura é trade-off: o custo extra só se paga com regras ricas e vida longa.' }
    ]
  },
  {
    titulo: 'Clean Architecture na prática: casos de uso', duracao: '3 h 30', resumo: 'Migre o fluxo de compra do MVC para casos de uso com portas de entrada e saída.',
    objetivos: ['Modelar casos de uso com comandos e resultados explícitos', 'Definir portas de entrada (use case) e de saída (repositórios, gateways)', 'Conectar tudo com Spring sem contaminar o núcleo'],
    teoria: `
<h3>Anatomia de um caso de uso</h3>
<p>Um caso de uso representa uma intenção do usuário: <i>comprar ingressos</i>, <i>cancelar pedido</i>, <i>publicar evento</i>. Ele:</p>
<ol><li>recebe um <b>comando</b> (record imutável e validado);</li><li>carrega agregados pelas <b>portas de saída</b>;</li><li>pede ao <b>domínio</b> para executar a regra;</li><li>persiste e publica eventos pelas portas de saída;</li><li>devolve um <b>resultado</b> simples.</li></ol>
<p>O caso de uso <b>orquestra</b>; o domínio <b>decide</b>. Se você vê <code>if</code> de regra de negócio no caso de uso, ele provavelmente pertence a uma entidade.</p>
<h3>Portas</h3>
<ul><li><b>Porta de entrada</b>: interface que o mundo externo chama (<code>ComprarIngressosUseCase</code>). O controller depende dela, não da implementação.</li><li><b>Porta de saída</b>: interface que o caso de uso precisa (<code>CarregarSetor</code>, <code>SalvarPedido</code>, <code>CobrarPagamento</code>). Prefira portas pequenas e focadas (ISP).</li></ul>
<h3>Transação e framework</h3>
<p>Para manter o núcleo livre de Spring, há duas opções: (a) aceitar <code>@Transactional</code> na camada de aplicação como concessão pragmática; (b) declarar os casos de uso como <code>@Bean</code> e envolver com transação na configuração. Tom Hombergs chama a opção (a) de “atalho consciente”. Escolha e registre num ADR.</p>`,
    codigo: [
      { titulo: 'Porta de entrada, comando e resultado', src: String.raw`package dev.ticketflow.vendas.application.port.in;

public interface ComprarIngressosUseCase {
    PedidoCriado executar(ComprarIngressosCommand comando);

    record ComprarIngressosCommand(ClienteId cliente, EventoId evento, String setor,
                                   int quantidade, List<PoliticaPreco> politicas) {
        public ComprarIngressosCommand {
            if (quantidade < 1 || quantidade > 6) throw new IllegalArgumentException("Quantidade entre 1 e 6");
            politicas = List.copyOf(politicas);
        }
    }

    record PedidoCriado(PedidoId id, Dinheiro total) {}
}` },
      { titulo: 'Portas de saída pequenas', src: String.raw`package dev.ticketflow.vendas.application.port.out;

public interface CarregarDisponibilidade { Disponibilidade doSetor(EventoId evento, String setor); }
public interface ReservarLugares { void reservar(Disponibilidade disponibilidade); } // com controle de versão
public interface SalvarPedido { void salvar(Pedido pedido); }
public interface PublicarEventos { void publicar(List<EventoDominio> eventos); }` },
      { titulo: 'O caso de uso', src: String.raw`package dev.ticketflow.vendas.application;

public class ComprarIngressosService implements ComprarIngressosUseCase {

    private final CarregarDisponibilidade carregar;
    private final ReservarLugares reservar;
    private final SalvarPedido salvar;
    private final PublicarEventos publicar;
    private final Clock clock;

    // construtor omitido

    @Override
    public PedidoCriado executar(ComprarIngressosCommand cmd) {
        Disponibilidade disp = carregar.doSetor(cmd.evento(), cmd.setor());
        Pedido pedido = Pedido.criar(cmd.cliente(), disp, cmd.quantidade(), cmd.politicas(), clock); // domínio decide
        reservar.reservar(disp);
        salvar.salvar(pedido);
        publicar.publicar(pedido.eventosPendentes());
        return new PedidoCriado(pedido.id(), pedido.total());
    }
}` },
      { titulo: 'Montagem com Spring, fora do núcleo', src: String.raw`@Configuration
class VendasConfig {
    @Bean
    ComprarIngressosUseCase comprarIngressos(CarregarDisponibilidade c, ReservarLugares r,
                                             SalvarPedido s, PublicarEventos p, Clock clock,
                                             PlatformTransactionManager tm) {
        var alvo = new ComprarIngressosService(c, r, s, p, clock);
        var tx = new TransactionTemplate(tm);
        return cmd -> tx.execute(status -> alvo.executar(cmd));   // transação sem anotar o núcleo
    }
}` }
    ],
    exercicio: {
      titulo: 'Migre a compra para um caso de uso',
      enunciado: `<ol><li>Crie a estrutura de pacotes do contexto <code>vendas</code> conforme a aula 4.1.</li>
<li>Mova <code>Pedido</code>, <code>Ingresso</code>, <code>StatusPedido</code> e as políticas para <code>vendas.domain</code>.</li>
<li>Implemente <code>ComprarIngressosService</code> com portas de saída, e um teste de unidade com fakes (sem Spring) que roda em menos de 50 ms.</li>
<li>Faça o controller depender de <code>ComprarIngressosUseCase</code>.</li>
<li>Mantenha os testes de integração da Fase 3 verdes: eles provam que o comportamento externo não mudou.</li></ol>`,
      dicas: ['Faça a migração em passos: primeiro mova classes, rode testes; depois introduza portas; depois troque o controller.', 'Se o teste de integração quebrar, o problema geralmente está no mapeamento entre domínio e JPA (próxima aula).'],
      solucao: String.raw`class ComprarIngressosServiceTest {

    DisponibilidadeFake disponibilidade = new DisponibilidadeFake();
    PedidosEmMemoria pedidos = new PedidosEmMemoria();
    EventosCapturados eventos = new EventosCapturados();
    Clock clock = Clock.fixed(Instant.parse("2026-05-01T12:00:00Z"), ZoneOffset.UTC);

    ComprarIngressosUseCase comprar = new ComprarIngressosService(
            disponibilidade, disponibilidade, pedidos, eventos, clock);

    @Test
    void criaPedidoReservaLugaresEPublicaEvento() {
        disponibilidade.cadastrar(EventoId.de("rock-no-vale"), "Pista", 100, Dinheiro.de("200"));

        var resultado = comprar.executar(new ComprarIngressosCommand(
                ClienteId.novo(), EventoId.de("rock-no-vale"), "Pista", 2, List.of(new Inteira())));

        assertThat(resultado.total()).isEqualTo(Dinheiro.de("400"));
        assertThat(disponibilidade.restantes("rock-no-vale", "Pista")).isEqualTo(98);
        assertThat(pedidos.todos()).hasSize(1);
        assertThat(eventos.capturados()).hasOnlyElementsOfType(IngressoVendido.class).hasSize(2);
    }
}`
    },
    quiz: [
      { p: 'Num caso de uso bem escrito, onde fica a regra “não vender acima da capacidade”?', o: ['No controller', 'No caso de uso, num if', 'No domínio (entidade ou agregado)', 'No adaptador JPA'], c: 2, e: 'O caso de uso orquestra; a regra pertence ao modelo de domínio.' },
      { p: 'Portas de saída pequenas e focadas aplicam qual princípio?', o: ['SRP', 'ISP', 'LSP', 'OCP'], c: 1, e: 'Interface Segregation: cada cliente depende só do que usa.' },
      { p: 'Qual o sinal de que a migração não mudou o comportamento externo?', o: ['O código ficou maior', 'Os testes de integração da API continuam verdes', 'A IDE não mostra avisos', 'O build ficou mais lento'], c: 1, e: 'Testes de fora para dentro funcionam como testes de caracterização da migração.' }
    ]
  },
  {
    titulo: 'Hexagonal: adaptadores e persistência separada', duracao: '3 h', resumo: 'Adaptadores primários e secundários, mapeamento domínio ↔ JPA e o custo disso.',
    objetivos: ['Implementar adaptadores secundários (JPA, HTTP) para as portas de saída', 'Separar entidade de domínio de entidade de persistência', 'Avaliar honestamente as estratégias de mapeamento'],
    teoria: `
<h3>Adaptadores</h3>
<p><b>Primários</b> (ou de entrada) acionam a aplicação: controllers REST, consumidores de fila, jobs agendados. <b>Secundários</b> (ou de saída) são acionados por ela: repositórios JPA, clientes HTTP, produtores de mensagem. Todos ficam na borda e dependem das portas.</p>
<h3>Três estratégias de mapeamento</h3>
<table><thead><tr><th>Estratégia</th><th>Como</th><th>Prós</th><th>Contras</th></tr></thead><tbody>
<tr><td>Sem mapeamento</td><td>Anotar o domínio com JPA</td><td>Menos código</td><td>Domínio depende de JPA; construtor vazio, setters e proxies invadem o modelo</td></tr>
<tr><td>Mapeamento completo</td><td>Classes JPA separadas + mapper</td><td>Domínio puro, schema livre</td><td>Mais classes e código de conversão</td></tr>
<tr><td>Híbrido</td><td>Separar só nos contextos ricos</td><td>Custo onde vale a pena</td><td>Duas convenções no projeto</td></tr></tbody></table>
<p>O curso usa <b>mapeamento completo</b> em Vendas para você sentir o custo e o ganho. Registre num ADR.</p>
<h3>Reconstituir agregados</h3>
<p>O construtor público do domínio valida regras de <i>criação</i> (evento no futuro). Ao carregar do banco um evento que já passou, essa validação não pode rodar. Use um método fábrica separado, como <code>Pedido.reconstituir(...)</code>, que só a infraestrutura chama.</p>`,
    codigo: [
      { titulo: 'Adaptador de persistência', src: String.raw`package dev.ticketflow.vendas.infrastructure.persistence;

@Component
class PedidoPersistenceAdapter implements SalvarPedido, CarregarPedido {

    private final PedidoJpaRepository jpa;

    @Override
    public void salvar(Pedido pedido) { jpa.save(PedidoMapper.paraJpa(pedido)); }

    @Override
    public Optional<Pedido> porId(PedidoId id) {
        return jpa.findById(id.valor()).map(PedidoMapper::paraDominio);
    }
}

final class PedidoMapper {
    static PedidoJpa paraJpa(Pedido p) {
        var e = new PedidoJpa();
        e.id = p.id().valor();
        e.clienteId = p.cliente().valor();
        e.status = switch (p.status()) {
            case StatusPedido.Criado c -> "CRIADO";
            case StatusPedido.Pago pg -> "PAGO";
            case StatusPedido.Cancelado c -> "CANCELADO";
            case StatusPedido.Expirado x -> "EXPIRADO";
        };
        e.idTransacao = p.status() instanceof StatusPedido.Pago pg ? pg.idTransacao() : null;
        e.itens = p.ingressos().stream().map(i -> IngressoJpa.de(i, e)).toList();
        return e;
    }

    static Pedido paraDominio(PedidoJpa e) {
        return Pedido.reconstituir(new PedidoId(e.id), new ClienteId(e.clienteId),
                e.itens.stream().map(IngressoJpa::paraDominio).toList(), statusDe(e));
    }
}` }
    ],
    exercicio: {
      titulo: 'Adaptadores de Vendas',
      enunciado: `<ol><li>Implemente os adaptadores de persistência para todas as portas de Vendas, com mapper e <code>reconstituir</code>.</li>
<li>Escreva um teste <code>@DataJpaTest</code> de ida e volta: salvar um pedido pago e carregá-lo devolve um objeto igual em todos os campos relevantes.</li>
<li>Implemente <code>CobrarPagamento</code> com um adaptador HTTP usando <code>RestClient</code> contra um servidor falso (WireMock).</li>
<li>Conte quantas classes o contexto de Vendas tem agora e compare com o MVC. Registre no ADR com sua opinião honesta.</li></ol>`,
      dicas: ['Use <code>assertThat(carregado).usingRecursiveComparison().isEqualTo(original)</code>.', 'WireMock tem extensão para JUnit 5: <code>@WireMockTest</code>.'],
      solucao: String.raw`@WireMockTest
class GatewayHttpAdapterTest {

    @Test
    void traduzRecusaDoGatewayParaExcecaoDeDominio(WireMockRuntimeInfo wm) {
        stubFor(post("/charges").willReturn(okJson("""
                {"status":"DECLINED","reason":"insufficient_funds"}""")));

        var adapter = new GatewayHttpAdapter(RestClient.create(wm.getHttpBaseUrl()));

        assertThatThrownBy(() -> adapter.cobrar(MeioPagamento.cartao("tok"), Dinheiro.de("50")))
                .isInstanceOf(PagamentoRecusadoException.class)
                .hasMessageContaining("insufficient_funds");
    }
}`
    },
    quiz: [
      { p: 'Um consumidor de mensagens Kafka que dispara um caso de uso é um adaptador:', o: ['Secundário', 'Primário', 'De domínio', 'De teste'], c: 1, e: 'Ele aciona a aplicação, como um controller.' },
      { p: 'Por que separar <code>Pedido.reconstituir</code> do construtor público?', o: ['Performance', 'Para não reaplicar regras de criação ao carregar dados históricos', 'Porque o JPA exige', 'Para usar reflexão'], c: 1, e: 'Um pedido de um evento passado é válido no banco, mas não poderia ser criado hoje.' },
      { p: 'Principal custo do mapeamento completo domínio ↔ JPA:', o: ['Domínio dependente de JPA', 'Mais classes e código de conversão', 'Não funciona com PostgreSQL', 'Impede testes'], c: 1, e: 'É o preço pago pelo domínio puro e pelo schema independente.' }
    ]
  },
  {
    titulo: 'DDD estratégico: subdomínios e bounded contexts', duracao: '3 h', resumo: 'Event Storming, linguagem ubíqua, contextos delimitados e mapa de contextos.',
    objetivos: ['Classificar subdomínios em core, suporte e genérico', 'Encontrar bounded contexts com Event Storming', 'Desenhar um mapa de contextos com seus padrões de relacionamento'],
    teoria: `
<h3>O problema que o DDD resolve</h3>
<p>Em sistemas grandes, a mesma palavra significa coisas diferentes. “Evento” para o Catálogo é um show com descrição, fotos e programação; para Vendas é algo com setores, capacidade e preço; para Pagamentos nem existe. Um modelo único para tudo vira uma classe gigante que ninguém entende.</p>
<h3>Subdomínios</h3>
<ul><li><b>Core</b>: o que diferencia o negócio. No TicketFlow: <b>Vendas</b> (preço, capacidade, concorrência). Recebe o melhor time e o melhor design.</li><li><b>Suporte</b>: necessário, específico, mas não diferencial: <b>Catálogo de eventos</b>.</li><li><b>Genérico</b>: problema resolvido no mercado: <b>Pagamentos</b>, autenticação, e-mail. Compre ou integre.</li></ul>
<h3>Bounded context e linguagem ubíqua</h3>
<p>Um <b>bounded context</b> é a fronteira dentro da qual um modelo e sua linguagem são consistentes. Dentro dele, “Pedido” tem um único significado, usado igual por especialistas de negócio e no código.</p>
<h3>Event Storming</h3>
<p>Workshop com post-its: <span style="color:var(--java)">laranja</span> para eventos de domínio no passado (“Ingresso vendido”), azul para comandos (“Comprar ingresso”), amarelo para atores, lilás para políticas (“quando pagamento aprovado, então emitir ingressos”), rosa para sistemas externos. Agrupamentos naturais de eventos revelam os contextos.</p>
<h3>Mapa de contextos: como os contextos se relacionam</h3>
<table><thead><tr><th>Padrão</th><th>Significado</th></tr></thead><tbody>
<tr><td>Customer/Supplier</td><td>Um contexto (fornecedor) atende às necessidades do outro (cliente) com negociação</td></tr>
<tr><td>Conformist</td><td>O cliente aceita o modelo do fornecedor como está</td></tr>
<tr><td>Anticorruption Layer (ACL)</td><td>O cliente traduz o modelo externo para o seu, protegendo-se</td></tr>
<tr><td>Open Host Service / Published Language</td><td>O fornecedor oferece uma API estável e documentada para vários clientes</td></tr>
<tr><td>Shared Kernel</td><td>Dois contextos compartilham um pequeno modelo comum (use com cuidado)</td></tr></tbody></table>`,
    codigo: [
      { titulo: 'Mapa de contextos do TicketFlow', lang: 'shell', src: String.raw`[Catálogo de Eventos] --(Open Host Service: EventoPublicado)--> [Vendas]
        suporte                                                     core
                                                                      |
                                                     (ACL: GatewayPagamento)
                                                                      v
                                                              [Pagamentos] -> provedor externo
                                                                genérico       (Conformist com o provedor)

Vendas -> Notificações: eventos de domínio (IngressoVendido, PedidoCancelado)` },
      { titulo: 'O mesmo conceito, modelos diferentes', src: String.raw`// Contexto Catálogo
package dev.ticketflow.catalogo.domain;
public class Evento {
    EventoId id; String titulo; String descricao; List<Atracao> atracoes;
    Local local; Periodo periodo; List<Imagem> imagens; StatusPublicacao status;
}

// Contexto Vendas: só o que importa para vender
package dev.ticketflow.vendas.domain;
public class EventoAVenda {
    EventoId id; Periodo periodo; Map<String, Disponibilidade> setores;
    boolean vendasAbertas(Instant agora) { ... }
}` }
    ],
    exercicio: {
      titulo: 'Event Storming e mapa de contextos',
      enunciado: `<ol><li>Faça um Event Storming sozinho (ou com colegas ou alunos) no Miro, Excalidraw ou papel, cobrindo: publicar evento, abrir vendas, comprar, pagar, emitir ingresso, cancelar, reembolsar, check-in na portaria.</li>
<li>Identifique pelo menos 20 eventos de domínio e agrupe-os em contextos.</li>
<li>Classifique cada contexto como core, suporte ou genérico, justificando.</li>
<li>Desenhe o mapa de contextos com os padrões de relacionamento.</li>
<li>Escreva um glossário da linguagem ubíqua de Vendas (mínimo 12 termos) em <code>docs/glossario-vendas.md</code>.</li>
<li>Reorganize os pacotes por contexto: <code>dev.ticketflow.catalogo</code>, <code>dev.ticketflow.vendas</code>, <code>dev.ticketflow.pagamentos</code>.</li></ol>`,
      dicas: ['Escreva eventos no passado e com termos do negócio: “Lote promocional encerrado”, não “Flag atualizada”.', 'Check-in na portaria é um candidato a contexto próprio (Acesso), com modelo bem diferente.'],
      solucaoNota: 'Uma possível lista de contextos e eventos. A sua pode ser diferente e ainda estar certa: peça ao mentor para discutir as escolhas.',
      solucao: [{ titulo: 'Exemplo de resultado', lang: 'shell', src: String.raw`Catálogo (suporte): EventoRascunhado, EventoPublicado, SetorConfigurado, EventoAdiado, EventoCancelado
Vendas (core): VendasAbertas, LoteIniciado, LoteEncerrado, PedidoCriado, LugaresReservados,
               PedidoPago, IngressoEmitido, PedidoExpirado, PedidoCancelado, LugaresLiberados, SetorEsgotado
Pagamentos (genérico): CobrancaSolicitada, PagamentoAprovado, PagamentoRecusado, EstornoSolicitado, EstornoConcluido
Acesso (suporte): IngressoValidado, EntradaRegistrada, IngressoRecusadoNaPortaria

Políticas: quando PagamentoAprovado -> emitir ingressos
           quando PedidoCriado e 15 min sem pagamento -> expirar pedido
           quando EventoCancelado -> cancelar pedidos e estornar` }]
    },
    quiz: [
      { p: 'No TicketFlow, qual é o subdomínio core?', o: ['Pagamentos', 'Vendas', 'Autenticação', 'Envio de e-mail'], c: 1, e: 'Preço, capacidade e venda sob concorrência são o diferencial do negócio.' },
      { p: 'Um bounded context é:', o: ['Um microsserviço, necessariamente', 'A fronteira onde um modelo e sua linguagem são consistentes', 'Um pacote Java qualquer', 'Uma tabela do banco'], c: 1, e: 'Pode virar um microsserviço, mas também pode ser um módulo num monólito.' },
      { p: 'Traduzir o modelo de um provedor externo para o modelo próprio é o padrão:', o: ['Shared Kernel', 'Conformist', 'Anticorruption Layer', 'Open Host Service'], c: 2, e: 'A ACL protege o seu modelo das ideias do outro sistema.' }
    ]
  },
  {
    titulo: 'DDD tático: agregados, value objects e eventos de domínio', duracao: '3 h 30', resumo: 'Desenhe agregados pequenos e consistentes e publique eventos de domínio.',
    objetivos: ['Definir agregados e suas raízes', 'Aplicar as regras de Vernon para agregados', 'Registrar e publicar eventos de domínio', 'Usar ids tipados'],
    teoria: `
<h3>Blocos de construção</h3>
<ul><li><b>Entidade</b>: identidade e ciclo de vida (Pedido).</li><li><b>Value object</b>: valor imutável (Dinheiro, Periodo, PedidoId).</li><li><b>Agregado</b>: grupo de objetos tratado como unidade de consistência, acessado só pela <b>raiz</b>.</li><li><b>Repositório</b>: coleção de agregados; um por raiz.</li><li><b>Serviço de domínio</b>: regra que não pertence a uma entidade só.</li><li><b>Evento de domínio</b>: algo relevante que aconteceu, no passado.</li></ul>
<h3>As quatro regras de agregados (Vaughn Vernon)</h3>
<ol><li><b>Proteja invariantes verdadeiras dentro da fronteira</b> do agregado. O que precisa ser consistente na mesma transação fica junto.</li><li><b>Desenhe agregados pequenos.</b> Agregados grandes geram conflitos de concorrência e carregam dados demais.</li><li><b>Referencie outros agregados por id</b>, não por objeto.</li><li><b>Use consistência eventual entre agregados</b>, via eventos de domínio.</li></ol>
<h3>A decisão difícil do TicketFlow</h3>
<p>“Não vender acima da capacidade” envolve o setor; “o pedido tem até 6 ingressos” envolve o pedido. Se <code>Evento</code> fosse um agregado com setores e pedidos dentro, toda compra travaria o evento inteiro. Melhor: um agregado <b>Disponibilidade</b> (por setor, com versão) e um agregado <b>Pedido</b>. A compra altera os dois na mesma transação, o que é uma exceção consciente à regra 1 vs regra 4, ou então você reserva primeiro e cria o pedido por evento. Discuta isso com o mentor.</p>
<h3>Eventos de domínio</h3>
<p>O agregado <b>registra</b> eventos numa lista interna enquanto executa comportamento; o caso de uso, depois de salvar, <b>publica</b>. Assim o domínio não depende de mecanismo de publicação.</p>`,
    codigo: [
      { titulo: 'Raiz de agregado com eventos', src: String.raw`public abstract class RaizAgregado {
    private final List<EventoDominio> pendentes = new ArrayList<>();
    protected void registrar(EventoDominio e) { pendentes.add(e); }
    public List<EventoDominio> eventosPendentes() {
        var copia = List.copyOf(pendentes);
        pendentes.clear();
        return copia;
    }
}

public sealed interface EventoDominio permits IngressoVendido, PedidoPago, PedidoCancelado {
    Instant ocorridoEm();
}
public record IngressoVendido(PedidoId pedido, EventoId evento, String setor, Dinheiro preco, Instant ocorridoEm) implements EventoDominio {}

public record PedidoId(UUID valor) { public static PedidoId novo() { return new PedidoId(UUID.randomUUID()); } }

public class Pedido extends RaizAgregado {
    private final PedidoId id;
    private final ClienteId cliente;      // referência por id a outro agregado
    private final EventoId evento;        // idem
    private final List<Ingresso> ingressos;
    private StatusPedido status;

    public static Pedido criar(ClienteId cliente, Disponibilidade disp, int qtd,
                               List<PoliticaPreco> politicas, Clock clock) {
        if (qtd > 6) throw new LimiteIngressosException(6);
        disp.reservar(qtd);                                  // invariante de capacidade
        var ingressos = IntStream.range(0, qtd)
                .mapToObj(i -> Ingresso.emitir(disp.setor(), disp.precoCom(politicas, clock))).toList();
        var p = new Pedido(PedidoId.novo(), cliente, disp.evento(), ingressos, new StatusPedido.Criado(clock.instant()));
        ingressos.forEach(i -> p.registrar(new IngressoVendido(p.id, p.evento, i.setor(), i.preco(), clock.instant())));
        return p;
    }
}` }
    ],
    exercicio: {
      titulo: 'Agregados Pedido e Disponibilidade',
      enunciado: `<ol><li>Crie ids tipados (<code>PedidoId</code>, <code>EventoId</code>, <code>ClienteId</code>) e troque os <code>UUID</code> soltos.</li>
<li>Extraia o agregado <code>Disponibilidade</code> (setor de um evento, com capacidade, vendidos, preço e versão) e faça <code>Pedido</code> referenciar o evento por id.</li>
<li>Implemente <code>RaizAgregado</code> e os eventos <code>IngressoVendido</code>, <code>PedidoPago</code> e <code>PedidoCancelado</code>.</li>
<li>Faça o adaptador de <code>PublicarEventos</code> usar o <code>ApplicationEventPublisher</code> do Spring e crie um ouvinte <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> que registra no log.</li>
<li>Escreva no ADR qual estratégia você escolheu para a consistência entre Pedido e Disponibilidade e por quê.</li></ol>`,
      dicas: ['<code>AFTER_COMMIT</code> garante que o ouvinte só roda se a transação deu certo. O que acontece se a aplicação cair entre o commit e o ouvinte? Guarde essa pergunta para a aula de Outbox (Fase 6).', 'Teste os eventos no domínio sem Spring: <code>assertThat(pedido.eventosPendentes()).hasSize(2)</code>.'],
      solucao: String.raw`@Component
class SpringPublicarEventos implements PublicarEventos {
    private final ApplicationEventPublisher spring;
    @Override public void publicar(List<EventoDominio> eventos) { eventos.forEach(spring::publishEvent); }
}

@Component
class LogVendas {
    private static final Logger log = LoggerFactory.getLogger(LogVendas.class);

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void aoVender(IngressoVendido e) {
        log.info("ingresso vendido evento={} setor={} preco={}", e.evento(), e.setor(), e.preco());
    }
}`
    },
    quiz: [
      { p: 'Segundo Vernon, agregados devem referenciar outros agregados:', o: ['Por objeto, com lazy loading', 'Por id', 'Por herança', 'Por cópia completa'], c: 1, e: 'Referência por id mantém fronteiras claras e agregados pequenos.' },
      { p: 'Por que um agregado Evento contendo setores e pedidos é má ideia?', o: ['É bonito demais', 'Toda compra concorreria pelo mesmo agregado e carregaria dados demais', 'O JPA não permite', 'Viola o SRP do controller'], c: 1, e: 'Agregados grandes geram contenção e problemas de performance.' },
      { p: 'Quem publica os eventos de domínio registrados pelo agregado?', o: ['O próprio agregado, chamando Kafka', 'O caso de uso (ou infraestrutura) depois de persistir', 'O controller', 'O banco de dados'], c: 1, e: 'O domínio registra; a aplicação publica, sem acoplar o domínio ao mecanismo.' }
    ]
  },
  {
    titulo: 'ACL, monólito modular e testes de arquitetura', duracao: '3 h', resumo: 'Proteja fronteiras com ACL, Spring Modulith e ArchUnit; documente com C4.',
    objetivos: ['Implementar uma camada anticorrupção', 'Verificar fronteiras de módulos com Spring Modulith', 'Escrever regras de arquitetura com ArchUnit', 'Documentar com o modelo C4'],
    teoria: `
<h3>Camada anticorrupção</h3>
<p>Uma ACL é mais que um adapter: ela traduz <b>conceitos</b>, não só formatos. O provedor fala em <i>charges</i>, <i>captures</i> e códigos de erro próprios; Vendas fala em <i>cobrança aprovada</i> e <i>pagamento recusado por saldo</i>. A ACL concentra essa tradução, e mudanças do provedor não vazam para o domínio.</p>
<h3>Monólito modular antes de microsserviços</h3>
<p>Separar contextos em módulos do mesmo deploy dá quase todos os benefícios de fronteira, sem os custos de rede, deploy e consistência distribuída. O <b>Spring Modulith</b> trata cada pacote de primeiro nível sob a aplicação como módulo, verifica dependências ilegais, gera documentação e oferece publicação de eventos entre módulos com registro persistente.</p>
<h3>Arquitetura que se verifica sozinha</h3>
<p>Regras escritas num wiki são esquecidas. Com <b>ArchUnit</b>, a regra “domínio não importa Spring” vira um teste que quebra o build.</p>
<h3>C4 em quatro zooms</h3>
<ol><li><b>Contexto</b>: o sistema, usuários e sistemas externos.</li><li><b>Containers</b>: aplicações e bancos que você implanta.</li><li><b>Componentes</b>: módulos dentro de um container.</li><li><b>Código</b>: raramente necessário.</li></ol>`,
    codigo: [
      { titulo: 'ArchUnit', src: String.raw`@AnalyzeClasses(packages = "dev.ticketflow", importOptions = ImportOption.DoNotIncludeTests.class)
class ArquiteturaTest {

    @ArchTest
    static final ArchRule dominioSemFrameworks = noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAnyPackage(
                    "org.springframework..", "jakarta.persistence..", "com.fasterxml..", "tools.jackson..")
            .because("o domínio deve ser Java puro");

    @ArchTest
    static final ArchRule camadas = layeredArchitecture().consideringAllDependencies()
            .layer("Web").definedBy("..web..")
            .layer("Aplicacao").definedBy("..application..")
            .layer("Dominio").definedBy("..domain..")
            .layer("Infra").definedBy("..infrastructure..")
            .whereLayer("Web").mayNotBeAccessedByAnyLayer()
            .whereLayer("Aplicacao").mayOnlyBeAccessedByLayers("Web", "Infra")
            .whereLayer("Infra").mayNotBeAccessedByAnyLayer();

    @ArchTest
    static final ArchRule vendasNaoUsaInternosDePagamentos = noClasses()
            .that().resideInAPackage("dev.ticketflow.vendas..")
            .should().dependOnClassesThat().resideInAPackage("dev.ticketflow.pagamentos.internal..");
}` },
      { titulo: 'Spring Modulith', src: String.raw`class ModulosTest {
    ApplicationModules modulos = ApplicationModules.of(TicketflowApplication.class);

    @Test
    void verificaFronteiras() { modulos.verify(); }        // falha em dependências ilegais ou ciclos

    @Test
    void geraDocumentacao() { new Documenter(modulos).writeDocumentation(); } // diagramas C4 de componentes
}

// Evento entre módulos com registro persistente (republica se falhar):
@ApplicationModuleListener
void aoVender(IngressoVendido e) { ... }` },
      { titulo: 'ACL para o provedor de pagamento', src: String.raw`package dev.ticketflow.vendas.infrastructure.pagamento;

class PagamentoAcl implements CobrarPagamento {
    private final ProvedorClient provedor;

    @Override
    public ResultadoCobranca cobrar(PedidoId pedido, MeioPagamento meio, Dinheiro valor) {
        var resposta = provedor.createCharge(new ChargeRequest(meio.token(), valor.emCentavos(), pedido.valor().toString()));
        return switch (resposta.status()) {
            case "captured" -> new ResultadoCobranca.Aprovada(new IdTransacao(resposta.id()));
            case "declined" -> new ResultadoCobranca.Recusada(motivo(resposta.declineCode()));
            case "pending_review" -> new ResultadoCobranca.EmAnalise(new IdTransacao(resposta.id()));
            default -> throw new ProvedorRespostaInesperadaException(resposta.status());
        };
    }

    private MotivoRecusa motivo(String codigo) {
        return switch (codigo) {
            case "insufficient_funds" -> MotivoRecusa.SALDO_INSUFICIENTE;
            case "expired_card" -> MotivoRecusa.CARTAO_EXPIRADO;
            case "fraud_suspected" -> MotivoRecusa.SUSPEITA_FRAUDE;
            default -> MotivoRecusa.OUTRO;
        };
    }
}` }
    ],
    exercicio: {
      titulo: 'Blinde a arquitetura e documente',
      enunciado: `<ol><li>Adicione ArchUnit com as regras acima e faça o build quebrar de propósito (importe uma anotação Spring no domínio) para ver a mensagem.</li>
<li>Adicione Spring Modulith, rode <code>verify()</code> e corrija as dependências ilegais que aparecerem.</li>
<li>Implemente a ACL de pagamento com o resultado como <code>sealed interface</code>.</li>
<li>Desenhe os diagramas C4 de nível 1 e 2 (Structurizr DSL, PlantUML C4 ou draw.io) em <code>docs/arquitetura/</code>.</li>
<li>Escreva o ADR final da fase comparando MVC e a versão limpa: número de classes, tempo dos testes de unidade, esforço para trocar o gateway. Crie a tag <code>v0.3-clean</code>.</li></ol>`,
      dicas: ['O Modulith espera que os módulos sejam pacotes diretos sob o pacote da classe principal: <code>dev.ticketflow.vendas</code>, <code>dev.ticketflow.catalogo</code>...', 'Para expor só parte de um módulo, coloque o resto em subpacote <code>internal</code>.'],
      solucao: [{ titulo: 'docs/arquitetura/c4.dsl (Structurizr)', lang: 'shell', src: String.raw`workspace "TicketFlow" {
  model {
    cliente = person "Cliente"
    organizador = person "Organizador"
    provedor = softwareSystem "Provedor de pagamento" "Externo"
    ticketflow = softwareSystem "TicketFlow" {
      api = container "API TicketFlow" "Monólito modular: Catálogo, Vendas, Pagamentos" "Java 21, Spring Boot"
      db = container "Banco" "Eventos, pedidos, disponibilidade" "PostgreSQL"
    }
    cliente -> api "Compra ingressos" "HTTPS/JSON"
    organizador -> api "Publica eventos" "HTTPS/JSON"
    api -> db "Lê e grava" "JDBC"
    api -> provedor "Cobra e estorna" "HTTPS"
  }
  views {
    systemContext ticketflow { include * autolayout lr }
    container ticketflow { include * autolayout lr }
  }
}` }]
    },
    quiz: [
      { p: 'Qual a diferença essencial entre um Adapter e uma ACL?', o: ['Nenhuma', 'A ACL traduz conceitos de um modelo para outro, não só formatos', 'Adapter é só para banco', 'ACL é um framework'], c: 1, e: 'A ACL protege o modelo do domínio de conceitos estranhos.' },
      { p: 'Qual a vantagem de um monólito modular sobre microsserviços no começo?', o: ['Escala infinitamente', 'Fronteiras claras sem custo de rede, deploy distribuído e consistência eventual', 'Dispensa testes', 'Usa menos memória sempre'], c: 1, e: 'Você valida as fronteiras antes de pagar o preço da distribuição.' },
      { p: 'Para que servem testes ArchUnit?', o: ['Medir performance', 'Transformar regras de arquitetura em testes que quebram o build', 'Gerar diagramas UML', 'Testar a UI'], c: 1, e: 'Arquitetura executável não depende da memória do time.' }
    ]
  }
  ]
});
