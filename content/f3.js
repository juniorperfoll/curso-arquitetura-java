C.fases.push({
  n: 3, curto: 'Spring Boot e APIs', titulo: 'Spring Boot na prática: APIs REST profissionais', semanas: 'Semanas 7 a 10',
  resumo: 'Injeção de dependências, REST bem feito, JPA, Flyway, segurança com JWT, testes com Testcontainers e migração para o Boot 4.',
  objetivo: 'Colocar o domínio das fases anteriores atrás de uma API REST segura, testada e documentada. Esta fase vem antes da arquitetura porque Clean Architecture e DDD fazem mais sentido quando você já sentiu o MVC “normal” crescer.',
  entrega: 'API documentada no Swagger, testes com Testcontainers (tag v0.2-api)',
  checklist: [
    'Módulo <code>ticketflow-api</code> com Spring Boot rodando e Actuator <code>/health</code> respondendo',
    'Endpoints: cadastrar evento, listar setores com paginação, comprar ingresso, cancelar pedido',
    'Erros padronizados em <code>ProblemDetail</code> com <code>@RestControllerAdvice</code>',
    'Migrations Flyway e PostgreSQL rodando via Docker',
    '<i>Locking</i> otimista com <code>@Version</code> e teste concorrente provando que não há overbooking',
    'Login com JWT; papel <code>ORGANIZADOR</code> cria eventos, papel <code>CLIENTE</code> compra',
    'Testes de integração com Testcontainers no <code>mvn verify</code>',
    'OpenAPI no <code>/swagger-ui.html</code> e arquivo <code>docs/api/ticketflow.http</code> (REST Client) no repositório',
    'Projeto migrado para Spring Boot 4 com nota do que mudou'
  ],
  leituras: ['<i>Spring in Action</i>, Craig Walls: capítulos de Spring Boot, Data e Security', '<a href="https://spring.io/guides">Spring Guides</a>: “Building REST services with Spring”, “Accessing data with JPA”', 'RFC 9457 (Problem Details for HTTP APIs)', 'Vlad Mihalcea, artigos sobre o problema N+1 e locking otimista'],
  aulas: [
  {
    titulo: 'Spring Boot essencial e injeção de dependências', duracao: '2 h 30', resumo: 'O que o Spring faz por você, como beans nascem e como configurar por ambiente.',
    objetivos: ['Criar o módulo da API com Spring Initializr', 'Entender container IoC, beans, escopos e injeção por construtor', 'Usar profiles e <code>@ConfigurationProperties</code>'],
    teoria: `
<h3>O que é o Spring, sem mística</h3>
<p>O Spring é, no fundo, um <b>container de inversão de controle</b>: você declara componentes e as dependências entre eles, e o container cria, conecta e gerencia o ciclo de vida. É o DIP da aula 2.1 automatizado. O <b>Spring Boot</b> acrescenta autoconfiguração (se o PostgreSQL está no classpath, ele configura um <code>DataSource</code>), um servidor embutido e convenções.</p>
<h3>Beans e estereótipos</h3>
<p><code>@Component</code>, <code>@Service</code>, <code>@Repository</code> e <code>@RestController</code> marcam classes para o container. Para classes que você não pode anotar (as do domínio, que não devem conhecer Spring), use <code>@Bean</code> numa classe <code>@Configuration</code>. Guarde isso: é como o domínio continua puro na Fase 4.</p>
<h3>Sempre injeção por construtor</h3>
<p>Campos <code>final</code>, dependências explícitas, objeto testável sem Spring. Evite <code>@Autowired</code> em campo.</p>
<h3>Configuração externa</h3>
<p><code>application.yml</code> com <b>profiles</b> (<code>dev</code>, <code>test</code>, <code>prod</code>) e variáveis de ambiente para segredos. Agrupe configurações relacionadas num record com <code>@ConfigurationProperties</code>, validado na inicialização.</p>
<div class="callout info"><b>Estrutura do repositório</b><code>ticketflow-domain</code> (Java puro) e <code>ticketflow-api</code> (Spring Boot, depende do domain). O domínio nunca depende da API.</div>`,
    codigo: [
      { titulo: 'pom.xml do módulo da API', lang: 'xml', antes: 'O módulo da API herda do pom raiz e traz o Spring Boot por BOM. A versão fica numa propriedade, o que facilita a migração da aula 3.6.', src: String.raw`<project>
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>dev.ticketflow</groupId>
    <artifactId>ticketflow</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>ticketflow-api</artifactId>

  <properties>
    <spring-boot.version>3.5.7</spring-boot.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${'$'}{spring-boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>dev.ticketflow</groupId>
      <artifactId>ticketflow-domain</artifactId>
      <version>${'$'}{project.version}</version>
    </dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>test</scope></dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <version>${'$'}{spring-boot.version}</version>
        <executions><execution><goals><goal>repackage</goal></goals></execution></executions>
      </plugin>
    </plugins>
  </build>
</project>` },
      { titulo: 'Domínio registrado como bean sem anotações no domínio', src: String.raw`@Configuration
public class DominioConfig {

    @Bean
    Clock clock() { return Clock.systemUTC(); }

    @Bean
    CalculadoraPreco calculadoraPreco(TicketflowProperties props) {
        return new ComTaxaConveniencia(new PrecoBase(), props.taxaConvenienciaPercentual());
    }
}` },
      { titulo: 'Propriedades tipadas e validadas', src: String.raw`@Validated
@ConfigurationProperties(prefix = "ticketflow")
public record TicketflowProperties(
        @Min(0) @Max(30) int taxaConvenienciaPercentual,
        @NotNull Duration expiracaoPedido,
        @Positive int maxIngressosPorPedido) {}

@SpringBootApplication
@ConfigurationPropertiesScan
public class TicketflowApplication {
    public static void main(String[] args) { SpringApplication.run(TicketflowApplication.class, args); }
}` },
      { titulo: 'application.yml', lang: 'yaml', src: String.raw`spring:
  application:
    name: ticketflow-api
  profiles:
    default: dev

ticketflow:
  taxa-conveniencia-percentual: 10
  expiracao-pedido: 15m
  max-ingressos-por-pedido: 6

management:
  endpoints:
    web:
      exposure:
        include: health,info

---
spring:
  config:
    activate:
      on-profile: prod
ticketflow:
  taxa-conveniencia-percentual: 12` }
    ],
    exercicio: {
      titulo: 'Suba a API e registre o domínio',
      enunciado: `<ol><li>Crie o módulo <code>ticketflow-api</code> à mão, com o <code>ticketflow-api/pom.xml</code> do primeiro bloco (ele herda do pom raiz e importa o Spring Boot como BOM). Adicione <code>&lt;module&gt;ticketflow-api&lt;/module&gt;</code> no <code>pom.xml</code> da raiz. Por que não usar o Spring Initializr direto? Porque ele gera um projeto avulso com o Spring como <i>parent</i>, e aqui o parent é o nosso pom raiz. Use o Initializr (Ctrl+Shift+P → <b>Spring Initializr: Create a Maven Project</b>) só para consultar dependências.</li><li>Deixe a Security liberada por enquanto com uma <code>SecurityFilterChain</code> que faz <code>permitAll</code> (você protege na aula 3.4).</li>
<li>Registre <code>Clock</code> e <code>CalculadoraPreco</code> como beans via <code>@Configuration</code>.</li>
<li>Crie <code>TicketflowProperties</code> e mostre que uma taxa de 50% derruba a inicialização com erro claro.</li>
<li>Escreva um teste <code>@SpringBootTest</code> que verifica que o contexto sobe e que o bean <code>CalculadoraPreco</code> aplica a taxa configurada.</li></ol>`,
      dicas: ['Para o contexto subir sem banco por enquanto, use o profile <code>test</code> com H2 ou exclua o autoconfig de DataSource. Na aula 3.5 você troca por Testcontainers.', 'O teste pode receber o bean com <code>@Autowired</code> no construtor ou em campo; em testes isso é aceitável.'],
      solucao: String.raw`@SpringBootTest(properties = "ticketflow.taxa-conveniencia-percentual=10")
@ActiveProfiles("test")
class ContextoTest {

    @Autowired CalculadoraPreco calculadora;

    @Test
    void aplicaTaxaConfigurada() {
        var pedido = PedidoBuilder.umPedido().noSetor("Pista", Dinheiro.de("100")).build();
        assertThat(calculadora.calcular(pedido)).isEqualTo(Dinheiro.de("110"));
    }
}`
    },
    quiz: [
      { p: 'Qual a forma recomendada de injetar dependências num bean?', o: ['<code>@Autowired</code> em campo', 'Construtor com campos <code>final</code>', 'Setter', '<code>ApplicationContext.getBean</code>'], c: 1, e: 'Construtor deixa dependências explícitas, imutáveis e o objeto testável sem container.' },
      { p: 'Como registrar uma classe do domínio como bean sem anotá-la?', o: ['Não é possível', 'Com <code>@Bean</code> numa classe <code>@Configuration</code>', 'Com <code>@ComponentScan</code> no domínio', 'Com XML obrigatório'], c: 1, e: 'O método <code>@Bean</code> instancia a classe pura; o domínio continua sem Spring.' },
      { p: 'O que a autoconfiguração do Spring Boot faz?', o: ['Gera código-fonte', 'Configura beans com base no que está no classpath e nas propriedades', 'Substitui o Maven', 'Cria o banco de dados em produção'], c: 1, e: 'Ela reage ao classpath (ex.: driver PostgreSQL presente) e às propriedades declaradas.' }
    ]
  },
  {
    titulo: 'API REST bem desenhada', duracao: '3 h', resumo: 'Recursos, verbos, status HTTP, DTOs, validação e erros com ProblemDetail.',
    objetivos: ['Desenhar recursos e rotas REST para o TicketFlow', 'Separar DTOs de entrada e saída do modelo de domínio', 'Padronizar erros com <code>ProblemDetail</code> (RFC 9457)'],
    teoria: `
<h3>Desenho dos recursos</h3>
<table><thead><tr><th>Operação</th><th>Rota</th><th>Sucesso</th></tr></thead><tbody>
<tr><td>Criar evento</td><td><code>POST /eventos</code></td><td>201 + <code>Location</code></td></tr>
<tr><td>Detalhar evento</td><td><code>GET /eventos/{id}</code></td><td>200</td></tr>
<tr><td>Listar setores</td><td><code>GET /eventos/{id}/setores?page=0&amp;size=20</code></td><td>200</td></tr>
<tr><td>Criar pedido</td><td><code>POST /pedidos</code></td><td>201</td></tr>
<tr><td>Cancelar pedido</td><td><code>POST /pedidos/{id}/cancelamento</code></td><td>200</td></tr></tbody></table>
<p>Ações de negócio que não são CRUD (cancelar, pagar) ficam melhores como <b>sub-recursos</b> (<code>/cancelamento</code>) do que como <code>PATCH status=CANCELADO</code>: o significado é explícito e cada ação tem sua validação.</p>
<h3>Status HTTP que importam</h3>
<p>200 OK, 201 Created, 204 No Content, 400 entrada malformada, 401 sem autenticação, 403 sem permissão, 404 não encontrado, 409 conflito de estado (pedido já cancelado), 422 regra de negócio violada (setor esgotado), 500 erro inesperado.</p>
<h3>DTOs: o contrato não é a entidade</h3>
<p>Expor a entidade direto acopla o JSON ao modelo interno e vaza campos. Use <b>records</b> de request e response, com Bean Validation nos de entrada. O mapeamento pode ser manual (claro e sem mágica) ou com MapStruct.</p>
<h3>ProblemDetail</h3>
<p>Desde o Spring 6 existe <code>ProblemDetail</code>, que implementa a RFC 9457: <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code> e campos extras. Um único <code>@RestControllerAdvice</code> traduz exceções de domínio em respostas consistentes.</p>`,
    codigo: [
      { titulo: 'DTOs com validação', src: String.raw`public record CriarPedidoRequest(
        @NotNull UUID eventoId,
        @NotBlank String setor,
        @Min(1) @Max(6) int quantidade,
        @NotNull TipoIngresso tipo,          // INTEIRA, MEIA
        String cupom) {}

public record PedidoResponse(UUID id, String status, BigDecimal total, List<IngressoResponse> ingressos) {
    public static PedidoResponse de(Pedido p) {
        return new PedidoResponse(p.id(), p.status().getClass().getSimpleName().toUpperCase(),
                p.total().valor(), p.ingressos().stream().map(IngressoResponse::de).toList());
    }
}` },
      { titulo: 'Controller enxuto', src: String.raw`@RestController
@RequestMapping("/pedidos")
class PedidoController {

    private final PedidoAppService pedidos;
    PedidoController(PedidoAppService pedidos) { this.pedidos = pedidos; }

    @PostMapping
    ResponseEntity<PedidoResponse> criar(@Valid @RequestBody CriarPedidoRequest req, UriComponentsBuilder uri) {
        Pedido pedido = pedidos.criar(req);
        URI location = uri.path("/pedidos/{id}").buildAndExpand(pedido.id()).toUri();
        return ResponseEntity.created(location).body(PedidoResponse.de(pedido));
    }

    @PostMapping("/{id}/cancelamento")
    PedidoResponse cancelar(@PathVariable UUID id, @Valid @RequestBody CancelamentoRequest req) {
        return PedidoResponse.de(pedidos.cancelar(id, req.motivo()));
    }
}` },
      { titulo: 'Tradução de erros com ProblemDetail', src: String.raw`@RestControllerAdvice
class ErrosApi {

    @ExceptionHandler(CapacidadeEsgotadaException.class)
    ProblemDetail esgotado(CapacidadeEsgotadaException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
        pd.setType(URI.create("https://ticketflow.dev/erros/capacidade-esgotada"));
        pd.setTitle("Setor sem lugares suficientes");
        return pd;
    }

    @ExceptionHandler(IllegalStateException.class)
    ProblemDetail conflito(IllegalStateException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        pd.setTitle("Operação incompatível com o estado atual");
        return pd;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalido(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Dados inválidos");
        pd.setProperty("campos", e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, f -> String.valueOf(f.getDefaultMessage()), (a, b) -> a)));
        return pd;
    }
}` }
    ],
    exercicio: {
      titulo: 'Endpoints de evento e pedido',
      enunciado: `<ol><li>Implemente <code>POST /eventos</code>, <code>GET /eventos/{id}</code> e <code>GET /eventos/{id}/setores</code> com paginação (<code>Pageable</code>).</li>
<li>Implemente <code>POST /pedidos</code> e <code>POST /pedidos/{id}/cancelamento</code>. Por enquanto, guarde em memória (um <code>ConcurrentHashMap</code> num <code>@Repository</code>).</li>
<li>Crie o <code>@RestControllerAdvice</code> cobrindo: validação (400), não encontrado (404), estado inválido (409), regra de negócio (422).</li>
<li>Escreva testes <code>@WebMvcTest</code> para cada status de erro.</li></ol>`,
      dicas: ['No <code>@WebMvcTest</code>, o serviço de aplicação entra como <code>@MockitoBean</code> (Boot 3.4+).', 'Use <code>jsonPath("$.title")</code> para verificar o corpo do ProblemDetail.'],
      solucao: String.raw`@WebMvcTest(PedidoController.class)
class PedidoControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean PedidoAppService pedidos;

    @Test
    void setorEsgotadoRetorna422ComProblemDetail() throws Exception {
        when(pedidos.criar(any())).thenThrow(new CapacidadeEsgotadaException("Pista", 0, 2));

        mvc.perform(post("/pedidos").contentType(MediaType.APPLICATION_JSON).content("""
                {"eventoId":"7f1c5a4e-0f4b-4a9e-9a1d-2b3c4d5e6f70","setor":"Pista","quantidade":2,"tipo":"INTEIRA"}
                """))
           .andExpect(status().isUnprocessableEntity())
           .andExpect(jsonPath("$.title").value("Setor sem lugares suficientes"))
           .andExpect(jsonPath("$.type").value("https://ticketflow.dev/erros/capacidade-esgotada"));
    }

    @Test
    void quantidadeAcimaDoLimiteRetorna400() throws Exception {
        mvc.perform(post("/pedidos").contentType(MediaType.APPLICATION_JSON).content("""
                {"eventoId":"7f1c5a4e-0f4b-4a9e-9a1d-2b3c4d5e6f70","setor":"Pista","quantidade":10,"tipo":"INTEIRA"}
                """))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.campos.quantidade").exists());
    }
}`
    },
    quiz: [
      { p: 'Qual status HTTP para “setor esgotado” numa requisição bem formada?', o: ['400', '404', '422', '500'], c: 2, e: 'A requisição é válida sintaticamente, mas viola uma regra de negócio.' },
      { p: 'Por que não expor a entidade de domínio como JSON?', o: ['JSON não suporta classes', 'Acopla o contrato público ao modelo interno e pode vazar dados', 'É mais lento', 'O Spring proíbe'], c: 1, e: 'DTOs permitem evoluir o modelo sem quebrar clientes e controlam exatamente o que sai.' },
      { p: 'Cancelar um pedido é melhor modelado como:', o: ['<code>DELETE /pedidos/{id}</code>', '<code>POST /pedidos/{id}/cancelamento</code>', '<code>GET /pedidos/{id}?cancelar=true</code>', '<code>PUT /pedidos/{id}</code> com o pedido inteiro'], c: 1, e: 'Cancelar não apaga o pedido; é uma ação de negócio com dados próprios (motivo).' }
    ]
  },
  {
    titulo: 'JPA, Flyway e transações', duracao: '4 h', resumo: 'Persistência com PostgreSQL, migrations versionadas, N+1 e locking otimista contra overbooking.',
    objetivos: ['Mapear entidades com JPA e versionar o schema com Flyway', 'Identificar e corrigir o problema N+1', 'Usar transações e <code>@Version</code> para impedir overbooking entre instâncias'],
    teoria: `
<h3>Flyway: o banco também é código</h3>
<p>Cada mudança de schema é um arquivo <code>V1__cria_eventos.sql</code>, <code>V2__...</code>, versionado no Git e aplicado em ordem. Nunca edite uma migration já aplicada; crie outra. Use <code>spring.jpa.hibernate.ddl-auto=validate</code> para o Hibernate só conferir.</p>
<h3>Mapeamento e a decisão que vem na Fase 4</h3>
<p>Nesta fase você vai anotar as classes do domínio com JPA, ou criar entidades JPA separadas. Faça do jeito mais simples: <b>entidades JPA no módulo da API</b> e conversão para o domínio. Na Fase 4 você vai avaliar esse custo de forma explícita.</p>
<h3>O problema N+1</h3>
<p>Listar 50 eventos e acessar <code>evento.getSetores()</code> em cada um dispara 1 consulta para os eventos + 50 para os setores. Sintoma: a API fica lenta conforme os dados crescem. Correções: <code>JOIN FETCH</code> na consulta, <code>@EntityGraph</code>, ou projeções (DTO direto da consulta). Ative <code>spring.jpa.show-sql</code> em dev para enxergar.</p>
<h3>Transações</h3>
<p><code>@Transactional</code> no serviço de aplicação define a unidade de trabalho: tudo ou nada. Mantenha transações curtas e nunca chame serviços HTTP externos dentro de uma.</p>
<h3>Locking otimista: a defesa real contra overbooking</h3>
<p>Com <code>@Version</code>, o Hibernate faz <code>UPDATE setor SET vendidos=?, version=version+1 WHERE id=? AND version=?</code>. Se outra transação alterou o setor antes, nenhuma linha é atualizada e é lançada <code>OptimisticLockException</code>. Você trata com <b>retry</b> curto. Funciona entre várias instâncias, porque a coordenação está no banco.</p>`,
    codigo: [
      { titulo: 'V1__cria_eventos_e_setores.sql', lang: 'sql', src: String.raw`CREATE TABLE evento (
    id          UUID PRIMARY KEY,
    nome        VARCHAR(200) NOT NULL,
    inicio      TIMESTAMP    NOT NULL,
    fim         TIMESTAMP    NOT NULL
);

CREATE TABLE setor (
    id          UUID PRIMARY KEY,
    evento_id   UUID         NOT NULL REFERENCES evento(id),
    nome        VARCHAR(100) NOT NULL,
    capacidade  INTEGER      NOT NULL CHECK (capacidade > 0),
    vendidos    INTEGER      NOT NULL DEFAULT 0 CHECK (vendidos <= capacidade),
    preco       NUMERIC(10,2) NOT NULL,
    version     BIGINT       NOT NULL DEFAULT 0,
    UNIQUE (evento_id, nome)
);` },
      { titulo: 'Entidade JPA com @Version', src: String.raw`@Entity
@Table(name = "setor")
class SetorEntity {
    @Id UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "evento_id") EventoEntity evento;
    String nome;
    int capacidade;
    int vendidos;
    BigDecimal preco;
    @Version long version;   // o Hibernate cuida do resto

    void reservar(int qtd) {
        if (vendidos + qtd > capacidade) throw new CapacidadeEsgotadaException(nome, capacidade - vendidos, qtd);
        vendidos += qtd;
    }
}

interface SetorRepository extends JpaRepository<SetorEntity, UUID> {
    Optional<SetorEntity> findByEventoIdAndNome(UUID eventoId, String nome);

    @Query("select e from EventoEntity e join fetch e.setores where e.inicio > :agora")
    List<EventoEntity> proximosComSetores(LocalDateTime agora);   // sem N+1
}` },
      { titulo: 'Serviço transacional com retry', src: String.raw`@Service
class PedidoAppService {

    @Retryable(retryFor = ObjectOptimisticLockingFailureException.class,
               maxAttempts = 3, backoff = @Backoff(delay = 20, random = true))
    @Transactional
    public Pedido criar(CriarPedidoRequest req) {
        SetorEntity setor = setores.findByEventoIdAndNome(req.eventoId(), req.setor())
                .orElseThrow(() -> new NaoEncontradoException("Setor"));
        setor.reservar(req.quantidade());         // UPDATE com WHERE version = ?
        Pedido pedido = montarPedido(setor, req);
        pedidos.save(PedidoEntity.de(pedido));
        return pedido;
    }
}
// @Retryable vem do spring-retry (habilite com @EnableRetry).
// No Spring Framework 7 / Boot 4 existe também @Retryable nativo em org.springframework.resilience.` }
    ],
    exercicio: {
      titulo: 'Persistência real e prova contra overbooking',
      enunciado: `<ol><li>Suba um PostgreSQL com <code>docker run -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16</code> e crie as migrations de evento, setor, pedido e ingresso.</li>
<li>Troque o repositório em memória por Spring Data JPA.</li>
<li>Crie um endpoint de listagem de eventos com setores, ative o log SQL, reproduza o N+1 e corrija com <code>JOIN FETCH</code> ou <code>@EntityGraph</code>.</li>
<li>Escreva um teste que dispara 200 compras concorrentes (virtual threads) num setor de 50 lugares, contra o banco real, e prova que <code>vendidos == 50</code> e que nenhuma compra além disso foi confirmada.</li></ol>`,
      dicas: ['Cada compra concorrente precisa rodar na sua própria transação: chame o serviço (proxy do Spring), não um método privado.', 'Conte sucessos e falhas com <code>AtomicInteger</code>. Falhas esperadas: <code>CapacidadeEsgotadaException</code> e, se os retries acabarem, falha de lock.'],
      solucao: String.raw`@SpringBootTest
class OverbookingIT {

    @Autowired PedidoAppService servico;
    @Autowired SetorRepository setores;

    @Test
    void duzentasComprasEmCinquentaLugares() throws Exception {
        UUID eventoId = criarEventoComSetor("Pista", 50);
        var ok = new AtomicInteger();
        var recusadas = new AtomicInteger();

        try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 200; i++) exec.submit(() -> {
                try { servico.criar(new CriarPedidoRequest(eventoId, "Pista", 1, TipoIngresso.INTEIRA, null)); ok.incrementAndGet(); }
                catch (CapacidadeEsgotadaException | ObjectOptimisticLockingFailureException e) { recusadas.incrementAndGet(); }
            });
        }

        var setor = setores.findByEventoIdAndNome(eventoId, "Pista").orElseThrow();
        assertThat(setor.vendidos).isEqualTo(ok.get()).isLessThanOrEqualTo(50);
        assertThat(ok.get() + recusadas.get()).isEqualTo(200);
    }
}`
    },
    quiz: [
      { p: 'O que fazer se uma migration já aplicada em produção tem um erro?', o: ['Editar o arquivo', 'Criar uma nova migration que corrige', 'Apagar a tabela flyway_schema_history', 'Usar ddl-auto=update'], c: 1, e: 'Migrations aplicadas são imutáveis; o Flyway confere checksums.' },
      { p: 'Como o <code>@Version</code> evita overbooking entre várias instâncias?', o: ['Com um lock em memória', 'Com um UPDATE condicionado à versão lida; se mudou, a transação falha', 'Bloqueando a tabela inteira', 'Não evita'], c: 1, e: 'A verificação acontece no banco, que é compartilhado por todas as instâncias.' },
      { p: 'Sintoma típico do N+1:', o: ['Erro de compilação', 'Uma consulta para a lista e uma para cada item ao acessar uma associação', 'Deadlock', 'Transação longa'], c: 1, e: 'Associações LAZY acessadas num laço geram uma consulta por item.' }
    ]
  },
  {
    titulo: 'Segurança com Spring Security e JWT', duracao: '3 h', resumo: 'Autenticação stateless, papéis ORGANIZADOR e CLIENTE e autorização por regra.',
    objetivos: ['Configurar a <code>SecurityFilterChain</code> stateless', 'Emitir e validar JWT com OAuth2 Resource Server', 'Autorizar por papel e por dono do recurso'],
    teoria: `
<h3>Autenticação x autorização</h3>
<p><b>Autenticação</b>: quem é você (401 se falhar). <b>Autorização</b>: o que você pode fazer (403 se negar). No TicketFlow: <code>ORGANIZADOR</code> cria eventos; <code>CLIENTE</code> compra; um cliente só cancela os <b>próprios</b> pedidos.</p>
<h3>JWT em uma frase</h3>
<p>Um token assinado com as <i>claims</i> do usuário (id, papéis, expiração). A API valida a assinatura sem consultar sessão: é <b>stateless</b>, o que facilita escalar horizontalmente (Fase 5). Em produção, o emissor costuma ser um provedor de identidade (Keycloak, Auth0, Cognito); aqui você emite tokens no próprio projeto para aprender, com chave simétrica, e troca depois.</p>
<h3>Resource Server</h3>
<p>O starter <code>spring-boot-starter-oauth2-resource-server</code> valida JWT e popula o <code>SecurityContext</code>. Você converte a claim <code>roles</code> em autoridades <code>ROLE_...</code>.</p>
<h3>Autorização por dono</h3>
<p>Papel não basta: um <code>CLIENTE</code> não pode cancelar o pedido de outro. Verifique a posse no serviço de aplicação (ou com <code>@PreAuthorize</code> chamando um bean). Responda 404 em vez de 403 para não revelar que o pedido existe.</p>`,
    codigo: [
      { titulo: 'SecurityFilterChain', src: String.raw`@Configuration
@EnableMethodSecurity
class SegurancaConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())                        // API stateless, sem cookies de sessão
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/eventos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/eventos/**").hasRole("ORGANIZADOR")
                .requestMatchers("/pedidos/**").hasRole("CLIENTE")
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(conversorPapeis())))
            .build();
    }

    private JwtAuthenticationConverter conversorPapeis() {
        var papeis = new JwtGrantedAuthoritiesConverter();
        papeis.setAuthoritiesClaimName("roles");
        papeis.setAuthorityPrefix("ROLE_");
        var conv = new JwtAuthenticationConverter();
        conv.setJwtGrantedAuthoritiesConverter(papeis);
        return conv;
    }

    @Bean
    JwtDecoder jwtDecoder(@Value("#{environment.JWT_SECRET}") String segredo) {
        var chave = new SecretKeySpec(segredo.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(chave).build();
    }
}` },
      { titulo: 'Dono do recurso no serviço', src: String.raw`@Transactional
public Pedido cancelar(UUID pedidoId, String motivo, Jwt usuario) {
    PedidoEntity pedido = pedidos.findById(pedidoId)
            .filter(p -> p.clienteId.equals(UUID.fromString(usuario.getSubject())))
            .orElseThrow(() -> new NaoEncontradoException("Pedido")); // 404, não 403
    // ...
}` },
      { titulo: 'Teste com usuário simulado', src: String.raw`mvc.perform(post("/eventos").with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CLIENTE")))
        .contentType(MediaType.APPLICATION_JSON).content(eventoJson))
   .andExpect(status().isForbidden());` }
    ],
    exercicio: {
      titulo: 'Proteja a API',
      enunciado: `<ol><li>Crie <code>POST /auth/token</code> que, dado e-mail e senha de usuários de teste (em memória, senha com BCrypt), devolve um JWT com <code>sub</code>, <code>roles</code> e expiração de 1 hora, assinado com HMAC (use <code>NimbusJwtEncoder</code>).</li>
<li>Configure a <code>SecurityFilterChain</code> acima. O segredo vem da variável de ambiente <code>JWT_SECRET</code> (mínimo 32 bytes).</li>
<li>Garanta que o pedido guarde o <code>clienteId</code> do token e que só o dono consiga cancelar.</li>
<li>Testes: anônimo recebe 401; cliente tentando criar evento recebe 403; cliente B tentando cancelar pedido de A recebe 404.</li></ol>`,
      dicas: ['Para emitir: <code>JwtClaimsSet.builder().subject(id).claim("roles", List.of("CLIENTE")).expiresAt(...)</code> e <code>encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))</code>.', 'Nunca coloque o segredo no <code>application.yml</code> commitado.'],
      solucao: String.raw`@RestController
class AuthController {
    private final JwtEncoder encoder;
    private final UsuariosTeste usuarios;   // em memória, senhas BCrypt
    private final PasswordEncoder senhas;

    @PostMapping("/auth/token")
    TokenResponse token(@Valid @RequestBody LoginRequest req) {
        var u = usuarios.porEmail(req.email())
                .filter(x -> senhas.matches(req.senha(), x.hash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var agora = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer("ticketflow").subject(u.id().toString())
                .issuedAt(agora).expiresAt(agora.plus(1, ChronoUnit.HOURS))
                .claim("roles", u.papeis()).build();
        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        return new TokenResponse(encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue());
    }
}

@Bean
JwtEncoder jwtEncoder(@Value("#{environment.JWT_SECRET}") String segredo) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(segredo.getBytes(StandardCharsets.UTF_8)));
}`
    },
    quiz: [
      { p: 'Usuário autenticado sem permissão para a ação recebe:', o: ['401', '403', '404', '500'], c: 1, e: '401 é falta de autenticação; 403 é autenticado, mas sem autorização.' },
      { p: 'Por que responder 404 quando um cliente tenta cancelar pedido de outro?', o: ['Erro de implementação', 'Para não revelar a existência do recurso', 'Porque 403 não existe em REST', 'Para o cliente tentar de novo'], c: 1, e: 'Evita enumeração de ids de outros usuários.' },
      { p: 'Qual vantagem do JWT stateless para escalar a API?', o: ['Tokens não expiram', 'Qualquer instância valida o token sem sessão compartilhada', 'Dispensa HTTPS', 'Dispensa autorização'], c: 1, e: 'Sem sessão no servidor, as instâncias são intercambiáveis atrás do balanceador.' }
    ]
  },
  {
    titulo: 'Testes de integração com Testcontainers e OpenAPI', duracao: '3 h', resumo: 'Banco real nos testes, testes de API ponta a ponta e documentação automática.',
    objetivos: ['Rodar testes contra PostgreSQL real com Testcontainers', 'Usar <code>@DataJpaTest</code> e testes ponta a ponta com <code>RestClient</code>', 'Documentar a API com springdoc-openapi'],
    teoria: `
<h3>Por que banco real</h3>
<p>H2 em modo de compatibilidade não é PostgreSQL: tipos, funções, locks e constraints diferem. O <b>Testcontainers</b> sobe um container Docker descartável por execução de testes. Com Spring Boot 3.1+ e <code>@ServiceConnection</code>, a configuração do <code>DataSource</code> é automática.</p>
<h3>Fatias de teste</h3>
<ul><li><code>@WebMvcTest</code>: só a camada web, serviços mockados. Rápido.</li><li><code>@DataJpaTest</code>: só JPA e repositórios, com Flyway rodando. Ideal para consultas.</li><li><code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code>: aplicação inteira, chamada por HTTP. Poucos testes, fluxos críticos.</li></ul>
<h3>Testes de integração no Maven</h3>
<p>Use o plugin <b>Failsafe</b> para classes <code>*IT</code>: <code>mvn test</code> roda só unidade; <code>mvn verify</code> roda tudo. No CI (Fase 5) é o <code>verify</code> que conta.</p>
<h3>OpenAPI</h3>
<p>O <code>springdoc-openapi-starter-webmvc-ui</code> gera a especificação a partir dos controllers e expõe o Swagger UI. Complemente com <code>@Operation</code> e <code>@ApiResponse</code> nos endpoints importantes e configure o esquema de segurança Bearer.</p>`,
    codigo: [
      { titulo: 'Configuração compartilhada do container', src: String.raw`@TestConfiguration(proxyBeanMethods = false)
public class ContainersConfig {
    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgres() {
        return new PostgreSQLContainer<>("postgres:16-alpine").withReuse(true);
    }
}

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ContainersConfig.class)
class SetorRepositoryIT {
    @Autowired SetorRepository setores;

    @Test
    void constraintImpedeVendidosAcimaDaCapacidade() {
        var setor = SetorEntityMother.pista(10);
        setor.vendidos = 11;
        assertThatThrownBy(() -> setores.saveAndFlush(setor))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}` },
      { titulo: 'Fluxo ponta a ponta', src: String.raw`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(ContainersConfig.class)
class CompraFluxoIT {

    @LocalServerPort int porta;

    @Test
    void organizadorCriaEventoEClienteCompra() {
        var http = RestClient.builder().baseUrl("http://localhost:" + porta).build();
        String tokenOrg = login(http, "org@ticketflow.dev");
        String tokenCli = login(http, "cliente@ticketflow.dev");

        URI evento = http.post().uri("/eventos").header("Authorization", "Bearer " + tokenOrg)
                .body(EventoFixtures.rockNoVale()).retrieve().toBodilessEntity().getHeaders().getLocation();

        var pedido = http.post().uri("/pedidos").header("Authorization", "Bearer " + tokenCli)
                .body(new CriarPedidoRequest(idDe(evento), "Pista", 2, TipoIngresso.INTEIRA, null))
                .retrieve().body(PedidoResponse.class);

        assertThat(pedido.ingressos()).hasSize(2);
        assertThat(pedido.total()).isEqualByComparingTo("440.00"); // 2 x 200 + 10% de taxa
    }
}` }
    ],
    exercicio: {
      titulo: 'Rede de testes completa e Swagger',
      enunciado: `<ol><li>Adicione Testcontainers, configure o Failsafe e migre o teste de overbooking para <code>OverbookingIT</code> com container.</li>
<li>Escreva <code>@DataJpaTest</code> para as consultas customizadas (incluindo a sem N+1: verifique o número de consultas com <code>Statistics</code> do Hibernate).</li>
<li>Escreva o fluxo ponta a ponta: login, criar evento, comprar, cancelar, conferir lugares liberados.</li>
<li>Adicione springdoc, configure o esquema Bearer e documente erros 401, 403, 409 e 422 em <code>POST /pedidos</code>.</li>
<li>Crie <code>docs/api/ticketflow.http</code> com as requisições do fluxo (extensão REST Client: clique em <b>Send Request</b> acima de cada uma).</li></ol>`,
      dicas: ['Ative <code>spring.jpa.properties.hibernate.generate_statistics=true</code> no profile de teste e leia <code>sessionFactory.getStatistics().getPrepareStatementCount()</code>.', 'No Docker Desktop, o Testcontainers funciona direto. No Linux, seu usuário precisa estar no grupo <code>docker</code>.'],
      solucao: [{ titulo: 'Configuração do OpenAPI', src: String.raw`@Configuration
@SecurityScheme(name = "bearer", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
@OpenAPIDefinition(info = @Info(title = "TicketFlow API", version = "0.2"),
                   security = @SecurityRequirement(name = "bearer"))
class OpenApiConfig {}

@Operation(summary = "Cria um pedido de ingressos")
@ApiResponse(responseCode = "201", description = "Pedido criado")
@ApiResponse(responseCode = "409", description = "Estado incompatível", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
@ApiResponse(responseCode = "422", description = "Setor sem lugares", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
@PostMapping
ResponseEntity<PedidoResponse> criar(...) { ... }

// N+1 verificado no teste
@Test
void listagemUsaUmaConsulta(@Autowired EntityManagerFactory emf) {
    var stats = emf.unwrap(SessionFactory.class).getStatistics();
    stats.clear();
    eventos.proximosComSetores(LocalDateTime.now()).forEach(e -> e.setores.size());
    assertThat(stats.getPrepareStatementCount()).isEqualTo(1);
}` }, { titulo: 'Requisições do fluxo (REST Client)', lang: 'shell', src: String.raw`### variáveis
@base = http://localhost:8080

### 1. login do organizador (copie o token da resposta)
# @name loginOrg
POST {{base}}/auth/token
Content-Type: application/json

{ "email": "org@ticketflow.dev", "senha": "org123" }

### 2. criar evento (usa o token da requisição anterior)
POST {{base}}/eventos
Authorization: Bearer {{loginOrg.response.body.token}}
Content-Type: application/json

{ "nome": "Rock no Vale", "inicio": "2027-03-10T20:00:00", "fim": "2027-03-11T01:00:00",
  "setores": [ { "nome": "Pista", "capacidade": 100, "preco": 200.00 } ] }

### 3. login do cliente
# @name loginCli
POST {{base}}/auth/token
Content-Type: application/json

{ "email": "cliente@ticketflow.dev", "senha": "cli123" }

### 4. comprar
POST {{base}}/pedidos
Authorization: Bearer {{loginCli.response.body.token}}
Content-Type: application/json

{ "eventoId": "COLE-O-ID-DO-EVENTO", "setor": "Pista", "quantidade": 2, "tipo": "INTEIRA" }` }]
    },
    quiz: [
      { p: 'Por que preferir PostgreSQL via Testcontainers a H2 nos testes?', o: ['É mais rápido', 'Garante o mesmo comportamento do banco de produção', 'Não precisa de Docker', 'Dispensa migrations'], c: 1, e: 'Diferenças de dialeto, locks e constraints fazem testes com H2 passarem e produção falhar.' },
      { p: 'Qual fatia de teste é ideal para validar uma consulta JPQL?', o: ['@WebMvcTest', '@DataJpaTest', '@JsonTest', 'Teste de unidade puro'], c: 1, e: 'Carrega só a camada de persistência, com banco real.' },
      { p: 'O plugin Failsafe é usado para:', o: ['Testes de integração na fase verify', 'Compilar Kotlin', 'Gerar o Swagger', 'Formatar código'], c: 0, e: 'Surefire roda testes de unidade; Failsafe roda os *IT no verify.' }
    ]
  },
  {
    titulo: 'Migrando para Spring Boot 4', duracao: '2 h 30', resumo: 'Planeje e execute a migração apoiado nos testes que você construiu.',
    objetivos: ['Planejar uma migração de versão maior com segurança', 'Conhecer as principais mudanças do Spring Boot 4 e Spring Framework 7', 'Usar a suíte de testes como rede de proteção'],
    teoria: `
<h3>Estratégia de migração</h3>
<ol><li><b>Suba primeiro para a última 3.x</b> e zere os avisos de depreciação. A maioria das quebras do 4.0 foi anunciada como depreciação na 3.x.</li>
<li>Garanta <b>suíte verde</b> e boa cobertura dos fluxos críticos (você construiu isso nas aulas anteriores).</li>
<li>Troque a propriedade <code>spring-boot.version</code> no <code>ticketflow-api/pom.xml</code>, compile, corrija imports e starters, rode os testes. Um commit por grupo de correções.</li>
<li>Use ferramentas de migração automática quando ajudarem, como as receitas do OpenRewrite para Spring Boot.</li></ol>
<h3>O que muda (visão geral)</h3>
<ul><li><b>Base</b>: Spring Framework 7, Jakarta EE 11, baseline Java 17 com recomendação de 21 ou 25.</li>
<li><b>Modularização</b>: o autoconfigure foi dividido em módulos menores; alguns starters mudaram de nome. Erros de “classe não encontrada” costumam vir daí.</li>
<li><b>Null safety</b> com anotações JSpecify em todo o portfólio Spring.</li>
<li><b>Resiliência nativa</b>: <code>@Retryable</code> e <code>@ConcurrencyLimit</code> no próprio Spring Framework.</li>
<li><b>Versionamento de API</b> suportado no Spring MVC.</li>
<li><b>Jackson 3</b> como padrão, com mudança de pacotes (<code>tools.jackson</code>).</li>
<li>Clientes HTTP declarativos (<code>@HttpExchange</code>) com configuração simplificada.</li></ul>
<div class="callout"><b>Confira a fonte</b>Antes de migrar, leia o <i>Spring Boot 4.0 Migration Guide</i> e as release notes oficiais no GitHub do projeto. Esta aula dá o mapa; os detalhes exatos estão lá e mudam entre versões menores.</div>`,
    codigo: [
      { titulo: 'Passo 1: última 3.x', lang: 'xml', src: String.raw`<properties>
  <spring-boot.version>3.5.7</spring-boot.version>   <!-- última 3.x disponível -->
</properties>

<!-- Passo 3, depois dos avisos zerados: -->
<properties>
  <spring-boot.version>4.0.0</spring-boot.version>
</properties>` },
      { titulo: 'Passo 2: OpenRewrite (opcional)', lang: 'shell', src: String.raw`./mvnw -U org.openrewrite.maven:rewrite-maven-plugin:run \
  -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-spring:RELEASE \
  -Drewrite.activeRecipes=org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0

git diff --stat     # revise TUDO antes de commitar
./mvnw verify` },
      { titulo: 'Depois: retry nativo do Spring Framework 7', src: String.raw`@Configuration
@EnableResilientMethods
class ResilienciaConfig {}

@Service
class PedidoAppService {
    @Retryable(includes = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, delay = 20, jitter = 10)
    @Transactional
    public Pedido criar(CriarPedidoRequest req) { ... }
}` }
    ],
    exercicio: {
      titulo: 'Migre o TicketFlow',
      enunciado: `<ol><li>Crie a branch <code>migracao-boot4</code>.</li>
<li>Suba para a última 3.x, rode com <code>-Xlint:deprecation</code> e corrija avisos.</li>
<li>Migre para o Boot 4 seguindo o guia oficial. Anote cada erro e a correção em <code>docs/migracao-boot4.md</code>.</li>
<li>Troque o <code>spring-retry</code> pelo retry nativo, se fizer sentido.</li>
<li>Abra um Pull Request para você mesmo, com descrição do que mudou, e só faça o merge com tudo verde. Crie a tag <code>v0.2-api</code>.</li></ol>`,
      dicas: ['Erros de compilação em <code>com.fasterxml.jackson</code> indicam a troca para Jackson 3.', 'Se o OpenRewrite fizer mudanças que você não entende, peça ao mentor para explicar o diff.'],
      solucaoNota: 'A migração depende das versões exatas no momento em que você fizer. Use este modelo para o registro e mande o arquivo para o mentor revisar.',
      solucao: [{ titulo: 'docs/migracao-boot4.md (modelo)', lang: 'shell', src: String.raw`# Migração Spring Boot 3.5 -> 4.0

## Antes
- Testes: 84 unidade, 12 integração, todos verdes
- Avisos de depreciação corrigidos: 7

## Problemas e correções
| Erro | Causa | Correção |
|------|-------|----------|
| ClassNotFound ...autoconfigure... | módulo separado | adicionado starter X |
| pacote com.fasterxml.jackson | Jackson 3 | imports para tools.jackson |

## Depois
- Testes verdes, tempo de inicialização: antes X s, depois Y s
- spring-retry removido em favor de @Retryable nativo` }]
    },
    quiz: [
      { p: 'Qual o primeiro passo recomendado antes de migrar de versão maior?', o: ['Apagar os testes antigos', 'Subir para a última versão menor e resolver depreciações', 'Migrar direto e ver o que quebra em produção', 'Trocar de framework'], c: 1, e: 'Depreciações da última versão menor antecipam as remoções da próxima maior.' },
      { p: 'O que dá segurança para uma migração grande?', o: ['Coragem', 'Uma suíte de testes automatizados confiável', 'Fazer tudo num commit só', 'Desligar o CI'], c: 1, e: 'Testes são a rede de proteção para qualquer mudança estrutural.' },
      { p: 'O Spring Framework 7 trouxe nativamente:', o: ['Suporte a Java 8', 'Anotações de resiliência como <code>@Retryable</code>', 'Remoção do Spring MVC', 'Fim do suporte a JPA'], c: 1, e: 'Retry e limite de concorrência passaram a fazer parte do core.' }
    ]
  }
  ]
});
