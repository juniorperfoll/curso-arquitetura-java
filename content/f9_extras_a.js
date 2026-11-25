/* Elementos didáticos no estilo "Use a Cabeça!" e Casa do Código + vídeos por aula.
   v: vídeos [título, url, idioma]; g: história de abertura; l: Aponte seu lápis [pergunta, resposta];
   q: Não existem perguntas idiotas [[P, R], ...]; c: Poder do cérebro (reflexão sem resposta); b: Pontos de bala */
C.extras = C.extras || {};
Object.assign(C.extras, {
'aula-1-1': {
  v: [['Como criar um projeto Maven multi-módulo', 'https://www.youtube.com/watch?v=laF45Z2gI1I', 'EN'],
      ['Configurando o VS Code para Java', 'https://www.youtube.com/watch?v=vDCGeZehtQg', 'PT']],
  g: `Segunda-feira, 9h. A Ana, organizadora de um festival de música, liga: "Preciso vender 12 mil ingressos em 3 setores, com meia-entrada, lote promocional e sem vender lugar que não existe." Você tem a semana para mostrar algo funcionando. Por onde começa? Não pelo banco, nem pelo Spring. Começa pela <b>estrutura</b> que vai segurar o projeto pelos próximos meses. É isso que você monta nesta aula.`,
  l: ['Sem olhar a aula, desenhe num papel as pastas que um projeto Maven precisa para ter código de produção e testes separados. Onde fica <code>Setor.java</code>? E <code>SetorTest.java</code>?',
      '<code>src/main/java/</code> para produção e <code>src/test/java/</code> para testes, ambos com as mesmas subpastas de pacote. <code>ticketflow-domain/src/main/java/dev/ticketflow/domain/evento/Setor.java</code> e <code>ticketflow-domain/src/test/java/dev/ticketflow/domain/evento/SetorTest.java</code>.'],
  q: [['Por que não usar o Spring Initializr logo de cara e pronto?', 'Porque você quer que o domínio nasça <b>sem</b> framework. Se o primeiro arquivo do projeto já é uma classe Spring, a tentação de anotar tudo com <code>@Entity</code> e <code>@Service</code> vem junto. O Spring entra na Fase 3, num módulo separado.'],
      ['Dois arquivos .vscode no Git? Isso não é configuração pessoal?', 'Não esses dois. <code>extensions.json</code> e <code>settings.json</code> do workspace descrevem o <i>projeto</i>, não você. Preferências pessoais (tema, fonte) continuam nas configurações de usuário do VS Code.']],
  c: 'Se daqui a seis meses outra pessoa clonar seu repositório, o que ela precisa encontrar na raiz para rodar os testes em 2 minutos, sem perguntar nada a você?',
  b: ['Domínio começa em Java puro, num módulo sem dependências de framework.', 'O Maven Wrapper garante a mesma versão do Maven para todos.', 'Teste de sanidade primeiro: prove que JDK, Maven e JUnit conversam.', 'ADR é curto: contexto, decisão, consequências.']
},
'aula-1-2': {
  v: [['Curso POO Java: Encapsulamento', 'https://www.youtube.com/watch?v=x4JfzV0Wb5w', 'PT']],
  g: `Imagine o setor Pista como um porteiro de festa. Um porteiro anêmico tem uma prancheta largada na mesa: qualquer um chega e escreve "+50 pessoas". Um porteiro de verdade segura a prancheta, conta quem entra e diz "lotou" quando lota. Nesta aula você troca o porteiro preguiçoso (getters e setters) pelo porteiro que <b>protege a regra</b>.`,
  l: ['Olhe esta linha: <code>setor.setVendidos(setor.getVendidos() + 2);</code>. Liste dois problemas que ela pode causar no TicketFlow.',
      '1) Ninguém verifica a capacidade: dá para vender acima do limite. 2) A regra “quanto ainda posso vender” fica espalhada em quem chama, então cada lugar do código pode calcular diferente. A correção é <code>setor.reservar(2)</code>.'],
  q: [['Então getter é proibido?', 'Não. Getter que <i>expõe informação</i> (<code>disponiveis()</code>) é ótimo. O problema é setter que deixa mudar o estado sem passar pela regra.'],
      ['Lançar exceção não é “pesado” demais?', 'Para violação de regra de negócio, é exatamente o recado certo: o pedido não pode acontecer. O custo de desempenho é irrelevante perto do custo de um ingresso vendido duas vezes.']],
  c: 'Quais outras invariantes do TicketFlow você consegue listar só pensando no negócio, sem olhar o código?',
  b: ['Objeto rico expõe comportamento, não campos.', 'Invariantes são protegidas no construtor e em cada método que muda estado.', 'Prefira composição à herança.', 'Dependências do mundo externo (como o relógio) entram por interface.']
},
'aula-1-3': {
  v: [['Java Records: como usar records', 'https://www.youtube.com/watch?v=3NshiQIy7p4', 'EN'],
      ['Refatoração: extraindo um Value Object', 'https://www.youtube.com/watch?v=xLSJk1OcAhA', 'EN']],
  g: `Você paga R$ 50 com uma nota de R$ 50. O caixa não pergunta “qual nota de 50 é essa?”: qualquer uma serve. Agora tente trocar seu ingresso com o de outra pessoa na portaria. Aí o número do ingresso importa. Essa diferença entre <b>valer pelo valor</b> e <b>valer pela identidade</b> é o coração desta aula.`,
  l: ['Classifique como entidade ou value object: Pedido, Dinheiro, CPF, Setor, Período do evento, Cliente.',
      'Entidades: Pedido, Setor, Cliente (têm identidade e mudam ao longo do tempo). Value objects: Dinheiro, CPF, Período (valem pelo conteúdo e não mudam).'],
  q: [['Por que não <code>double</code> para dinheiro se “só uso duas casas”?', 'Porque <code>double</code> é binário e não representa 0,1 exatamente. Some milhares de ingressos e o centavo some (ou aparece). <code>BigDecimal</code> com escala fixa resolve.'],
      ['Record pode ter métodos?', 'Pode e deve: <code>mais</code>, <code>vezes</code>, <code>percentual</code>. Um value object com comportamento é muito mais útil que um saco de dados.']],
  c: 'Quantas vezes o seu código atual (no trabalho) valida um CPF? Em quantos lugares? O que mudaria se o tipo <code>Cpf</code> existisse?',
  b: ['Entidade tem identidade; value object vale pelo conteúdo.', 'Records são ideais para value objects: imutáveis e com equals por valor.', 'Valide no construtor compacto: não existe objeto inválido.', 'Dinheiro é BigDecimal com escala normalizada, nunca double.']
},
'aula-1-4': {
  v: [['Java 21 Pattern Matching Tutorial (#RoadTo21)', 'https://www.youtube.com/watch?v=QrwFrm1R8OY', 'EN']],
  g: `Um pedido nasce, é pago, às vezes é cancelado. Parece simples até alguém escrever <code>if (status.equals("PAGO") || status.equals("Pago"))</code>. Nesta aula o compilador vira seu colega de revisão: se você esquecer um estado, o código <b>não compila</b>.`,
  l: ['Desenhe o diagrama de estados do pedido (bolinhas e setas) com Criado, Pago, Cancelado e Expirado. Quais setas são proibidas?',
      'Criado → Pago, Criado → Cancelado, Criado → Expirado, Pago → Cancelado. Proibidas: qualquer saída de Cancelado ou Expirado, e Pago → Pago.'],
  q: [['Sealed interface não é só um enum mais complicado?', 'Enum dá valores fixos; sealed dá <b>tipos</b> fixos, e cada tipo carrega seus próprios dados (o Pago tem idTransacao, o Cancelado tem motivo).'],
      ['E se eu colocar <code>default</code> no switch?', 'Você perde a verificação de exaustividade. Um estado novo cairia no default em silêncio. Evite default em switch sobre tipo selado.']],
  c: 'Onde mais no TicketFlow existe um conjunto fechado de possibilidades que hoje você representaria com String ou boolean?',
  b: ['<code>sealed</code> fecha a hierarquia com <code>permits</code>.', 'Switch sobre tipo selado sem default é verificado pelo compilador.', 'Record patterns desestruturam os dados direto no case.', 'Guardas com <code>when</code> refinam o padrão.']
},
'aula-1-5': {
  v: [['Java Streams: Group By', 'https://www.youtube.com/watch?v=f5HrYF5u9yE', 'PT'],
      ['Dominando o groupingBy (Java Streams, parte 10)', 'https://www.youtube.com/watch?v=wu0ARvSE3Jk', 'EN']],
  g: `Sexta, 18h. A Ana quer saber: quanto o festival faturou, qual setor vendeu mais e quais esgotaram. Você poderia escrever três laços com variáveis temporárias. Ou poderia descrever <i>o que</i> quer e deixar a biblioteca cuidar do <i>como</i>. Bem-vindo aos Streams.`,
  l: ['Traduza para Stream: “para cada item, se o setor for Pista, some a quantidade”.',
      '<code>itens.stream().filter(i -&gt; i.setor().equals("Pista")).mapToInt(ItemVendido::quantidade).sum()</code>'],
  q: [['Stream é sempre mais rápido que for?', 'Não. Em geral o desempenho é parecido. O ganho é de legibilidade e composição. Para lógica com muitas saídas antecipadas, o for continua melhor.'],
      ['Posso usar <code>parallelStream()</code> para acelerar?', 'Só com dados grandes, operações sem efeito colateral e medindo antes e depois. Para relatórios de poucos milhares de itens, quase sempre piora.']],
  c: 'Qual relatório do seu dia a dia (no trabalho ou na faculdade) você conseguiria reescrever com <code>groupingBy</code> em três linhas?',
  b: ['Escolha List, Set ou Map pelo uso, não por hábito.', 'Stream descreve o cálculo; não altere estado externo dentro dele.', '<code>reduce</code> com identidade é seguro para lista vazia.', '<code>groupingBy</code> com downstream é o GROUP BY do Java.']
},
'aula-1-6': {
  v: [['Java 21: Virtual Threads (#RoadTo21)', 'https://www.youtube.com/watch?v=5E0LU85EnTI', 'EN']],
  g: `Abertura das vendas do show mais disputado do ano. 50 mil pessoas clicam em “Comprar” no mesmo segundo para 10 mil lugares. Duas delas leem “resta 1 lugar” ao mesmo tempo, e as duas compram. Parabéns: você acabou de vender o mesmo assento duas vezes. Nesta aula você <b>provoca</b> esse bug de propósito, para nunca mais esquecer como ele acontece.`,
  l: ['Com duas threads A e B e o código <code>if (disponiveis() &gt;= 1) vendidos++;</code>, escreva a sequência de passos que leva a vender 2 ingressos com 1 lugar livre.',
      'A lê disponíveis = 1; B lê disponíveis = 1; A incrementa (vendidos = capacidade); B incrementa (vendidos = capacidade + 1). Verificar e alterar precisam ser uma operação só.'],
  q: [['Virtual threads resolvem a condição de corrida?', 'Não. Elas deixam a concorrência mais barata, mas o problema de duas threads mexendo no mesmo dado continua. Sincronização é responsabilidade sua.'],
      ['Se eu uso lock, por que ainda preciso do banco na Fase 3?', 'Porque o lock vive dentro de uma JVM. Com três instâncias da API, são três locks que não se conhecem. Só um recurso compartilhado (o banco) coordena todas.']],
  c: 'Que outros recursos “escassos” no TicketFlow podem sofrer o mesmo problema? (Pense em cupons com limite de uso.)',
  b: ['Condição de corrida: o resultado depende da ordem das threads.', 'Virtual threads são leves e ótimas para I/O, mas não sincronizam nada.', 'Verificar e alterar estado compartilhado precisa ser atômico.', 'Lock em memória protege uma JVM; entre instâncias, coordene no banco.']
},
'aula-2-1': {
  v: [['SOLID: aprenda SOLID e Arquitetura Limpa', 'https://www.youtube.com/watch?v=oyKVLCO1wJ0', 'PT']],
  g: `O marketing pede para mudar o texto do e-mail de confirmação. Você abre a <code>CompraService</code>, mexe no HTML e... quebra o cálculo de desconto, que estava no mesmo método. Ninguém pediu para mexer no desconto. SOLID é o conjunto de cinco princípios que evitam exatamente esse tipo de surpresa.`,
  l: ['Para cada responsabilidade da <code>CompraService</code> “antes”, escreva quem (que área da empresa) pediria uma mudança nela.',
      'Cálculo de preço: financeiro. Cobrança no PagSeguro: TI ou financeiro (troca de fornecedor). Persistência: TI. Texto e envio do e-mail: marketing. Quatro atores, quatro motivos para mudar.'],
  q: [['Seguir SOLID não gera classes demais?', 'Gera mais classes, sim, cada uma menor e com um motivo para existir. O objetivo não é contar classes, é reduzir o efeito colateral de cada mudança.'],
      ['Preciso aplicar os cinco sempre?', 'Não. Use-os como lentes para diagnosticar dor. O mais importante para arquitetura é o DIP: ele vira a regra da dependência na Fase 4.']],
  c: 'Pense na classe mais temida do sistema em que você trabalha. Quais letras do SOLID ela viola?',
  b: ['SRP: um motivo para mudar, um ator por módulo.', 'OCP: estender sem modificar o que funciona.', 'LSP: subtipo substituível sem surpresas.', 'ISP e DIP: interfaces pequenas, dependências apontando para abstrações.']
},
'aula-2-2': {
  v: [['O padrão de projeto Decorator', 'https://www.youtube.com/watch?v=Rc_3oxrR0Xc', 'PT'],
      ['Introdução ao padrão Builder em Java', 'https://www.youtube.com/watch?v=l-ouMkReapo', 'PT']],
  g: `Pense numa pizza. A massa é a base; cada cobertura <i>envolve</i> a anterior e soma ao preço. Você não cria uma classe <code>PizzaMussarelaComBordaEAzeitona</code>: você empilha. A taxa de conveniência do TicketFlow é uma cobertura. É disso que trata o Decorator.`,
  l: ['Com herança, quantas classes você precisaria para combinar: taxa de conveniência, cupom e teto de taxa (cada um pode estar ou não)?',
      'Até 2³ = 8 combinações, ou seja, 7 subclasses além da base. Com Decorator, são só 3 classes, combinadas em tempo de execução.'],
  q: [['Builder não é exagero para um objeto simples?', 'Para objetos de produção simples, é. O uso que mais compensa é o <i>Test Data Builder</i>: testes legíveis que destacam só o que importa no cenário.'],
      ['Qual a diferença entre Decorator e Adapter, se os dois “envolvem” outro objeto?', 'O Decorator mantém a mesma interface e acrescenta comportamento. O Adapter muda a interface para a que o cliente espera.']],
  c: 'No Java que você já usa, onde há decoradores escondidos? (Dica: <code>new BufferedReader(new InputStreamReader(...))</code>.)',
  b: ['Padrão é vocabulário: nomeie o problema antes de aplicar.', 'Test Data Builder deixa testes curtos e intencionais.', 'Decorator compõe comportamento sem explosão de subclasses.', 'Adapter traduz a interface de terceiros para a sua.']
},
'aula-2-3': {
  v: [['Padrão Strategy na prática com Java e Spring', 'https://www.youtube.com/watch?v=TgfdjuEGY1Y', 'PT'],
      ['Observer na prática (Padrões de Projeto, parte 42)', 'https://www.youtube.com/watch?v=qjvKY1pk2dU', 'PT']],
  g: `O marketing inventa uma campanha por mês: lote promocional, meia para professores, cupom de aniversário. Se cada ideia vira um novo <code>case</code> num switch gigante, em seis meses ninguém tem coragem de mexer no cálculo de preço. Nesta aula, cada regra vira uma <b>estratégia</b> plugável, e cada efeito colateral vira um <b>ouvinte</b>.`,
  l: ['Escreva a assinatura (só a assinatura) de uma nova política “Meia para professores” que exige o número de registro do professor.',
      '<code>public record MeiaProfessor(String registro) implements PoliticaPreco { ... }</code>, e incluir em <code>permits</code>. O compilador mostra os <code>switch</code> que precisam tratá-la.'],
  q: [['Strategy e Decorator não são parecidos?', 'Strategy <i>troca</i> o algoritmo inteiro; Decorator <i>acrescenta</i> comportamento em volta de outro objeto. Você pode usar os dois juntos: uma estratégia de preço decorada com taxa.'],
      ['Observer não deixa o fluxo difícil de seguir?', 'Pode deixar, por isso dê nomes claros aos eventos (no passado: <code>CompraConfirmada</code>) e mantenha a lista de ouvintes fácil de encontrar.']],
  c: 'Que efeito colateral da compra você ainda está fazendo dentro do caso de uso, mas que poderia virar um ouvinte?',
  b: ['Strategy encapsula regras intercambiáveis e cumpre o OCP.', 'Observer desacopla quem publica de quem reage.', 'Um ouvinte com erro não deve derrubar os outros.', 'Regras que combinam políticas pertencem a quem monta o objeto.']
},
'aula-2-4': {
  v: [['Test Driven Development com Java e JUnit 5 + Mockito (mini curso)', 'https://www.youtube.com/watch?v=Wfdb3bx4W9U', 'EN']],
  g: `Você já entregou uma correção que quebrou outra coisa? TDD é como andar de bicicleta com rodinhas que se recolhem sozinhas: você dá passos pequenos, sempre com uma rede embaixo. Vermelho, verde, refatora. Repita até o design aparecer quase sozinho.`,
  l: ['Escreva só o nome (em português, como frase) dos quatro testes do <code>CancelarPedido</code> antes de escrever qualquer código.',
      'Exemplo: <code>cancelaPedidoNaoPagoSemChamarGateway</code>, <code>estornaPedidoPagoDentroDoPrazo</code>, <code>recusaCancelamentoForaDoPrazo</code>, <code>falhaNoEstornoMantemPedidoPago</code>.'],
  q: [['Escrever o teste antes não atrasa a entrega?', 'No primeiro dia, um pouco. Depois, menos tempo depurando e mais coragem para mudar. Em código de regra de negócio, o saldo é positivo.'],
      ['Quando usar mock e quando usar fake?', 'Fake para coisas com estado que você consulta depois (repositório em memória). Mock para verificar uma interação específica e importante (cobrou o valor certo?).']],
  c: 'Qual foi o último bug em produção que um teste de unidade simples teria pegado?',
  b: ['Vermelho, verde, refatora: passos pequenos.', 'Pirâmide: muitos testes de unidade, alguns de integração, poucos ponta a ponta.', 'Fake para estado, mock para interação relevante.', 'Não faça mock de value objects nem de tipos de terceiros.']
},
'aula-2-5': {
  v: [['Webinar Refatoração 1/3: melhorando o código legado', 'https://www.youtube.com/watch?v=kVC3EjizE9k', 'PT'],
      ['Mutation Testing com PITest em Java', 'https://www.youtube.com/watch?v=50wS6U2IWEw', 'EN']],
  g: `Todo desenvolvedor conhece aquela classe de 400 linhas que “funciona, não mexe”. Um dia o negócio pede uma mudança nela. Esta aula é o seu kit de sobrevivência: primeiro você <b>fotografa</b> o comportamento com testes, depois reforma o cômodo sem derrubar a casa.`,
  l: ['Seu teste verifica <code>if (idade &gt;= 60)</code>. O PIT troca para <code>idade &gt; 60</code> e o teste continua verde. O que está faltando?',
      'Um teste com o valor exatamente na borda: idade 60. Mutantes de “condição de borda” sobrevivem quando ninguém testa o limite.'],
  q: [['Teste de caracterização não “congela” bugs?', 'Congela de propósito, por enquanto. Primeiro você garante que a refatoração não muda nada. Depois, com o negócio, decide o que é bug e muda com um teste novo.'],
      ['Mutation score de 100% é a meta?', 'Não. Alguns mutantes são equivalentes (não mudam o comportamento). 70% a 85% no domínio já indica uma suíte forte.']],
  c: 'Se você só pudesse escrever cinco testes para o sistema legado que mais te preocupa, quais comportamentos você fotografaria primeiro?',
  b: ['Legado é código sem testes: caracterize antes de mudar.', 'Refatore em passos pequenos, com a IDE, um commit por passo.', 'Cobertura mede execução; mutação mede verificação.', 'BDD descreve fluxos importantes na linguagem do negócio.']
}
});
