Object.assign(C.extras, {
'aula-3-1': {
  v: [['Dependency Injection e Inversion of Control no Spring', 'https://www.youtube.com/watch?v=FHii0xjGN5g', 'EN']],
  g: `Num restaurante, você não entra na cozinha para montar o prato: pede ao garçom e a cozinha entrega tudo pronto. O Spring é a cozinha. Você descreve o que cada classe precisa (pelo construtor) e ele monta, conecta e serve os objetos. Esta aula mostra a cozinha por dentro, sem mágica.`,
  l: ['Sem olhar o código da aula: como registrar <code>PrecoBase</code> (classe pura do domínio, sem anotações) como bean do Spring?',
      'Num método anotado com <code>@Bean</code> dentro de uma classe <code>@Configuration</code> no módulo da API: <code>@Bean CalculadoraPreco calc() { return new PrecoBase(); }</code>. O domínio continua sem Spring.'],
  q: [['Por que não <code>@Autowired</code> no campo, que é mais curto?', 'Porque esconde as dependências, impede campos <code>final</code> e obriga a subir o Spring para testar. Construtor é explícito e testável com um simples <code>new</code>.'],
      ['Autoconfiguração não é mágica demais?', 'É convenção. Rode a aplicação com <code>--debug</code> e o Spring imprime o relatório de quais configurações aplicou e por quê.']],
  c: 'Quais classes do seu domínio precisariam virar beans? E quais nunca deveriam saber que o Spring existe?',
  b: ['Spring é um container de IoC: ele cria e conecta objetos.', 'Injeção por construtor sempre.', 'Classes do domínio viram beans por <code>@Bean</code>, sem anotações no domínio.', 'Configuração tipada com <code>@ConfigurationProperties</code> e validação na subida.']
},
'aula-3-2': {
  v: [['Spring 6 e Problem Details', 'https://www.youtube.com/watch?v=4YyJUS_7rQE', 'EN'],
      ['API REST com Spring Boot: tratamento de exceções', 'https://www.youtube.com/watch?v=ac7JWdD3CZ0', 'PT']],
  g: `Um app de celular chama sua API e recebe <code>500 Internal Server Error</code> com uma stack trace de 80 linhas. O desenvolvedor do app não sabe se foi culpa dele, se pode tentar de novo ou se o setor esgotou. Uma API bem desenhada <b>conversa</b> com quem a usa: status certo, mensagem clara, formato padrão.`,
  l: ['Escolha o status HTTP: (a) JSON malformado; (b) token ausente; (c) cliente tentando criar evento; (d) setor esgotado; (e) cancelar pedido já cancelado.',
      '(a) 400; (b) 401; (c) 403; (d) 422; (e) 409.'],
  q: [['Por que não retornar sempre 200 com um campo “sucesso: false”?', 'Porque proxies, caches, monitoramento e clientes HTTP entendem status. Esconder erro em 200 engana todos eles e polui suas métricas.'],
      ['DTO e entidade são quase iguais, por que duplicar?', 'Hoje são parecidos; amanhã a entidade ganha um campo interno e o contrato da API não deve mudar junto. DTO é o contrato público.']],
  c: 'Se você fosse o desenvolvedor do app de celular, o que gostaria de ler no corpo de um erro 422?',
  b: ['Recursos com substantivos, ações de negócio como sub-recursos.', 'Status HTTP carregam significado: use o certo.', 'DTOs (records) separam contrato público de modelo interno.', 'ProblemDetail padroniza erros (RFC 9457) num único advice.']
},
'aula-3-3': {
  v: [['O problema N+1 no Spring Data JPA e como corrigir', 'https://www.youtube.com/watch?v=NNYaknokxeI', 'EN']],
  g: `Em desenvolvimento, com 5 eventos no banco, a tela abre em 40 ms. Em produção, com 500 eventos, leva 6 segundos. O código é o mesmo; o número de consultas, não. Nesta aula você aprende a <b>enxergar</b> o SQL que o JPA gera e a impedir, no banco, que dois compradores levem o mesmo lugar.`,
  l: ['Com 50 eventos e acesso a <code>evento.getSetores()</code> num laço, quantas consultas são executadas sem <code>JOIN FETCH</code>? E com?',
      'Sem: 1 (eventos) + 50 (setores de cada evento) = 51. Com JOIN FETCH: 1.'],
  q: [['Por que não usar <code>ddl-auto=update</code> e deixar o Hibernate criar as tabelas?', 'Porque você perde o controle do schema e o histórico de mudanças. Com Flyway, cada alteração é um arquivo versionado, revisado e repetível em qualquer ambiente.'],
      ['Locking otimista ou pessimista?', 'Otimista quando conflitos são raros e a transação é curta (a maioria dos casos). Pessimista (<code>SELECT ... FOR UPDATE</code>) quando o conflito é frequente e retentar sai caro.']],
  c: 'Qual tela do sistema em que você trabalha fica mais lenta conforme os dados crescem? Será um N+1?',
  b: ['Flyway versiona o schema: nunca edite migration aplicada.', 'N+1: uma consulta por item ao acessar associação LAZY.', 'Transação curta, nada de HTTP externo dentro dela.', '<code>@Version</code> + retry impede overbooking entre instâncias.']
},
'aula-3-4': {
  v: [['Spring Boot 3 Security: OAuth2 Resource Server', 'https://www.youtube.com/watch?v=IPHKhHItrBg', 'EN']],
  g: `Na portaria do show, o segurança não liga para a bilheteria a cada pessoa: ele confere a pulseira. A pulseira tem a cor do setor e não dá para falsificar. O JWT é a pulseira da sua API: carrega quem você é e o que pode fazer, com uma assinatura que a API confere sozinha.`,
  l: ['Qual a diferença entre autenticação e autorização? Dê um exemplo de cada no TicketFlow.',
      'Autenticação: provar quem você é (login devolve o token; sem token, 401). Autorização: o que você pode fazer (cliente tentando criar evento recebe 403; cliente B cancelando pedido de A recebe 404).'],
  q: [['Se o JWT é só um texto em Base64, qualquer um não pode ler?', 'Pode ler, sim. Por isso não coloque dados sensíveis nele. O que ninguém consegue é <i>alterar</i> sem invalidar a assinatura.'],
      ['Como “deslogar” alguém com JWT stateless?', 'Tokens curtos (minutos a uma hora) + refresh token, ou uma lista de revogação. Em produção, use um provedor de identidade que cuida disso.']],
  c: 'Que dados você colocaria nas claims do token do TicketFlow? E quais nunca colocaria?',
  b: ['401 é “quem é você?”; 403 é “você não pode”.', 'JWT stateless facilita escalar horizontalmente.', 'Papel não basta: verifique o dono do recurso.', 'Segredos vêm de variáveis de ambiente, nunca do Git.']
},
'aula-3-5': {
  v: [['Spring Boot Testcontainers: testes de integração fáceis', 'https://www.youtube.com/watch?v=erp-7MCK5BU', 'EN']],
  g: `“Na minha máquina passa.” O teste usava H2; produção usa PostgreSQL. Uma constraint, uma função de data, um lock diferente, e o bug só aparece no cliente. Testcontainers sobe o <b>banco de verdade</b> num container descartável a cada execução de testes. Fim do “na minha máquina passa”.`,
  l: ['Para cada teste, escolha a fatia: (a) consulta com JOIN FETCH; (b) status 422 do controller; (c) login + compra + cancelamento.',
      '(a) <code>@DataJpaTest</code> com container; (b) <code>@WebMvcTest</code>; (c) <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code>.'],
  q: [['Testcontainers não deixa a suíte lenta?', 'O primeiro container leva alguns segundos; com reuso e uma configuração compartilhada, os testes seguintes ficam rápidos. É um preço pequeno pela confiança.'],
      ['Preciso de Swagger se tenho o arquivo .http?', 'São complementares: o Swagger documenta o contrato para quem consome; o .http é o seu roteiro de testes manuais versionado.']],
  c: 'Qual teste da sua empresa hoje é “instável” (passa às vezes)? Ele depende de um ambiente compartilhado?',
  b: ['Teste contra o mesmo banco de produção, em container.', '<code>@ServiceConnection</code> configura a conexão sozinho.', 'Failsafe roda os *IT no <code>mvn verify</code>.', 'Documente a API com springdoc e mantenha um .http no repositório.']
},
'aula-3-6': {
  v: [['Spring Boot 4: o que há de novo', 'https://www.youtube.com/watch?v=ZBVa5y6-GTw', 'EN'],
      ['Guia de migração para o Spring Boot 4', 'https://www.youtube.com/watch?v=qMQgCMe0kh0', 'EN']],
  g: `Trocar a versão de um framework é como trocar o motor de um carro em movimento. Dá para fazer, desde que você tenha instrumentos no painel. Os seus instrumentos são os testes que você escreveu nas aulas anteriores. Agora eles vão trabalhar a seu favor.`,
  l: ['Coloque em ordem: (a) trocar para 4.0; (b) rodar a suíte; (c) subir para a última 3.x; (d) zerar depreciações; (e) corrigir imports e starters.',
      'c → d → b → a → e → b (rodar a suíte de novo no fim).'],
  q: [['Posso pular a última 3.x e ir direto para a 4?', 'Pode, mas você perde os avisos de depreciação que apontam exatamente o que vai quebrar. Ir pela 3.x final costuma ser mais rápido no total.'],
      ['E se uma biblioteca de terceiros ainda não suportar o Boot 4?', 'Registre num ADR, procure alternativa ou espere. Por isso a migração fica numa branch, com merge só quando tudo estiver verde.']],
  c: 'Quanto tempo o sistema em que você trabalha está atrás da versão atual do framework? O que impede a atualização?',
  b: ['Migre primeiro para a última versão menor.', 'Depreciações de hoje são as quebras de amanhã.', 'Suíte de testes é o painel de instrumentos da migração.', 'Registre problemas e soluções num documento de migração.']
},
'aula-4-1': {
  v: [['Clean Architecture (Dicionário do Programador)', 'https://www.youtube.com/watch?v=ow8UUjS5vzU', 'PT']],
  g: `Numa casa bem construída, você troca a geladeira sem quebrar a parede. A tomada é o contrato: qualquer geladeira que encaixe funciona. Arquitetura de software é decidir onde ficam as tomadas, para trocar banco, framework ou fornecedor sem demolir as regras de negócio.`,
  l: ['Desenhe as camadas do MVC tradicional com as setas de dependência. Agora desenhe a versão com a regra da dependência. O que mudou de direção?',
      'MVC: Controller → Service → Repository → Banco. Na versão limpa, o Repository vira uma interface no núcleo, e o adaptador JPA aponta para ela: a seta entre negócio e banco inverte.'],
  q: [['Clean, Hexagonal e Onion: qual eu escolho?', 'Tanto faz o nome: todas aplicam a regra da dependência. Escolha um vocabulário para o time e seja consistente.'],
      ['Todo projeto precisa disso?', 'Não. CRUD simples vive bem em camadas. A arquitetura limpa se paga quando as regras são ricas e o sistema vai viver anos.']],
  c: 'No sistema em que você trabalha, quantos arquivos mudariam se o banco fosse trocado amanhã?',
  b: ['Arquitetura existe para reduzir o custo de mudança.', 'Dependências de código apontam para dentro.', 'O núcleo define interfaces; a borda as implementa.', 'Toda escolha tem custo: registre os contras no ADR.']
},
'aula-4-2': {
  v: [['Padrões de Arquitetura de Software com Spring Boot (Limpa e Hexagonal)', 'https://www.youtube.com/watch?v=Vf2rykpfgAI', 'PT']],
  g: `Um caso de uso é como o roteiro de um garçom experiente: recebe o pedido, consulta a cozinha, confirma o pagamento, avisa o cliente. Ele não cozinha (isso é o domínio) e não fabrica pratos (isso é a infraestrutura). Ele <b>orquestra</b>. Nesta aula você escreve os seus primeiros “garçons”.`,
  l: ['Quais portas de saída o caso de uso <code>CancelarPedido</code> precisa? Liste só os nomes das interfaces.',
      'Algo como <code>CarregarPedido</code>, <code>SalvarPedido</code>, <code>EstornarPagamento</code>, <code>LiberarLugares</code> e <code>PublicarEventos</code>.'],
  q: [['Uma porta por operação não gera interfaces demais?', 'Gera várias interfaces pequenas, e o adaptador pode implementar várias delas. O ganho é que cada caso de uso declara exatamente o que usa.'],
      ['Posso deixar <code>@Transactional</code> no caso de uso?', 'É um atalho aceitável e comum, desde que consciente e registrado. A alternativa pura é envolver a transação na configuração dos beans.']],
  c: 'Se você remover o Spring do classpath, quantos testes do seu caso de uso continuam rodando?',
  b: ['Caso de uso orquestra; o domínio decide.', 'Comando de entrada e resultado de saída são records.', 'Portas pequenas, definidas pelo caso de uso.', 'Os testes de integração antigos provam que nada mudou por fora.']
},
'aula-4-3': {
  v: [['Arquitetura Hexagonal na Prática', 'https://www.youtube.com/watch?v=UKSj5VJEzps', 'PT'],
      ['Hexagonal Architecture, com Alistair Cockburn (o criador)', 'https://www.youtube.com/watch?v=k0ykTxw7s0Y', 'EN']],
  g: `Pense no seu notebook: USB, HDMI e tomada são portas. Mouse, monitor e carregador são adaptadores. O notebook não sabe a marca do mouse. Na arquitetura hexagonal, a aplicação é o notebook, e o banco, o gateway de pagamento e a API REST são periféricos plugados nas portas.`,
  l: ['Classifique como adaptador primário ou secundário: controller REST, repositório JPA, consumidor Kafka, cliente HTTP do gateway, job agendado.',
      'Primários (acionam a aplicação): controller REST, consumidor Kafka, job agendado. Secundários (são acionados): repositório JPA, cliente HTTP do gateway.'],
  q: [['Separar entidade de domínio e entidade JPA vale o trabalho?', 'No contexto central (Vendas), sim: o domínio fica livre de construtor vazio e setters. Em contextos simples, anotar o domínio pode ser um atalho aceitável. Registre a escolha.'],
      ['O que é o “reconstituir”?', 'Uma fábrica que recria o objeto a partir do banco sem reaplicar regras de criação. Um evento que já aconteceu é válido no banco, mesmo que não pudesse ser criado hoje.']],
  c: 'Qual adaptador do TicketFlow você acha que vai ser trocado primeiro na vida real? Por quê?',
  b: ['Portas pertencem à aplicação; adaptadores, à borda.', 'Primários acionam; secundários são acionados.', 'Mapper converte entre domínio e persistência.', 'Mais classes é o preço do domínio puro: avalie e registre.']
},
'aula-4-4': {
  v: [['Subdomínios e contextos delimitados', 'https://www.youtube.com/watch?v=9hlRHZ4Pfyo', 'PT'],
      ['Context Mapping', 'https://www.youtube.com/watch?v=yhlaNZ7c494', 'PT'],
      ['Event Storming explicado com exemplos reais', 'https://www.youtube.com/watch?v=l93N4XaQJok', 'EN']],
  g: `Pergunte “o que é um evento?” ao marketing e ouvirá: fotos, atrações, descrição. Pergunte à bilheteria: setores, capacidade, preço. Pergunte ao financeiro: nem existe, o que existe é cobrança. Todos estão certos, cada um no seu <b>contexto</b>. Tentar um único modelo de Evento para todos é a receita da classe de 3 mil linhas.`,
  l: ['Escreva 10 eventos de domínio do TicketFlow no passado, como post-its de Event Storming.',
      'Exemplos: Evento publicado, Vendas abertas, Lote encerrado, Pedido criado, Lugares reservados, Pagamento aprovado, Ingresso emitido, Pedido expirado, Pedido cancelado, Entrada registrada na portaria.'],
  q: [['Bounded context é o mesmo que microsserviço?', 'Não. É uma fronteira de modelo. Pode virar um microsserviço, mas também pode ser um módulo dentro de um monólito, que é o caso do TicketFlow nesta fase.'],
      ['Preciso de especialistas de negócio para fazer Event Storming?', 'Idealmente sim. Sem eles, faça com o que você sabe e valide depois: o resultado ainda é muito melhor que pular direto para as tabelas.']],
  c: 'No sistema em que você trabalha, que palavra tem significados diferentes para áreas diferentes?',
  b: ['Core recebe o melhor design; genérico, compre ou integre.', 'Bounded context é onde um modelo e sua linguagem são consistentes.', 'Event Storming revela contextos pelos eventos do negócio.', 'O mapa de contextos explicita como eles se relacionam.']
},
'aula-4-5': {
  v: [['Domain Driven Design: agregados, entidades e value objects', 'https://www.youtube.com/watch?v=3U09ez40oSw', 'PT'],
      ['Eventos de Domínio', 'https://www.youtube.com/watch?v=_By3QRBMHSo', 'PT']],
  g: `Um agregado é como uma mala com cadeado: tudo que está dentro viaja junto e só o dono (a raiz) abre. Se você coloca a casa inteira na mala, ela fica pesada e todo mundo briga pela chave. Agregados pequenos, referências por id, eventos entre eles: é isso que deixa o TicketFlow aguentar milhares de compras simultâneas.`,
  l: ['Por que <code>Pedido</code> guarda <code>EventoId</code> e não o objeto <code>Evento</code> inteiro?',
      'Para não carregar nem travar o evento a cada compra, manter fronteiras claras entre agregados e permitir que cada um evolua (e seja salvo) de forma independente.'],
  q: [['Se agregados não podem mudar juntos, como a compra altera Pedido e Disponibilidade?', 'Ou você aceita conscientemente as duas alterações na mesma transação (exceção documentada), ou reserva primeiro e cria o pedido por evento, com consistência eventual. A aula pede que você escolha e registre.'],
      ['Quem publica os eventos de domínio?', 'O agregado só registra. A aplicação publica depois de salvar. Assim o domínio não depende de Spring nem de Kafka.']],
  c: 'Que regra do TicketFlow precisa ser verdadeira no mesmo instante, e qual pode ficar consistente alguns segundos depois?',
  b: ['Agregado é a unidade de consistência; acesso só pela raiz.', 'Agregados pequenos, referência a outros por id.', 'Ids tipados evitam trocar um UUID por outro.', 'Domínio registra eventos; aplicação publica.']
},
'aula-4-6': {
  v: [['Introdução ao Spring Modulith: monólitos modulares', 'https://www.youtube.com/watch?v=xHlDyKVyvig', 'EN'],
      ['Documentando e testando sua arquitetura Java com ArchUnit', 'https://www.youtube.com/watch?v=KWN6LbLg6LQ', 'PT']],
  g: `Regra de arquitetura escrita na wiki tem a mesma vida útil de uma placa de “não pise na grama”: dura até o primeiro prazo apertado. Nesta aula a regra vira teste. Alguém importou Spring no domínio? O build quebra, com uma mensagem dizendo exatamente onde.`,
  l: ['Escreva em português, como frase, três regras de arquitetura do TicketFlow que você quer verificar automaticamente.',
      'Ex.: “Classes de domain não dependem de Spring nem de JPA”; “Web não é acessada por nenhuma camada”; “Vendas não usa classes internas de Pagamentos”.'],
  q: [['ArchUnit e Spring Modulith não fazem a mesma coisa?', 'Se sobrepõem. ArchUnit é genérico e flexível para qualquer regra; Modulith entende módulos Spring, gera documentação e ajuda com eventos entre módulos. Usar os dois é comum.'],
      ['Por que diagramas C4 se o código já está organizado?', 'Porque pessoas novas (e você daqui a um ano) entendem o sistema pelo desenho em minutos. O C4 dá zoom: do sistema inteiro até os componentes.']],
  c: 'Se você pudesse impor uma única regra de arquitetura automática no sistema em que trabalha, qual seria?',
  b: ['ACL traduz conceitos, não só formatos.', 'Monólito modular antes de microsserviços.', 'Regras de arquitetura viram testes com ArchUnit.', 'C4: contexto, containers, componentes, código.']
}
});
