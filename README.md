# Tesouraria API

API REST desenvolvida com **Java 17 + Spring Boot** para controle financeiro de eventos e atividades da igreja.

O sistema permite registrar vendas de uniformes, controlar pagamentos parciais, acompanhar saldos pendentes e centralizar informações financeiras que antes ficavam espalhadas em anotações, papéis ou planilhas.

O objetivo do projeto é manter um histórico confiável de pagamentos, reduzir erros de cálculo e fornecer dados consolidados para apoiar a tomada de decisão da tesouraria.

---

## Problema

Durante a organização de eventos da igreja, foi identificado que:

- o controle financeiro era feito manualmente;
- havia dificuldade em acompanhar quem já pagou;
- não existia uma visão consolidada dos valores arrecadados;
- pagamentos parciais não eram controlados corretamente;
- informações ficavam espalhadas em anotações e planilhas;
- era difícil manter um histórico confiável.

Esse cenário gerava retrabalho, erros de cálculo e falta de organização financeira.

---

## Solução

Foi desenvolvida uma API REST com Spring Boot para:

- registrar vendas de uniformes;
- controlar pagamentos parciais, como Pix e dinheiro;
- calcular automaticamente o saldo pendente;
- organizar informações por congregação;
- disponibilizar dados para dashboard financeiro;
- preparar autenticação segura com JWT;
- manter uma arquitetura organizada, escalável e de fácil manutenção.

---

## Arquitetura

O projeto segue uma arquitetura em camadas:

| Camada | Responsabilidade |
| --- | --- |
| `controller` | Recebe as requisições HTTP e expõe os endpoints da API |
| `service` | Concentra as regras de negócio |
| `repository` | Realiza o acesso ao banco de dados |
| `entity` | Representa as tabelas do banco |
| `dto` | Define os objetos de entrada e saída da API |
| `mapper` | Converte dados entre entidades e DTOs |
| `security` | Concentra autenticação, autorização e JWT |
| `config` | Armazena configurações gerais do projeto |

Estrutura principal do backend:

```text
backend/src/main/java/com/ufads/tesouraria
|-- config
|-- controller
|-- dto
|-- entity
|-- enums
|-- event
|-- exception
|-- mapper
|-- repository
|-- security
`-- service
```

---

## Tecnologias

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Hibernate
- Bean Validation
- Maven
- Lombok
- Swagger / OpenAPI
- MySQL

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

### Infraestrutura e ferramentas

- Docker
- Git
- GitHub
- Render

---

## Funcionalidades Implementadas

- [x] Cadastro de congregações
- [x] Cadastro de participantes
- [x] Registro de vendas de uniformes
- [x] Controle de pagamentos parciais
- [x] Cálculo automático de saldo pendente
- [x] Status de pagamento
- [x] Organização por DTOs
- [x] Mappers para conversão de dados
- [x] Arquitetura em camadas
- [x] Swagger / OpenAPI configurado
- [x] Login com JWT
- [x] Criptografia de senha com BCrypt
- [x] Proteção de rotas com Spring Security
- [x] Tratamento global de exceções
- [x] Dockerfile configurado
- [x] Estrutura inicial de frontend em React
- [x] Deploy iniciado no Render

---

## Dados Controlados

A API permite controlar informações como:

- valor total do uniforme;
- valor pago via Pix;
- valor pago em dinheiro;
- saldo pendente;
- status do pagamento;
- data do pagamento;
- observações;
- vínculo com congregação;
- movimentações de caixa;
- resumo financeiro para dashboard.

---

## Endpoints Principais

| Recurso | Endpoint |
| --- | --- |
| Autenticação | `/auth/login` e `/auth/refresh` |
| Congregações | `/congregacoes` |
| Participantes | `/mulheres` |
| Vendas | `/vendas` |
| Lotes de venda | `/lotes-venda` |
| Uniformes de festividade | `/uniforme-festividade` |
| Uniformes de pandeiro | `/uniforme-pandeiro` |
| Movimentos de caixa | `/caixa` |
| Dashboard | `/dashboard` |
| Relatórios | `/relatorios/financeiro` |
| Exportação CSV | `/relatorios/financeiro/csv` |
| Usuários | `/usuarios` |
| Swagger | `/swagger-ui.html` |

---

## Roadmap

### Segurança

- [x] Estrutura de autenticação
- [x] Login com JWT
- [x] Criptografia de senha
- [x] Proteção de rotas
- [x] Cadastro administrativo de usuários
- [x] Controle de acesso por perfil
- [x] Refresh de token JWT

### Dashboard

- [x] Estrutura de dados para dashboard
- [x] Resumo financeiro geral
- [x] Total por período
- [x] Filtro por congregação
- [x] Histórico financeiro detalhado via relatório
- [ ] Indicadores visuais de arrecadação

### Pagamentos

- [x] Controle de pagamento parcial
- [x] Cálculo automático de saldo
- [x] Status de pagamento
- [ ] Controle de parcelas
- [ ] Histórico detalhado de alterações
- [ ] Baixa automática por tipo de pagamento

### Relatórios

- [x] Relatório por período
- [x] Relatório por congregação
- [x] Exportação CSV
- [ ] Exportação em PDF
- [ ] Exportação em Excel

### Frontend

- [x] Estrutura inicial em React
- [x] Tela de login
- [x] Integração inicial com API
- [ ] Dashboard visual completo
- [x] Tela completa de cadastro
- [x] Tela de vendas e pagamentos
- [x] Tela de relatórios

### Qualidade

- [x] Tratamento global de exceções
- [x] Validações de dados
- [x] Testes unitários
- [x] Teste de contexto da aplicação
- [x] Padronização completa de respostas de erro
- [ ] Logs estruturados da aplicação

### Deploy

- [x] Projeto preparado para deploy
- [x] Dockerfile criado
- [x] Deploy iniciado no Render
- [ ] Banco de dados em produção
- [x] Variáveis de ambiente finais
- [ ] URL pública definitiva da API

---

## Como Executar Localmente

### Pré-requisitos

- Java 17
- Maven ou Maven Wrapper
- MySQL
- Git

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/raypaivac123/tesouraria-api.git
```

