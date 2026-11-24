/* Onde cada arquivo vai.
   Modo: n = novo arquivo, e = editar arquivo existente, t = terminal, r = exemplo (não criar).
   Prefixos: D: domínio (main), DT: domínio (test), A: API (main), AT: API (test), AR: recursos da API,
             P: serviço de pagamentos (main), PT: pagamentos (test), PR: recursos de pagamentos. */
C.prefixos = {
  'D:': 'ticketflow-domain/src/main/java/dev/ticketflow/',
  'DT:': 'ticketflow-domain/src/test/java/dev/ticketflow/',
  'DR:': 'ticketflow-domain/src/test/resources/',
  'A:': 'ticketflow-api/src/main/java/dev/ticketflow/',
  'AT:': 'ticketflow-api/src/test/java/dev/ticketflow/',
  'AR:': 'ticketflow-api/src/main/resources/',
  'P:': 'ticketflow-pagamentos/src/main/java/dev/ticketflow/pagamentos/',
  'PT:': 'ticketflow-pagamentos/src/test/java/dev/ticketflow/pagamentos/',
  'PR:': 'ticketflow-pagamentos/src/main/resources/'
};
C.paths = {
  'aula-1-1': {
    c: [['r', '(estrutura de referência)'], ['n', '.vscode/extensions.json'], ['n', '.vscode/settings.json'], ['n', 'pom.xml'], ['n', 'DT:domain/SanidadeTest.java'], ['t', 'Terminal integrado, na raiz do repositório']],
    s: [['n', 'ticketflow-domain/pom.xml'], ['n', 'docs/adr/0001-registrar-decisoes.md']],
    x: [['n', 'README.md', 'Descrição do projeto e glossário'], ['n', '.gitignore', 'Se o GitHub não criou: target/, .idea/, *.class, .DS_Store']]
  },
  'aula-1-2': {
    c: [['n', 'D:domain/evento/Setor.java'], ['n', 'D:domain/evento/CapacidadeEsgotadaException.java'], ['n', 'D:domain/evento/Evento.java', 'A última linha (Clock fixo) é para usar nos testes, não neste arquivo.']],
    s: [['n', 'D:domain/pedido/Ingresso.java', 'Ingresso fica no pacote pedido: package dev.ticketflow.domain.pedido;'], ['n', 'DT:domain/evento/SetorTest.java']],
    x: [['n', 'DT:domain/evento/EventoTest.java', 'Testes de evento no passado e setor duplicado'], ['n', 'DT:domain/pedido/IngressoTest.java', 'Teste do cancelamento duplo']]
  },
  'aula-1-3': {
    c: [['n', 'D:domain/comum/Dinheiro.java'], ['n', 'D:domain/comum/Cpf.java'], ['n', 'DT:domain/comum/ValueObjectsTest.java', 'Coloque os três testes dentro de uma classe ValueObjectsTest.']],
    s: [['n', 'D:domain/comum/Periodo.java']],
    x: [['n', 'DT:domain/comum/PeriodoTest.java', 'Testes de Periodo'], ['e', 'D:domain/evento/Setor.java', 'Adicionar Dinheiro preco e total(int)'], ['e', 'D:domain/evento/Evento.java', 'Trocar a data solta por Periodo']]
  },
  'aula-1-4': {
    c: [['n', 'D:domain/pedido/StatusPedido.java'], ['r', 'Exemplo para estudar', 'Se quiser rodar, cole o método dentro de um teste em StatusPedidoTest.java.'], ['n', 'D:domain/pedido/Pedido.java']],
    s: [['e', 'D:domain/pedido/StatusPedido.java', 'O record Expirado e o novo cancelar vão em StatusPedido.java; o método cancelar(motivo, clock) do final vai em Pedido.java.']],
    x: [['n', 'DT:domain/pedido/StatusPedidoTest.java', 'Todas as transições válidas e inválidas'], ['n', 'DT:domain/pedido/PedidoTest.java', 'Prazo de 48 h para cancelar']]
  },
  'aula-1-5': {
    c: [['n', 'D:domain/relatorio/RelatorioVendas.java', 'O record ItemVendido vai em um arquivo próprio na mesma pasta: ItemVendido.java.'], ['e', 'D:domain/relatorio/RelatorioVendas.java', 'Adicione o record Resumo e o método que usa teeing.']],
    s: [['e', 'D:domain/relatorio/RelatorioVendas.java', 'Novos métodos ocupacao, esgotados e ticketMedio.']],
    x: [['n', 'D:domain/relatorio/ItemVendido.java', 'Record do item vendido'], ['n', 'DT:domain/relatorio/RelatorioVendasTest.java', 'Massa de 3 eventos e 6 setores e os testes'], ['e', 'D:domain/evento/Setor.java', 'Adicionar os getters vendidos() e capacidade()']]
  },
  'aula-1-6': {
    c: [['n', 'DT:domain/evento/SetorConcorrenciaTest.java'], ['e', 'D:domain/evento/Setor.java', 'Adicione o campo lock e substitua o método reservar.'], ['r', 'Alternativa em Setor.java', 'Teste numa branch ou num commit separado para comparar.']],
    s: [['n', 'docs/adr/0002-overbooking.md']],
    x: [['t', 'git tag v0.1-dominio && git push --tags', 'Fim da Fase 1']]
  },
  'aula-2-1': {
    c: [['n', 'D:domain/compra/CompraService.java', 'Versão “antes”, temporária: você vai apagá-la ao fim do exercício.'], ['n', 'D:domain/compra/ComprarIngressos.java', 'Cada interface vai em seu próprio arquivo na mesma pasta: GatewayPagamento.java, Notificador.java, Pedidos.java. O PagSeguroAdapter é só ilustrativo.'], ['r', 'Exemplo de LSP', 'Não precisa criar.']],
    s: [['n', 'DT:domain/compra/ComprarIngressosTest.java', 'Os fakes podem ser classes no mesmo pacote de teste: NotificadorEspiao.java, PedidosEmMemoria.java, GatewayFalso.java.']],
    x: [['n', 'D:domain/compra/GatewayPagamento.java', 'Interface'], ['n', 'D:domain/compra/Notificador.java', 'Interface'], ['n', 'D:domain/compra/Pedidos.java', 'Interface do repositório'], ['n', 'D:domain/compra/Transacao.java', 'record Transacao(String id)'], ['n', 'D:domain/compra/MeioPagamento.java', 'record com token e fábrica pix()']]
  },
  'aula-2-2': {
    c: [['n', 'DT:domain/pedido/PedidoBuilder.java', 'Fica em src/test porque só os testes usam.'], ['n', 'D:domain/preco/CalculadoraPreco.java', 'PrecoBase e ComTaxaConveniencia vão em arquivos próprios: PrecoBase.java e ComTaxaConveniencia.java, mesma pasta.'], ['r', 'Exemplo de Adapter', 'O adaptador real aparece na Fase 4.']],
    s: [['n', 'D:domain/preco/ComTetoDeTaxa.java', 'O teste vai em DT:domain/preco/CalculadoraPrecoTest.java.']],
    x: [['n', 'D:domain/preco/PrecoBase.java', 'Decorado base'], ['n', 'D:domain/preco/ComTaxaConveniencia.java', 'Decorador'], ['n', 'DT:domain/preco/CalculadoraPrecoTest.java', 'Composição nas duas ordens']]
  },
  'aula-2-3': {
    c: [['n', 'D:domain/preco/PoliticaPreco.java', 'Cada record vai em seu arquivo na mesma pasta: Inteira.java, MeiaEntrada.java, LotePromocional.java, Cupom.java (e Comprovante.java).'], ['n', 'D:domain/compra/eventos/PublicadorEventos.java', 'Também na pasta eventos: CompraConfirmada.java e OuvinteCompra.java. Os ouvintes de cada canal ficam em D:domain/compra/notificacao/.']],
    s: [['e', 'D:domain/pedido/Ingresso.java', 'O método estático criar vai em Ingresso.java (crie RegraDePrecoException.java em domain/preco). O teste vai em DT:domain/compra/eventos/PublicadorEventosTest.java.']],
    x: [['n', 'DT:domain/preco/PoliticaPrecoTest.java', 'Um teste por política, em TDD'], ['n', 'DT:domain/compra/eventos/PublicadorEventosTest.java', 'Ouvinte com falha não derruba os outros'], ['e', 'D:domain/compra/ComprarIngressos.java', 'Publicar CompraConfirmada no lugar do Notificador']]
  },
  'aula-2-4': {
    c: [['n', 'DT:domain/compra/ComprarIngressosMockitoTest.java']],
    s: [['n', 'D:domain/compra/CancelarPedido.java', 'O teste do final vai em DT:domain/compra/CancelarPedidoTest.java.']],
    x: [['e', 'pom.xml', 'Adicione mockito-junit-jupiter (scope test) nas dependências do pom raiz'], ['n', 'DT:domain/compra/CancelarPedidoTest.java', 'Um teste por cenário, um commit por ciclo verde']]
  },
  'aula-2-5': {
    c: [['e', 'ticketflow-domain/pom.xml', 'Cole dentro de <build><plugins>…</plugins></build> (crie essas tags se não existirem).'], ['n', 'DT:legado/PedidoServiceLegadoTest.java'], ['n', 'DR:features/compra.feature']],
    s: [['n', 'DT:bdd/CucumberTest.java', 'A classe CompraSteps vai em DT:bdd/CompraSteps.java.']],
    x: [['n', 'D:legado/PedidoServiceLegado.java', 'Código gerado pelo mentor'], ['n', 'DT:bdd/CompraSteps.java', 'Passos do Cucumber'], ['e', 'ticketflow-domain/pom.xml', 'Dependências de teste: cucumber-java, cucumber-junit-platform-engine, junit-platform-suite'], ['t', './mvnw -pl ticketflow-domain org.pitest:pitest-maven:mutationCoverage', 'Relatório em ticketflow-domain/target/pit-reports/index.html (abra com Live Preview ou no navegador)']]
  },
  'aula-3-1': {
    c: [['n', 'ticketflow-api/pom.xml'], ['n', 'A:api/config/DominioConfig.java'], ['n', 'A:api/config/TicketflowProperties.java', 'A classe TicketflowApplication vai em A:TicketflowApplication.java (pacote dev.ticketflow, raiz da API).'], ['n', 'AR:application.yml']],
    s: [['n', 'AT:api/ContextoTest.java']],
    x: [['e', 'pom.xml', 'Adicione <module>ticketflow-api</module>'], ['n', 'A:TicketflowApplication.java', 'Classe principal; rode pelo “Run” acima do main ou pelo Spring Boot Dashboard'], ['n', 'A:api/config/SegurancaTemporariaConfig.java', 'SecurityFilterChain com permitAll até a aula 3.4'], ['n', 'ticketflow-api/src/test/resources/application-test.yml', 'Configuração do profile de teste']]
  },
  'aula-3-2': {
    c: [['n', 'A:api/web/pedido/CriarPedidoRequest.java', 'PedidoResponse vai em PedidoResponse.java na mesma pasta (e IngressoResponse.java).'], ['n', 'A:api/web/pedido/PedidoController.java'], ['n', 'A:api/web/ErrosApi.java']],
    s: [['n', 'AT:api/web/pedido/PedidoControllerTest.java']],
    x: [['n', 'A:api/service/PedidoAppService.java', 'Serviço de aplicação'], ['n', 'A:api/web/evento/EventoController.java', 'Endpoints de evento'], ['n', 'A:api/persistence/PedidosEmMemoriaRepository.java', 'ConcurrentHashMap temporário'], ['n', 'A:api/web/pedido/CancelamentoRequest.java', 'record com motivo']]
  },
  'aula-3-3': {
    c: [['n', 'AR:db/migration/V1__cria_eventos_e_setores.sql', 'Dois sublinhados depois do número: V1__nome.sql.'], ['n', 'A:api/persistence/SetorEntity.java', 'SetorRepository vai em SetorRepository.java na mesma pasta.'], ['e', 'A:api/service/PedidoAppService.java']],
    s: [['n', 'AT:api/OverbookingIT.java', 'Classes terminadas em IT rodam no mvn verify (Failsafe, aula 3.5).']],
    x: [['n', 'AR:db/migration/V2__cria_pedidos_e_ingressos.sql', 'Tabelas de pedido e ingresso'], ['n', 'A:api/persistence/EventoEntity.java', 'Entidade de evento'], ['n', 'A:api/persistence/PedidoEntity.java', 'Entidade de pedido'], ['t', 'docker run -d --name ticketflow-db -e POSTGRES_DB=ticketflow -e POSTGRES_USER=ticketflow -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16', 'PostgreSQL local'], ['e', 'AR:application.yml', 'spring.datasource.* e spring.jpa.hibernate.ddl-auto=validate']]
  },
  'aula-3-4': {
    c: [['n', 'A:api/security/SegurancaConfig.java', 'Apague a SegurancaTemporariaConfig.java da aula 3.1.'], ['e', 'A:api/service/PedidoAppService.java'], ['e', 'AT:api/web/pedido/PedidoControllerTest.java', 'Novo teste no controller de evento: AT:api/web/evento/EventoControllerTest.java.']],
    s: [['n', 'A:api/security/AuthController.java', 'O bean jwtEncoder vai dentro de SegurancaConfig.java.']],
    x: [['n', 'A:api/security/UsuariosTeste.java', 'Usuários em memória com senha BCrypt'], ['n', 'A:api/security/LoginRequest.java', 'record email, senha'], ['n', 'A:api/security/TokenResponse.java', 'record token'], ['n', '.env', 'JWT_SECRET=... (adicione .env ao .gitignore!)'], ['n', '.vscode/launch.json', 'Para rodar com a variável: "envFile": "${workspaceFolder}/.env" (veja o Guia do VS Code)']]
  },
  'aula-3-5': {
    c: [['n', 'AT:api/ContainersConfig.java', 'A classe SetorRepositoryIT vai em AT:api/persistence/SetorRepositoryIT.java.'], ['n', 'AT:api/CompraFluxoIT.java']],
    s: [['n', 'A:api/config/OpenApiConfig.java', 'As anotações @Operation e @ApiResponse vão no PedidoController.java.'], ['n', 'docs/api/ticketflow.http', 'Abra o arquivo e clique em “Send Request” acima de cada requisição.']],
    x: [['n', 'AT:api/persistence/SetorRepositoryIT.java', '@DataJpaTest com container'], ['e', 'ticketflow-api/pom.xml', 'Dependências testcontainers (postgresql, junit-jupiter), springdoc-openapi-starter-webmvc-ui e plugin maven-failsafe-plugin']]
  },
  'aula-3-6': {
    c: [['e', 'ticketflow-api/pom.xml', 'Troque só a propriedade spring-boot.version.'], ['t', 'Terminal integrado, na raiz'], ['n', 'A:api/config/ResilienciaConfig.java', 'A anotação @Retryable nova vai no PedidoAppService.java.']],
    s: [['n', 'docs/migracao-boot4.md']],
    x: [['t', 'git checkout -b migracao-boot4', 'Ou pelo VS Code: clique no nome da branch na barra de status → Create new branch'], ['t', 'git tag v0.2-api && git push --tags', 'Depois do merge']]
  },
  'aula-4-1': {
    c: [['r', '(estrutura de referência)']],
    s: [['n', 'docs/adr/0003-adotar-arquitetura-hexagonal.md']],
    x: [['n', 'docs/arquitetura/dependencias-mvc.png', 'Seu desenho do grafo de dependências (Excalidraw: extensão pomdtr.excalidraw-editor cria arquivos .excalidraw no próprio VS Code)']]
  },
  'aula-4-2': {
    c: [['n', 'D:vendas/application/port/in/ComprarIngressosUseCase.java'], ['n', 'D:vendas/application/port/out/CarregarDisponibilidade.java', 'Uma interface por arquivo, todas em port/out: CarregarDisponibilidade.java, ReservarLugares.java, SalvarPedido.java, PublicarEventos.java.'], ['n', 'D:vendas/application/ComprarIngressosService.java'], ['n', 'A:vendas/infrastructure/config/VendasConfig.java']],
    s: [['n', 'DT:vendas/application/ComprarIngressosServiceTest.java', 'Os fakes ficam em DT:vendas/application/fakes/.']],
    x: [['t', 'Mover pacotes', 'No Explorer, arraste a pasta domain/pedido para vendas/domain: o VS Code pergunta se atualiza os imports; responda sim'], ['e', 'A:api/web/pedido/PedidoController.java', 'Passa a depender de ComprarIngressosUseCase']]
  },
  'aula-4-3': {
    c: [['n', 'A:vendas/infrastructure/persistence/PedidoPersistenceAdapter.java', 'PedidoMapper vai em PedidoMapper.java na mesma pasta.']],
    s: [['n', 'AT:vendas/infrastructure/pagamento/GatewayHttpAdapterTest.java']],
    x: [['n', 'A:vendas/infrastructure/persistence/PedidoJpa.java', 'Entidade JPA (copie e adapte da Fase 3)'], ['n', 'A:vendas/infrastructure/persistence/IngressoJpa.java', 'Entidade JPA'], ['n', 'A:vendas/infrastructure/persistence/PedidoJpaRepository.java', 'Spring Data'], ['n', 'A:vendas/infrastructure/pagamento/GatewayHttpAdapter.java', 'Adaptador HTTP com RestClient'], ['n', 'AT:vendas/infrastructure/persistence/PedidoPersistenceAdapterIT.java', 'Ida e volta com usingRecursiveComparison']]
  },
  'aula-4-4': {
    c: [['n', 'docs/arquitetura/mapa-de-contextos.md', 'Cole dentro de um bloco de código no Markdown.'], ['r', 'Exemplo dos dois modelos', 'Catálogo: D:catalogo/domain/Evento.java; Vendas: D:vendas/domain/EventoAVenda.java']],
    s: [['n', 'docs/event-storming.md']],
    x: [['n', 'docs/glossario-vendas.md', 'Mínimo de 12 termos'], ['t', 'Reorganizar pacotes', 'Crie dev/ticketflow/catalogo, vendas e pagamentos em ticketflow-domain e ticketflow-api e arraste as pastas no Explorer']]
  },
  'aula-4-5': {
    c: [['n', 'D:vendas/domain/RaizAgregado.java', 'Um tipo por arquivo em vendas/domain: EventoDominio.java, IngressoVendido.java, PedidoId.java e Pedido.java (este último substitui o anterior).']],
    s: [['n', 'A:vendas/infrastructure/eventos/SpringPublicarEventos.java', 'LogVendas vai em LogVendas.java na mesma pasta.']],
    x: [['n', 'D:vendas/domain/Disponibilidade.java', 'Agregado novo'], ['n', 'D:vendas/domain/EventoId.java', 'Id tipado'], ['n', 'D:vendas/domain/ClienteId.java', 'Id tipado'], ['n', 'docs/adr/0004-consistencia-pedido-disponibilidade.md', 'Sua decisão de consistência']]
  },
  'aula-4-6': {
    c: [['n', 'AT:ArquiteturaTest.java', 'Pacote dev.ticketflow, para enxergar todos os contextos.'], ['n', 'AT:ModulosTest.java', 'O @ApplicationModuleListener é exemplo: use-o no ouvinte que já existe.'], ['n', 'A:vendas/infrastructure/pagamento/PagamentoAcl.java']],
    s: [['n', 'docs/arquitetura/c4.dsl', 'Para visualizar, use o Structurizr Lite em Docker ou a extensão “Structurizr DSL”.']],
    x: [['e', 'ticketflow-api/pom.xml', 'Dependências archunit-junit5 e spring-modulith-starter-test (test)'], ['n', 'docs/adr/0005-resultado-migracao-clean.md', 'Comparação MVC x limpa'], ['t', 'git tag v0.3-clean && git push --tags', 'Fim da Fase 4']]
  },
  'aula-5-1': {
    c: [['n', 'Dockerfile', 'Na raiz, sem extensão, com D maiúsculo.'], ['n', 'compose.yaml', 'Na raiz.']],
    s: [['e', 'compose.yaml', 'Substitua o serviço api.'], ['n', '.dockerignore', 'Na raiz, começa com ponto.']],
    x: [['t', 'docker compose up --build', 'Ou clique com o botão direito em compose.yaml → Compose Up']]
  },
  'aula-5-2': {
    c: [['n', 'infra/nginx.conf'], ['n', 'A:vendas/infrastructure/agendamento/ExpiracaoPedidosJob.java']],
    s: [['n', 'A:plataforma/web/InstanciaHeaderFilter.java', 'AgendamentoConfig vai em A:plataforma/config/AgendamentoConfig.java; a tabela shedlock numa nova migration em AR:db/migration/.']],
    x: [['e', 'compose.yaml', 'Adicione o serviço nginx'], ['n', 'A:plataforma/config/AgendamentoConfig.java', 'ShedLock'], ['n', 'AR:db/migration/V5__cria_shedlock.sql', 'Use o próximo número livre de migration']]
  },
  'aula-5-3': {
    c: [['n', 'infra/sql/diagnostico.sql', 'Os CREATE INDEX vão numa migration nova, ex.: AR:db/migration/V6__indices_performance.sql (sem CONCURRENTLY dentro do Flyway, ou com flyway executeInTransaction=false).'], ['e', 'AR:application.yml']],
    s: [['n', 'infra/sql/massa-de-dados.sql', 'Rode com: docker compose exec -T postgres psql -U ticketflow ticketflow < infra/sql/massa-de-dados.sql']],
    x: [['n', 'AR:db/migration/V6__indices_performance.sql', 'Índices criados a partir dos planos'], ['n', 'docs/performance.md', 'Antes e depois de cada consulta']]
  },
  'aula-5-4': {
    c: [['n', 'A:plataforma/config/CacheConfig.java', 'CatalogoConsultas vai em A:catalogo/application/CatalogoConsultas.java e CatalogoComandos em A:catalogo/application/CatalogoComandos.java.']],
    s: [['n', 'AT:catalogo/CatalogoCacheIT.java']],
    x: [['e', 'ticketflow-api/pom.xml', 'spring-boot-starter-data-redis e spring-boot-starter-cache'], ['e', 'AT:api/ContainersConfig.java', 'Bean do container Redis'], ['e', 'compose.yaml', 'Serviço redis (se ainda não existir)']]
  },
  'aula-5-5': {
    c: [['n', 'A:vendas/infrastructure/metricas/MetricasVendas.java'], ['e', 'AR:application.yml'], ['n', 'infra/grafana/consultas.promql', 'Referência para montar os painéis.']],
    s: [['e', 'compose.yaml', 'O conteúdo comentado no final vai em infra/prometheus.yml.']],
    x: [['n', 'infra/prometheus.yml', 'Configuração de coleta'], ['n', 'infra/tempo.yaml', 'Configuração mínima do Tempo (peça ao mentor)'], ['n', 'infra/grafana/datasources/datasources.yml', 'Prometheus e Tempo provisionados'], ['e', 'ticketflow-api/pom.xml', 'micrometer-registry-prometheus, micrometer-tracing-bridge-otel, opentelemetry-exporter-otlp, spring-boot-starter-aop']]
  },
  'aula-5-6': {
    c: [['n', 'carga/abertura.js', 'Rode com: docker run --rm -i --network host -e TOKEN=... -e EVENTO=... grafana/k6 run - < carga/abertura.js'], ['n', '.github/workflows/ci.yml', 'O caminho começa com ponto: .github/workflows/.']],
    s: [['e', 'docs/performance.md']],
    x: [['e', 'README.md', 'Badge do CI'], ['t', 'git tag v0.4-infra && git push --tags', 'Fim da Fase 5']]
  },
  'aula-6-1': {
    c: [['n', 'A:vendas/infrastructure/pagamento/PagamentoRemotoAdapter.java', 'Renomeie o adaptador atual para PagamentoLocalAdapter.java (F2 no nome da classe) e adicione o @ConditionalOnProperty.']],
    s: [['n', 'A:vendas/infrastructure/pagamento/PagamentosClient.java', 'PagamentosClientConfig vai em PagamentosClientConfig.java na mesma pasta.']],
    x: [['n', 'docs/adr/0007-extrair-pagamentos.md', 'Motivos da extração'], ['n', 'ticketflow-pagamentos/pom.xml', 'Copie o ticketflow-api/pom.xml e ajuste artifactId e dependências'], ['e', 'pom.xml', '<module>ticketflow-pagamentos</module>'], ['n', 'P:PagamentosApplication.java', 'Classe principal'], ['n', 'P:web/CobrancaController.java', 'POST /cobrancas e /cobrancas/{id}/estorno'], ['n', 'PR:application.yml', 'Porta 8081 e banco próprio'], ['e', 'compose.yaml', 'Serviços pagamentos e pagamentos-db']]
  },
  'aula-6-2': {
    c: [['e', 'A:vendas/infrastructure/pagamento/PagamentoRemotoAdapter.java'], ['e', 'AR:application.yml']],
    s: [['n', 'P:application/CobrancaService.java']],
    x: [['n', 'PR:db/migration/V1__idempotencia.sql', 'Tabela com a chave como PK'], ['e', 'compose.yaml', 'Serviço toxiproxy (ghcr.io/shopify/toxiproxy)'], ['e', 'ticketflow-api/pom.xml', 'resilience4j-spring-boot3'], ['n', 'A:vendas/infrastructure/agendamento/ConciliacaoPagamentosJob.java', 'Concilia pedidos em análise']]
  },
  'aula-6-3': {
    c: [['n', 'A:vendas/infrastructure/mensageria/IngressoVendidoV1.java'], ['n', 'A:notificacoes/NotificacaoConsumer.java', 'Notificações como módulo do monólito (pasta notificacoes).'], ['e', 'compose.yaml', 'Adicione o serviço kafka.']],
    s: [['n', 'AT:notificacoes/NotificacaoIdempotenteIT.java']],
    x: [['e', 'ticketflow-api/pom.xml', 'spring-kafka e testcontainers kafka'], ['n', 'A:notificacoes/EventoProcessado.java', 'Entidade de eventos processados'], ['n', 'AR:db/migration/V7__eventos_processados.sql', 'Tabela de idempotência']]
  },
  'aula-6-4': {
    c: [['n', 'A:vendas/infrastructure/outbox/OutboxPublicarEventos.java', 'OutboxRelay vai em OutboxRelay.java na mesma pasta. Apague o SpringPublicarEventos da aula 4.5.'], ['n', 'A:vendas/infrastructure/saga/SagaCompra.java']],
    s: [['n', 'AR:db/migration/V8__cria_outbox.sql', 'Use o próximo número livre.']],
    x: [['n', 'A:vendas/infrastructure/outbox/OutboxEntry.java', 'Entidade da outbox'], ['n', 'A:vendas/infrastructure/outbox/OutboxRepository.java', 'Consulta FOR UPDATE SKIP LOCKED'], ['n', 'docs/arquitetura/saga-compra.md', 'Diagrama de sequência (Mermaid renderiza no preview do Markdown com a extensão Markdown Preview Mermaid Support)']]
  },
  'aula-6-5': {
    c: [['n', 'A:organizador/PainelOrganizadorProjecao.java'], ['e', 'AR:application.yml'], ['n', 'ticketflow-pagamentos/src/test/resources/contracts/cobranca_aprovada.yml']],
    s: [['e', 'A:vendas/infrastructure/outbox/OutboxPublicarEventos.java', 'O trecho do relay vai em OutboxRelay.java.']],
    x: [['n', 'AR:db/migration/V9__painel_vendas_hora.sql', 'Tabela do read model'], ['n', 'A:organizador/PainelController.java', 'GET /organizador/eventos/{id}/painel'], ['t', 'git tag v0.5-distribuido && git push --tags', 'Fim da Fase 6']]
  },
  'aula-F-1': {
    c: [['n', 'README.md', 'No repositório NOVO do projeto final.']],
    s: [['n', 'docs/backlog.md']],
    x: [['n', 'docs/adr/0001-registrar-decisoes.md', 'No novo repositório'], ['n', 'docs/event-storming.md', 'Resultado do workshop']]
  },
  'aula-F-2': {
    c: [['r', 'Texto para colar no mentor']],
    s: [['n', 'docs/falha-provocada.md']],
    x: []
  },
  'aula-F-3': {
    c: [],
    s: [['n', 'docs/roteiro-video.md']],
    x: [['t', 'git tag v1.0 && git push --tags', 'Entrega final']]
  }
};
