C.fases.push({
  n: 2, curto: 'Design de código', titulo: 'Design de código: SOLID, padrões e testes', semanas: 'Semanas 4 a 6',
  resumo: 'SOLID, padrões GoF úteis no back-end, TDD com Mockito, refatoração segura e testes de mutação.',
  objetivo: 'Entender <i>por que</i> o código está organizado de um jeito antes de aprender arquiteturas inteiras. Arquitetura é design de código em escala maior.',
  entrega: 'políticas de preço e notificações com padrões, ADRs e relatório PIT',
  checklist: [
    'Política de preços com <b>Strategy</b> (inteira, meia-entrada, lote promocional, cupom) criada em TDD',
    'Notificações de compra com <b>Observer</b> (e-mail, SMS, push) sem <code>if</code> por canal',
    '<b>Builder</b> de teste para montar <code>Pedido</code>; <b>Decorator</b> para taxa de conveniência',
    'Classe “Deus” <code>PedidoService</code> legada refatorada com testes de caracterização verdes',
    'Testes com Mockito para dependências externas (gateway de pagamento, notificador)',
    'PIT configurado e <i>mutation score</i> acima de 70% no domínio',
    'Três cenários de compra em Gherkin com Cucumber',
    'ADR para cada padrão adotado'
  ],
  leituras: ['<i>Refactoring</i>, Martin Fowler, 2ª ed.: capítulos 1 a 3', '<i>Use a Cabeça! Padrões de Projetos</i>: Strategy, Observer, Decorator, Factory', '<a href="https://github.com/emilybache/GildedRose-Refactoring-Kata">Gilded Rose Refactoring Kata</a> em Java'],
  aulas: [
  {
    titulo: 'SOLID na prática', duracao: '3 h', resumo: 'Os cinco princípios com violações reais e correções no TicketFlow.',
    objetivos: ['Reconhecer violações de cada princípio SOLID', 'Refatorar para SRP, OCP e DIP', 'Entender por que o DIP é a base da Clean Architecture'],
    teoria: `
<h3>Os cinco princípios em uma frase cada</h3>
<table><thead><tr><th>Princípio</th><th>Em uma frase</th><th>Sintoma de violação</th></tr></thead><tbody>
<tr><td><b>S</b>ingle Responsibility</td><td>Uma classe deve ter um único motivo para mudar.</td><td>Classe que calcula preço, salva no banco e manda e-mail.</td></tr>
<tr><td><b>O</b>pen/Closed</td><td>Aberto para extensão, fechado para modificação.</td><td>Todo tipo novo de desconto exige mexer num <code>switch</code> gigante.</td></tr>
<tr><td><b>L</b>iskov Substitution</td><td>Subtipos devem poder substituir o tipo base sem surpresas.</td><td>Subclasse que lança <code>UnsupportedOperationException</code> num método herdado.</td></tr>
<tr><td><b>I</b>nterface Segregation</td><td>Clientes não devem depender de métodos que não usam.</td><td>Interface <code>Repositorio</code> com 25 métodos, implementações com metade vazia.</td></tr>
<tr><td><b>D</b>ependency Inversion</td><td>Dependa de abstrações; detalhes dependem de políticas.</td><td>Regra de negócio fazendo <code>new SmtpEmailSender()</code>.</td></tr></tbody></table>
<h3>SRP: “motivo para mudar” é sobre pessoas</h3>
<p>Robert Martin reformulou o SRP como “um módulo deve responder a um, e apenas um, ator”. Se o financeiro pede para mudar o cálculo da taxa e o marketing pede para mudar o texto do e-mail, e ambos mexem na mesma classe, há duas responsabilidades misturadas.</p>
<h3>DIP: a seta da dependência</h3>
<p>Sem DIP: <code>CompraIngresso → PagSeguroClient</code>. Com DIP: <code>CompraIngresso → GatewayPagamento (interface)</code> e <code>PagSeguroAdapter → GatewayPagamento</code>. A regra de negócio não conhece o fornecedor. Trocar de fornecedor vira criar outro adaptador. Guarde essa imagem: na Fase 4 ela vira a <b>regra da dependência</b> da Clean Architecture.</p>`,
    codigo: [
      { titulo: 'Antes: tudo junto', src: String.raw`public class CompraService {
    public void comprar(Pedido pedido, String cartao) {
        // 1) calcula preço com regras de desconto (financeiro)
        // 2) chama o PagSeguro diretamente (infraestrutura)
        var client = new PagSeguroClient("chave-fixa");
        client.cobrar(cartao, pedido.total());
        // 3) grava no banco com JDBC (infraestrutura)
        // 4) monta HTML do e-mail e envia por SMTP (marketing + infraestrutura)
        new SmtpEmailSender().enviar(pedido.email(), "<h1>Obrigado!</h1>");
    }
}` },
      { titulo: 'Depois: SRP + DIP', src: String.raw`// Abstrações pertencem a quem usa (o caso de uso), não a quem implementa
public interface GatewayPagamento { Transacao cobrar(MeioPagamento meio, Dinheiro valor); }
public interface Notificador { void compraConfirmada(Pedido pedido); }
public interface Pedidos { void salvar(Pedido pedido); }

public class ComprarIngressos {
    private final GatewayPagamento gateway;
    private final Pedidos pedidos;
    private final Notificador notificador;

    public ComprarIngressos(GatewayPagamento gateway, Pedidos pedidos, Notificador notificador) {
        this.gateway = gateway; this.pedidos = pedidos; this.notificador = notificador;
    }

    public void executar(Pedido pedido, MeioPagamento meio) {
        Transacao tx = gateway.cobrar(meio, pedido.total());
        pedido.pagar(tx.id());
        pedidos.salvar(pedido);
        notificador.compraConfirmada(pedido);
    }
}

// Detalhe técnico depende da abstração, não o contrário
public class PagSeguroAdapter implements GatewayPagamento { /* ... */ }` },
      { titulo: 'LSP violado e corrigido', src: String.raw`// Violação: nem todo ingresso pode ser transferido
class Ingresso { void transferir(Cpf novoTitular) { ... } }
class IngressoCortesia extends Ingresso {
    @Override void transferir(Cpf c) { throw new UnsupportedOperationException(); } // surpresa!
}

// Correção: modele a capacidade explicitamente
interface Transferivel { void transferir(Cpf novoTitular); }
final class IngressoPago extends Ingresso implements Transferivel { ... }
final class IngressoCortesia extends Ingresso { }  // simplesmente não é Transferivel` }
    ],
    exercicio: {
      titulo: 'Desmonte a CompraService',
      enunciado: `<ol><li>Copie a <code>CompraService</code> “antes” para o projeto e complete-a de forma ingênua (com classes falsas de PagSeguro e SMTP que só imprimem).</li>
<li>Liste, num comentário, cada responsabilidade e o ator que pede mudanças nela.</li>
<li>Refatore para o desenho “depois”, criando <code>ComprarIngressos</code> e as três interfaces.</li>
<li>Escreva um teste de <code>ComprarIngressos</code> usando implementações falsas escritas à mão (sem Mockito ainda): <code>GatewayFalso</code>, <code>PedidosEmMemoria</code>, <code>NotificadorEspiao</code>.</li></ol>`,
      dicas: ['Um “espião” guarda o que recebeu numa lista para o teste conferir depois.', 'Repare como o teste fica fácil quando nada é criado com <code>new</code> dentro do caso de uso.'],
      solucao: String.raw`class NotificadorEspiao implements Notificador {
    final List<Pedido> notificados = new ArrayList<>();
    @Override public void compraConfirmada(Pedido p) { notificados.add(p); }
}

class PedidosEmMemoria implements Pedidos {
    final Map<UUID, Pedido> banco = new HashMap<>();
    @Override public void salvar(Pedido p) { banco.put(p.id(), p); }
}

class GatewayFalso implements GatewayPagamento {
    @Override public Transacao cobrar(MeioPagamento m, Dinheiro v) { return new Transacao("tx-123"); }
}

@Test
void compraPagaSalvaENotifica() {
    var pedidos = new PedidosEmMemoria();
    var notificador = new NotificadorEspiao();
    var comprar = new ComprarIngressos(new GatewayFalso(), pedidos, notificador);
    var pedido = PedidoBuilder.umPedido().build();

    comprar.executar(pedido, MeioPagamento.pix());

    assertThat(pedido.status()).isInstanceOf(StatusPedido.Pago.class);
    assertThat(pedidos.banco).containsKey(pedido.id());
    assertThat(notificador.notificados).containsExactly(pedido);
}`
    },
    quiz: [
      { p: 'Uma classe que calcula desconto e também formata o e-mail de confirmação viola principalmente:', o: ['LSP', 'SRP', 'ISP', 'OCP'], c: 1, e: 'São dois motivos para mudar, vindos de atores diferentes.' },
      { p: 'No DIP, a interface <code>GatewayPagamento</code> deve ficar:', o: ['No módulo do adaptador do PagSeguro', 'Junto do caso de uso que a usa', 'Num módulo utilitário genérico', 'Em qualquer lugar'], c: 1, e: 'A abstração pertence a quem depende dela. Assim a seta aponta do detalhe para a política.' },
      { p: 'Uma subclasse que lança <code>UnsupportedOperationException</code> num método herdado é sinal de violação de:', o: ['SRP', 'LSP', 'DIP', 'Nenhum'], c: 1, e: 'Quem usa o tipo base é surpreendido: o subtipo não é substituível.' }
    ]
  },
  {
    titulo: 'Padrões criacionais e estruturais', duracao: '2 h 30', resumo: 'Builder, Factory Method, Decorator e Adapter onde eles realmente ajudam.',
    objetivos: ['Usar Builder para objetos complexos e para dados de teste', 'Usar Factory para esconder a escolha de implementação', 'Usar Decorator para adicionar comportamento sem herança', 'Usar Adapter para integrar APIs externas'],
    teoria: `
<h3>Padrão é vocabulário, não objetivo</h3>
<p>Padrões de projeto são soluções nomeadas para problemas recorrentes. O ganho maior é a comunicação: dizer “isso é um Decorator” resume um desenho inteiro. Aplicar padrão sem problema é <i>overengineering</i>.</p>
<h3>Builder</h3>
<p>Útil quando um objeto tem muitos parâmetros opcionais. No TicketFlow, o uso mais valioso é o <b>Test Data Builder</b>: monta objetos válidos com valores padrão e deixa o teste dizer só o que importa (“um pedido <i>pago</i> com <i>3 ingressos</i>”).</p>
<h3>Factory</h3>
<p>Centraliza a decisão de <i>qual</i> implementação criar. Ex.: <code>PoliticaPrecoFactory.para(tipoIngresso)</code>. Com Spring, muitas factories somem porque o container injeta a implementação certa, mas a ideia continua.</p>
<h3>Decorator</h3>
<p>Envolve um objeto que implementa a mesma interface e acrescenta algo antes ou depois. Taxa de conveniência, log, cache e métricas são decoradores clássicos. Combinam livremente: <code>new ComTaxa(new ComCupom(new PrecoBase()))</code>.</p>
<h3>Adapter</h3>
<p>Converte a interface “feia” de um fornecedor na interface que o seu domínio quer. Na Fase 4 você vai reconhecer isso como o <i>adapter</i> da arquitetura hexagonal e como a <i>camada anticorrupção</i> do DDD.</p>`,
    codigo: [
      { titulo: 'Test Data Builder', src: String.raw`public class PedidoBuilder {
    private int quantidade = 1;
    private String setor = "Pista";
    private Dinheiro preco = Dinheiro.de("100");
    private boolean pago = false;
    private Clock clock = Clock.fixed(Instant.parse("2026-03-01T10:00:00Z"), ZoneOffset.UTC);

    public static PedidoBuilder umPedido() { return new PedidoBuilder(); }

    public PedidoBuilder comIngressos(int q) { this.quantidade = q; return this; }
    public PedidoBuilder noSetor(String s, Dinheiro p) { this.setor = s; this.preco = p; return this; }
    public PedidoBuilder pago() { this.pago = true; return this; }

    public Pedido build() {
        var ingressos = IntStream.range(0, quantidade)
                .mapToObj(i -> new Ingresso(setor, "Titular " + i, preco)).toList();
        var pedido = new Pedido(ingressos, clock);
        if (pago) pedido.pagar("tx-teste", clock);
        return pedido;
    }
}

// O teste fala só do que importa:
var pedido = umPedido().comIngressos(3).pago().build();` },
      { titulo: 'Decorator: taxa de conveniência', src: String.raw`public interface CalculadoraPreco { Dinheiro calcular(Pedido pedido); }

public class PrecoBase implements CalculadoraPreco {
    public Dinheiro calcular(Pedido p) {
        return p.ingressos().stream().map(Ingresso::preco).reduce(Dinheiro.ZERO, Dinheiro::mais);
    }
}

public class ComTaxaConveniencia implements CalculadoraPreco {
    private final CalculadoraPreco interna;
    private final int percentual;

    public ComTaxaConveniencia(CalculadoraPreco interna, int percentual) {
        this.interna = interna; this.percentual = percentual;
    }

    public Dinheiro calcular(Pedido p) {
        Dinheiro base = interna.calcular(p);
        return base.mais(base.percentual(percentual)); // acrescenta, não substitui
    }
}

CalculadoraPreco calc = new ComTaxaConveniencia(new PrecoBase(), 10);` },
      { titulo: 'Adapter para um gateway externo', src: String.raw`// API do fornecedor (não controlamos): valores em centavos, status em String
class FornecedorPayClient {
    FornecedorResposta charge(String token, long amountInCents) { ... }
}

public class FornecedorPayAdapter implements GatewayPagamento {
    private final FornecedorPayClient client;

    public Transacao cobrar(MeioPagamento meio, Dinheiro valor) {
        long centavos = valor.valor().movePointRight(2).longValueExact();
        FornecedorResposta r = client.charge(meio.token(), centavos);
        if (!"APPROVED".equals(r.status())) throw new PagamentoRecusadoException(r.reason());
        return new Transacao(r.transactionId());
    }
}` }
    ],
    exercicio: {
      titulo: 'Builder de teste e preço decorado',
      enunciado: `<ol><li>Crie <code>PedidoBuilder</code> e reescreva pelo menos 5 testes existentes usando-o.</li>
<li>Implemente <code>PrecoBase</code>, <code>ComTaxaConveniencia</code> e um segundo decorador <code>ComTetoDeTaxa</code> que limita a taxa a R$ 30 por pedido.</li>
<li>Teste a composição nas duas ordens e explique, num comentário, por que a ordem importa.</li></ol>`,
      dicas: ['O teto precisa saber quanto foi a taxa. Ele pode calcular base e decorado e comparar a diferença.', 'Escreva os testes com valores redondos: pedido de R$ 500 com 10% dá R$ 50 de taxa, limitada a R$ 30.'],
      solucao: String.raw`public class ComTetoDeTaxa implements CalculadoraPreco {
    private final CalculadoraPreco base;      // sem taxa
    private final CalculadoraPreco comTaxa;   // com taxa
    private final Dinheiro teto;

    public Dinheiro calcular(Pedido p) {
        Dinheiro semTaxa = base.calcular(p);
        Dinheiro taxa = new Dinheiro(comTaxa.calcular(p).valor().subtract(semTaxa.valor()));
        return semTaxa.mais(taxa.compareTo(teto) > 0 ? teto : taxa);
    }
}

@Test
void taxaDeDezPorCentoLimitadaATrintaReais() {
    var pedido = umPedido().comIngressos(5).noSetor("Pista", Dinheiro.de("100")).build();
    var base = new PrecoBase();
    var calc = new ComTetoDeTaxa(base, new ComTaxaConveniencia(base, 10), Dinheiro.de("30"));
    assertThat(calc.calcular(pedido)).isEqualTo(Dinheiro.de("530"));
}`
    },
    quiz: [
      { p: 'Qual o maior benefício do Test Data Builder?', o: ['Gera dados aleatórios', 'Testes mostram só o que importa para o cenário', 'Substitui o Mockito', 'Acelera a JVM'], c: 1, e: 'Valores padrão escondem o ruído; o teste destaca a variável do cenário.' },
      { p: 'Decorator e herança: por que preferir o Decorator para taxa, cupom e log?', o: ['É mais rápido', 'Permite combinar comportamentos livremente em tempo de execução', 'Usa menos classes sempre', 'Herança não funciona em Java'], c: 1, e: 'Com herança você precisaria de uma subclasse para cada combinação.' },
      { p: 'Converter centavos e status em String do fornecedor para o modelo do domínio é papel do:', o: ['Builder', 'Adapter', 'Singleton', 'Observer'], c: 1, e: 'Adapter traduz uma interface para outra esperada pelo cliente.' }
    ]
  },
  {
    titulo: 'Padrões comportamentais: Strategy, Observer e Template Method', duracao: '3 h', resumo: 'Políticas de preço plugáveis e notificações desacopladas.',
    objetivos: ['Substituir condicionais de regra de negócio por Strategy', 'Desacoplar efeitos colaterais com Observer (eventos)', 'Reaproveitar um algoritmo com Template Method'],
    teoria: `
<h3>Strategy: uma família de algoritmos intercambiáveis</h3>
<p>Preço de ingresso muda conforme o tipo: inteira, meia-entrada (50%), lote promocional (preço fixo até data X), cupom (percentual). O código ingênuo é um <code>switch</code> que cresce a cada campanha do marketing (viola OCP). Com Strategy, cada regra vira uma classe pequena e testável, e adicionar uma política nova não mexe nas existentes.</p>
<h3>Observer: “quando X acontecer, avise quem se interessar”</h3>
<p>Ao confirmar uma compra, queremos mandar e-mail, SMS, push, atualizar o painel e dar pontos de fidelidade. Se o caso de uso chamar cada um, ele acumula dependências. Com Observer, o caso de uso publica <b>um evento</b> (<code>CompraConfirmada</code>) e os interessados se registram. Essa ideia escala até os eventos de domínio (Fase 4) e à mensageria (Fase 6).</p>
<h3>Template Method</h3>
<p>Define o esqueleto de um algoritmo numa classe base e deixa subclasses preencherem passos. Útil para geração de relatórios com o mesmo fluxo (buscar, filtrar, formatar) e formatos diferentes (CSV, PDF). Hoje costuma ser trocado por composição com lambdas, mas você vai encontrá-lo em todo framework (o <code>JdbcTemplate</code> do Spring é parente dele).</p>`,
    codigo: [
      { titulo: 'Strategy de preço com sealed interface', src: String.raw`public sealed interface PoliticaPreco permits Inteira, MeiaEntrada, LotePromocional, Cupom {
    Dinheiro aplicar(Dinheiro precoBase, Instant agora);
}

public record Inteira() implements PoliticaPreco {
    public Dinheiro aplicar(Dinheiro base, Instant agora) { return base; }
}

public record MeiaEntrada(Comprovante comprovante) implements PoliticaPreco {
    public MeiaEntrada { Objects.requireNonNull(comprovante, "meia exige comprovante"); }
    public Dinheiro aplicar(Dinheiro base, Instant agora) { return base.percentual(50); }
}

public record LotePromocional(Dinheiro precoLote, Instant validoAte) implements PoliticaPreco {
    public Dinheiro aplicar(Dinheiro base, Instant agora) {
        return agora.isBefore(validoAte) ? precoLote : base;
    }
}

public record Cupom(String codigo, int percentualDesconto) implements PoliticaPreco {
    public Cupom {
        if (percentualDesconto < 1 || percentualDesconto > 90) throw new IllegalArgumentException("Desconto inválido");
    }
    public Dinheiro aplicar(Dinheiro base, Instant agora) {
        return base.percentual(100 - percentualDesconto);
    }
}` },
      { titulo: 'Observer simples, sem framework', src: String.raw`public record CompraConfirmada(UUID pedidoId, String email, Dinheiro total, Instant quando) {}

public interface OuvinteCompra { void aoConfirmar(CompraConfirmada evento); }

public class PublicadorEventos {
    private final List<OuvinteCompra> ouvintes = new CopyOnWriteArrayList<>();
    public void registrar(OuvinteCompra o) { ouvintes.add(o); }
    public void publicar(CompraConfirmada e) {
        for (var o : ouvintes) {
            try { o.aoConfirmar(e); }
            catch (RuntimeException falha) { /* um ouvinte com erro não derruba os outros */ }
        }
    }
}

// Cada canal é independente e testável:
public class EmailConfirmacao implements OuvinteCompra { ... }
public class SmsConfirmacao implements OuvinteCompra { ... }
public class PontosFidelidade implements OuvinteCompra { ... }` }
    ],
    exercicio: {
      titulo: 'Preços em TDD e notificações por evento',
      enunciado: `<ol><li>Em TDD (um teste vermelho por vez), implemente as quatro políticas de preço.</li>
<li>Faça cada <code>Ingresso</code> guardar a <code>PoliticaPreco</code> aplicada e calcular o preço final.</li>
<li>Regra extra: cupom <b>não</b> se combina com meia-entrada. Onde essa regra deve morar? Implemente e justifique num comentário.</li>
<li>Crie o <code>PublicadorEventos</code>, três ouvintes que só registram numa lista, e faça <code>ComprarIngressos</code> publicar <code>CompraConfirmada</code> no lugar de chamar o <code>Notificador</code>.</li></ol>`,
      dicas: ['A regra “cupom não combina com meia” envolve duas políticas; ela pertence a quem monta o ingresso (uma fábrica ou o próprio <code>Pedido</code>), não a uma das políticas.', 'Teste que um ouvinte que lança exceção não impede os demais de receber o evento.'],
      solucao: String.raw`// Regra de combinação no ponto de criação do ingresso
public static Ingresso criar(Setor setor, String titular, List<PoliticaPreco> politicas, Instant agora) {
    boolean temMeia = politicas.stream().anyMatch(p -> p instanceof MeiaEntrada);
    boolean temCupom = politicas.stream().anyMatch(p -> p instanceof Cupom);
    if (temMeia && temCupom)
        throw new RegraDePrecoException("Cupom não pode ser usado com meia-entrada");

    Dinheiro preco = setor.preco();
    for (var politica : politicas) preco = politica.aplicar(preco, agora);
    return new Ingresso(setor.nome(), titular, preco);
}

@Test
void ouvinteComFalhaNaoImpedeOsOutros() {
    var publicador = new PublicadorEventos();
    var registro = new ArrayList<String>();
    publicador.registrar(e -> { throw new RuntimeException("SMS fora do ar"); });
    publicador.registrar(e -> registro.add("email"));
    publicador.publicar(new CompraConfirmada(UUID.randomUUID(), "a@b.com", Dinheiro.de("10"), Instant.now()));
    assertThat(registro).containsExactly("email");
}`
    },
    quiz: [
      { p: 'Que princípio SOLID a Strategy ajuda a cumprir no cálculo de preço?', o: ['LSP', 'OCP', 'ISP', 'Nenhum'], c: 1, e: 'Nova política = nova classe, sem modificar as existentes.' },
      { p: 'Qual o risco de o caso de uso chamar diretamente e-mail, SMS, push e fidelidade?', o: ['Nenhum', 'Acumula dependências e uma falha em um canal pode derrubar a compra', 'Fica mais rápido', 'Viola o LSP'], c: 1, e: 'Observer reduz o acoplamento e isola falhas de efeitos colaterais.' },
      { p: 'O <code>JdbcTemplate</code> do Spring é parente de qual padrão?', o: ['Template Method', 'Builder', 'Adapter', 'Singleton'], c: 0, e: 'Ele fixa o fluxo (abrir conexão, executar, tratar erro, fechar) e você fornece as partes variáveis.' }
    ]
  },
  {
    titulo: 'TDD e dublês de teste com Mockito', duracao: '3 h', resumo: 'Ciclo vermelho-verde-refatora, pirâmide de testes e quando usar mocks.',
    objetivos: ['Praticar o ciclo TDD em passos pequenos', 'Distinguir stub, mock, spy e fake', 'Usar Mockito sem acoplar o teste à implementação'],
    teoria: `
<h3>O ciclo</h3>
<ol><li><b>Vermelho</b>: escreva o menor teste que falha por um motivo de negócio.</li><li><b>Verde</b>: escreva o código mais simples que passa.</li><li><b>Refatore</b>: melhore nomes e estrutura com o teste verde como rede de proteção.</li></ol>
<p>Os passos são pequenos de propósito: em poucos minutos você está de volta ao verde. O design emerge porque código difícil de testar denuncia acoplamento cedo.</p>
<h3>Pirâmide de testes</h3>
<p>Muitos testes de <b>unidade</b> (rápidos, domínio puro), alguns de <b>integração</b> (banco real, HTTP real, Fase 3) e poucos <b>ponta a ponta</b>. Testes de unidade do domínio devem rodar em milissegundos.</p>
<h3>Dublês de teste</h3>
<table><thead><tr><th>Tipo</th><th>O que faz</th><th>Exemplo</th></tr></thead><tbody>
<tr><td>Stub</td><td>Devolve respostas prontas</td><td>Gateway que sempre aprova</td></tr>
<tr><td>Fake</td><td>Implementação funcional simplificada</td><td>Repositório em <code>HashMap</code></td></tr>
<tr><td>Spy</td><td>Registra chamadas para verificação</td><td>Notificador que guarda o que recebeu</td></tr>
<tr><td>Mock</td><td>Espera interações específicas</td><td><code>verify(gateway).cobrar(...)</code></td></tr></tbody></table>
<div class="callout"><b>Regra prática</b>Não faça mock de tipos que você não controla (bibliotecas, <code>RestTemplate</code>) nem de value objects. Faça mock das <i>suas</i> interfaces de saída. Prefira fakes para repositórios: os testes ficam menos frágeis.</div>`,
    codigo: [
      { titulo: 'Mockito com as suas interfaces', src: String.raw`@ExtendWith(MockitoExtension.class)
class ComprarIngressosTest {

    @Mock GatewayPagamento gateway;
    @Mock PublicadorEventos eventos;
    PedidosEmMemoria pedidos = new PedidosEmMemoria(); // fake, não mock

    @Test
    void naoSalvaNemPublicaQuandoPagamentoERecusado() {
        var comprar = new ComprarIngressos(gateway, pedidos, eventos);
        var pedido = umPedido().build();
        when(gateway.cobrar(any(), any())).thenThrow(new PagamentoRecusadoException("saldo"));

        assertThatThrownBy(() -> comprar.executar(pedido, MeioPagamento.pix()))
                .isInstanceOf(PagamentoRecusadoException.class);

        assertThat(pedidos.banco).isEmpty();
        verifyNoInteractions(eventos);
    }

    @Test
    void cobraOValorTotalDoPedido() {
        when(gateway.cobrar(any(), any())).thenReturn(new Transacao("tx-1"));
        var pedido = umPedido().comIngressos(2).noSetor("Pista", Dinheiro.de("150")).build();

        new ComprarIngressos(gateway, pedidos, eventos).executar(pedido, MeioPagamento.pix());

        verify(gateway).cobrar(any(), eq(Dinheiro.de("300")));
    }
}` }
    ],
    exercicio: {
      titulo: 'Cancelamento com reembolso em TDD',
      enunciado: `<p>Implemente em TDD o caso de uso <code>CancelarPedido</code>:</p><ul>
<li>Pedido criado e não pago: cancela, libera os lugares do setor, não chama o gateway.</li>
<li>Pedido pago dentro do prazo: cancela, libera lugares, chama <code>gateway.estornar(idTransacao, total)</code>.</li>
<li>Pedido pago fora do prazo: lança exceção, não libera lugares, não estorna.</li>
<li>Falha no estorno: o pedido <b>não</b> fica cancelado.</li></ul>
<p>Escreva um teste por vez e faça um commit a cada ciclo verde.</p>`,
      dicas: ['Comece pelo caso mais simples (pedido não pago).', 'Para o último cenário, a ordem das operações importa: estornar antes de mudar o estado.'],
      solucao: String.raw`public class CancelarPedido {
    private final Pedidos pedidos;
    private final GatewayPagamento gateway;
    private final Clock clock;

    public void executar(UUID pedidoId, String motivo) {
        Pedido pedido = pedidos.buscar(pedidoId).orElseThrow(PedidoNaoEncontradoException::new);
        pedido.validarCancelamento(clock);                  // lança se fora do prazo
        if (pedido.status() instanceof StatusPedido.Pago pago)
            gateway.estornar(pago.idTransacao(), pedido.total()); // falha aqui = nada muda
        pedido.cancelar(motivo, clock);                     // muda estado e libera setores
        pedidos.salvar(pedido);
    }
}

@Test
void falhaNoEstornoMantemPedidoPago() {
    var pedido = umPedido().pago().build();
    pedidos.salvar(pedido);
    doThrow(new GatewayIndisponivelException()).when(gateway).estornar(any(), any());

    assertThatThrownBy(() -> cancelar.executar(pedido.id(), "desistência"))
            .isInstanceOf(GatewayIndisponivelException.class);
    assertThat(pedido.status()).isInstanceOf(StatusPedido.Pago.class);
}`
    },
    quiz: [
      { p: 'Qual a ordem do ciclo TDD?', o: ['Verde, vermelho, refatora', 'Vermelho, verde, refatora', 'Refatora, vermelho, verde', 'Código, teste, deploy'], c: 1, e: 'Primeiro um teste que falha, depois o mínimo para passar, depois melhorar.' },
      { p: 'Para o repositório de pedidos num teste de caso de uso, o dublê mais robusto costuma ser:', o: ['Mock com verify de cada chamada', 'Fake em memória', 'Spy do Mockito sobre a classe JPA', 'Nenhum, usar banco real'], c: 1, e: 'Fakes testam comportamento (o que ficou salvo) em vez de detalhes de chamada.' },
      { p: 'Do que você NÃO deve fazer mock?', o: ['Das suas interfaces de saída', 'De value objects como Dinheiro', 'Do gateway de pagamento', 'Do publicador de eventos'], c: 1, e: 'Value objects são simples e determinísticos; use os reais.' }
    ]
  },
  {
    titulo: 'Refatoração de legado e testes de mutação', duracao: '3 h', resumo: 'Testes de caracterização, refatorações seguras e PIT para medir a qualidade dos testes.',
    objetivos: ['Escrever testes de caracterização antes de mexer em código legado', 'Aplicar refatorações do catálogo de Fowler em passos pequenos', 'Configurar PIT e interpretar mutantes sobreviventes', 'Escrever cenários BDD com Cucumber'],
    teoria: `
<h3>Código legado é código sem testes</h3>
<p>A definição é de Michael Feathers. Antes de mudar, <b>caracterize</b>: escreva testes que registram o comportamento atual, mesmo que pareça errado. Eles são a rede que permite refatorar sem medo.</p>
<h3>Refatorações que você vai usar toda semana</h3>
<ul><li><b>Extract Method</b>: um trecho com comentário explicativo vira um método com esse nome.</li><li><b>Replace Conditional with Polymorphism</b>: o <code>switch</code> por tipo vira Strategy.</li><li><b>Introduce Parameter Object</b>: cinco parâmetros soltos viram um record.</li><li><b>Move Method</b>: o método que mais usa dados de outra classe vai para ela.</li><li><b>Replace Primitive with Object</b>: <code>String cpf</code> vira <code>Cpf</code>.</li></ul>
<p>Use as refatorações do VS Code, mais seguras que editar à mão: selecione o trecho e pressione <b>Ctrl+Shift+R</b> (menu <i>Refactor…</i>) para <i>Extract to method</i>, <i>Extract to local variable</i> ou <i>Inline</i>; <b>F2</b> renomeia símbolo em todo o projeto; <b>Ctrl+.</b> mostra correções rápidas; renomear ou mover um arquivo <code>.java</code> no Explorer atualiza o <code>package</code> e os imports.</p>
<h3>Cobertura mente; mutação não</h3>
<p>Cobertura de 90% só diz que as linhas <i>rodaram</i>, não que foram <i>verificadas</i>. O <b>PIT</b> cria mutantes (troca <code>&gt;</code> por <code>&gt;=</code>, remove chamadas, inverte condições) e roda seus testes. Se nenhum teste falha, o mutante <b>sobreviveu</b>: há um comportamento sem verificação. O <i>mutation score</i> é a porcentagem de mutantes mortos.</p>
<h3>BDD com Cucumber</h3>
<p>Cenários em Gherkin (Dado, Quando, Então) servem como especificação legível pelo negócio. Use para fluxos importantes, não para tudo.</p>`,
    codigo: [
      { titulo: 'PIT no pom.xml', lang: 'xml', src: String.raw`<plugin>
  <groupId>org.pitest</groupId>
  <artifactId>pitest-maven</artifactId>
  <version>1.17.0</version>
  <dependencies>
    <dependency>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-junit5-plugin</artifactId>
      <version>1.2.1</version>
    </dependency>
  </dependencies>
  <configuration>
    <targetClasses><param>dev.ticketflow.domain.*</param></targetClasses>
    <mutationThreshold>70</mutationThreshold>
  </configuration>
</plugin>
<!-- rode: ./mvnw -pl ticketflow-domain org.pitest:pitest-maven:mutationCoverage -->` },
      { titulo: 'Teste de caracterização', src: String.raw`// Legado: ninguém sabe exatamente as regras. Registramos o que ele faz HOJE.
@ParameterizedTest
@CsvSource({
    "INTEIRA, 100.00, 0,  110.00",
    "MEIA,    100.00, 0,  55.00",
    "INTEIRA, 100.00, 20, 90.00",   // cupom de 20% + taxa de 10%... sobre o valor com desconto
    "MEIA,    100.00, 20, 55.00"    // curioso: cupom ignorado na meia. Bug ou regra? Pergunte!
})
void caracterizaCalculoLegado(String tipo, String base, int cupom, String esperado) {
    var legado = new PedidoServiceLegado();
    assertThat(legado.calcularTotal(tipo, new BigDecimal(base), cupom))
            .isEqualByComparingTo(esperado);
}` },
      { titulo: 'Cenário Gherkin', lang: 'shell', src: String.raw`# language: pt
Funcionalidade: Compra de ingressos

  Cenário: Compra com meia-entrada
    Dado um evento "Rock no Vale" com o setor "Pista" a R$ 200,00 e 100 lugares
    Quando a cliente compra 1 ingresso de meia-entrada na "Pista"
    Então o total do pedido é R$ 100,00
    E restam 99 lugares na "Pista"` }
    ],
    exercicio: {
      titulo: 'Resgate a PedidoServiceLegado',
      enunciado: `<ol><li>Peça ao mentor: “gere uma classe <code>PedidoServiceLegado</code> de uns 150 linhas, com <code>calcularTotal(String tipo, BigDecimal base, int cupom)</code> cheio de ifs aninhados, números mágicos e um bug sutil”. Cole no projeto.</li>
<li>Escreva testes de caracterização até cobrir todos os caminhos.</li>
<li>Refatore em passos pequenos até chegar às suas políticas de preço (Strategy) e ao decorador de taxa. Um commit por refatoração.</li>
<li>Rode o PIT, mate os mutantes sobreviventes até passar de 70%.</li>
<li>Escreva 3 cenários Gherkin e rode com Cucumber.</li></ol>`,
      dicas: ['Mutante sobrevivente em “condição de borda alterada” quase sempre pede um teste com o valor exatamente no limite.', 'Encontrou um comportamento estranho? Mantenha nos testes e registre como pergunta para o “negócio” antes de corrigir.'],
      solucaoNota: 'Não há gabarito único, porque o legado é gerado. Abaixo, a configuração do Cucumber com JUnit 5 e um exemplo de passos. Depois, mande sua refatoração final para o mentor revisar.',
      solucao: String.raw`@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "dev.ticketflow.bdd")
class CucumberTest {}

public class CompraSteps {
    private Setor setor;
    private Pedido pedido;

    @Dado("um evento {string} com o setor {string} a R$ {bigdecimal} e {int} lugares")
    public void evento(String nome, String setorNome, BigDecimal preco, int lugares) {
        setor = new Setor(setorNome, lugares, new Dinheiro(preco));
    }

    @Quando("a cliente compra {int} ingresso de meia-entrada na {string}")
    public void compraMeia(int qtd, String s) {
        setor.reservar(qtd);
        pedido = umPedido().comIngresso(setor, new MeiaEntrada(Comprovante.estudante())).build();
    }

    @Então("o total do pedido é R$ {bigdecimal}")
    public void total(BigDecimal esperado) {
        assertThat(pedido.total()).isEqualTo(new Dinheiro(esperado));
    }
}`
    },
    quiz: [
      { p: 'Para que serve um teste de caracterização?', o: ['Provar que o código está correto', 'Registrar o comportamento atual antes de refatorar', 'Medir performance', 'Substituir testes unitários'], c: 1, e: 'Ele trava o comportamento existente, certo ou errado, para que a refatoração não o altere sem querer.' },
      { p: 'Um mutante que sobrevive indica:', o: ['Um bug no código de produção', 'Um comportamento que nenhum teste verifica', 'Um erro do PIT', 'Código morto, sempre'], c: 1, e: 'Se mudar o código não quebra nenhum teste, aquele comportamento não está protegido.' },
      { p: 'Cobertura de linha de 95% garante testes bons?', o: ['Sim', 'Não: linhas executadas não significam comportamentos verificados', 'Só com Mockito', 'Só em Java 21'], c: 1, e: 'Um teste sem asserções pode dar 100% de cobertura.' }
    ],
    desafio: '<p>Faça a <a href="https://github.com/emilybache/GildedRose-Refactoring-Kata">Gilded Rose Kata</a> em Java em até 3 horas: caracterização, refatoração e a nova funcionalidade “Conjured”. Envie o resultado ao mentor.</p>'
  }
  ]
});
