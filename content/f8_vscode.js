C.vscodeCodigo = [
  { titulo: 'Configuração de execução e depuração', lang: 'json', arquivo: ['n', '.vscode/launch.json'], src: String.raw`{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "TicketFlow API",
      "request": "launch",
      "mainClass": "dev.ticketflow.TicketflowApplication",
      "projectName": "ticketflow-api",
      "envFile": "${'$'}{workspaceFolder}/.env",
      "args": "--spring.profiles.active=dev"
    }
  ]
}` },
  { titulo: 'Variáveis locais (nunca vão para o Git)', lang: 'shell', arquivo: ['n', '.env', 'Adicione a linha .env no .gitignore antes do primeiro commit.'], src: String.raw`JWT_SECRET=troque-por-um-segredo-com-32-bytes-ou-mais
PAGAMENTOS_URL=http://localhost:8081
PAGAMENTOS_API_KEY=dev-chave-local` },
  { titulo: 'Estrutura completa ao fim da Fase 6', lang: 'shell', arquivo: ['r', '(estrutura de referência)'], src: String.raw`ticketflow/
├── .github/workflows/ci.yml                    Fase 5
├── .vscode/  extensions.json  settings.json  launch.json
├── carga/abertura.js                           Fase 5
├── docs/
│   ├── adr/0001-...md  0002-...md  ...         todas as fases
│   ├── api/ticketflow.http                     Fase 3
│   ├── arquitetura/  c4.dsl  mapa-de-contextos.md  saga-compra.md
│   └── performance.md  glossario-vendas.md  migracao-boot4.md
├── infra/  nginx.conf  prometheus.yml  tempo.yaml  sql/  grafana/     Fase 5
├── ticketflow-domain/                          Fase 1 (Java puro)
│   ├── pom.xml
│   └── src/
│       ├── main/java/dev/ticketflow/
│       │   ├── domain/   comum/ evento/ pedido/ preco/ compra/ relatorio/     Fases 1-2
│       │   ├── catalogo/domain/                                              Fase 4
│       │   └── vendas/   domain/  application/port/in/  application/port/out/ Fase 4
│       ├── test/java/dev/ticketflow/   (mesmas pastas, classes *Test.java)
│       └── test/resources/features/compra.feature                           Fase 2
├── ticketflow-api/                             Fase 3 (Spring Boot)
│   ├── pom.xml
│   └── src/
│       ├── main/java/dev/ticketflow/
│       │   ├── TicketflowApplication.java
│       │   ├── api/        config/ web/ service/ persistence/ security/      Fase 3
│       │   ├── catalogo/   application/ ...                                 Fases 4-5
│       │   ├── vendas/     infrastructure/  web/                            Fases 4-6
│       │   ├── notificacoes/   organizador/   plataforma/                    Fases 5-6
│       ├── main/resources/  application.yml   db/migration/V1__....sql
│       └── test/java/dev/ticketflow/   *Test.java  *IT.java  ArquiteturaTest.java
├── ticketflow-pagamentos/                      Fase 6 (serviço separado)
├── .dockerignore  .env  .gitignore  compose.yaml  Dockerfile
├── mvnw  mvnw.cmd  pom.xml
└── README.md` }
];