2. Acesse a pasta do backend:

```bash
cd tesouraria-api/backend
```

3. Configure o banco de dados no arquivo:

```text
src/main/resources/application.properties
```

4. Execute a aplicação:

```bash
./mvnw spring-boot:run
```

No Windows, também é possível executar:

```bash
mvnw.cmd spring-boot:run
```

5. Acesse a documentação da API:

```text
http://localhost:8080/swagger-ui.html
```

---

## Variáveis de Ambiente

O backend aceita as principais configurações de execução por variáveis de ambiente:

| Variável | Descrição | Valor padrão |
| --- | --- | --- |
| `PORT` | Porta da aplicação | `8080` |
| `DATABASE_URL` | URL de conexão com o MySQL | `jdbc:mysql://localhost:3306/tesouraria` |
| `DATABASE_USERNAME` | Usuário do banco de dados | `root` |
| `DATABASE_PASSWORD` | Senha do banco de dados | vazio |
| `JWT_SECRET` | Chave secreta para geração de tokens JWT | chave padrão de desenvolvimento |
| `JWT_EXPIRATION` | Tempo de expiração do token em milissegundos | `86400000` |

---

## Executar com Docker

Dentro da pasta `backend`, execute:

```bash
docker build -t tesouraria-api .
```

Depois, suba o container:

```bash
docker run -p 8080:8080 tesouraria-api
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

## Executar o Frontend

Acesse a pasta do frontend:

```bash
cd tesouraria-api/frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

---

## Autora

**Rayssa Paiva Carvalho**

Graduada em Ciência da Computação e Instrutora de Tecnologia no SENAC.

Foco em:

- Java
- Spring Boot
- APIs REST
- Banco de dados
- Desenvolvimento web

GitHub: [raypaivac123](https://github.com/raypaivac123)

LinkedIn: [Rayssa Paiva](https://linkedin.com/in/rayssa-paiva-0565301b9/)

---

## Observação

Projeto desenvolvido para resolver uma necessidade real de organização financeira da igreja, aplicando boas práticas de backend, arquitetura em camadas, autenticação segura e preparação para evolução com frontend, relatórios e dashboard financeiro.
