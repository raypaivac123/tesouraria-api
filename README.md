# Tesouraria API

**REST API** built with **Java 17 + Spring Boot** for managing financial operations of church events and activities.

The system allows tracking uniform sales, partial payments, pending balances, and centralizes financial information that was previously scattered in notes, papers, or spreadsheets. It ensures a **reliable payment history**, reduces calculation errors, and provides consolidated data to support treasury decision-making.

---

## Problem

During church event organization, it was identified that:

- Financial control was done manually  
- It was difficult to track who had already paid  
- No consolidated view of collected amounts  
- Partial payments were not properly managed  
- Information was scattered across notes and spreadsheets  
- Maintaining a reliable history was challenging  

This scenario caused rework, calculation errors, and poor financial organization.

---

## Solution

A REST API with Spring Boot was developed to:

- Register uniform sales  
- Track partial payments (Pix, cash)  
- Control installments and current installment  
- Automatically calculate pending balance  
- Organize information by congregation  
- Provide data for financial dashboards  
- Export reports in CSV, PDF, and Excel  
- Maintain history of changes and automatic cash updates  
- Prepare secure authentication with JWT  
- Keep an organized, scalable, and maintainable architecture  

---

## Architecture

The project follows a **layered architecture**:

| Layer | Responsibility |
| --- | --- |
| `controller` | Handles HTTP requests and exposes API endpoints |
| `service` | Business logic |
| `repository` | Database access |
| `entity` | Database table representation |
| `dto` | API input/output objects |
| `mapper` | Converts data between entities and DTOs |
| `security` | Handles authentication, authorization, JWT |
| `event` | Automates cash updates from payments |
| `config` | General project configuration |

**Backend folder structure**:

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


Technologies
Backend
Java 17
Spring Boot 3
Spring Web
Spring Data JPA
Spring Security
JWT
Hibernate
Bean Validation
Maven
Lombok
Swagger / OpenAPI
PostgreSQL
Frontend
React
TypeScript
Vite
Axios
React Router
Infrastructure & Tools
Docker
Git / GitHub
Render
Implemented Features
 Congregation registration
 Participant registration
 Uniform sales registration
 Partial payment handling
 Installment control
 Automatic pending balance calculation
 Payment status tracking
 Automatic cash updates
 Detailed history of changes
 Export reports: CSV / PDF / Excel
 Structured JSON logs
 DTO organization
 Mapper conversions
 Layered architecture
 Swagger / OpenAPI
 JWT login
 Password encryption (BCrypt)
 Route protection with Spring Security
 Global exception handling
 Dockerfile configured
 Frontend initial structure in React
 Deploy initiated on Render
Data Controlled

The API manages:

Uniform total value
Paid via Pix / cash
Pending balance
Payment status
Installment count / current installment
Payment date
Observations
Congregation linkage
Cash movements
History of changes
Dashboard financial summary
Main Endpoints
Resource	Endpoint
Authentication	/auth/register, /auth/login, /auth/refresh
Congregations	/congregacoes
Participants	/mulheres
Sales	/vendas
Sale Lots	/lotes-venda
Festivity Uniforms	/uniforme-festividade
Pandeiro Uniforms	/uniforme-pandeiro
Cash Movements	/caixa
Dashboard	/dashboard
Reports	/relatorios/financeiro
Export CSV	/relatorios/financeiro/csv
Export PDF	/relatorios/financeiro/pdf
Export Excel	/relatorios/financeiro/excel
Change History	/historico
Users	/usuarios
Swagger	/swagger-ui.html
Roadmap
Security
 Authentication structure
 JWT login
 Password encryption
 Route protection
 Admin user registration
 Initial public registration via /auth/register
 Profile-based access control
 JWT token refresh
Dashboard
 Dashboard data structure
 Overall financial summary
 Total by period
 Filter by congregation
 Detailed financial history
 Visual indicators of collection
Payments
 Partial payment handling
 Automatic balance calculation
 Payment status tracking
 Installment control
 Detailed change history
 Automatic cash updates
Reports
 Period-based report
 Congregation-based report
 CSV export
 PDF export
 Excel export
Frontend
 Initial React structure
 Login screen
 API integration
 Full dashboard
 Full registration screen
 Sales & payments screen
 Reports screen
 Change history screen
Quality
 Global exception handling
 Data validation
 Unit tests
 Application context tests
 Standardized error responses
 Structured logs
Deploy
 Deployment-ready project
 Dockerfile
 Deployment initiated on Render
 Production database
 Environment variables finalized
 Final public API URL
How to Run Locally

Prerequisites: Java 17, Maven, PostgreSQL (or Neon), Git

# Clone the repository
git clone https://github.com/raypaivac123/tesouraria-api.git
cd tesouraria-api/backend

# Configure database in src/main/resources/application.properties

# Run the API
./mvnw spring-boot:run
# On Windows
mvnw.cmd spring-boot:run

# Access Swagger
http://localhost:8080/swagger-ui.html

Frontend:

cd tesouraria-api/frontend
npm install
npm run dev
# Access at http://localhost:5173
Environment Variables
Variable	Description	Default
PORT	Application port	8080
DB_URL	PostgreSQL/Neon connection URL	required
DB_USERNAME	Database user	required
DB_PASSWORD	Database password	required
JWT_SECRET	JWT secret key	default dev key
JWT_EXPIRATION	Token expiration in ms	86400000
Docker
# Build image
docker build -t tesouraria-api .

# Run container
docker run -p 8080:8080 tesouraria-api

Rayssa Paiva Carvalho – Software Developer & Tech Instructor at SENAC

GitHub: raypaivac123
LinkedIn: Rayssa Paiva
Notes

Project developed to solve real financial organization challenges of a church, applying best practices in backend, layered architecture, secure authentication, and prepared for frontend, dashboards, and reports.
