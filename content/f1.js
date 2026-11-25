C.intro = `
<h3>Como este curso funciona</h3>
<p>Este curso foi escrito para o seu cérebro, não para uma prova. A ideia vem dos livros da série <i>Use a Cabeça!</i> e do jeito prático dos livros da Casa do Código: você aprende melhor quando há uma história, quando precisa pensar antes de ver a resposta, quando vê o mesmo conceito de vários ângulos e quando coloca a mão no código. Por isso cada aula tem as mesmas peças, sempre na mesma ordem:</p>
<div class="table-wrap"><table><thead><tr><th>Peça</th><th>Para que serve</th></tr></thead><tbody>
<tr><td><b>Imagine a cena</b></td><td>Uma situação real do TicketFlow que mostra por que o assunto importa, antes de qualquer definição.</td></tr>
<tr><td><b>Assista</b></td><td>Um ou dois vídeos do YouTube sobre o tema. Veja antes da teoria para ter uma visão geral ou depois para reforçar.</td></tr>
<tr><td><b>Arquivos desta aula</b></td><td>O caminho completo e o nome de cada arquivo que você vai criar ou editar no VS Code.</td></tr>
<tr><td><b>Teoria e código comentado</b></td><td>O conceito explicado em linguagem direta, com código Java para estudar e copiar.</td></tr>
<tr><td><b>Aponte seu lápis</b></td><td>Uma pergunta para responder no papel antes de seguir. Errar aqui é ótimo: o cérebro guarda melhor o que tentou adivinhar.</td></tr>
<tr><td><b>Não existem perguntas idiotas</b></td><td>As dúvidas que quase todo mundo tem, respondidas sem rodeios.</td></tr>
<tr><td><b>Mão na massa</b></td><td>O exercício no TicketFlow, com dicas e gabarito comentado.</td></tr>
<tr><td><b>Quiz</b></td><td>Três perguntas para conferir se o conceito ficou.</td></tr>
<tr><td><b>Poder do cérebro</b></td><td>Uma reflexão sem resposta certa, ligando o assunto ao seu trabalho.</td></tr>
<tr><td><b>Pontos de bala</b></td><td>O resumo da aula em quatro frases, para revisar em um minuto.</td></tr>
</tbody></table></div>
<p>Quando travar, abra o <b>Mentor</b>: ele conhece a aula aberta, responde dúvidas no mesmo tom do curso e revisa o código que você colar.</p>
<h3>Regras de ouro</h3>
<ol>
<li><b>Um repositório só.</b> Crie <code>ticketflow</code> no GitHub no primeiro dia. Tudo que você fizer no curso vai para lá.</li>
<li><b>Um commit por conceito.</b> Mensagens no imperativo: <code>adiciona value object Dinheiro</code>.</li>
<li><b>Teste primeiro sempre que der.</b> A partir da Fase 2, todo código novo nasce de um teste vermelho.</li>
<li><b>Registre decisões.</b> Cada escolha de arquitetura vira um ADR curto em <code>docs/adr/</code>.</li>
<li><b>Feche a fase com uma tag.</b> <code>v0.1-dominio</code>, <code>v0.2-api</code>, <code>v0.3-clean</code>, <code>v0.4-infra</code>, <code>v0.5-distribuido</code>, <code>v1.0</code>.</li>
</ol>
<h3>Ritmo sugerido</h3>
<div class="table-wrap"><table><thead><tr><th>Dia</th><th>Atividade</th><th>Tempo</th></tr></thead><tbody>
<tr><td>Segunda</td><td>Ler a aula e rodar o código comentado</td><td>1 h 30</td></tr>
<tr><td>Terça</td><td>Exercício da aula no TicketFlow, sem gabarito</td><td>1 h 30</td></tr>
<tr><td>Quarta</td><td>Leitura do livro da fase</td><td>1 h</td></tr>
<tr><td>Quinta</td><td>Itens do checklist da fase</td><td>2 h</td></tr>
<tr><td>Sábado</td><td>Bloco longo: item mais difícil + testes</td><td>2 h 30</td></tr>
<tr><td>Domingo</td><td>Quiz, ADR da semana e revisão com o mentor</td><td>30 min</td></tr>
</tbody></table></div>
<h3>Stack de referência</h3>
<p>Java 21 LTS (tudo aqui roda também no 25), Maven 3.9+, Spring Boot 3.x com migração para o 4, PostgreSQL 16, JUnit 5, AssertJ, Mockito, Testcontainers, Docker, Redis, Kafka ou RabbitMQ, GitHub Actions. IDE: <b>VS Code</b>. Antes da primeira aula, leia o <a href="#vscode">Guia do VS Code</a>: ele mostra a configuração, como criar arquivos e a estrutura de pastas do repositório em cada fase.</p>
`;