C.vscode = `
<h3>1. Instalação (uma vez)</h3>
<ol>
<li><b>JDK 21</b>: Eclipse Temurin em adoptium.net. No Windows, marque “Set JAVA_HOME” no instalador. Confira com <code>java -version</code> num terminal novo.</li>
<li><b>VS Code</b>: code.visualstudio.com.</li>
<li><b>Git</b>: git-scm.com. Configure nome e e-mail: <code>git config --global user.name "Seu Nome"</code> e <code>git config --global user.email "voce@exemplo.com"</code>.</li>
<li><b>Docker Desktop</b> (a partir da Fase 3). No Windows, ative o WSL 2 quando o instalador pedir.</li>
<li><b>Extensões</b>: veja a tabela da <a href="#aula-1-1">aula 1.1</a>. Depois que você criar o <code>.vscode/extensions.json</code>, o VS Code oferece instalar todas de uma vez.</li>
</ol>

<h3>2. A tela que você vai usar</h3>
<div class="table-wrap"><table><thead><tr><th>Painel</th><th>Como abrir</th><th>Para quê</th></tr></thead><tbody>
<tr><td>Explorer</td><td>Ctrl+Shift+E</td><td>Pastas e arquivos; criar, renomear, mover</td></tr>
<tr><td>Java Projects</td><td>Parte de baixo do Explorer</td><td>Ver módulos e pacotes do jeito Java</td></tr>
<tr><td>Maven</td><td>Parte de baixo do Explorer</td><td>Rodar <code>verify</code>, <code>test</code>, plugins com clique</td></tr>
<tr><td>Testing</td><td>Ícone de tubo de ensaio</td><td>Rodar e depurar testes, ver os que falharam</td></tr>
<tr><td>Source Control</td><td>Ctrl+Shift+G</td><td>Ver diferenças, commit, push, branches</td></tr>
<tr><td>Spring Boot Dashboard</td><td>Ícone do Spring (Fase 3)</td><td>Subir e parar a API</td></tr>
<tr><td>Containers</td><td>Ícone de baleia (Fase 5)</td><td>Containers, imagens, logs do Compose</td></tr>
<tr><td>Terminal</td><td>Ctrl+' (aspas simples)</td><td>Comandos <code>./mvnw</code>, <code>git</code>, <code>docker</code></td></tr>
</tbody></table></div>

<h3>3. Como criar um arquivo no lugar certo</h3>
<p>Todo bloco de código do curso mostra, no topo, o <b>caminho completo a partir da raiz do repositório</b> e uma etiqueta:</p>
<ul>
<li><b>Novo arquivo</b>: crie exatamente nesse caminho.</li>
<li><b>Editar arquivo</b>: o arquivo já existe; abra (Ctrl+P e digite o nome) e altere conforme a nota.</li>
<li><b>Terminal</b>: rode os comandos no terminal integrado, na raiz.</li>
<li><b>Exemplo</b>: só para estudar; não precisa criar.</li>
</ul>
<p><b>Passo a passo (vale para qualquer tipo de arquivo):</b></p>
<ol>
<li>No bloco, clique em <b>Copiar caminho</b>.</li>
<li>No Explorer, clique com o botão direito na <b>raiz</b> (<code>TICKETFLOW</code>, no topo) → <b>New File…</b>.</li>
<li>Cole (Ctrl+V) e tecle Enter. O VS Code cria as pastas que faltarem e abre o arquivo vazio.</li>
<li>Para <code>.java</code>, a extensão Java preenche <code>package</code> e o esqueleto da classe automaticamente. Apague o esqueleto, cole o código do curso e confira se a linha <code>package</code> continua no topo.</li>
<li>Salve com Ctrl+S.</li>
</ol>
<div class="callout info"><b>Regra de ouro dos arquivos Java</b>O nome do arquivo é igual ao nome da classe pública (<code>Setor.java</code> contém <code>public class Setor</code>), e o <code>package</code> é igual às pastas depois de <code>src/main/java/</code> ou <code>src/test/java/</code>, trocando <code>/</code> por <code>.</code>. Quando um bloco do curso tem mais de um tipo público, a nota do bloco diz em qual arquivo cada um vai.</div>

<h3>4. Onde cada coisa mora</h3>
<div class="table-wrap"><table><thead><tr><th>O que é</th><th>Pasta</th><th>Exemplo de package</th></tr></thead><tbody>
<tr><td>Domínio e casos de uso (Java puro)</td><td><code>ticketflow-domain/src/main/java/dev/ticketflow/…</code></td><td><code>dev.ticketflow.domain.evento</code>, depois <code>dev.ticketflow.vendas.domain</code></td></tr>
<tr><td>Testes do domínio</td><td><code>ticketflow-domain/src/test/java/dev/ticketflow/…</code></td><td>mesmo pacote da classe testada</td></tr>
<tr><td>API Spring Boot</td><td><code>ticketflow-api/src/main/java/dev/ticketflow/…</code></td><td><code>dev.ticketflow.api.web.pedido</code>, depois <code>dev.ticketflow.vendas.web</code></td></tr>
<tr><td>Configuração e migrations da API</td><td><code>ticketflow-api/src/main/resources/</code></td><td><code>application.yml</code>, <code>db/migration/V1__....sql</code></td></tr>
<tr><td>Testes da API</td><td><code>ticketflow-api/src/test/java/dev/ticketflow/…</code></td><td><code>*Test.java</code> e <code>*IT.java</code></td></tr>
<tr><td>Documentação</td><td><code>docs/</code></td><td>ADRs, diagramas, <code>.http</code></td></tr>
<tr><td>Infraestrutura</td><td>raiz e <code>infra/</code></td><td><code>Dockerfile</code>, <code>compose.yaml</code>, <code>infra/nginx.conf</code></td></tr>
</tbody></table></div>

<h3>5. Convenções de nomes</h3>
<div class="table-wrap"><table><thead><tr><th>Tipo</th><th>Regra</th><th>Exemplo</th></tr></thead><tbody>
<tr><td>Classe, record, interface</td><td>PascalCase, sem acento, arquivo com o mesmo nome</td><td><code>CalculadoraPreco.java</code></td></tr>
<tr><td>Pacote e pasta Java</td><td>minúsculas, sem acento nem hífen</td><td><code>dev/ticketflow/vendas/application/port/in</code></td></tr>
<tr><td>Teste de unidade</td><td>classe testada + <code>Test</code></td><td><code>SetorTest.java</code></td></tr>
<tr><td>Teste de integração</td><td>termina em <code>IT</code> (roda no <code>verify</code>)</td><td><code>OverbookingIT.java</code></td></tr>
<tr><td>Migration Flyway</td><td><code>V</code> + número + dois sublinhados + descrição</td><td><code>V3__cria_outbox.sql</code></td></tr>
<tr><td>ADR</td><td>4 dígitos + título com hífens, em <code>docs/adr/</code></td><td><code>0003-adotar-arquitetura-hexagonal.md</code></td></tr>
<tr><td>Feature BDD</td><td>minúsculas, em <code>src/test/resources/features/</code></td><td><code>compra.feature</code></td></tr>
</tbody></table></div>

<h3>6. Rodar, testar e depurar</h3>
<ul>
<li><b>Um teste</b>: clique em <b>Run Test</b> ou <b>Debug Test</b> que aparece acima do método.</li>
<li><b>Todos os testes</b>: painel Testing → ▶, ou <code>./mvnw verify</code> no terminal (no Windows: <code>.\\mvnw.cmd verify</code>).</li>
<li><b>Ponto de parada</b>: clique à esquerda do número da linha (bolinha vermelha) e use Debug Test ou F5.</li>
<li><b>A API</b> (Fase 3 em diante): clique em <b>Run</b> acima do <code>main</code> de <code>TicketflowApplication</code>, use o Spring Boot Dashboard, ou F5 com o <code>launch.json</code> abaixo, que carrega o <code>.env</code>.</li>
<li><b>Requisições</b>: abra <code>docs/api/ticketflow.http</code> e clique em <b>Send Request</b>.</li>
</ul>
<!--code:0-->
<!--code:1-->

<h3>7. Atalhos que valem ouro</h3>
<div class="table-wrap"><table><thead><tr><th>Ação</th><th>Windows / Linux</th><th>Mac</th></tr></thead><tbody>
<tr><td>Abrir arquivo pelo nome</td><td>Ctrl+P</td><td>Cmd+P</td></tr>
<tr><td>Paleta de comandos</td><td>Ctrl+Shift+P</td><td>Cmd+Shift+P</td></tr>
<tr><td>Correção rápida (importar, criar método)</td><td>Ctrl+.</td><td>Cmd+.</td></tr>
<tr><td>Refatorar (extrair método, variável)</td><td>Ctrl+Shift+R</td><td>Ctrl+Shift+R</td></tr>
<tr><td>Renomear símbolo</td><td>F2</td><td>F2</td></tr>
<tr><td>Ir para definição</td><td>F12</td><td>F12</td></tr>
<tr><td>Organizar imports</td><td>Shift+Alt+O</td><td>Shift+Option+O</td></tr>
<tr><td>Formatar</td><td>Shift+Alt+F</td><td>Shift+Option+F</td></tr>
<tr><td>Buscar em todos os arquivos</td><td>Ctrl+Shift+F</td><td>Cmd+Shift+F</td></tr>
<tr><td>Terminal</td><td>Ctrl+'</td><td>Ctrl+'</td></tr>
</tbody></table></div>

<h3>8. Estrutura do repositório, fase a fase</h3>
<!--code:2-->

<h3>9. Problemas comuns</h3>
<div class="table-wrap"><table><thead><tr><th>Sintoma</th><th>Solução</th></tr></thead><tbody>
<tr><td>“The declared package does not match the expected package”</td><td>A linha <code>package</code> não bate com a pasta. Use Ctrl+. e escolha mover o arquivo ou corrigir o package.</td></tr>
<tr><td>Classes em vermelho logo depois de mudar o <code>pom.xml</code></td><td>Salve o pom e aguarde; se persistir, Ctrl+Shift+P → <b>Java: Clean Java Language Server Workspace</b>.</td></tr>
<tr><td>“./mvnw: Permission denied” (Linux/Mac)</td><td><code>chmod +x mvnw</code> e faça commit.</td></tr>
<tr><td>“./mvnw não é reconhecido” (Windows)</td><td>Use <code>.\\mvnw.cmd</code> no PowerShell.</td></tr>
<tr><td>Testcontainers: “Could not find a valid Docker environment”</td><td>Abra o Docker Desktop e espere ficar “running”.</td></tr>
<tr><td>Teste não aparece no painel Testing</td><td>Confirme que a classe está em <code>src/test/java</code> e o método tem <code>@Test</code> do pacote <code>org.junit.jupiter.api</code>.</td></tr>
</tbody></table></div>
`;
