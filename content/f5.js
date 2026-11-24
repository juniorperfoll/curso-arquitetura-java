C.fases.push({
  n: 5, curto: 'Infra e performance', titulo: 'Infraestrutura, performance e observabilidade', semanas: 'Semanas 15 a 18',
  resumo: 'Docker, Compose, Nginx, banco otimizado, cache com Redis, métricas e tracing, testes de carga e pipeline.',
  objetivo: 'Levar o TicketFlow para um servidor e fazê-lo aguentar o pico de abertura de vendas, medindo antes e depois de cada otimização.',
  entrega: 'ambiente em Compose, relatório de performance e pipeline verde (tag v0.4-infra)',
  checklist: [
    'Dockerfile multi-stage com imagem final enxuta e usuário não root',
    '<code>docker compose up</code> sobe API, PostgreSQL, Redis e Nginx numa máquina limpa',
    'Três réplicas da API atrás do Nginx, sem estado em memória',
    'Índices criados a partir de <code>EXPLAIN ANALYZE</code> e pool HikariCP dimensionado',
    'Cache Redis no catálogo de eventos com TTL e invalidação na alteração',
    'Métricas com Micrometer e Prometheus, painel Grafana com p95, taxa de erro e vendas por minuto',
    'Tracing com OpenTelemetry visível no Grafana Tempo ou Jaeger',
    'Teste de carga com linha de base e comparação após otimizações',
    'Pipeline no GitHub Actions: build, testes, análise estática e publicação da imagem'
  ],
  leituras: ['<i>Designing Data-Intensive Applications</i>, Martin Kleppmann: capítulos 1 a 3', '<a href="https://12factor.net/pt_br/">The Twelve-Factor App</a>', 'Documentação do Spring Boot: “Container Images” e “Observability”', '<i>Use The Index, Luke</i> (use-the-index-luke.com)'],
  aulas: [
  {
    titulo: 'Docker e Docker Compose para aplicações Java', duracao: '3 h', resumo: 'Imagens enxutas, multi-stage, configuração por ambiente e o ambiente completo em Compose.',
    objetivos: ['Escrever um Dockerfile multi-stage seguro', 'Configurar a JVM corretamente dentro de containers', 'Orquestrar API, banco e cache com Compose e healthchecks'],
    teoria: `
<h3>Imagem é um artefato imutável</h3>
<p>A mesma imagem roda em dev, homologação e produção; só a <b>configuração</b> muda (variáveis de ambiente, fator III do 12-Factor). Nada de compilar no servidor.</p>
<h3>Multi-stage</h3>
<p>Um estágio com JDK e Maven compila; o estágio final tem só um JRE e o JAR. A imagem cai de ~800 MB para ~200 MB, com menos superfície de ataque. Use camadas do Spring Boot (<code>jarmode=tools extract --layers</code>) para que mudanças de código não invalidem o cache das dependências.</p>
<h3>JVM em containers</h3>
<p>JVMs modernas respeitam os limites do container. Ajuste <code>-XX:MaxRAMPercentage=75</code> em vez de <code>-Xmx</code> fixo. Considere <b>CDS / AOT cache</b> (Java 24+, JEP 483) para inicialização mais rápida.</p>
<h3>Alternativa sem Dockerfile</h3>
<p><code>./mvnw spring-boot:build-image</code> usa Buildpacks e gera uma imagem otimizada sem você escrever Dockerfile. Bom padrão para times; aqui você escreve o Dockerfile para entender o que acontece.</p>`,
    codigo: [
      { titulo: 'Dockerfile', lang: 'shell', src: String.raw`# ---- build ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY ticketflow-domain/pom.xml ticketflow-domain/
COPY ticketflow-api/pom.xml ticketflow-api/
RUN ./mvnw -q dependency:go-offline          # cache de dependências
COPY . .
RUN ./mvnw -q -DskipTests package && \
    java -Djarmode=tools -jar ticketflow-api/target/*.jar extract --layers --launcher --destination /app

# ---- runtime ----
FROM eclipse-temurin:21-jre
RUN useradd --system --uid 1001 app
WORKDIR /app
COPY --from=build /app/dependencies/ ./
COPY --from=build /app/spring-boot-loader/ ./
COPY --from=build /app/snapshot-dependencies/ ./
COPY --from=build /app/application/ ./
USER app
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]` },
      { titulo: 'compose.yaml', lang: 'yaml', src: String.raw`services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ticketflow
      POSTGRES_USER: ticketflow
      POSTGRES_PASSWORD: dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ticketflow"]
      interval: 5s
      retries: 10
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine

  api:
    build: .
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ticketflow
      SPRING_DATASOURCE_USERNAME: ticketflow
      SPRING_DATASOURCE_PASSWORD: dev
      SPRING_DATA_REDIS_HOST: redis
      JWT_SECRET: troque-por-um-segredo-de-32-bytes-ou-mais
    depends_on:
      postgres: { condition: service_healthy }
    deploy:
      replicas: 3

  nginx:
    image: nginx:1.27-alpine
    ports: ["8080:80"]
    volumes: ["./infra/nginx.conf:/etc/nginx/conf.d/default.conf:ro"]
    depends_on: [api]

volumes:
  pgdata:` }
    ],
    exercicio: {
      titulo: 'Containerize o TicketFlow',
      enunciado: `<ol><li>Escreva o Dockerfile multi-stage e compare o tamanho com uma imagem ingênua (<code>FROM eclipse-temurin:21-jdk</code> + <code>COPY *.jar</code>). Use <code>docker images</code>.</li>
<li>Crie o <code>compose.yaml</code> com PostgreSQL e Redis (Nginx entra na próxima aula; por enquanto uma réplica e porta 8080 exposta).</li>
<li>Exponha <code>/actuator/health/readiness</code> e use como healthcheck da API.</li>
<li>Mostre que um clone limpo sobe com <code>docker compose up --build</code> e responde ao fluxo de compra.</li>
<li>Meça o tempo de inicialização. Teste o AOT cache (se estiver no Java 24+) ou o CDS e compare.</li></ol>`,
      dicas: ['Adicione um <code>.dockerignore</code> com <code>target/</code>, <code>.git</code>, <code>.idea</code>: o build fica muito mais rápido.', 'Healthcheck da API: <code>curl -f http://localhost:8080/actuator/health/readiness</code> (instale curl na imagem, ou use o <code>wget</code> da alpine).'],
      solucao: [{ titulo: 'Trecho do serviço api com healthcheck', lang: 'yaml', src: String.raw`  api:
    build: .
    ports: ["8080:8080"]
    environment:
      MANAGEMENT_ENDPOINT_HEALTH_PROBES_ENABLED: "true"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/actuator/health/readiness | grep UP"]
      interval: 10s
      start_period: 40s
      retries: 6` }, { titulo: '.dockerignore', lang: 'shell', src: String.raw`**/target
.git
.idea
*.iml
docs` }]
    },
    quiz: [
      { p: 'Por que usar multi-stage?', o: ['Para compilar mais rápido', 'Para que a imagem final contenha só o necessário para rodar', 'Porque o Docker exige', 'Para usar dois JDKs'], c: 1, e: 'O estágio de build fica para trás; a imagem final é menor e mais segura.' },
      { p: 'Configuração que muda por ambiente deve vir de:', o: ['Recompilar a imagem', 'Variáveis de ambiente ou configuração externa', 'Arquivos editados dentro do container', 'Constantes no código'], c: 1, e: 'Fator III do 12-Factor: uma imagem, várias configurações.' },
      { p: 'Qual opção é preferível para memória da JVM em containers?', o: ['<code>-Xmx</code> fixo igual à RAM do host', '<code>-XX:MaxRAMPercentage</code>', 'Não configurar nunca', '<code>-Xms</code> maior que o limite'], c: 1, e: 'Percentual se adapta ao limite definido para o container.' }
    ]
  },
  {
    titulo: 'Nginx, escala horizontal e aplicações stateless', duracao: '2 h 30', resumo: 'Proxy reverso, balanceamento entre réplicas e o que impede uma aplicação de escalar.',
    objetivos: ['Configurar Nginx como proxy reverso e balanceador', 'Diferenciar escala vertical e horizontal', 'Eliminar estado local que impede escalar'],
    teoria: `
<h3>Escala vertical x horizontal</h3>
<p><b>Vertical</b>: máquina maior. Simples, mas tem teto e é ponto único de falha. <b>Horizontal</b>: mais instâncias atrás de um balanceador. Exige que qualquer instância atenda qualquer requisição: a aplicação precisa ser <b>stateless</b>.</p>
<h3>O que costuma quebrar a escala horizontal</h3>
<ul><li>Sessão HTTP em memória (resolvido com JWT na Fase 3).</li><li>Cache local com dados que mudam (resolvido com Redis, aula 5.4).</li><li>Locks em memória (você já viu: overbooking só se resolve no banco).</li><li>Jobs agendados rodando em todas as instâncias ao mesmo tempo (use ShedLock ou um lock no banco).</li><li>Arquivos gravados no disco local (use armazenamento de objetos).</li></ul>
<h3>Nginx como porta de entrada</h3>
<p>Termina TLS, balanceia (round-robin, <code>least_conn</code>), comprime, limita taxa por IP (<code>limit_req</code>, ótimo para abertura de vendas) e serve estáticos. Em Kubernetes, o mesmo papel é do Ingress ou de um API Gateway.</p>`,
    codigo: [
      { titulo: 'infra/nginx.conf', lang: 'shell', src: String.raw`upstream ticketflow_api {
    least_conn;
    server api:8080;        # o DNS do Compose resolve para todas as réplicas
    keepalive 32;
}

limit_req_zone $binary_remote_addr zone=compras:10m rate=5r/s;

server {
    listen 80;
    gzip on;
    gzip_types application/json;

    location /pedidos {
        limit_req zone=compras burst=10 nodelay;   # protege a abertura de vendas
        proxy_pass http://ticketflow_api;
        include /etc/nginx/proxy_params_ticketflow;
    }

    location / {
        proxy_pass http://ticketflow_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}` },
      { titulo: 'Job agendado seguro com várias instâncias (ShedLock)', src: String.raw`@Scheduled(fixedDelay = 60_000)
@SchedulerLock(name = "expirarPedidos", lockAtMostFor = "PT5M", lockAtLeastFor = "PT30S")
void expirarPedidosNaoPagos() {
    expirarPedidos.executar(Instant.now(clock).minus(Duration.ofMinutes(15)));
}` }
    ],
    exercicio: {
      titulo: 'Três réplicas atrás do Nginx',
      enunciado: `<ol><li>Adicione o Nginx ao Compose e suba 3 réplicas da API (<code>docker compose up --scale api=3</code>).</li>
<li>Adicione um header de resposta <code>X-Instancia</code> com o hostname (um filtro simples) e confirme com <code>curl -i</code> que as respostas vêm de instâncias diferentes.</li>
<li>Implemente o job de expiração de pedidos com ShedLock e prove, pelos logs, que só uma instância o executa a cada minuto.</li>
<li>Configure <code>limit_req</code> e mostre um 503 quando um único IP dispara muitas compras.</li>
<li>Derrube uma réplica (<code>docker stop</code>) durante um laço de requisições e observe o comportamento.</li></ol>`,
      dicas: ['Para o <code>X-Instancia</code>, um <code>OncePerRequestFilter</code> com <code>InetAddress.getLocalHost().getHostName()</code> basta.', 'O <code>limit_req</code> retorna 503 por padrão; use <code>limit_req_status 429;</code> para um status mais correto.'],
      solucao: String.raw`@Component
class InstanciaHeaderFilter extends OncePerRequestFilter {
    private final String host;
    InstanciaHeaderFilter() throws UnknownHostException { host = InetAddress.getLocalHost().getHostName(); }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        res.setHeader("X-Instancia", host);
        chain.doFilter(req, res);
    }
}

// ShedLock com JDBC
@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT10M")
class AgendamentoConfig {
    @Bean LockProvider lockProvider(DataSource ds) {
        return new JdbcTemplateLockProvider(JdbcTemplateLockProvider.Configuration.builder()
                .withJdbcTemplate(new JdbcTemplate(ds)).usingDbTime().build());
    }
}
// migration: CREATE TABLE shedlock(name VARCHAR(64) PRIMARY KEY, lock_until TIMESTAMP, locked_at TIMESTAMP, locked_by VARCHAR(255));`
    },
    quiz: [
      { p: 'O que é obrigatório para escalar horizontalmente sem afinidade de sessão?', o: ['Servidor maior', 'Aplicação stateless', 'Banco em memória', 'Uma réplica só'], c: 1, e: 'Qualquer instância precisa poder atender qualquer requisição.' },
      { p: 'Com 3 réplicas, um <code>@Scheduled</code> sem coordenação executa:', o: ['Uma vez', 'Três vezes, uma por instância', 'Nunca', 'Aleatoriamente'], c: 1, e: 'Cada JVM tem seu agendador; é preciso um lock compartilhado.' },
      { p: 'Para que serve <code>limit_req</code> na rota de compras?', o: ['Comprimir respostas', 'Limitar a taxa de requisições por cliente e proteger o sistema em picos', 'Cache de respostas', 'Autenticar usuários'], c: 1, e: 'Rate limiting na borda evita que poucos clientes esgotem os recursos.' }
    ]
  },
  {
    titulo: 'Banco de dados: índices, consultas e pool de conexões', duracao: '3 h', resumo: 'Leia planos de execução, crie os índices certos e dimensione o HikariCP.',
    objetivos: ['Ler <code>EXPLAIN ANALYZE</code> e identificar varreduras sequenciais', 'Criar índices compostos e parciais adequados', 'Dimensionar o pool de conexões e entender por que mais não é melhor'],
    teoria: `
<h3>Meça antes de otimizar</h3>
<p>Ative <code>pg_stat_statements</code> e descubra quais consultas consomem mais tempo total. Otimizar uma consulta rara e rápida não muda nada.</p>
<h3>Lendo o plano</h3>
<p><code>EXPLAIN (ANALYZE, BUFFERS)</code> mostra o plano real: <code>Seq Scan</code> em tabela grande com filtro seletivo é sinal de índice faltando; compare <i>rows</i> estimadas e reais para ver se as estatísticas estão ruins.</p>
<h3>Índices que importam no TicketFlow</h3>
<ul><li><b>Compostos</b> seguem a ordem dos filtros: <code>(evento_id, nome)</code> para buscar setor.</li><li><b>Parciais</b> para subconjuntos quentes: pedidos <code>CRIADO</code> esperando expiração.</li><li><b>Chaves estrangeiras</b> não ganham índice automático no PostgreSQL.</li></ul>
<p>Cada índice custa escrita e espaço. Índice sem uso é dívida.</p>
<h3>Pool de conexões</h3>
<p>Conexões são caras e o banco tem limite. A fórmula clássica da equipe do PostgreSQL é <code>conexões ≈ (núcleos × 2) + discos efetivos</code>, por instância do banco, somando todas as réplicas da aplicação. Com virtual threads, milhares de requisições disputam poucas conexões: isso é bom, desde que as transações sejam curtas. Configure <code>connection-timeout</code> e monitore a espera por conexão.</p>`,
    codigo: [
      { titulo: 'Diagnóstico e índices', lang: 'sql', src: String.raw`-- consulta do job de expiração
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM pedido WHERE status = 'CRIADO' AND criado_em < now() - interval '15 minutes';

-- antes: Seq Scan on pedido (rows=1.000.000) ... Execution Time: 180 ms
CREATE INDEX CONCURRENTLY ix_pedido_criado_pendente
    ON pedido (criado_em) WHERE status = 'CRIADO';
-- depois: Index Scan using ix_pedido_criado_pendente ... Execution Time: 0.4 ms

-- FK sem índice: o cancelamento busca ingressos do pedido
CREATE INDEX CONCURRENTLY ix_ingresso_pedido ON ingresso (pedido_id);

-- top consultas por tempo total
SELECT query, calls, round(total_exec_time) AS ms_total, round(mean_exec_time,2) AS ms_media
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;` },
      { titulo: 'HikariCP', lang: 'yaml', src: String.raw`spring:
  datasource:
    hikari:
      maximum-pool-size: 10        # por réplica; 3 réplicas = 30 conexões no banco
      minimum-idle: 10
      connection-timeout: 2000     # falhe rápido em vez de enfileirar para sempre
      max-lifetime: 1800000
  jpa:
    open-in-view: false            # não segure conexão durante a renderização da resposta` }
    ],
    exercicio: {
      titulo: 'Massa de dados e otimização guiada por medição',
      enunciado: `<ol><li>Crie um script SQL que gere 500 eventos, 3 mil setores, 1 milhão de pedidos e 2 milhões de ingressos (use <code>generate_series</code>).</li>
<li>Ative <code>pg_stat_statements</code> no Compose, rode o fluxo da API por alguns minutos e liste as 5 consultas mais caras.</li>
<li>Para cada uma, registre o <code>EXPLAIN ANALYZE</code> antes e depois de criar o índice adequado, numa tabela em <code>docs/performance.md</code>.</li>
<li>Desligue <code>open-in-view</code> e corrija o que quebrar.</li></ol>`,
      dicas: ['No Compose: <code>command: postgres -c shared_preload_libraries=pg_stat_statements</code> e depois <code>CREATE EXTENSION pg_stat_statements;</code>.', 'Com <code>open-in-view=false</code>, um <code>LazyInitializationException</code> no controller indica que o DTO precisa ser montado dentro da transação.'],
      solucao: [{ titulo: 'Geração de massa', lang: 'sql', src: String.raw`INSERT INTO evento (id, nome, inicio, fim)
SELECT gen_random_uuid(), 'Evento ' || g, now() + (g || ' days')::interval, now() + (g || ' days')::interval + interval '4 hours'
FROM generate_series(1, 500) g;

INSERT INTO setor (id, evento_id, nome, capacidade, vendidos, preco)
SELECT gen_random_uuid(), e.id, s.nome, 5000, 0, s.preco
FROM evento e CROSS JOIN (VALUES ('Pista', 200), ('Camarote', 600), ('Cadeira', 300)) AS s(nome, preco)
LIMIT 3000;

INSERT INTO pedido (id, cliente_id, evento_id, status, criado_em, total)
SELECT gen_random_uuid(), gen_random_uuid(), (SELECT id FROM evento OFFSET (g % 500) LIMIT 1),
       (ARRAY['CRIADO','PAGO','PAGO','PAGO','CANCELADO'])[1 + g % 5],
       now() - (g % 10000 || ' minutes')::interval, 200
FROM generate_series(1, 1000000) g;` }]
    },
    quiz: [
      { p: 'Qual sinal num plano indica índice faltando numa tabela grande com filtro seletivo?', o: ['Index Only Scan', 'Seq Scan', 'Hash Join', 'Bitmap Heap Scan'], c: 1, e: 'Varrer a tabela toda para devolver poucas linhas é desperdício.' },
      { p: 'Aumentar o pool para 200 conexões por réplica tende a:', o: ['Sempre melhorar', 'Piorar, por contenção no banco', 'Não ter efeito', 'Eliminar locks'], c: 1, e: 'O banco tem núcleos limitados; conexões demais competem entre si.' },
      { p: 'Índice parcial é útil quando:', o: ['Todas as linhas são consultadas igualmente', 'Consultas frequentes miram um subconjunto pequeno e estável', 'A tabela não tem chave primária', 'Nunca'], c: 1, e: 'Ex.: pedidos ainda CRIADOS, que são poucos perto do total.' }
    ]
  },
  {
    titulo: 'Cache com Redis', duracao: '2 h 30', resumo: 'Spring Cache com Redis, TTL, invalidação e o que nunca deve ir para o cache.',
    objetivos: ['Aplicar cache-aside com Spring Cache e Redis', 'Escolher TTL e estratégia de invalidação', 'Reconhecer dados que não podem ser cacheados'],
    teoria: `
<h3>O que cachear no TicketFlow</h3>
<p>O catálogo de eventos é lido milhares de vezes por minuto e muda raramente: candidato perfeito. A <b>disponibilidade</b> de lugares muda a cada compra e precisa ser exata no momento de vender: <b>não</b> cacheie a decisão de venda. Você pode cachear uma <i>exibição</i> aproximada (“poucos lugares”) com TTL curto, deixando a verificação real no banco.</p>
<h3>Padrões</h3>
<ul><li><b>Cache-aside</b> (o mais comum): lê do cache; se faltar, lê do banco e grava no cache.</li><li><b>Write-through</b>: grava no cache e no banco juntos.</li><li><b>Invalidação</b>: ao alterar o evento, remova a chave (<code>@CacheEvict</code>).</li></ul>
<h3>Cuidados</h3>
<p>Serialize como JSON (não Java serialization), defina TTL sempre, prefixe chaves com versão para mudanças de formato, e proteja contra <i>cache stampede</i> (muitos misses simultâneos da mesma chave) com <code>sync = true</code>.</p>`,
    codigo: [
      { titulo: 'Configuração e uso', src: String.raw`@Configuration
@EnableCaching
class CacheConfig {
    @Bean
    RedisCacheManagerBuilderCustomizer caches() {
        var json = RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer());
        return b -> b
            .withCacheConfiguration("eventos-v1", RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10)).serializeValuesWith(json))
            .withCacheConfiguration("vitrine-v1", RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofSeconds(5)).serializeValuesWith(json));
    }
}

@Service
class CatalogoConsultas {
    @Cacheable(cacheNames = "eventos-v1", key = "#id", sync = true)
    public EventoDetalhe detalhe(UUID id) { return repositorio.detalhe(id).orElseThrow(); }
}

@Service
class CatalogoComandos {
    @CacheEvict(cacheNames = "eventos-v1", key = "#cmd.id()")
    @Transactional
    public void atualizar(AtualizarEventoCommand cmd) { ... }
}` }
    ],
    exercicio: {
      titulo: 'Cache do catálogo com prova de ganho',
      enunciado: `<ol><li>Adicione <code>spring-boot-starter-data-redis</code> e configure o cache do detalhe do evento.</li>
<li>Invalide ao atualizar o evento e escreva um teste de integração (Testcontainers com Redis) que prova: primeira leitura vai ao banco, segunda não, depois da atualização vai de novo.</li>
<li>Crie a “vitrine” com disponibilidade aproximada e TTL de 5 segundos, deixando claro na resposta que é aproximada.</li>
<li>Meça a latência do <code>GET /eventos/{id}</code> com e sem cache (100 requisições) e registre em <code>docs/performance.md</code>.</li></ol>`,
      dicas: ['Para provar que não foi ao banco, use um <code>@MockitoSpyBean</code> no repositório e <code>verify(repo, times(1))</code>.', 'Redis no Testcontainers: <code>new GenericContainer&lt;&gt;("redis:7-alpine").withExposedPorts(6379)</code> com <code>@ServiceConnection(name = "redis")</code>.'],
      solucao: String.raw`@SpringBootTest
@Import(ContainersConfig.class)
class CatalogoCacheIT {

    @Autowired CatalogoConsultas consultas;
    @Autowired CatalogoComandos comandos;
    @MockitoSpyBean EventoRepository repositorio;

    @Test
    void cacheiaEInvalida() {
        UUID id = criarEvento();
        consultas.detalhe(id);
        consultas.detalhe(id);
        verify(repositorio, times(1)).detalhe(id);

        comandos.atualizar(new AtualizarEventoCommand(id, "Novo título"));
        consultas.detalhe(id);
        verify(repositorio, times(2)).detalhe(id);
    }
}`
    },
    quiz: [
      { p: 'Qual dado NÃO deve ser lido do cache na decisão de venda?', o: ['Descrição do evento', 'Fotos', 'Disponibilidade exata de lugares', 'Nome do local'], c: 2, e: 'Disponibilidade muda a cada compra; a decisão precisa do valor atual no banco.' },
      { p: 'Para que serve <code>sync = true</code> no <code>@Cacheable</code>?', o: ['Gravar em disco', 'Evitar que muitas threads recalculem a mesma chave ao mesmo tempo nesta instância', 'Sincronizar réplicas do Redis', 'Desligar o TTL'], c: 1, e: 'Mitiga cache stampede localmente.' },
      { p: 'Por que versionar o nome do cache (<code>eventos-v1</code>)?', o: ['Estética', 'Para que uma mudança no formato do objeto não leia dados antigos incompatíveis', 'Exigência do Redis', 'Para ordenar chaves'], c: 1, e: 'Trocar para v2 após mudar o DTO evita erros de desserialização.' }
    ]
  },
  {
    titulo: 'Observabilidade: logs, métricas e traces', duracao: '3 h 30', resumo: 'Micrometer, Prometheus, Grafana e OpenTelemetry para enxergar o sistema em produção.',
    objetivos: ['Emitir logs estruturados com correlação', 'Criar métricas de negócio e técnicas com Micrometer', 'Visualizar p95, taxa de erro e traces num painel'],
    teoria: `
<h3>Os três pilares</h3>
<ul><li><b>Logs</b>: o que aconteceu, com contexto. Estruturados (JSON) para busca; com <code>traceId</code> para correlação.</li><li><b>Métricas</b>: números agregados no tempo. Baratas e boas para alertas.</li><li><b>Traces</b>: o caminho de uma requisição por componentes, com a duração de cada trecho.</li></ul>
<h3>Métricas que importam (método RED)</h3>
<p><b>R</b>ate (requisições por segundo), <b>E</b>rrors (taxa de erro), <b>D</b>uration (latência em percentis: p50, p95, p99). Média esconde o problema: se o p99 da compra é 4 s, 1 em cada 100 compradores sofre.</p>
<h3>Métricas de negócio</h3>
<p>Ingressos vendidos por minuto, pedidos expirados, pagamentos recusados por motivo. Elas mostram problemas que métricas técnicas não mostram (ex.: o gateway passou a recusar 30% dos cartões).</p>
<h3>Stack</h3>
<p>Spring Boot Actuator + Micrometer expõem <code>/actuator/prometheus</code>; o Prometheus coleta; o Grafana mostra. Para traces, Micrometer Tracing com OpenTelemetry exporta via OTLP para Tempo ou Jaeger. Desde o Boot 3.4 há logs estruturados nativos (<code>logging.structured.format.console=ecs</code>).</p>`,
    codigo: [
      { titulo: 'Métricas de negócio', src: String.raw`@Component
class MetricasVendas {
    private final Counter vendidos;
    private final MeterRegistry registry;

    MetricasVendas(MeterRegistry registry) {
        this.registry = registry;
        this.vendidos = Counter.builder("ticketflow.ingressos.vendidos")
                .description("Ingressos vendidos").register(registry);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void aoVender(IngressoVendido e) {
        vendidos.increment();
        registry.counter("ticketflow.ingressos.vendidos.setor", "setor", e.setor()).increment();
    }

    void pagamentoRecusado(MotivoRecusa motivo) {
        registry.counter("ticketflow.pagamentos.recusados", "motivo", motivo.name()).increment();
    }
}

// Latência de um trecho específico
@Observed(name = "ticketflow.compra", contextualName = "comprar-ingressos")
public PedidoCriado executar(ComprarIngressosCommand cmd) { ... }` },
      { titulo: 'application.yml de observabilidade', lang: 'yaml', src: String.raw`management:
  endpoints.web.exposure.include: health,info,prometheus
  metrics.distribution:
    percentiles-histogram:
      http.server.requests: true
  tracing.sampling.probability: 1.0      # em produção, algo como 0.1
  otlp.tracing.endpoint: http://tempo:4318/v1/traces
logging:
  structured.format.console: ecs` },
      { titulo: 'PromQL para o painel', lang: 'shell', src: String.raw`# p95 da compra
histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket{uri="/pedidos",method="POST"}[5m])))

# taxa de erro 5xx
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))

# vendas por minuto
sum(rate(ticketflow_ingressos_vendidos_total[1m])) * 60` }
    ],
    exercicio: {
      titulo: 'Painel da abertura de vendas',
      enunciado: `<ol><li>Adicione Prometheus, Grafana e Tempo ao Compose (há imagens oficiais; provisione a fonte de dados do Grafana por arquivo).</li>
<li>Crie as métricas de negócio da aula e a observação <code>ticketflow.compra</code>.</li>
<li>Monte um painel com: p95 de <code>POST /pedidos</code>, taxa de erro, vendas por minuto, recusas por motivo, conexões ativas do Hikari.</li>
<li>Ative logs estruturados e mostre que o <code>traceId</code> do log leva ao trace no Tempo.</li>
<li>Crie um alerta no Grafana: p95 da compra acima de 800 ms por 5 minutos.</li></ol>`,
      dicas: ['Métrica do Hikari: <code>hikaricp_connections_active</code> e <code>hikaricp_connections_pending</code>.', 'Exporte o JSON do painel para <code>infra/grafana/</code> e versiona no Git.'],
      solucao: [{ titulo: 'Trecho do compose para observabilidade', lang: 'yaml', src: String.raw`  prometheus:
    image: prom/prometheus:v2.55.0
    volumes: ["./infra/prometheus.yml:/etc/prometheus/prometheus.yml:ro"]
    ports: ["9090:9090"]

  tempo:
    image: grafana/tempo:2.6.1
    command: ["-config.file=/etc/tempo.yaml"]
    volumes: ["./infra/tempo.yaml:/etc/tempo.yaml:ro"]

  grafana:
    image: grafana/grafana:11.3.0
    ports: ["3000:3000"]
    volumes: ["./infra/grafana:/etc/grafana/provisioning"]

# infra/prometheus.yml
# scrape_configs:
#   - job_name: ticketflow
#     metrics_path: /actuator/prometheus
#     dns_sd_configs: [{ names: ["api"], type: A, port: 8080 }]` }]
    },
    quiz: [
      { p: 'Por que acompanhar p95 em vez da média de latência?', o: ['É mais fácil de calcular', 'A média esconde a cauda de requisições lentas', 'O Prometheus não calcula média', 'Por convenção apenas'], c: 1, e: 'Percentis mostram a experiência dos usuários mais afetados.' },
      { p: 'Para que serve o <code>traceId</code> no log?', o: ['Autenticação', 'Correlacionar logs de uma mesma requisição com o trace', 'Ordenar logs', 'Comprimir logs'], c: 1, e: 'Com ele você pula do erro no log para o caminho completo da requisição.' },
      { p: 'Qual destas é uma métrica de negócio?', o: ['Uso de CPU', 'Pagamentos recusados por motivo', 'GC pause', 'Threads ativas'], c: 1, e: 'Ela mede o efeito do sistema no negócio, não o recurso técnico.' }
    ]
  },
  {
    titulo: 'Testes de carga e CI/CD', duracao: '3 h', resumo: 'Simule a abertura de vendas com k6 ou Gatling e automatize build, testes e imagem no GitHub Actions.',
    objetivos: ['Escrever um teste de carga realista e definir critérios de aceite', 'Comparar linha de base e otimizações com números', 'Montar um pipeline de CI com testes, análise e publicação de imagem'],
    teoria: `
<h3>Teste de carga com hipótese</h3>
<p>Defina antes: “com 3 réplicas, a API suporta 2 mil usuários comprando em 60 s com p95 &lt; 800 ms e erro &lt; 1%”. Depois teste. Sem hipótese, você só gera gráficos bonitos.</p>
<h3>Perfis</h3>
<ul><li><b>Carga</b>: volume esperado.</li><li><b>Estresse</b>: aumenta até quebrar, para conhecer o limite.</li><li><b>Pico</b>: sobe de repente (abertura de vendas).</li><li><b>Resistência</b>: carga moderada por horas, para achar vazamentos.</li></ul>
<h3>Pipeline</h3>
<p>Todo push roda: compilação, testes de unidade e integração (Testcontainers funciona no runner do GitHub), análise estática (SonarQube/SonarCloud ou SpotBugs + Checkstyle), varredura de vulnerabilidades da imagem (Trivy), e publicação da imagem no registry só na branch principal. O pipeline é a definição executável de “pronto”.</p>`,
    codigo: [
      { titulo: 'k6: abertura de vendas', lang: 'java', src: String.raw`// carga/abertura.js  (JavaScript do k6)
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    abertura: { executor: 'ramping-arrival-rate', startRate: 10, timeUnit: '1s',
      preAllocatedVUs: 500, stages: [ { target: 300, duration: '20s' }, { target: 300, duration: '40s' } ] },
  },
  thresholds: { http_req_failed: ['rate<0.01'], 'http_req_duration{name:compra}': ['p(95)<800'] },
};

export default function () {
  const body = JSON.stringify({ eventoId: __ENV.EVENTO, setor: 'Pista', quantidade: 2, tipo: 'INTEIRA' });
  const r = http.post('http://localhost:8080/pedidos', body, {
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + __ENV.TOKEN },
    tags: { name: 'compra' },
  });
  check(r, { 'criado ou esgotado': (x) => x.status === 201 || x.status === 422 });
}` },
      { titulo: '.github/workflows/ci.yml', lang: 'yaml', src: String.raw`name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: maven }
      - name: Testes (unidade + integração + ArchUnit)
        run: ./mvnw -B verify
      - name: Testes de mutação no domínio
        run: ./mvnw -B -pl ticketflow-domain org.pitest:pitest-maven:mutationCoverage
      - name: Imagem
        run: docker build -t ghcr.io/${'$'}{{ github.repository }}:${'$'}{{ github.sha }} .
      - name: Vulnerabilidades
        uses: aquasecurity/trivy-action@0.28.0
        with: { image-ref: 'ghcr.io/${'$'}{{ github.repository }}:${'$'}{{ github.sha }}', severity: 'CRITICAL,HIGH', exit-code: '1' }
      - name: Publicar
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${'$'}{{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${'$'}{{ github.actor }} --password-stdin
          docker push ghcr.io/${'$'}{{ github.repository }}:${'$'}{{ github.sha }}` }
    ],
    exercicio: {
      titulo: 'Relatório de performance e pipeline verde',
      enunciado: `<ol><li>Escreva a hipótese de carga em <code>docs/performance.md</code>.</li>
<li>Rode o teste de pico com 1 réplica, sem cache e sem índices: essa é a linha de base. Salve os números.</li>
<li>Repita com: índices, depois cache, depois 3 réplicas. Uma linha por cenário: req/s, p95, p99, erros, overbooking (deve ser zero sempre).</li>
<li>Monte o pipeline do GitHub Actions e faça-o ficar verde. Adicione o badge no README.</li>
<li>Crie a tag <code>v0.4-infra</code>.</li></ol>`,
      dicas: ['Depois de cada teste, confira no banco que <code>vendidos &lt;= capacidade</code> em todos os setores.', 'Rode a carga de outra máquina ou limite a CPU dos containers; senão o gerador de carga disputa CPU com a API.'],
      solucao: [{ titulo: 'Modelo de docs/performance.md', lang: 'shell', src: String.raw`# Performance — abertura de vendas

Hipótese: 3 réplicas suportam 300 compras/s por 60 s com p95 < 800 ms e erro < 1%.
Máquina: 8 vCPU, 16 GB. API limitada a 1 vCPU / 1 GB por réplica.

| Cenário                 | req/s | p95 (ms) | p99 (ms) | erros | overbooking |
|-------------------------|-------|----------|----------|-------|-------------|
| Base (1 réplica)        |       |          |          |       | 0           |
| + índices               |       |          |          |       | 0           |
| + cache catálogo        |       |          |          |       | 0           |
| + 3 réplicas + Nginx    |       |          |          |       | 0           |

Gargalo observado: ...
Próximo passo: ...` }]
    },
    quiz: [
      { p: 'O que deve existir antes de rodar um teste de carga?', o: ['Um painel bonito', 'Uma hipótese com critérios de aceite mensuráveis', 'Microsserviços', 'Kubernetes'], c: 1, e: 'Sem critério, não há como dizer se passou.' },
      { p: 'Qual perfil simula a abertura de vendas de um show?', o: ['Resistência', 'Pico', 'Fumaça', 'Unidade'], c: 1, e: 'Subida brusca de usuários num curto intervalo.' },
      { p: 'No pipeline, quando publicar a imagem no registry?', o: ['Em todo push de qualquer branch', 'Só depois de testes e verificações passarem, na branch principal', 'Antes dos testes', 'Manualmente sempre'], c: 1, e: 'A imagem publicada deve ser um artefato verificado.' }
    ]
  }
  ]
});
