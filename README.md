<div align="center">

# ☕ Curso de Arquitetura Java

### Do Java moderno aos microsserviços, construindo um sistema real: o **TicketFlow**

<br>

<a href="https://juniorperfoll.github.io/curso-arquitetura-java/">
  <img src="https://img.shields.io/badge/ACESSAR_O_CURSO-▶-E76F00?style=for-the-badge&labelColor=1F2937" alt="Acessar o curso" height="48">
</a>

<br><br>

**🔗 [juniorperfoll.github.io/curso-arquitetura-java](https://juniorperfoll.github.io/curso-arquitetura-java/)**

<br>

![Java 21](https://img.shields.io/badge/Java-21_LTS-E76F00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x_→_4-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka_|_RabbitMQ-mensageria-231F20?logo=apachekafka&logoColor=white)
![VS Code](https://img.shields.io/badge/IDE-VS_Code-007ACC?logo=visualstudiocode&logoColor=white)

[![Deploy](https://github.com/juniorperfoll/curso-arquitetura-java/actions/workflows/pages.yml/badge.svg)](https://github.com/juniorperfoll/curso-arquitetura-java/actions/workflows/pages.yml)

</div>

---

## 🎯 O que você vai construir

Em **24 semanas**, você evolui um único projeto (o **TicketFlow**, uma plataforma de venda de ingressos) de um módulo de domínio em Java puro até um sistema distribuído, observável e pronto para portfólio.

Cada aula traz **objetivos**, **teoria curta**, **código comentado** e um **exercício** aplicado ao TicketFlow. Seu progresso fica salvo no navegador.

## 🗺️ Trilha

| Fase | Tema | Semanas | Entrega |
|:---:|---|:---:|---|
| **1** | ☕ Java moderno e orientação a objetos | 1–3 | Domínio testado com records, sealed types e virtual threads · `v0.1-dominio` |
| **2** | 🧩 Design de código: SOLID, padrões e testes | 4–6 | Políticas de preço com padrões, TDD e testes de mutação |
| **3** | 🌱 Spring Boot e APIs REST profissionais | 7–10 | API com JPA, Flyway, JWT e Testcontainers · `v0.2-api` |
| **4** | 🏛️ Clean Architecture, Hexagonal e DDD | 11–14 | Módulos limpos, mapa de contextos, C4 e ArchUnit · `v0.3-clean` |
| **5** | ⚙️ Infraestrutura, performance e observabilidade | 15–18 | Compose, Redis, métricas, testes de carga e pipeline · `v0.4-infra` |
| **6** | 🔀 Microsserviços, mensageria e resiliência | 19–22 | Saga da compra, Outbox, Resilience4j e tracing · `v0.5-distribuido` |
| **7** | 🚀 Projeto integrador e portfólio | 23–24 | Repositório público e vídeo de 5 minutos · `v1.0` |

## ✨ Como funciona

- 📂 **Arquivos de cada aula listados:** caminho, nome e ação (criar, editar ou rodar).
- 📋 **Código pronto para copiar**, com o caminho do arquivo no topo de cada bloco.
- ✅ **Checklist por fase** e leituras recomendadas.
- 💾 **Progresso salvo** no navegador, sem cadastro.
- 🖥️ **Guia do VS Code** para montar o ambiente antes da primeira aula.

<div align="center">

### 👉 [Começar agora](https://juniorperfoll.github.io/curso-arquitetura-java/)

</div>

---

<details>
<summary><b>🛠️ Para quem mantém o site</b></summary>

<br>

O site é estático e publicado no GitHub Pages a cada push na branch `main`, pelo workflow [`pages.yml`](.github/workflows/pages.yml).

### Onde editar

| Quero mudar | Arquivo |
|-------------|---------|
| Texto da página inicial | `content/f1.js` (`C.intro`) |
| Aulas da Fase N | `content/fN.js` (Fase 7 = projeto final) |
| Caminhos dos arquivos de cada aula | `content/f0_paths.js` |
| Guia do VS Code | `content/f8_vscode.js` |
| Layout, cores, tema, mentor | `template.html` |

### Ver localmente antes do push

```bash
python build.py
# abra site/index.html no navegador (ou use a extensão Live Preview do VS Code)
```

### Observações

- O progresso fica salvo no navegador (localStorage).
- O painel do mentor só funciona quando a página é aberta no Claude; aqui ele fica oculto.

</details>
