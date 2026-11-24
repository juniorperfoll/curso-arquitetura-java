C.fases.push({
  n: 'F', curto: 'Projeto final', titulo: 'Projeto integrador e portfólio', semanas: 'Semanas 23 e 24',
  resumo: 'Aplicar tudo num domínio novo, sem aula para seguir, e transformar o trabalho em portfólio.',
  objetivo: 'Provar a si mesmo que aprendeu: construir do zero, num domínio que você conhece, um sistema com domínio isolado, decisões registradas, testes de verdade, operação observável e entrega contínua.',
  entrega: 'repositório público com critérios atendidos e vídeo de 5 minutos (tag v1.0)',
  checklist: [
    'Domínio escolhido e Event Storming feito',
    'Domínio isolado: regras ArchUnit passando, zero import de Spring em <code>domain</code>',
    'Mapa de contextos e glossário da linguagem ubíqua no README',
    'Cobertura acima de 80%, <i>mutation score</i> acima de 70%, análise estática sem bloqueadores',
    'Testcontainers com banco e broker reais',
    '<code>docker compose up</code> funciona; painéis de métricas e tracing',
    'Um cenário de falha provocado e documentado',
    'Pelo menos 5 ADRs e diagramas C4 níveis 1 a 3',
    'Pipeline verde a cada push',
    'README com como rodar em 3 comandos e vídeo de 5 minutos explicando a arquitetura'
  ],
  leituras: ['<i>Fundamentos da Arquitetura de Software</i>, Mark Richards e Neal Ford: capítulos sobre características arquiteturais e trade-offs', '<i>System Design Interview</i>, Alex Xu, para treinar a explicação de arquiteturas'],
  aulas: [
  {
    titulo: 'Escolha do domínio e modelagem', duracao: '4 h', resumo: 'Escolha um domínio, descubra os contextos e planeje a arquitetura antes de codificar.',
    objetivos: ['Escolher um domínio com regras de negócio reais', 'Produzir Event Storming, mapa de contextos e ADRs iniciais', 'Definir características arquiteturais prioritárias'],
    teoria: `
<h3>Escolha um domínio que você conhece</h3>
<p>Quanto melhor você conhece o negócio, mais rica a modelagem. Sugestões próximas do seu dia a dia:</p>
<ul><li><b>Agendamento de audiências</b>: salas, juízes, partes, conflitos de agenda, remarcações, prazos.</li><li><b>Controle de prazos processuais</b>: contagem em dias úteis, feriados, suspensões, alertas.</li><li><b>Matrícula em disciplinas</b>: pré-requisitos, vagas, choque de horário, lista de espera.</li><li><b>Banca de TCC</b>: disponibilidade de avaliadores, distribuição, notas, atas.</li></ul>
<h3>Características arquiteturais</h3>
<p>Escolha no máximo três prioridades (Richards e Ford): disponibilidade, escalabilidade, consistência, auditabilidade, segurança, facilidade de mudança. Elas guiam as decisões. Um sistema de prazos processuais prioriza <b>correção e auditabilidade</b> sobre escala; um sistema de ingressos, <b>escala e consistência</b> no pico.</p>
<h3>Plano antes do código</h3>
<ol><li>Event Storming (2 h).</li><li>Contextos e classificação core/suporte/genérico.</li><li>Três características prioritárias e as decisões que delas decorrem.</li><li>ADRs: estilo arquitetural, persistência, comunicação entre contextos.</li><li>Backlog em fatias verticais (cada item vai do endpoint ao banco).</li></ol>`,
    codigo: [
      { titulo: 'Modelo de README do projeto final', lang: 'shell', src: String.raw`# <Nome do sistema>

<uma frase sobre o problema que resolve>

## Rodar em 3 comandos
git clone ... && cd ...
docker compose up -d --build
open http://localhost:8080/swagger-ui.html

## Arquitetura
- Estilo: monólito modular hexagonal (ver docs/adr/0002)
- Contextos: ... (mapa em docs/arquitetura/contextos.png)
- Características prioritárias: correção, auditabilidade, facilidade de mudança

## Linguagem ubíqua
| Termo | Significado |
|-------|-------------|

## Qualidade
badge CI | cobertura | mutation score

## O que eu faria diferente
...` }
    ],
    exercicio: {
      titulo: 'Kickoff do projeto final',
      enunciado: `<ol><li>Escolha o domínio e escreva o problema em um parágrafo.</li>
<li>Faça o Event Storming e fotografe ou exporte.</li>
<li>Escreva os ADRs 1 a 3 (registrar decisões, estilo arquitetural, persistência).</li>
<li>Monte o backlog com 10 a 15 fatias verticais, ordenadas por risco (o mais arriscado primeiro).</li>
<li>Envie o resumo para o mentor e peça uma crítica como se ele fosse o arquiteto revisor.</li></ol>`,
      dicas: ['Fatia vertical boa: “Agendar audiência sem conflito de sala” (endpoint, caso de uso, regra, persistência, teste). Fatia ruim: “Criar todas as tabelas”.', 'O item mais arriscado costuma ser a regra de negócio mais complexa ou a integração externa.'],
      solucaoNota: 'Não há gabarito para o seu domínio. Este é um exemplo de backlog para “agendamento de audiências”.',
      solucao: [{ titulo: 'Exemplo de backlog', lang: 'shell', src: String.raw`1. Agendar audiência garantindo que sala e juiz não tenham conflito (regra central, concorrência)
2. Calcular data-limite de intimação em dias úteis com feriados (regra complexa)
3. Remarcar audiência com motivo e histórico (auditabilidade)
4. Consultar pauta do dia por sala (read model)
5. Notificar partes por evento AudienciaAgendada (mensageria + outbox)
6. Importar feriados de um serviço externo via ACL
7. Cancelar audiência e liberar sala
8. Painel de ocupação de salas por semana
9. Autenticação com papéis SERVIDOR e MAGISTRADO
10. Observabilidade: métricas de agendamentos e conflitos recusados` }]
    },
    quiz: [
      { p: 'Por que limitar a três características arquiteturais prioritárias?', o: ['Por superstição', 'Porque otimizar tudo ao mesmo tempo é impossível; prioridades guiam trade-offs', 'Porque o Spring só suporta três', 'Não há motivo'], c: 1, e: 'Cada característica tem custo; escolher é o trabalho do arquiteto.' },
      { p: 'Qual item deve vir primeiro no backlog?', o: ['O mais fácil', 'O de maior risco técnico ou de negócio', 'A tela de login', 'O CRUD de cadastros'], c: 1, e: 'Atacar o risco cedo evita descobrir tarde que a arquitetura não serve.' },
      { p: 'O que é uma fatia vertical?', o: ['Uma camada inteira do sistema', 'Uma funcionalidade pequena que atravessa todas as camadas, do endpoint ao banco', 'Um microsserviço', 'Uma tabela'], c: 1, e: 'Entrega valor e valida a arquitetura de ponta a ponta.' }
    ]
  },
  {
    titulo: 'Construção guiada por qualidade', duracao: '8 h ou mais', resumo: 'Construa fatia por fatia, com o checklist de qualidade como definição de pronto.',
    objetivos: ['Entregar fatias verticais com TDD e testes de integração', 'Manter a arquitetura verificada pelo build', 'Usar o mentor como revisor de código a cada fatia'],
    teoria: `
<h3>Definição de pronto para cada fatia</h3>
<ul><li>Teste de unidade da regra (escrito antes).</li><li>Teste de integração do caminho completo (Testcontainers).</li><li>ArchUnit e Modulith verdes.</li><li>Métrica de negócio, se a fatia gerar um fato relevante.</li><li>ADR, se houve decisão nova.</li><li>Revisão do mentor com nota ≥ 8 ou pendências registradas como issues.</li></ul>
<h3>Ritmo</h3>
<p>Uma a duas fatias por sessão. Faça commit pequeno, push e veja o pipeline. Se uma fatia levar mais de duas sessões, ela está grande: divida.</p>
<h3>Erros comuns no projeto final</h3>
<ul><li>Começar pela infraestrutura e nunca chegar nas regras.</li><li>Copiar o TicketFlow e só renomear classes. O valor está em decidir de novo, para outro domínio.</li><li>Microsserviços “porque sim”. Justifique ou mantenha um monólito modular.</li><li>Pular o teste de falha. É ele que mostra maturidade.</li></ul>`,
    codigo: [
      { titulo: 'Prompt para revisão de cada fatia', lang: 'shell', src: String.raw`Revise esta fatia do meu projeto final (<nome da fatia>).
Contexto: domínio <X>, arquitetura hexagonal, características prioritárias <A, B, C>.
Avalie: correção da regra, onde a regra mora, testes faltando, nomes da linguagem ubíqua,
acoplamentos indevidos e se a decisão merece um ADR. Dê nota de 0 a 10.` }
    ],
    exercicio: {
      titulo: 'Entregue o backlog',
      enunciado: `<p>Implemente as fatias do seu backlog, na ordem de risco, cumprindo a definição de pronto. A cada fatia:</p><ol><li>Cole o caso de uso e o teste principal na aba “Revisar meu código” do mentor.</li><li>Corrija ou registre as pendências como issues no GitHub.</li><li>Marque o item do checklist da etapa quando aplicável.</li></ol><p>Ao final, provoque uma falha relevante para o seu domínio (dependência externa fora, pico de carga, mensagem duplicada) e documente o comportamento.</p>`,
      dicas: ['Mantenha uma lista “decisões a registrar” enquanto codifica; escreva os ADRs no fim de cada sessão.', 'Se travar numa regra, descreva-a ao mentor em linguagem de negócio antes de pedir código.'],
      solucaoNota: 'O gabarito aqui é a sua própria suíte de testes passando e o checklist cumprido. Use o modelo abaixo para o relato da falha provocada.',
      solucao: [{ titulo: 'docs/falha-provocada.md (modelo)', lang: 'shell', src: String.raw`# Falha provocada: <serviço de feriados indisponível>

## Hipótese
Se o serviço de feriados cair, o agendamento continua usando o último calendário em cache
e marca o cálculo como "a confirmar".

## Como provocamos
Toxiproxy: timeout total no proxy feriados durante 5 minutos, com 50 agendamentos/min.

## Resultado observado
- p95 do agendamento: 180 ms -> 220 ms
- circuito aberto após 12 s
- 0 erros para o usuário; 61 agendamentos marcados "a confirmar"
- job de reconciliação confirmou todos em 2 min após o retorno

## Ajustes feitos
- reduzido timeout de 2 s para 800 ms` }]
    },
    quiz: [
      { p: 'Uma fatia levou três sessões e ainda não terminou. O que fazer?', o: ['Continuar até acabar', 'Dividir em fatias menores', 'Pular os testes', 'Desistir da fatia'], c: 1, e: 'Fatias grandes escondem risco e atrasam feedback.' },
      { p: 'Qual erro é mais comum em projetos finais?', o: ['Testar demais', 'Começar pela infraestrutura e não chegar às regras de negócio', 'Ter poucos ADRs', 'Usar Java 21'], c: 1, e: 'O valor está no domínio; a infraestrutura vem para servir a ele.' },
      { p: 'Por que provocar uma falha de propósito?', o: ['Para quebrar o projeto', 'Para verificar que as defesas funcionam e conhecer o comportamento real sob falha', 'Por exigência do Docker', 'Para gerar logs'], c: 1, e: 'Resiliência não testada é suposição.' }
    ]
  },
  {
    titulo: 'Portfólio, apresentação e próximos passos', duracao: '3 h', resumo: 'Transforme o projeto em portfólio, treine a explicação e planeje a continuação.',
    objetivos: ['Apresentar uma arquitetura em 5 minutos com clareza', 'Defender decisões com trade-offs', 'Planejar os próximos passos de carreira em arquitetura'],
    teoria: `
<h3>Os 5 minutos que mostram senioridade</h3>
<ol><li><b>Problema</b> (30 s): o que o sistema resolve e para quem.</li><li><b>Características prioritárias</b> (30 s): as três e por quê.</li><li><b>Visão C4</b> (1 min): contexto e containers.</li><li><b>Duas decisões difíceis</b> (2 min): alternativas, escolha, custo aceito.</li><li><b>Prova</b> (1 min): testes, painel, falha provocada.</li><li><b>O que faria diferente</b> (30 s).</li></ol>
<p>Falar de trade-offs e do que você faria diferente vale mais do que listar tecnologias.</p>
<h3>Perguntas que você deve saber responder</h3>
<ul><li>Por que não microsserviços desde o início?</li><li>Como você garante que não há venda duplicada ou conflito de agenda com várias instâncias?</li><li>O que acontece se o broker cair?</li><li>Como um novo desenvolvedor entende o sistema em um dia?</li><li>Qual parte você mais teme mudar, e por quê?</li></ul>
<h3>Próximos passos</h3>
<ul><li><b>Certificação</b>: Oracle Certified Professional Java SE 21 Developer (1Z0-830) valida a base da linguagem.</li><li><b>Kubernetes</b>: leve o Compose para um cluster (kind ou k3d localmente) com Helm.</li><li><b>Cloud</b>: deploy em AWS (ECS ou EKS, RDS, MSK) ou equivalente, com infraestrutura como código.</li><li><b>Arquitetura evolutiva</b>: funções de aptidão (fitness functions) além do ArchUnit.</li><li><b>Ensino</b>: transformar partes do TicketFlow em material das suas disciplinas é a melhor forma de consolidar.</li></ul>`,
    codigo: [],
    exercicio: {
      titulo: 'Grave, publique e peça a banca',
      enunciado: `<ol><li>Grave o vídeo de 5 minutos seguindo o roteiro e coloque o link no README.</li>
<li>Peça ao mentor: “Faça o papel de banca de arquitetura e me faça 8 perguntas difíceis sobre este projeto, uma por vez, avaliando cada resposta.” Responda por escrito.</li>
<li>Publique a tag <code>v1.0</code> e um post curto (LinkedIn ou blog) com as três lições mais importantes.</li>
<li>Escreva seu plano dos próximos 3 meses: uma certificação, um tema de aprofundamento e uma aplicação no trabalho.</li></ol>`,
      dicas: ['Ensaie o vídeo duas vezes com cronômetro antes de gravar.', 'No post, mostre uma decisão com trade-off, não uma lista de tecnologias.'],
      solucaoNota: 'Roteiro de exemplo do vídeo, para adaptar.',
      solucao: [{ titulo: 'Roteiro do vídeo', lang: 'shell', src: String.raw`00:00 Problema: "Varas perdem audiências por conflito de sala e de agenda do juiz."
00:30 Prioridades: correção, auditabilidade, facilidade de mudança.
01:00 C4: usuários, API em monólito modular, PostgreSQL, Kafka, serviço de feriados.
02:00 Decisão 1: lock otimista na agenda da sala em vez de lock pessimista (por quê, custo).
03:00 Decisão 2: monólito modular, não microsserviços (critérios, quando mudaria).
04:00 Prova: suíte verde, painel de conflitos recusados, falha do serviço de feriados.
04:30 O que faria diferente: read model da pauta desde o início.` }]
    },
    quiz: [
      { p: 'O que mais demonstra maturidade numa apresentação de arquitetura?', o: ['Quantidade de tecnologias', 'Decisões explicadas com alternativas e trade-offs', 'Slides animados', 'Código na tela o tempo todo'], c: 1, e: 'Arquitetura é escolha sob restrições; mostrar o raciocínio é o que importa.' },
      { p: 'Qual certificação valida a base da linguagem Java 21?', o: ['AWS Solutions Architect', 'Oracle Certified Professional Java SE 21 Developer (1Z0-830)', 'CKA', 'Scrum Master'], c: 1, e: 'É a certificação oficial da Oracle para Java SE 21.' },
      { p: 'Fitness functions em arquitetura evolutiva são:', o: ['Testes de academia', 'Verificações automatizadas de características arquiteturais', 'Métricas de RH', 'Funções lambda'], c: 1, e: 'ArchUnit, limites de latência no CI e testes de carga são exemplos.' }
    ]
  }
  ]
});
