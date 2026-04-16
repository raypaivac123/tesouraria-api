# 💰 Tesouraria API

Sistema backend desenvolvido para auxiliar no controle financeiro de eventos e atividades da igreja.

O projeto surgiu a partir de uma necessidade real de organizar o registro de vendas, pagamentos e acompanhamento financeiro de itens como uniformes de festividades e grupos (ex: pandeiro), evitando controles manuais e facilitando a visualização de dados importantes para tomada de decisão.

A proposta é centralizar informações financeiras, manter histórico de pagamentos e permitir acompanhamento do saldo de forma simples, segura e organizada.

---

# 🎯 Problema identificado

Durante a organização de eventos e atividades da igreja, foi observado que:

- o controle financeiro era feito manualmente
- havia dificuldade em acompanhar quem já pagou e quem ainda possui saldo pendente
- não existia um painel consolidado com totais de entradas e saídas
- informações ficavam espalhadas em anotações ou planilhas
- era difícil manter histórico confiável de pagamentos parciais

Diante disso, busquei desenvolver uma solução tecnológica para resolver esse problema de forma estruturada e escalável.

---

# 💡 Solução proposta

Uma API REST desenvolvida com Spring Boot para:

- registrar vendas de uniformes
- controlar pagamentos parciais (Pix, dinheiro, etc)
- calcular automaticamente saldo pendente
- organizar informações por congregação
- fornecer um dashboard financeiro com totais consolidados
- preparar a aplicação para autenticação segura com JWT
- manter uma arquitetura organizada seguindo boas práticas de backend

---

# 🧱 Arquitetura do projeto

O projeto foi estruturado seguindo o padrão em camadas:

controller → recebe requisições HTTP  
service → regras de negócio  
repository → acesso ao banco de dados  
entity → representação das tabelas  
dto → objetos de transferência de dados  
mapper → conversão entre entity e dto  

Estrutura:

src/main/java/com/ufads/tesouraria

- controller
- service
- repository
- entity
- dto
- mapper
- security
- config

---

# 🚀 Tecnologias utilizadas

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- MySQL ou H2
- Lombok
- Swagger / OpenAPI
- Maven
- Git
- GitHub

---

# 📊 Funcionalidades implementadas

✔ Cadastro de congregações  
✔ Cadastro de participantes  
✔ Registro de vendas de uniformes  
✔ Controle de pagamento parcial  
✔ Cálculo automático de saldo pendente  
✔ Dashboard financeiro  
✔ Organização por DTO e Mapper  
✔ Estrutura preparada para autenticação JWT  
✔ Documentação automática da API com Swagger  

---

# 📈 Exemplo de dados controlados

- valor total do uniforme
- valor pago via Pix
- valor pago em dinheiro
- saldo pendente
- status do pagamento
- data do pagamento
- observações
- vínculo com congregação

---

# 🗺 Roadmap do projeto

## ✅ Versão atual (MVP)

- [x] Cadastro de congregações
- [x] Cadastro de participantes
- [x] Registro de vendas de uniformes
- [x] Controle de pagamento parcial
- [x] Cálculo automático de saldo pendente
- [x] Dashboard financeiro
- [x] Organização em camadas (controller, service, repository)
- [x] Uso de DTOs e Mappers
- [x] Documentação da API com Swagger
- [x] Estrutura preparada para autenticação

---

## 🔐 Autenticação e segurança

- [ ] Implementar login com JWT
- [ ] Criar entidade de usuário
- [ ] Criptografia de senha
- [ ] Controle de acesso por perfil
- [ ] Proteger rotas da API
- [ ] Token de autenticação via Bearer Token

---

## 📊 Melhorias no dashboard

- [ ] Total de vendas por período
- [ ] Filtro por congregação
- [ ] Relatório de pagamentos pendentes
- [ ] Histórico financeiro
- [ ] Indicadores de arrecadação
- [ ] Evolução dos pagamentos ao longo do tempo

---

## 💳 Gestão de pagamentos

- [ ] Controle de parcelas
- [ ] Registro de múltiplos pagamentos
- [ ] Histórico detalhado de pagamentos
- [ ] Status automático:
  - PENDENTE
  - PARCIAL
  - PAGO
- [ ] Regras automáticas de cálculo de saldo

---

## 📑 Relatórios

- [ ] Relatório de vendas
- [ ] Relatório por congregação
- [ ] Relatório por período
- [ ] Exportação em PDF
- [ ] Exportação em Excel

---

## 🌐 Integração com frontend

- [ ] Criar interface web
- [ ] Dashboard visual
- [ ] Tela de cadastro
- [ ] Tela de controle financeiro
- [ ] Tela de login
- [ ] Integração com API

---

## 🧪 Qualidade e boas práticas

- [ ] Testes unitários
- [ ] Tratamento global de exceções
- [ ] Validações de dados
- [ ] Padronização de respostas da API
- [ ] Logs da aplicação
- [ ] Organização de pacotes

---

## ☁ Deploy

- [ ] Deploy em nuvem
- [ ] Configuração de variáveis de ambiente
- [ ] Banco em produção
- [ ] URL pública da API
- [ ] Documentação online

---

## 📌 Futuras evoluções

- [ ] Controle de múltiplos eventos
- [ ] Cadastro de produtos diversos
- [ ] Controle de caixa completo
- [ ] Gestão financeira geral da igreja
- [ ] Controle de permissões por perfil
- [ ] Histórico de alterações

---

# ▶ Como executar o projeto

1. Clonar o repositório

git clone https://github.com/raypaivac123/tesouraria-api.git

2. Abrir o projeto no IntelliJ ou VS Code

3. Configurar o banco de dados no arquivo:

application.properties

4. Executar a aplicação:

TesourariaApplication.java

5. Acessar a documentação Swagger:

http://localhost:8080/swagger-ui.html

ou

http://localhost:8080/swagger-ui/index.html

---

# 👩‍💻 Autora

Rayssa Paiva Carvalho

Graduada em Ciência da Computação  
Instrutora de Tecnologia no SENAC  
Foco em desenvolvimento backend com Java e Spring Boot  

GitHub:
https://github.com/raypaivac123

LinkedIn:
https://linkedin.com/in/rayssa-paiva-0565301b9/

---

# 📌 Observação

Este projeto foi desenvolvido com fins de aprendizado e também para resolver uma necessidade real de organização financeira, aplicando conceitos de arquitetura backend, boas práticas de programação e versionamento de código.
