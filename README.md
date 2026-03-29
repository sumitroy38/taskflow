# TaskFlow — Task Management System

A full-stack task management application built as a capstone project. TaskFlow lets teams create tasks, assign them to members, track progress, and manage users through a clean, modern interface.

## What it does

- Login and Register with secure JWT-based authentication
- Dashboard with live task status counters
- Create and edit tasks with titles, descriptions, and assignees
- Track status across Todo, In Progress, and Done
- Admin panel to view and manage all users
- Role-based access so Admins see everything and Users see their work

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Spring Boot 3.5, Spring Security, JPA/Hibernate |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## How to run locally

### Prerequisites
- Java 17
- Maven 3.9+
- Node.js 20+
- MySQL 8

### 1. Clone the repo
```bash
git clone https://github.com/sumitroy38/taskflow.git
cd taskflow
```

### 2. Setup the database
```sql
CREATE DATABASE taskflowdb;
```

### 3. Configure the backend
Create this file: `backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflowdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=8080
app.jwt.secret=taskflow-super-secret-key-change-in-production-min-32-chars
app.jwt.expiration=86400000
```

### 4. Run the backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at http://localhost:8080

### 5. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## How to run with Docker
```bash
docker-compose up --build
```

Frontend at http://localhost:4173 and Backend at http://localhost:8080

## Sample Users

After running the app, register a new account. To make it an Admin run this in MySQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/tasks | Get all tasks | User |
| POST | /api/tasks | Create task | User |
| PUT | /api/tasks/{id} | Update task | User |
| DELETE | /api/tasks/{id} | Delete task | User |
| GET | /api/users | Get all users | Admin |

## Project Structure
```
taskflow/
├── backend/
│   ├── src/main/java/com/taskflow/backend/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── security/
│   │   └── dto/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── api/
│   └── package.json
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Known Limitations

- Backend is not yet deployed to a cloud provider and runs locally or via Docker
- No pagination on task list yet
- Password reset not implemented

Built with love by Sumit Roy
