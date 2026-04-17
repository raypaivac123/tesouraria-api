# 💰 Tesouraria API

API REST desenvolvida com **Java + Spring Boot** para controle financeiro de eventos e atividades da igreja.

O sistema permite registrar vendas de uniformes, controlar pagamentos parciais e acompanhar saldos pendentes de forma organizada, evitando controles manuais em papel ou planilhas dispersas.

O objetivo é centralizar as informações financeiras, manter histórico confiável de pagamentos e fornecer dados consolidados para melhor tomada de decisão.

---

# 🎯 Problema

Durante a organização de eventos da igreja, foi identificado que:

* o controle financeiro era feito manualmente
* havia dificuldade em acompanhar quem já pagou
* não existia visão consolidada dos valores arrecadados
* pagamentos parciais não eram controlados corretamente
* informações ficavam espalhadas em anotações e planilhas
* era difícil manter histórico confiável

Isso gerava retrabalho, erros de cálculo e falta de organização financeira.

---

# 💡 Solução

Foi desenvolvida uma API REST com Spring Boot para:

* registrar vendas de uniformes
* controlar pagamentos parciais (Pix, dinheiro, etc)
* calcular automaticamente saldo pendente
* organizar informações por congregação
* fornecer dados para dashboard financeiro
* preparar autenticação segura com JWT
* manter arquitetura organizada e escalável

---

# 🧱 Arquitetura

O projeto segue arquitetura em camadas:

controller → recebe requisições HTTP
service → regras de negócio
repository → acesso ao banco de dados
entity → representação das tabelas
dto → objetos de transferência de dados
mapper → conversão entre entity e dto

Estrutura:

src/main/java/com/ufads/tesouraria

* controller
* service
* repository
* entity
* dto
* mapper
* security
* config

---

# 🚀 Tecnologias

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Maven
* Lombok
* Swagger / OpenAPI
* H2 ou MySQL
* Docker
* Git
* GitHub
* Render

---

# 📊 Funcionalidades implementadas

✔ Cadastro de congregações
✔ Cadastro de participantes
✔ Registro de vendas de uniformes
✔ Controle de pagamento parcial
✔ Cálculo automático de saldo pendente
✔ Organização por DTO
✔ Mapper para conversão de dados
✔ Arquitetura em camadas
✔ Swagger configurado
✔ Estrutura inicial de autenticação JWT
✔ Dockerfile configurado
✔ Deploy configurado no Render

---

# 📈 Exemplo de dados controlados

* valor total do uniforme
* valor pago via Pix
* valor pago em dinheiro
* saldo pendente
* status do pagamento
* data do pagamento
* observações
* vínculo com congregação

---

# 🗺 Roadmap

## 🔐 Segurança

* [x] Estrutura inicial de autenticação
* [ ] Login com JWT funcional
* [ ] Cadastro de usuário
* [ ] Criptografia de senha
* [ ] Controle de acesso por perfil
* [ ] Proteção de rotas

## 📊 Dashboard

* [x] Estrutura de dados para dashboard
* [ ] Total por período
* [ ] Filtro por congregação
* [ ] Histórico financeiro
* [ ] Indicadores de arrecadação

## 💳 Pagamentos

* [x] Controle de pagamento parcial
* [x] Cálculo automático de saldo
* [ ] Controle de parcelas
* [ ] Histórico detalhado
* [ ] Status automático (PENDENTE, PARCIAL, PAGO)

## 📑 Relatórios

* [ ] Relatório por período
* [ ] Exportação PDF
* [ ] Exportação Excel

## 🌐 Frontend

* [x] Estrutura inicial em React
* [x] Tela de login
* [x] Integração inicial com API
* [ ] Dashboard visual completo
* [ ] Tela de cadastro completa

## 🧪 Qualidade

* [ ] Testes unitários
* [ ] Tratamento global de exceções
* [ ] Validações de dados
* [ ] Padronização de respostas
* [ ] Logs da aplicação

## ☁ Deploy

* [x] Projeto preparado para deploy
* [x] Dockerfile criado
* [x] Deploy iniciado no Render
* [ ] Banco em produção
* [ ] Variáveis de ambiente
* [ ] URL pública definitiva da API

---

# ▶ Como executar localmente

1. Clonar o repositório

git clone https://github.com/raypaivac123/tesouraria-api.git

2. Abrir no IntelliJ ou VS Code

3. Configurar banco no:

application.properties

4. Executar:

TesourariaApplication.java

5. Acessar Swagger:

http://localhost:8080/swagger-ui.html

---

# 🐳 Executar com Docker

Dentro da pasta backend:

docker build -t tesouraria-api .

docker run -p 8080:8080 tesouraria-api

---

# 👩‍💻 Autora

Rayssa Paiva Carvalho

Graduada em Ciência da Computação
Instrutora de Tecnologia no SENAC

Foco em:

Java
Spring Boot
APIs REST
Banco de dados

GitHub:
https://github.com/raypaivac123

LinkedIn:
https://linkedin.com/in/rayssa-paiva-0565301b9/

---

# 📌 Observação

Projeto desenvolvido para resolver uma necessidade real de organização financeira da igreja, aplicando boas práticas de backend, arquitetura em camadas e preparação para autenticação segura.

```
```