C.fases.push({
  n: 1, curto: 'Java moderno e OO', titulo: 'Java moderno e orientação a objetos', semanas: 'Semanas 1 a 3',
  resumo: 'Records, sealed types, Streams, testes e concorrência com virtual threads, modelando o domínio do TicketFlow em Java puro.',
  objetivo: 'Escrever Java idiomático de 2026 e modelar o núcleo do TicketFlow sem nenhum framework. Sem uma base OO firme, DDD e Clean Architecture viram só pastas com nomes bonitos.',
  entrega: 'módulo ticketflow-domain testado (tag v0.1-dominio)',
  checklist: [
    'Projeto Maven multi-módulo criado, com <code>ticketflow-domain</code> e Java 21 configurado',
    'Classes <code>Evento</code>, <code>Setor</code>, <code>Ingresso</code> e <code>Pedido</code> com invariantes protegidas',
    'Value objects <code>Dinheiro</code>, <code>Cpf</code> e <code>Periodo</code> como <code>record</code> com validação no construtor',
    '<code>StatusPedido</code> como <code>sealed interface</code> com transições via pattern matching',
    'Relatório de vendas por setor com Streams (<code>groupingBy</code>)',
    'Simulação de 10 mil compras simultâneas com virtual threads, condição de corrida reproduzida e corrigida',
    'Cobertura de testes acima de 80% no módulo de domínio e <code>mvn verify</code> verde',
    'Tag <code>v0.1-dominio</code> publicada no GitHub'
  ],
  leituras: ['<i>Effective Java</i>, Joshua Bloch, 3ª ed.: itens 1, 2, 10, 11, 15, 17, 18, 64 e 69', 'JEPs 395 (records), 409 (sealed classes), 441 (pattern matching em switch) e 444 (virtual threads)', '<a href="https://exercism.org/tracks/java">Exercism, trilha Java</a>: 10 exercícios por semana'],
  aulas: [
  {
    titulo: 'Ambiente e o projeto TicketFlow', duracao: '2 h', resumo: 'Monte o projeto Maven multi-módulo que vai acompanhar você o curso inteiro.',
    objetivos: ['Configurar JDK 21, Maven e a IDE', 'Criar um projeto Maven multi-módulo com JUnit 5 e AssertJ', 'Entender o domínio do TicketFlow e os termos que usaremos o curso todo'],
    teoria: `
<h3>O domínio que você vai construir</h3>
<p>O <b>TicketFlow</b> vende ingressos para eventos. Um <b>organizador</b> cadastra um <b>evento</b> (show, peça, congresso) com data, local e <b>setores</b> (pista, camarote, cadeira numerada). Cada setor tem <b>capacidade</b> e <b>preço</b>. Um <b>cliente</b> faz um <b>pedido</b> com um ou mais <b>ingressos</b>, paga e recebe os ingressos. Existem meia-entrada, lotes promocionais e cupons. Pedidos podem ser cancelados até certa data.</p>
<p>Esse domínio é pequeno o bastante para caber num curso e rico o bastante para ter regras de verdade: capacidade não pode estourar, preço depende de política, pagamento pode falhar, vendas concorrem entre si na abertura de um show disputado.</p>
<h3>Por que multi-módulo desde o início</h3>
<p>Na Fase 4 você vai separar <b>domínio</b>, <b>aplicação</b> e <b>infraestrutura</b>. Começar com um módulo <code>ticketflow-domain</code> sem dependências de framework força a disciplina certa: se o domínio não compila sem Spring, algo está errado. O Maven garante isso pela própria estrutura de dependências.</p>
<h3>Ferramentas mínimas</h3>
<ul>
<li><b>JDK 21</b> (Eclipse Temurin). Confira no terminal com <code>java -version</code>. No Windows, use o instalador .msi do site adoptium.net e marque “Set JAVA_HOME”. No Linux e Mac, o SDKMAN! facilita alternar versões.</li>
<li><b>VS Code</b> com as extensões da tabela abaixo. O arquivo <code>.vscode/extensions.json</code> (código abaixo) faz o VS Code sugerir todas sozinho quando você abrir a pasta.</li>
<li><b>Git</b> e uma conta no GitHub.</li>
<li><b>Maven</b>: não precisa instalar. Você vai usar o <i>Maven Wrapper</i> (<code>mvnw</code>), que baixa a versão certa na primeira execução.</li>
</ul>
<div class="table-wrap"><table><thead><tr><th>Extensão</th><th>ID no Marketplace</th><th>Para quê</th></tr></thead><tbody>
<tr><td>Extension Pack for Java</td><td><code>vscjava.vscode-java-pack</code></td><td>Linguagem, Maven, testes, debug, refatorações</td></tr>
<tr><td>Spring Boot Extension Pack</td><td><code>vmware.vscode-boot-dev-pack</code></td><td>Spring Initializr, Boot Dashboard, ajuda no YAML (Fase 3)</td></tr>
<tr><td>XML</td><td><code>redhat.vscode-xml</code></td><td>Autocompletar e validar o <code>pom.xml</code></td></tr>
<tr><td>YAML</td><td><code>redhat.vscode-yaml</code></td><td><code>application.yml</code>, Compose, CI</td></tr>
<tr><td>Container Tools</td><td><code>ms-azuretools.vscode-containers</code></td><td>Docker e Compose (Fase 5)</td></tr>
<tr><td>REST Client</td><td><code>humao.rest-client</code></td><td>Testar a API com arquivos <code>.http</code> versionados (Fase 3)</td></tr>
<tr><td>Cucumber</td><td><code>CucumberOpen.cucumber-official</code></td><td>Arquivos <code>.feature</code> (Fase 2)</td></tr>
<tr><td>SonarQube for IDE</td><td><code>SonarSource.sonarlint-vscode</code></td><td>Aponta problemas de qualidade enquanto você digita</td></tr>
</tbody></table></div>
<h3>Como criar arquivos e pastas no VS Code</h3>
<p>Em todo o curso, cada bloco de código mostra no topo o <b>caminho completo</b> do arquivo a partir da raiz do repositório e o que fazer com ele: <b>Novo arquivo</b>, <b>Editar arquivo</b>, <b>Terminal</b> ou <b>Exemplo</b> (só para estudar). Para criar:</p>
<ol>
<li>Abra a pasta do repositório: <i>File → Open Folder…</i> e escolha <code>ticketflow</code>. O Explorer (Ctrl+Shift+E) mostra a raiz.</li>
<li>Clique com o botão direito na <b>raiz</b> e escolha <b>New File…</b>.</li>
<li>Cole o <b>caminho completo</b> mostrado no bloco, com barras, por exemplo <code>ticketflow-domain/src/main/java/dev/ticketflow/domain/evento/Setor.java</code>. O VS Code cria todas as pastas que faltam.</li>
<li>Cole o código e salve (Ctrl+S).</li>
</ol>
<p>Use o botão <b>Copiar caminho</b> de cada bloco para não errar nomes. Em Java, a primeira linha <code>package ...;</code> tem que bater com as pastas depois de <code>src/main/java</code> (ou <code>src/test/java</code>): <code>dev/ticketflow/domain/evento</code> ↔ <code>package dev.ticketflow.domain.evento;</code>. Se não bater, o VS Code sublinha em vermelho e oferece a correção com Ctrl+.</p>
<div class="callout info"><b>Glossário do curso</b>Evento, Setor, Ingresso, Pedido, Cliente, Organizador, Lote, Cupom, Meia-entrada. Use exatamente esses nomes no código: isso já é a <i>linguagem ubíqua</i> que você vai estudar no DDD.</div>`,
    codigo: [
      { titulo: 'Estrutura que você terá ao fim desta aula', lang: 'shell', src: String.raw`ticketflow/                       <- pasta aberta no VS Code (raiz do repositório)
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── .mvn/wrapper/                  <- gerado pelo Maven Wrapper
├── docs/
│   └── adr/
│       └── 0001-registrar-decisoes.md
├── ticketflow-domain/
│   ├── pom.xml
│   └── src/
│       ├── main/java/dev/ticketflow/domain/      <- código de produção
│       └── test/java/dev/ticketflow/domain/
│           └── SanidadeTest.java                  <- testes
├── .gitignore
├── mvnw  e  mvnw.cmd
├── pom.xml                        <- pom raiz (agregador)
└── README.md` },
      { titulo: 'Extensões recomendadas', lang: 'json', src: String.raw`{
  "recommendations": [
    "vscjava.vscode-java-pack",
    "vmware.vscode-boot-dev-pack",
    "redhat.vscode-xml",
    "redhat.vscode-yaml",
    "ms-azuretools.vscode-containers",
    "humao.rest-client",
    "CucumberOpen.cucumber-official",
    "SonarSource.sonarlint-vscode"
  ]
}` },
      { titulo: 'Configurações do workspace', lang: 'json', antes: 'Estas configurações valem só para este repositório e vão para o Git, então funcionam igual em qualquer máquina.', src: String.raw`{
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.compile.nullAnalysis.mode": "automatic",
  "java.saveActions.organizeImports": true,
  "editor.formatOnSave": true,
  "editor.rulers": [120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": { "**/target": true },
  "java.test.config": { "vmArgs": ["-XX:+EnableDynamicAgentLoading"] }
}` },
      { titulo: 'pom.xml (raiz)', lang: 'xml', src: String.raw`<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>dev.ticketflow</groupId>
  <artifactId>ticketflow</artifactId>
  <version>0.1.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <modules>
    <module>ticketflow-domain</module>
  </modules>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.junit</groupId>
        <artifactId>junit-bom</artifactId>
        <version>5.11.3</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.assertj</groupId>
      <artifactId>assertj-core</artifactId>
      <version>3.26.3</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>` },
      { titulo: 'Primeiro teste: o projeto respira', lang: 'java', antes: 'Antes de modelar qualquer coisa, garanta que o ciclo <code>mvn verify</code> roda um teste. Isso valida JDK, Maven e JUnit de uma vez.', src: String.raw`package dev.ticketflow.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SanidadeTest {

    @Test
    void projetoCompilaETestaComJava21() {
        // Runtime.version() devolve a versão da JVM que está rodando os testes
        assertThat(Runtime.version().feature()).isGreaterThanOrEqualTo(21);
    }
}` },
      { titulo: 'Comandos do dia a dia', lang: 'shell', src: String.raw`# rode no terminal integrado do VS Code (Ctrl+'), na raiz do repositório
# cria o wrapper (precisa de um Maven instalado só nesta primeira vez)
mvn -N wrapper:wrapper

# no Windows (PowerShell), troque ./mvnw por .\mvnw.cmd

# compila, roda testes e verificações
./mvnw verify

# roda só um teste
./mvnw -pl ticketflow-domain test -Dtest=SanidadeTest` }
    ],
    exercicio: {
      titulo: 'Crie o esqueleto do TicketFlow',
      enunciado: `<ol><li>Crie o repositório <code>ticketflow</code> no GitHub (com README, <code>.gitignore</code> de Java e licença MIT) e clone: no VS Code, Ctrl+Shift+P → <b>Git: Clone</b> → cole a URL → escolha a pasta → <b>Open</b>.</li>
<li>Crie <code>.vscode/extensions.json</code> e <code>.vscode/settings.json</code> (blocos acima). Aceite a sugestão de instalar as extensões recomendadas.</li>
<li>Crie o <code>pom.xml</code> da raiz e o <code>ticketflow-domain/pom.xml</code> (gabarito).</li>
<li>Abra o terminal integrado (Ctrl+') na raiz e gere o Maven Wrapper com o comando do bloco “Terminal”. Se não tiver Maven instalado, peça ao mentor o passo alternativo (baixar o wrapper pronto).</li>
<li>Crie <code>SanidadeTest.java</code> no caminho indicado e rode: clique em <b>Run Test</b> acima do método, ou use o painel <b>Testing</b> (ícone de tubo de ensaio), ou <code>./mvnw verify</code> no terminal.</li>
<li>No <code>README.md</code>, escreva em 5 linhas o que é o TicketFlow e liste o glossário.</li>
<li>Crie <code>docs/adr/0001-registrar-decisoes.md</code> (gabarito). Faça o commit pelo painel <b>Source Control</b> (Ctrl+Shift+G) e dê <b>Sync</b>.</li></ol>`,
      dicas: ['O <code>pom.xml</code> do módulo filho precisa de <code>&lt;parent&gt;</code> apontando para o raiz e só declara <code>artifactId</code>.', 'Se o VS Code não reconhecer o módulo depois de criar o <code>pom.xml</code>, Ctrl+Shift+P → <b>Java: Clean Java Language Server Workspace</b> → Restart.', 'No Windows, troque <code>./mvnw</code> por <code>.\\mvnw.cmd</code> (PowerShell).'],
      solucao: [{ titulo: 'ticketflow-domain/pom.xml', lang: 'xml', src: String.raw`<project>
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>dev.ticketflow</groupId>
    <artifactId>ticketflow</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>ticketflow-domain</artifactId>
  <!-- Nenhuma dependência de produção: o domínio é Java puro. -->
</project>` }, { titulo: 'docs/adr/0001-registrar-decisoes.md', lang: 'shell', src: String.raw`# 1. Registrar decisões de arquitetura

## Contexto
O projeto vai passar por várias mudanças de arquitetura ao longo do curso.

## Decisão
Toda decisão relevante será registrada como ADR numerado em docs/adr.

## Consequências
Fica fácil explicar o porquê de cada escolha; custa alguns minutos por decisão.` }]
    },
    quiz: [
      { p: 'Por que o módulo <code>ticketflow-domain</code> não deve ter dependência de produção?', o: ['Para o build ficar mais rápido', 'Para garantir que as regras de negócio não dependam de frameworks', 'Porque o Maven não permite', 'Para reduzir o tamanho do JAR'], c: 1, e: 'Domínio sem framework é a base da Clean Architecture e da Hexagonal: as regras ficam testáveis e independentes de tecnologia.' },
      { p: 'Para que serve o Maven Wrapper (<code>mvnw</code>)?', o: ['Acelerar a compilação', 'Garantir que todos usem a mesma versão do Maven', 'Substituir o JDK', 'Gerar documentação'], c: 1, e: 'O wrapper baixa a versão de Maven fixada no projeto, o que evita o famoso “na minha máquina funciona”.' },
      { p: 'O que um ADR registra?', o: ['A lista de tarefas da sprint', 'Contexto, decisão e consequências de uma escolha de arquitetura', 'O manual do usuário', 'O histórico de commits'], c: 1, e: 'ADR é curto e focado no porquê da decisão e nos seus trade-offs.' }
    ]
  },
  {
    titulo: 'Orientação a objetos de verdade', duracao: '3 h', resumo: 'Encapsulamento, invariantes, composição e interfaces aplicados a Evento e Setor.',
    objetivos: ['Distinguir objeto anêmico de objeto com comportamento', 'Proteger invariantes no construtor e nos métodos', 'Preferir composição a herança e usar interfaces como contrato'],
    teoria: `
<h3>Objeto anêmico x objeto rico</h3>
<p>Um <b>objeto anêmico</b> é um saco de getters e setters; as regras ficam espalhadas em <i>services</i>. Qualquer código pode fazer <code>setor.setVendidos(9999)</code> e estourar a capacidade. Um <b>objeto rico</b> expõe <i>comportamento</i> (<code>setor.reservar(2)</code>) e se recusa a entrar num estado inválido.</p>
<h3>Invariantes</h3>
<p>Invariante é uma regra que precisa ser verdadeira <b>sempre</b>, do nascimento à morte do objeto. Exemplos do TicketFlow:</p>
<ul><li>Um setor nunca tem mais vendidos do que a capacidade.</li><li>Um evento sempre tem nome e data futura no momento da criação.</li><li>Capacidade é maior que zero.</li></ul>
<p>Proteja invariantes em dois lugares: no <b>construtor</b> (o objeto já nasce válido) e em cada <b>método que muda estado</b>. Lance exceções de domínio com mensagens claras.</p>
<h3>Composição sobre herança</h3>
<p>Herança cria acoplamento forte: a subclasse depende dos detalhes da superclasse. Um <code>SetorVip extends Setor</code> parece natural até aparecer “setor VIP com meia-entrada” e “setor numerado VIP”. Prefira compor: o setor <i>tem</i> uma política de preço e <i>tem</i> um tipo de assento.</p>
<h3>Interfaces como contrato</h3>
<p>Interface diz <i>o que</i> se faz, não <i>como</i>. Quando o domínio precisa de algo externo (relógio, gerador de id), defina uma interface no domínio. Isso deixa o código testável e é a semente do Princípio da Inversão de Dependência.</p>
<div class="callout"><b>Armadilha comum</b>Gerar getters e setters para tudo por reflexo. Comece sem setters. Crie apenas os getters que algum teste ou caso de uso realmente precisa.</div>`,
    codigo: [
      { titulo: 'Setor.java — objeto que protege a si mesmo', src: String.raw`package dev.ticketflow.domain.evento;

public class Setor {

    private final String nome;
    private final int capacidade;
    private int vendidos;

    public Setor(String nome, int capacidade) {
        if (nome == null || nome.isBlank())
            throw new IllegalArgumentException("Setor precisa de nome");
        if (capacidade <= 0)
            throw new IllegalArgumentException("Capacidade deve ser positiva");
        this.nome = nome;
        this.capacidade = capacidade;
    }

    /** Comportamento, não setter: a regra mora aqui. */
    public void reservar(int quantidade) {
        if (quantidade <= 0)
            throw new IllegalArgumentException("Quantidade deve ser positiva");
        if (quantidade > disponiveis())
            throw new CapacidadeEsgotadaException(nome, disponiveis(), quantidade);
        vendidos += quantidade;
    }

    public void liberar(int quantidade) {
        if (quantidade <= 0 || quantidade > vendidos)
            throw new IllegalArgumentException("Liberação inválida");
        vendidos -= quantidade;
    }

    public int disponiveis() { return capacidade - vendidos; }
    public String nome() { return nome; }
    public boolean esgotado() { return disponiveis() == 0; }
}` },
      { titulo: 'Exceção de domínio com mensagem útil', src: String.raw`public class CapacidadeEsgotadaException extends RuntimeException {
    public CapacidadeEsgotadaException(String setor, int disponiveis, int pedidos) {
        super("Setor %s tem %d lugares; pedido de %d".formatted(setor, disponiveis, pedidos));
    }
}` },
      { titulo: 'Interface no domínio: o relógio', antes: 'Testar “a data do evento precisa ser futura” com <code>LocalDateTime.now()</code> espalhado deixa os testes frágeis. Use <code>java.time.Clock</code> injetado:', src: String.raw`public class Evento {
    private final String nome;
    private final LocalDateTime data;
    private final List<Setor> setores = new ArrayList<>();

    public Evento(String nome, LocalDateTime data, Clock clock) {
        if (!data.isAfter(LocalDateTime.now(clock)))
            throw new IllegalArgumentException("Evento precisa ser no futuro");
        this.nome = nome;
        this.data = data;
    }

    public void adicionarSetor(Setor setor) {
        boolean repetido = setores.stream().anyMatch(s -> s.nome().equals(setor.nome()));
        if (repetido) throw new IllegalArgumentException("Setor duplicado: " + setor.nome());
        setores.add(setor);
    }

    /** Devolve cópia imutável: ninguém altera a lista por fora. */
    public List<Setor> setores() { return List.copyOf(setores); }
}

// No teste, o tempo é fixo e previsível:
Clock fixo = Clock.fixed(Instant.parse("2026-01-10T12:00:00Z"), ZoneOffset.UTC);` }
    ],
    exercicio: {
      titulo: 'Modele Evento, Setor e Ingresso com testes',
      enunciado: `<p><code>Setor</code> e <code>Evento</code> ficam no pacote <code>dev.ticketflow.domain.evento</code>; <code>Ingresso</code> fica em <code>dev.ticketflow.domain.pedido</code>. Os caminhos exatos estão em “Arquivos desta aula”, no topo.</p><ol>
<li>Implemente <code>Setor</code> e <code>Evento</code> como acima, sem setters.</li>
<li>Crie <code>Ingresso</code> com: id (<code>UUID</code>), nome do setor, nome do titular. Ingresso nasce <i>ativo</i> e pode ser <code>cancelar()</code>; cancelar duas vezes lança exceção.</li>
<li>Escreva testes para: capacidade zero, reserva acima do disponível, liberação maior que vendidos, setor duplicado, evento no passado (usando <code>Clock.fixed</code>), cancelamento duplo.</li>
<li>Nomeie os testes como frases: <code>naoReservaAlemDaCapacidade()</code>.</li></ol>`,
      dicas: ['Use <code>assertThatThrownBy(() -> setor.reservar(11)).isInstanceOf(CapacidadeEsgotadaException.class).hasMessageContaining("10")</code>.', 'Para o ingresso, um <code>boolean ativo</code> privado basta por enquanto. Na aula 1.4 você troca por um tipo selado.'],
      solucao: [{ titulo: 'Ingresso.java', src: String.raw`public class Ingresso {
    private final UUID id = UUID.randomUUID();
    private final String setor;
    private final String titular;
    private boolean ativo = true;

    public Ingresso(String setor, String titular) {
        this.setor = Objects.requireNonNull(setor);
        if (titular == null || titular.isBlank())
            throw new IllegalArgumentException("Ingresso precisa de titular");
        this.titular = titular;
    }

    public void cancelar() {
        if (!ativo) throw new IllegalStateException("Ingresso " + id + " já cancelado");
        ativo = false;
    }

    public boolean ativo() { return ativo; }
    public UUID id() { return id; }
}` }, { titulo: 'SetorTest.java', src: String.raw`class SetorTest {

    @Test
    void naoReservaAlemDaCapacidade() {
        var pista = new Setor("Pista", 10);
        pista.reservar(8);
        assertThatThrownBy(() -> pista.reservar(3))
            .isInstanceOf(CapacidadeEsgotadaException.class)
            .hasMessageContaining("2 lugares");
        assertThat(pista.disponiveis()).isEqualTo(2); // estado não mudou
    }

    @Test
    void naoAceitaCapacidadeZero() {
        assertThatThrownBy(() -> new Setor("Pista", 0))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void liberaLugaresReservados() {
        var pista = new Setor("Pista", 10);
        pista.reservar(4);
        pista.liberar(4);
        assertThat(pista.disponiveis()).isEqualTo(10);
    }
}` }]
    },
    quiz: [
      { p: 'Qual opção protege melhor a regra “vendidos ≤ capacidade”?', o: ['<code>setVendidos(int)</code> com comentário de alerta', 'Validação no controller', 'Método <code>reservar(int)</code> que valida e lança exceção', 'Constraint só no banco'], c: 2, e: 'A regra deve morar no objeto dono do dado. Banco e controller são defesas extras, não a principal.' },
      { p: 'Por que devolver <code>List.copyOf(setores)</code>?', o: ['Performance', 'Para que quem chama não altere a lista interna e burle as invariantes', 'Porque <code>ArrayList</code> não é serializável', 'Para ordenar a lista'], c: 1, e: 'Vazar a coleção interna permite <code>evento.setores().add(...)</code> sem passar pela validação de duplicidade.' },
      { p: 'Qual o principal ganho de injetar <code>Clock</code>?', o: ['Fuso horário automático', 'Testes determinísticos sobre regras de tempo', 'Menos memória', 'Compatibilidade com Java 8'], c: 1, e: 'Com <code>Clock.fixed</code> o “agora” do teste é sempre o mesmo e o teste nunca quebra por causa da data.' }
    ]
  },
  {
    titulo: 'Records, value objects e imutabilidade', duracao: '2 h 30', resumo: 'Modele Dinheiro, Cpf e Periodo como records imutáveis e validados.',
    objetivos: ['Diferenciar entidade de value object', 'Usar records com construtor compacto para validar', 'Trabalhar com dinheiro usando <code>BigDecimal</code> corretamente'],
    teoria: `
<h3>Entidade x value object</h3>
<p>Uma <b>entidade</b> tem identidade que atravessa o tempo: o pedido #123 continua sendo o pedido #123 mesmo quando o status muda. Um <b>value object</b> é definido só pelos seus valores: R$ 50,00 é igual a qualquer outro R$ 50,00. Value objects são <b>imutáveis</b>, comparados por valor e <b>validados na criação</b>.</p>
<h3>Records são feitos para isso</h3>
<p>Um <code>record</code> gera construtor, acessores, <code>equals</code>, <code>hashCode</code> e <code>toString</code> baseados nos componentes. Campos são <code>final</code>. Com o <b>construtor compacto</b> você valida e normaliza sem repetir atribuições.</p>
<h3>Dinheiro nunca é double</h3>
<p><code>0.1 + 0.2</code> em <code>double</code> dá <code>0.30000000000000004</code>. Para valores monetários use <code>BigDecimal</code> com escala fixa (2 casas) e <code>RoundingMode.HALF_EVEN</code> (arredondamento bancário). Compare com <code>compareTo</code>, porque <code>new BigDecimal("1.0").equals(new BigDecimal("1.00"))</code> é <code>false</code>. Normalizar a escala no construtor resolve isso.</p>
<h3>Primitive obsession</h3>
<p>Passar <code>String cpf</code> e <code>BigDecimal preco</code> por todo lado é o cheiro chamado <i>primitive obsession</i>. Um <code>Cpf</code> que só existe se for válido elimina validações duplicadas e torna as assinaturas autoexplicativas: <code>comprar(Cpf, Dinheiro)</code>.</p>
<div class="callout info"><b>Record não é bala de prata</b>Records são ótimos para value objects e DTOs. Para entidades com estado que muda (Pedido, Setor) continue usando classes.</div>`,
    codigo: [
      { titulo: 'Dinheiro.java', src: String.raw`public record Dinheiro(BigDecimal valor) implements Comparable<Dinheiro> {

    public static final Dinheiro ZERO = new Dinheiro(BigDecimal.ZERO);

    public Dinheiro {                       // construtor compacto
        Objects.requireNonNull(valor, "valor");
        if (valor.signum() < 0) throw new IllegalArgumentException("Valor negativo");
        valor = valor.setScale(2, RoundingMode.HALF_EVEN); // normaliza a escala
    }

    public static Dinheiro de(String valor) { return new Dinheiro(new BigDecimal(valor)); }

    public Dinheiro mais(Dinheiro outro) { return new Dinheiro(valor.add(outro.valor)); }
    public Dinheiro vezes(int qtd) { return new Dinheiro(valor.multiply(BigDecimal.valueOf(qtd))); }
    public Dinheiro percentual(int pct) {
        return new Dinheiro(valor.multiply(BigDecimal.valueOf(pct)).divide(BigDecimal.valueOf(100)));
    }

    @Override public int compareTo(Dinheiro o) { return valor.compareTo(o.valor); }
    @Override public String toString() { return "R$ " + valor.toPlainString(); }
}` },
      { titulo: 'Cpf.java — só existe se for válido', src: String.raw`public record Cpf(String numero) {

    public Cpf {
        numero = numero == null ? "" : numero.replaceAll("\\D", ""); // tira pontos e traço
        if (!valido(numero)) throw new IllegalArgumentException("CPF inválido");
    }

    private static boolean valido(String n) {
        if (n.length() != 11 || n.chars().distinct().count() == 1) return false;
        return digito(n, 9) == n.charAt(9) - '0' && digito(n, 10) == n.charAt(10) - '0';
    }

    private static int digito(String n, int pos) {
        int soma = 0;
        for (int i = 0; i < pos; i++) soma += (n.charAt(i) - '0') * (pos + 1 - i);
        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }

    public String formatado() {
        return numero.replaceFirst("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }
}` },
      { titulo: 'Testando igualdade por valor', src: String.raw`@Test
void dinheiroComEscalasDiferentesEhIgual() {
    assertThat(Dinheiro.de("10.0")).isEqualTo(Dinheiro.de("10.00"));
}

@Test
void meiaEntradaDeCemEhCinquenta() {
    assertThat(Dinheiro.de("100").percentual(50)).isEqualTo(Dinheiro.de("50"));
}

@ParameterizedTest
@ValueSource(strings = {"111.111.111-11", "123", "", "529.982.247-26x"})
void rejeitaCpfInvalido(String entrada) {
    assertThatThrownBy(() -> new Cpf(entrada)).isInstanceOf(IllegalArgumentException.class);
}` }
    ],
    exercicio: {
      titulo: 'Crie Periodo e refatore Evento',
      enunciado: `<ol><li>Implemente <code>Dinheiro</code> e <code>Cpf</code> com os testes acima (adicione <code>junit-jupiter-params</code> se precisar).</li>
<li>Crie <code>record Periodo(LocalDateTime inicio, LocalDateTime fim)</code>: fim depois do início; método <code>contem(LocalDateTime)</code>; método <code>duracao()</code> devolvendo <code>Duration</code>.</li>
<li>Refatore <code>Setor</code> para ter um <code>Dinheiro preco</code> e <code>Evento</code> para ter um <code>Periodo</code> no lugar de uma data solta.</li>
<li>Crie <code>Dinheiro total(int quantidade)</code> em <code>Setor</code>.</li></ol>`,
      dicas: ['Use <code>!fim.isAfter(inicio)</code> para validar.', 'Um evento de um dia só pode ter fim igual a início + 4 horas. Crie um método fábrica <code>Periodo.de(inicio, Duration)</code>.'],
      solucao: String.raw`public record Periodo(LocalDateTime inicio, LocalDateTime fim) {

    public Periodo {
        Objects.requireNonNull(inicio); Objects.requireNonNull(fim);
        if (!fim.isAfter(inicio))
            throw new IllegalArgumentException("Fim deve ser depois do início");
    }

    public static Periodo de(LocalDateTime inicio, Duration duracao) {
        return new Periodo(inicio, inicio.plus(duracao));
    }

    public boolean contem(LocalDateTime instante) {
        return !instante.isBefore(inicio) && instante.isBefore(fim);
    }

    public Duration duracao() { return Duration.between(inicio, fim); }
}`
    },
    quiz: [
      { p: 'Qual destes é um value object no TicketFlow?', o: ['Pedido', 'Cliente', 'Dinheiro', 'Evento'], c: 2, e: 'Dinheiro é definido só pelo valor; os outros têm identidade própria.' },
      { p: 'Por que normalizar a escala do <code>BigDecimal</code> no construtor?', o: ['Para ocupar menos memória', 'Para que 10.0 e 10.00 sejam iguais em <code>equals</code>', 'Porque o banco exige', 'Para converter em double'], c: 1, e: '<code>BigDecimal.equals</code> considera a escala; normalizar evita bugs sutis em comparações e em coleções.' },
      { p: 'Onde a validação de um record deve ficar?', o: ['Num validador externo', 'No construtor compacto', 'No getter', 'No <code>toString</code>'], c: 1, e: 'O construtor compacto roda em toda criação, então não existe record inválido.' }
    ]
  },
  {
    titulo: 'Sealed types e pattern matching', duracao: '2 h 30', resumo: 'Modele o ciclo de vida do pedido como uma máquina de estados segura em tempo de compilação.',
    objetivos: ['Usar <code>sealed interface</code> para fechar hierarquias', 'Usar <code>switch</code> com pattern matching e record patterns', 'Modelar estados e transições sem <code>if</code> espalhado'],
    teoria: `
<h3>O problema dos status em String ou enum simples</h3>
<p>Com <code>String status</code>, nada impede <code>"PAGOO"</code>. Com <code>enum</code> você ganha segurança de valores, mas estados diferentes carregam dados diferentes: um pedido <i>pago</i> tem data e id da transação; um <i>cancelado</i> tem motivo. Enfiar tudo em campos anuláveis na classe <code>Pedido</code> vira uma bagunça.</p>
<h3>Sealed: hierarquia fechada</h3>
<p>Uma <code>sealed interface</code> lista explicitamente quem pode implementá-la (<code>permits</code>). Combinada com records, cada estado carrega exatamente os seus dados. E o compilador sabe todos os casos: um <code>switch</code> que esquece um estado <b>não compila</b>. Isso é chamado de verificação de exaustividade.</p>
<h3>Pattern matching em switch</h3>
<p>Desde o Java 21 você pode fazer <code>switch</code> sobre tipos, desestruturar records (<i>record patterns</i>) e usar guardas com <code>when</code>. É a forma idiomática de implementar transições de estado.</p>
<table><thead><tr><th>Estado</th><th>Dados</th><th>Pode ir para</th></tr></thead><tbody>
<tr><td>Criado</td><td>quando</td><td>Pago, Cancelado</td></tr>
<tr><td>Pago</td><td>quando, idTransacao</td><td>Cancelado (com reembolso)</td></tr>
<tr><td>Cancelado</td><td>quando, motivo</td><td>nenhum (final)</td></tr></tbody></table>`,
    codigo: [
      { titulo: 'StatusPedido.java', src: String.raw`public sealed interface StatusPedido
        permits StatusPedido.Criado, StatusPedido.Pago, StatusPedido.Cancelado {

    record Criado(Instant quando) implements StatusPedido {}
    record Pago(Instant quando, String idTransacao) implements StatusPedido {}
    record Cancelado(Instant quando, String motivo, boolean reembolsar) implements StatusPedido {}

    default StatusPedido pagar(String idTransacao, Instant agora) {
        return switch (this) {
            case Criado c -> new Pago(agora, idTransacao);
            case Pago p -> throw new IllegalStateException("Pedido já pago em " + p.quando());
            case Cancelado c -> throw new IllegalStateException("Pedido cancelado: " + c.motivo());
        }; // sem default: se surgir um novo estado, isto não compila
    }

    default StatusPedido cancelar(String motivo, Instant agora) {
        return switch (this) {
            case Criado c -> new Cancelado(agora, motivo, false);
            case Pago p -> new Cancelado(agora, motivo, true);   // pago gera reembolso
            case Cancelado c -> throw new IllegalStateException("Já cancelado");
        };
    }
}` },
      { titulo: 'Record patterns e guardas', src: String.raw`String descrever(StatusPedido s) {
    return switch (s) {
        case StatusPedido.Criado(var quando) -> "Aguardando pagamento desde " + quando;
        case StatusPedido.Pago(var quando, var tx) -> "Pago (tx " + tx + ")";
        case StatusPedido.Cancelado(var q, var motivo, var reembolsar) when reembolsar ->
                "Cancelado com reembolso: " + motivo;
        case StatusPedido.Cancelado c -> "Cancelado: " + c.motivo();
    };
}` },
      { titulo: 'Pedido usando o estado', src: String.raw`public class Pedido {
    private final UUID id = UUID.randomUUID();
    private final List<Ingresso> ingressos;
    private StatusPedido status;

    public Pedido(List<Ingresso> ingressos, Clock clock) {
        if (ingressos.isEmpty()) throw new IllegalArgumentException("Pedido sem ingressos");
        this.ingressos = List.copyOf(ingressos);
        this.status = new StatusPedido.Criado(clock.instant());
    }

    public void pagar(String idTransacao, Clock clock) { status = status.pagar(idTransacao, clock.instant()); }

    public void cancelar(String motivo, Clock clock) {
        status = status.cancelar(motivo, clock.instant());
        ingressos.forEach(Ingresso::cancelar);
    }

    public StatusPedido status() { return status; }
}` }
    ],
    exercicio: {
      titulo: 'Implemente o ciclo de vida do Pedido',
      enunciado: `<ol><li>Implemente <code>StatusPedido</code> e <code>Pedido</code>.</li>
<li>Adicione a regra: um pedido <b>pago</b> só pode ser cancelado até 48 horas antes do início do evento. O pedido precisa conhecer o <code>Periodo</code> do evento.</li>
<li>Adicione um estado <code>Expirado</code> (pedido criado e não pago em 15 minutos) e veja o compilador apontar todos os <code>switch</code> que precisam mudar.</li>
<li>Teste todas as transições válidas e inválidas.</li></ol>`,
      dicas: ['Passe o <code>Periodo</code> do evento no construtor do pedido.', 'Use guarda: <code>case Pago p when agora.isAfter(limite) -> throw ...</code>.'],
      solucaoNota: 'Repare que adicionar <code>Expirado</code> ao <code>permits</code> quebra a compilação de cada <code>switch</code> até você tratá-lo. Esse é o ganho de segurança dos tipos selados.',
      solucao: String.raw`record Expirado(Instant quando) implements StatusPedido {}

default StatusPedido cancelar(String motivo, Instant agora, Instant limiteCancelamento) {
    return switch (this) {
        case Criado c -> new Cancelado(agora, motivo, false);
        case Pago p when agora.isAfter(limiteCancelamento) ->
                throw new IllegalStateException("Prazo de cancelamento encerrado");
        case Pago p -> new Cancelado(agora, motivo, true);
        case Cancelado c -> throw new IllegalStateException("Já cancelado");
        case Expirado e -> throw new IllegalStateException("Pedido expirado");
    };
}

// em Pedido:
public void cancelar(String motivo, Clock clock) {
    Instant limite = periodoEvento.inicio().minusHours(48).toInstant(ZoneOffset.UTC);
    status = status.cancelar(motivo, clock.instant(), limite);
    ingressos.forEach(Ingresso::cancelar);
}`
    },
    quiz: [
      { p: 'O que acontece se você adicionar um novo record ao <code>permits</code> e não tratá-lo num <code>switch</code> sem <code>default</code>?', o: ['Erro em tempo de execução', 'Erro de compilação', 'O switch ignora o caso', 'Um aviso, apenas'], c: 1, e: 'Switch sobre tipo selado é verificado quanto à exaustividade pelo compilador.' },
      { p: 'Qual vantagem dos estados como records em relação a um enum?', o: ['Ocupam menos memória', 'Cada estado carrega seus próprios dados', 'São mais rápidos', 'Funcionam com JPA sem configuração'], c: 1, e: 'Pago tem idTransacao; Cancelado tem motivo. Sem campos anuláveis sobrando.' },
      { p: 'Para que serve o <code>when</code> num case?', o: ['Definir prioridade', 'Adicionar uma condição (guarda) ao padrão', 'Repetir o case', 'Capturar exceções'], c: 1, e: 'A guarda refina o padrão; o primeiro case que casar, com guarda verdadeira, vence.' }
    ]
  },
  {
    titulo: 'Coleções e Streams para regras e relatórios', duracao: '2 h', resumo: 'Use Collections e Streams para calcular totais, agrupar vendas e evitar armadilhas.',
    objetivos: ['Escolher a coleção certa (List, Set, Map) para cada caso', 'Usar <code>map</code>, <code>filter</code>, <code>groupingBy</code>, <code>reduce</code> e <code>Collectors.teeing</code>', 'Saber quando um laço simples é melhor que um stream'],
    teoria: `
<h3>Escolhendo a coleção</h3>
<ul><li><b>List</b>: ordem importa e repetição é permitida (itens de um pedido).</li><li><b>Set</b>: unicidade (CPFs de quem comprou meia).</li><li><b>Map</b>: busca por chave (setor por nome). <code>LinkedHashMap</code> preserva ordem de inserção; <code>TreeMap</code> ordena.</li></ul>
<p>Prefira coleções imutáveis em retornos (<code>List.of</code>, <code>List.copyOf</code>, <code>stream().toList()</code>).</p>
<h3>Streams: declarativo e sem efeitos colaterais</h3>
<p>Um stream descreve <i>o que</i> calcular. Regra de ouro: as funções passadas a <code>map</code> e <code>filter</code> não devem alterar estado externo. Para totais monetários, use <code>reduce</code> com um valor identidade (<code>Dinheiro.ZERO</code>) e uma função associativa (<code>Dinheiro::mais</code>).</p>
<h3>Agrupamentos</h3>
<p><code>Collectors.groupingBy(chave, downstream)</code> é o “GROUP BY” do Java. O <i>downstream</i> define o que fazer com cada grupo: <code>counting()</code>, <code>summingInt</code>, <code>mapping</code>, <code>reducing</code>.</p>
<div class="callout"><b>Quando não usar stream</b>Laços com várias saídas antecipadas, mutações intencionais ou lógica com muitos estados intermediários ficam mais claros num <code>for</code>. Legibilidade vence estilo.</div>`,
    codigo: [
      { titulo: 'Total do pedido e relatórios', src: String.raw`public record ItemVendido(String evento, String setor, int quantidade, Dinheiro precoUnitario) {
    public Dinheiro subtotal() { return precoUnitario.vezes(quantidade); }
}

public class RelatorioVendas {

    public Dinheiro faturamento(List<ItemVendido> itens) {
        return itens.stream()
                .map(ItemVendido::subtotal)
                .reduce(Dinheiro.ZERO, Dinheiro::mais);
    }

    /** setor -> quantidade vendida, em ordem alfabética */
    public Map<String, Integer> ingressosPorSetor(List<ItemVendido> itens) {
        return itens.stream().collect(Collectors.groupingBy(
                ItemVendido::setor, TreeMap::new, Collectors.summingInt(ItemVendido::quantidade)));
    }

    /** evento -> faturamento */
    public Map<String, Dinheiro> faturamentoPorEvento(List<ItemVendido> itens) {
        return itens.stream().collect(Collectors.groupingBy(
                ItemVendido::evento,
                Collectors.reducing(Dinheiro.ZERO, ItemVendido::subtotal, Dinheiro::mais)));
    }

    /** top N setores por quantidade */
    public List<String> topSetores(List<ItemVendido> itens, int n) {
        return ingressosPorSetor(itens).entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(n)
                .map(Map.Entry::getKey)
                .toList();
    }
}` },
      { titulo: 'teeing: dois resultados numa passada', src: String.raw`record Resumo(long pedidos, Dinheiro total) {}

Resumo resumo = itens.stream().collect(Collectors.teeing(
        Collectors.counting(),
        Collectors.reducing(Dinheiro.ZERO, ItemVendido::subtotal, Dinheiro::mais),
        Resumo::new));` }
    ],
    exercicio: {
      titulo: 'Painel de vendas do organizador',
      enunciado: `<p>Crie <code>RelatorioVendas</code> e uma massa de teste com pelo menos 3 eventos e 6 setores. Implemente e teste:</p><ol>
<li>Faturamento total e por evento.</li><li>Quantidade por setor, ordenada.</li><li>Percentual de ocupação por setor (vendidos ÷ capacidade), como <code>Map&lt;String, Double&gt;</code> com 1 casa decimal.</li><li>Lista de setores esgotados.</li><li>Ticket médio (faturamento ÷ número de pedidos) usando <code>teeing</code>.</li></ol>`,
      dicas: ['Para ocupação você precisa dos setores, não só dos itens vendidos. Receba a lista de <code>Setor</code> como parâmetro.', 'Arredonde com <code>Math.round(x * 1000) / 10.0</code> para ter percentual com 1 casa.'],
      solucao: String.raw`public Map<String, Double> ocupacao(List<Setor> setores) {
    return setores.stream().collect(Collectors.toMap(
            Setor::nome,
            s -> Math.round((double) s.vendidos() / s.capacidade() * 1000) / 10.0,
            (a, b) -> a, TreeMap::new));
}

public List<String> esgotados(List<Setor> setores) {
    return setores.stream().filter(Setor::esgotado).map(Setor::nome).sorted().toList();
}

public Dinheiro ticketMedio(List<ItemVendido> itens, long pedidos) {
    if (pedidos == 0) return Dinheiro.ZERO;
    BigDecimal total = faturamento(itens).valor();
    return new Dinheiro(total.divide(BigDecimal.valueOf(pedidos), 2, RoundingMode.HALF_EVEN));
}`
    },
    quiz: [
      { p: 'Qual coletor equivale a um GROUP BY com SUM?', o: ['<code>toList()</code>', '<code>groupingBy(chave, summingInt(...))</code>', '<code>partitioningBy</code>', '<code>joining</code>'], c: 1, e: 'groupingBy com um downstream de soma é o equivalente direto.' },
      { p: 'Por que <code>reduce(Dinheiro.ZERO, Dinheiro::mais)</code> é seguro inclusive com lista vazia?', o: ['Porque lança exceção', 'Porque o valor identidade é devolvido quando não há elementos', 'Porque usa Optional', 'Não é seguro'], c: 1, e: 'Com identidade, o resultado de lista vazia é a própria identidade, ZERO.' },
      { p: 'Qual destes é um mau uso de stream?', o: ['<code>filter</code> seguido de <code>map</code>', 'Adicionar itens numa lista externa dentro de <code>forEach</code> para depois usá-la', '<code>sorted</code> com comparator', '<code>toList()</code> no final'], c: 1, e: 'Efeito colateral em lambda quebra o modelo e dá problema com streams paralelos. Use um coletor.' }
    ]
  },
  {
    titulo: 'Concorrência com virtual threads', duracao: '3 h', resumo: 'Simule a abertura de vendas de um show disputado e corrija a condição de corrida.',
    objetivos: ['Entender condição de corrida com um exemplo real', 'Usar virtual threads com <code>Executors.newVirtualThreadPerTaskExecutor()</code>', 'Corrigir com sincronização e comparar com <code>AtomicInteger</code>'],
    teoria: `
<h3>O dia em que 50 mil pessoas querem 10 mil ingressos</h3>
<p>Quando várias threads executam <code>if (disponiveis() >= q) vendidos += q;</code> ao mesmo tempo, duas podem ler “sobrou 1” e as duas vendem. Isso é uma <b>condição de corrida</b> (<i>race condition</i>): o resultado depende da ordem em que as threads intercalam. No TicketFlow isso significa <b>overbooking</b>, o pior bug possível para o negócio.</p>
<h3>Virtual threads (Java 21)</h3>
<p>Threads de plataforma são caras (memória e troca de contexto do sistema operacional). <b>Virtual threads</b> são leves, gerenciadas pela JVM: você pode criar milhões. Elas brilham em cargas de I/O (chamadas HTTP, banco). O modelo continua sendo “uma thread por requisição”, só que barato.</p>
<h3>Como corrigir</h3>
<ul><li><b>Exclusão mútua</b>: <code>synchronized</code> ou <code>ReentrantLock</code> no método que verifica e altera. Com virtual threads, prefira <code>ReentrantLock</code> em trechos com I/O, porque <code>synchronized</code> podia “prender” a thread portadora em versões antigas (resolvido no JDK 24).</li>
<li><b>Operações atômicas</b>: <code>AtomicInteger.updateAndGet</code> com lógica compare-and-set.</li>
<li><b>No mundo real</b>: a defesa definitiva fica no banco (locking otimista ou pessimista). Você fará isso na Fase 3. Na memória de uma JVM, o lock só protege uma instância da aplicação.</li></ul>`,
    codigo: [
      { titulo: 'Reproduzindo o overbooking', src: String.raw`@Test
void abreVendasParaDezMilCompradores() throws Exception {
    var setor = new Setor("Pista", 1_000, Dinheiro.de("200"));
    var vendidos = new AtomicInteger();

    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
        for (int i = 0; i < 10_000; i++) {
            executor.submit(() -> {
                try { setor.reservar(1); vendidos.incrementAndGet(); }
                catch (CapacidadeEsgotadaException esgotado) { /* esperado */ }
            });
        }
    } // close() espera todas as tarefas terminarem

    // Sem proteção, este teste falha de vez em quando: vendidos > 1000
    assertThat(vendidos.get()).isEqualTo(1_000);
    assertThat(setor.disponiveis()).isZero();
}` },
      { titulo: 'Correção com lock', src: String.raw`public class Setor {
    private final ReentrantLock lock = new ReentrantLock();
    // ...

    public void reservar(int quantidade) {
        lock.lock();
        try {
            if (quantidade > disponiveis())
                throw new CapacidadeEsgotadaException(nome, disponiveis(), quantidade);
            vendidos += quantidade;
        } finally {
            lock.unlock(); // sempre no finally
        }
    }
}` },
      { titulo: 'Alternativa sem lock', src: String.raw`private final AtomicInteger vendidos = new AtomicInteger();

public void reservar(int quantidade) {
    vendidos.updateAndGet(atual -> {
        if (atual + quantidade > capacidade)
            throw new CapacidadeEsgotadaException(nome, capacidade - atual, quantidade);
        return atual + quantidade;
    });
}` }
    ],
    exercicio: {
      titulo: 'Prove o bug e prove a correção',
      enunciado: `<ol><li>Escreva o teste de 10 mil compradores contra o <code>Setor</code> sem proteção. Rode-o com <code>@RepeatedTest(20)</code> até ver uma falha. Se não falhar, adicione <code>Thread.yield()</code> entre a verificação e o incremento para alargar a janela.</li>
<li>Corrija com <code>ReentrantLock</code>. Rode de novo 20 vezes.</li>
<li>Implemente a versão com <code>AtomicInteger</code> e meça o tempo das duas com <code>System.nanoTime()</code>.</li>
<li>Escreva um ADR curto: “Proteção contra overbooking em memória é insuficiente” explicando por que, com várias instâncias da API, o problema volta.</li></ol>`,
      dicas: ['<code>@RepeatedTest(20)</code> substitui <code>@Test</code>.', 'Com várias instâncias da aplicação, cada JVM tem o seu lock. Quem coordena todas? Pense no banco.'],
      solucao: String.raw`# docs/adr/0002-overbooking.md

## Contexto
A venda de ingressos sofre concorrência alta. Testes mostraram overbooking
quando várias threads reservam no mesmo setor.

## Decisão
No domínio, Setor protege a invariante com ReentrantLock. Em produção,
a garantia definitiva será no banco (locking otimista com @Version, Fase 3),
pois a API rodará em várias instâncias e locks em memória não se coordenam.

## Consequências
+ O domínio continua correto em testes e em instância única.
- Precisamos de testes de concorrência também na camada de persistência.`
    },
    quiz: [
      { p: 'Para que tipo de carga as virtual threads trazem mais ganho?', o: ['Cálculo intensivo de CPU', 'Muitas tarefas que esperam I/O', 'Aplicações desktop', 'Código sem concorrência'], c: 1, e: 'Elas liberam a thread portadora enquanto esperam I/O, permitindo concorrência massiva barata.' },
      { p: 'Por que o <code>unlock()</code> fica no <code>finally</code>?', o: ['Estilo', 'Para liberar o lock mesmo se uma exceção for lançada', 'Para performance', 'É exigência do compilador'], c: 1, e: 'Sem finally, uma exceção deixaria o lock preso e travaria todas as outras threads.' },
      { p: 'Com 3 instâncias da API, o lock em memória do Setor evita overbooking?', o: ['Sim, sempre', 'Não, cada instância tem o seu lock; é preciso coordenar no banco ou num recurso compartilhado', 'Só com virtual threads', 'Só se usar synchronized'], c: 1, e: 'Locks de JVM não atravessam processos. A coordenação precisa de um recurso comum.' }
    ],
    desafio: '<p>Leia o JEP 444 e explique ao mentor, com suas palavras, o que é “pinning” e por que o JDK 24 (JEP 491) o resolveu para <code>synchronized</code>. Peça para ele corrigir sua explicação.</p>'
  }
  ]
});
