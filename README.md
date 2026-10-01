# Banking Application

A full-stack banking application built for learning modern backend development and secure financial workflows.

The project includes:

- A frontend client application in `client/`
- A RESTful Express API in `backend/`
- MongoDB persistence through Mongoose
- JWT-based authentication
- Account management and transaction history
- Atomic money transfers using MongoDB transactions

> This project is intended for learning and demonstration purposes. It is not designed for real-world banking use.

## Project Structure

```text
banking-app/
│
├── client/                     # Frontend application
│
├── backend/                    # Express API and database layer
│   ├── src/
│   │   ├── config/             # Environment and database configuration
│   │   ├── controllers/        # HTTP request and response handling
│   │   ├── data/               # MongoDB repositories
│   │   ├── middleware/         # Authentication, validation, and error handling
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic
│   │   └── utils/              # Reusable helpers
│   │
│   ├── .env.example
│   ├── package.json
│
│
└── README.md
```

## Features

- User registration and login
- JWT-protected routes
- Secure password hashing
- User profile retrieval
- Bank account creation and retrieval
- Transaction history
- Account-to-account transfers
- MongoDB transaction support for atomic transfers
- Input validation and centralized error handling

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- dotenv

### Frontend

The frontend application is located in the `client` folder.

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- npm

## Backend Setup

Open a terminal in the project root and move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Configure your MongoDB connection in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/banking_api
JWT_SECRET=your_secure_secret
PORT=3000
```

Start the backend development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000/api/v1
```

Health check:

```text
GET http://localhost:3000/health
```

## Frontend Setup

Open another terminal and move into the frontend folder:

```bash
cd client
```

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

> The exact frontend command may differ depending on whether the client uses React, Vite, Next.js, or another framework.

## API Endpoints

| Area             | Method | Endpoint                            |
| ---------------- | ------ | ----------------------------------- |
| Health check     | `GET`  | `/health`                           |
| Register         | `POST` | `/api/v1/auth/register`             |
| Login            | `POST` | `/api/v1/auth/login`                |
| Current user     | `GET`  | `/api/v1/users/me`                  |
| Get accounts     | `GET`  | `/api/v1/accounts`                  |
| Get account      | `GET`  | `/api/v1/accounts/:id`              |
| Get transactions | `GET`  | `/api/v1/accounts/:id/transactions` |
| Transfer money   | `POST` | `/api/v1/transfers`                 |

## Register a User

```http
POST /api/v1/auth/register
```

```json
{
  "email": "ada@example.com",
  "password": "SecurePass123!",
  "firstName": "Ada",
  "lastName": "Lovelace"
}
```

## Log In

```http
POST /api/v1/auth/login
```

```json
{
  "email": "ada@example.com",
  "password": "SecurePass123!"
}
```

Use the returned access token for protected routes:

```http
Authorization: Bearer <token>
```

## Make a Transfer

```http
POST /api/v1/transfers
```

```json
{
  "fromAccountId": "account-id",
  "toAccountNumber": "1000000002",
  "amount": 25.5,
  "description": "Lunch payment"
}
```

## MongoDB Transactions

Transfers use MongoDB transactions to ensure that money is moved safely between accounts.

A successful transfer performs all of these actions together:

1. Decreases the source account balance
2. Increases the destination account balance
3. Creates a debit transaction record
4. Creates a credit transaction record

If any step fails, MongoDB rolls back the entire transfer.

For local development, MongoDB must run as a replica set because transactions are not supported by a standalone MongoDB server.

Example local database URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/banking_api
```

## Environment Variables

| Variable         | Description                              |
| ---------------- | ---------------------------------------- |
| `PORT`           | Port used by the backend server          |
| `MONGODB_URI`    | MongoDB connection string                |
| `JWT_SECRET`     | Secret used to sign access tokens        |
| `JWT_EXPIRES_IN` | JWT token expiration time, if configured |

Never commit your `.env` file. Keep secrets in environment variables.

## Security Notes

This application includes basic learning-level security features such as password hashing, JWT authentication, validation, and MongoDB transactions.

A real banking system would additionally require:

- Multi-factor authentication
- Rate limiting and account lockouts
- Audit logs
- Idempotency keys for transfers
- Encryption and managed secrets
- Fraud detection
- AML and sanctions checks
- Monitoring and alerting
- Formal security testing and compliance reviews

## License

This project is for educational use.
# banking-api
