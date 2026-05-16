# Tesouraria API

> **Church Treasury Management System** — A production-ready REST API built with Java 17 and Spring Boot for structured financial control of church events and activities.

---

## Overview

**Tesouraria API** is a backend solution developed to replace manual, error-prone financial tracking with a reliable, auditable system. Originally designed for a church women's organization (UFADS), it manages uniform sales, partial payment tracking, installment control, and consolidated financial reporting — all in a clean, layered architecture.

> *Designed for real-world use. Built for maintainability and scale.*

---

## Problem Statement

Before this system was introduced, financial management was handled entirely by hand:

- No consolidated view of collected amounts
- No reliable tracking of who had paid
- Partial payments were not properly recorded
- Information was scattered across handwritten notes and spreadsheets
- No audit trail or payment history

This led to **calculation errors, duplicated effort, and lack of financial transparency**.

---

## Solution

A REST API was developed with Spring Boot to address each of these pain points:

- Register uniform sales with full payment detail
- Track partial payments via Pix and cash
- Control installment plans and current installment status
- Automatically calculate outstanding balances
- Organize data by congregation
- Provide structured data for a financial dashboard
- Export reports in **CSV, PDF, and Excel**
- Maintain a detailed change history and automatic cash reconciliation
- Secure access via **JWT authentication**

---

## Architecture

The project follows a **clean layered architecture**, ensuring clear separation of concerns and ease of maintenance:

| Layer | Responsibility |
|---|---|
| `controller` | Receives HTTP requests and exposes API endpoints |
| `service` | Encapsulates all business logic |
| `repository` | Handles database access via Spring Data JPA |
| `entity` | Represents database tables |
| `dto` | Defines structured input/output objects |
| `mapper` | Converts between entities and DTOs |
| `security` | Manages authentication, authorization, and JWT |
| `event` | Automates cash reconciliation from payment events |
| `config` | Stores global project configuration |

### Project Structure

```
backend/src/main/java/com/ufads/tesouraria
├── config
├── controller
├── dto
├── entity
├── enums
├── event
├── exception
├── mapper
├── repository
├── security
└── service
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot 3 | Application framework |
| Spring Web | REST API layer |
| Spring Data JPA | Data persistence |
| Spring Security | Authentication and route protection |
| JWT | Stateless token-based authentication |
| Hibernate | ORM / database mapping |
| Bean Validation | Input validation |
| Lombok | Boilerplate reduction |
| Swagger / OpenAPI | API documentation |
| PostgreSQL | Relational database |
| Maven | Dependency and build management |

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Axios | HTTP client |
| React Router | Client-side navigation |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker | Containerization |
| Git + GitHub | Version control |
| Render | Cloud deployment |

---

## Implemented Features

### Security
- [x] JWT-based login and authentication
- [x] Password encryption with BCrypt
- [x] Route protection via Spring Security
- [x] Token refresh support
- [x] Role-based access control structure

### Payment Control
- [x] Partial payment tracking (Pix + cash)
- [x] Automatic outstanding balance calculation
- [x] Payment status management
- [x] Installment plan control
- [x] Detailed change history
- [x] Automatic cash reconciliation by payment type

### Reporting
- [x] Period-based and congregation-based reports
- [x] CSV export
- [x] PDF export
- [x] Excel export
- [x] Dashboard financial summary

### Code Quality
- [x] Global exception handling
- [x] Input validation
- [x] Structured JSON logging
- [x] Standardized error responses
- [x] DTO-based data organization
- [x] Mapper pattern for entity conversion
- [x] Unit tests
- [x] Application context test

### Infrastructure
- [x] Dockerfile configured
- [x] Deployment initiated on Render
- [x] Production database configured

---

## API Endpoints

| Resource | Endpoint |
|---|---|
| Authentication | `/auth/register`, `/auth/login`, `/auth/refresh` |
| Congregations | `/congregacoes` |
| Members | `/mulheres` |
| Sales | `/vendas` |
| Sale Batches | `/lotes-venda` |
| Festival Uniforms | `/uniforme-festividade` |
| Tambourine Uniforms | `/uniforme-pandeiro` |
| Cash Movements | `/caixa` |
| Dashboard | `/dashboard` |
| Financial Report | `/relatorios/financeiro` |
| CSV Export | `/relatorios/financeiro/csv` |
| PDF Export | `/relatorios/financeiro/pdf` |
| Excel Export | `/relatorios/financeiro/excel` |
| Change History | `/historico` |
| Users | `/usuarios` |
| API Docs | `/swagger-ui.html` |

---

## Getting Started

### Prerequisites

- Java 17
- Maven or Maven Wrapper
- PostgreSQL or a configured [Neon](https://neon.tech) database
- Git

### Clone and Run

```bash
# Clone the repository
git clone https://github.com/raypaivac123/tesouraria-api.git

# Navigate to the backend folder
cd tesouraria-api/backend

# Configure your database connection
# Edit: src/main/resources/application.properties

# Run the application
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

Access the API documentation at:
```
http://localhost:8080/swagger-ui.html
```

> **Default local user:** `rayssa` / `123456`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Application port | `8080` |
| `DB_URL` | PostgreSQL/Neon connection URL | required |
| `DB_USERNAME` | Database username | required |
| `DB_PASSWORD` | Database password | required |
| `JWT_SECRET` | Secret key for JWT token generation | dev default |
| `JWT_EXPIRATION` | Token expiration in milliseconds | `86400000` |

---

## Docker

```bash
# Build the image
docker build -t tesouraria-api .

# Run the container
docker run -p 8080:8080 tesouraria-api
```

API available at `http://localhost:8080`

---

## Frontend

```bash
# Navigate to the frontend folder
cd tesouraria-api/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend: `http://localhost:5173`  
Backend must be running at: `http://localhost:8080`

---

## Roadmap

| Area | Status |
|---|---|
| JWT authentication | ✅ Done |
| Partial payment control | ✅ Done |
| CSV / PDF / Excel export | ✅ Done |
| Structured logging | ✅ Done |
| Docker support | ✅ Done |
| Render deployment | 🔄 In progress |
| Full dashboard UI | 🔲 Planned |
| Full frontend screens | 🔲 Planned |
| Unit test coverage | 🔲 Planned |
| Error response standardization | 🔲 Planned |

---

## Author

**Rayssa Paiva Carvalho**  
*B.Sc. Computer Science | Technology Instructor at SENAC*

Focus areas: Java · Spring Boot · REST APIs · Databases · Web Development

[![GitHub](https://img.shields.io/badge/GitHub-raypaivac123-181717?logo=github)](https://github.com/raypaivac123)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rayssa%20Paiva-0A66C2?logo=linkedin)](https://www.linkedin.com/in/rayssa-paiva)

---

## Notes

This project was developed to solve a real financial organization need within a church community, applying backend best practices including layered architecture, secure authentication, structured reporting, and full deployment preparation.

It serves as a reference implementation for maintainable, production-oriented Spring Boot APIs.

---

*Built with Java · Spring Boot · PostgreSQL · Docker*
