# My Fullstack Project

A full-stack web application with React frontend and Spring Boot backend.

## Project Structure

```
├── my-react-app/     # React frontend application
├── backend/          # Spring Boot backend application
└── README.md         # This file
```

## Frontend (React)

Located in `my-react-app/` directory.

### Features
- React 19.1.1
- Axios for HTTP requests
- Testing setup with React Testing Library

### Getting Started
```bash
cd my-react-app
npm install
npm start
```

## Backend (Spring Boot)

Located in `backend/` directory.

### Features
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Apache POI for Excel processing
- File upload functionality
- CORS configuration

### Getting Started
```bash
cd backend
./gradlew build
./gradlew bootRun
```

## Development

1. Start the backend server (runs on port 8080)
2. Start the React frontend (runs on port 3000)
3. The frontend is configured to proxy API requests to the backend

## API Endpoints

- `GET /api/hello` - Hello world endpoint
- `POST /upload` - File upload endpoint
- Additional endpoints available in the backend controllers