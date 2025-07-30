# Smart Personal Budget Assistant (SPBA)

> **Empowering smarter personal finance for everyone!**

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Service Breakdown](#service-breakdown)
  - [1. Wallet (API/Backend)](#1-wallet-apibackend)
  - [2. WalletDB (MySQL)](#2-walletdb-mysql)
  - [3. Prediction (AI/ML)](#3-prediction-aiml)
  - [4. Web (Frontend)](#4-web-frontend)
- [System Architecture Diagram](#system-architecture-diagram)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Overview

**SPBA** is a multi-service application designed to help users manage personal finances, simulate digital wallets, analyze spending habits, and provide actionable AI-powered insights. It is modular, extensible, and suitable for both technical and non-technical users.

---

## Architecture

SPBA is composed of four main services, each running independently (preferably via Docker Compose):

- **Wallet**: Node.js backend API for wallet and transaction management.
- **WalletDB**: MySQL database for storing wallets and transactions.
- **Prediction**: Python-based AI/ML service for spending prediction and insights.
- **Web**: Modern JavaScript frontend for user interaction.

### System Architecture Diagram

```mermaid
graph TD;
    A[Web Frontend] --> B{Wallet API};
    B --> C(Prediction Service);
    B --> D[(WalletDB)];
    C --> D;
```


---

## Service Breakdown

### 1. Wallet (API/Backend)
- **Language:** Node.js (ES Modules)
- **Main Entry:** `index.js`
- **Key Dependencies:**
  - `express`, `cors`, `dotenv`, `mysql2`, `axios`, `openai`, `nodemon`
- **Responsibilities:**
  - Exposes RESTful API endpoints for wallet and transaction management
  - Handles authentication (if implemented)
  - Forwards transaction data to Prediction service
  - Integrates with OpenAI for chat/insight features
- **Project Structure:**
  - `index.js`: App entry, sets up Express server and routes
  - `routes/`: Route handlers for `/wallets` and `/chat`
  - `db.js`: Database connection logic
  - `utility.js`: Helper functions
- **How to Run:**
  - `npm install`
  - `npm start` (with `.env`)

#### Example Endpoints
- `GET /wallets`: List all wallets
- `POST /wallets`: Create a new wallet
- `GET /wallets/:id/transactions`: List transactions for a wallet
- `POST /wallets/:id/transactions`: Add a transaction
- `POST /chat`: AI-powered chat endpoint

### 2. WalletDB (MySQL)
- **Type:** Relational Database
- **Schema File:** `services/walletdb/init.d/wallet.sql`
- **Tables:**
  - `wallets`: Stores wallet metadata (id, user_id, provider, etc.)
  - `wallet_transactions`: Stores transaction details (id, wallet_id, user_id, amount, type, category, timestamp, etc.)
- **Sample Data:**
  - Pre-populated with demo wallets and transactions
- **How to Run:**
  - Via Docker Compose (`docker-compose up`)
  - Or manually import `wallet.sql` into your MySQL instance

### 3. Prediction (AI/ML)
- **Language:** Python 3.x
- **Frameworks:** Flask, scikit-learn, pandas, joblib, pymysql, openai
- **Key Files:**
  - `api.py`: Flask API exposing prediction endpoints
  - `engine.py`: Model training, prediction, and insight logic
  - `spba.pkl`: Serialized ML model
- **Responsibilities:**
  - Learns from transaction data to predict future spending
  - Provides insights using GPT via OpenAI
- **Endpoints:**
  - `GET /v1/ai/predict/<user_id>`: Predict next month's spending per category
  - `GET /v1/ai/predict/<user_id>/insights`: AI-generated financial insights
- **How to Run:**
  - `pip install -r requirements.txt`
  - `python api.py`
- **Model Details:**
  - Uses linear regression on monthly categorized spending
  - GPT (via OpenAI) for natural language suggestions

### 4. Web (Frontend)
- **Language:** JavaScript (React, Vite, Tailwind CSS)
- **Key Files:**
  - `src/app.jsx`, `src/main.jsx`: App entry and router
  - `src/components/`: Reusable UI components
  - `src/pages/`: Page-level views (dashboard, analytics, etc.)
  - `src/services/`: API client logic
- **Key Dependencies:**
  - `react`, `@tanstack/react-query`, `@radix-ui/*`, `axios`, `tailwindcss`, `vite`, `formik`, etc.
- **Features:**
  - Dashboard for wallet overview
  - Transaction history and analytics
  - AI-driven insights and predictions
- **How to Run:**
  - `npm install`
  - `npm run dev`

---

## Setup & Installation

### Prerequisites
- [Docker](https://www.docker.com/) (recommended for orchestration)
- Node.js >= 18.x
- Python 3.10+
- MySQL 8+
- OpenAI API key (for AI features)

### Environment Variables
Each service has a `.env.example` file. Copy and fill in as needed:
```bash
cp .env.example .env
cp services/wallet/.env.example services/wallet/.env
cp services/prediction/.env.example services/prediction/.env
cp services/web/.env.example services/web/.env
cp services/walletdb/.env.example services/walletdb/.env
```

### Running with Docker Compose
```bash
git clone <your-repo-url>
cd spba
docker-compose up --build
```
- Access frontend at [http://localhost:3000](http://localhost:3000)
- API at [http://localhost:3001](http://localhost:3001)
- Prediction at [http://localhost:5000](http://localhost:5000)

### Manual Service Startup
- See each service's README or docs for standalone dev mode

---

## API Reference

### Wallet API (Node.js)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /wallets | List all wallets |
| POST   | /wallets | Create wallet |
| GET    | /wallets/:id/transactions | List transactions |
| POST   | /wallets/:id/transactions | Add transaction |
| POST   | /chat    | AI chat/insight |

### Prediction API (Python/Flask)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /v1/ai/predict/<user_id> | Predict spending |
| GET    | /v1/ai/predict/<user_id>/insights | AI insights |

---

## Database Schema

### wallets
| Field      | Type           | Description |
|------------|----------------|-------------|
| id         | INT, PK, AI    | Wallet ID   |
| user_id    | INT            | User ID     |
| provider   | VARCHAR(50)    | Provider    |
| source     | ENUM           | Source (`bank`, `momo`) |
| label      | VARCHAR(100)   | Wallet label|
| is_active  | BOOLEAN        | Active flag |
| created_at | DATETIME       | Created     |

### wallet_transactions
| Field      | Type           | Description |
|------------|----------------|-------------|
| id         | INT, PK, AI    | Transaction ID |
| wallet_id  | INT, FK        | Wallet FK      |
| user_id    | INT            | User ID        |
| source     | ENUM           | Transaction source |
| amount     | DECIMAL(10,2)  | Amount         |
| type       | ENUM           | `credit`/`debit` |
| description| VARCHAR(255)   | Description    |
| category   | VARCHAR(100)   | Category       |
| timestamp  | DATETIME       | Timestamp      |

---

## Advanced Usage

### Training the AI Model
- Run `engine.py` to retrain the model if new data is added
- Model output saved as `spba.pkl`

### Customizing Categories
- Edit `wallet.sql` and frontend code to add new spending categories

### Integrating More AI
- Swap OpenAI models in `engine.py` and backend as needed

### Security & Privacy
- Use strong secrets in `.env` files
- Never commit real API keys or credentials

---

## Troubleshooting
- **Docker Issues:** Ensure ports 3000, 3001, and 5000 are free
- **MySQL Errors:** Confirm `wallet.sql` is loaded and DB credentials are correct
- **AI/Prediction Errors:** Check OpenAI API key and Python dependencies
- **Frontend Not Loading:** Run `npm install` in `/web` and check Vite logs

---

## Contributing
- Open issues for bugs or feature requests
- Submit pull requests with clear descriptions
- Improve docs or add tests

---

## License & Contact
- MIT License (see LICENSE)
- For questions, open an issue or contact maintainers

---

*This project is built for learning, experimentation, and empowering smarter personal finance for everyone!*

Welcome to the Smart Personal Budget Assistant (SPBA) project! This application is designed to help you manage your personal finances more intelligently, combining modern AI with intuitive interfaces. Whether you are a developer, a data enthusiast, or someone looking to take control of your spending, this project provides the tools and insights you need.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Services](#services)
  - [1. Wallet](#1-wallet)
  - [2. WalletDB](#2-walletdb)
  - [3. Prediction](#3-prediction)
  - [4. Web](#4-web)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Project Overview
SPBA is a multi-service application built to simulate and manage a digital wallet, analyze your spending habits, and provide actionable insights using AI. It aims to make personal finance smarter and more accessible for everyone.

## Architecture
The project is organized as a set of independent but interconnected services:
- **Wallet** (API/Backend)
- **WalletDB** (MySQL Database)
- **Prediction** (AI/ML Service)
- **Web** (Frontend Application)

These services communicate with each other to provide a seamless experience from data storage to intelligent analysis and user interaction.

## Services

### 1. Wallet
- **Type:** Backend/API (Node.js)
- **Role:** Acts as the main backend, handling wallet operations and communicating with both the WalletDB and Prediction services.
- **Responsibilities:**
  - Manage wallet accounts and transactions
  - Interface with the database for storing/retrieving data
  - Relay transaction data to the Prediction service for analysis

### 2. WalletDB
- **Type:** Database (MySQL)
- **Role:** Stores wallet and transaction data, simulating a real digital wallet system.
- **Key File:** `wallet.sql` (located in `services/walletdb/init.d/`)
- **How it works:**
  - Contains tables for wallets and transactions
  - Used by the Wallet service to persist and query financial data

### 3. Prediction
- **Type:** AI/ML Service (Python)
- **Role:** Learns spending habits from the WalletDB and predicts future trends. Integrates with GPT models for deeper financial insights.
- **Responsibilities:**
  - Analyze transaction history
  - Predict future spending or saving patterns
  - Provide AI-powered insights and recommendations
- **Key Files:**
  - `api.py`, `engine.py`, `spba.pkl`

### 4. Web
- **Type:** Frontend Application
- **Role:** User interface for interacting with your wallet, viewing analytics, and receiving predictions.
- **Tech Stack:** Likely uses modern JavaScript frameworks and Tailwind CSS (see `package.json`, `tailwind.config.js`).
- **Features:**
  - Dashboard for wallet overview
  - Transaction history
  - AI-driven insights and predictions

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) (recommended for running all services together)
- Node.js & npm (for backend/frontend development)
- Python 3.x (for Prediction service)
- MySQL (if running WalletDB outside Docker)

### Quick Start (with Docker Compose)
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd spba
   ```
2. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp services/wallet/.env.example services/wallet/.env
   cp services/prediction/.env.example services/prediction/.env
   cp services/web/.env.example services/web/.env
   cp services/walletdb/.env.example services/walletdb/.env
   ```
3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

### Manual Setup
- See each service's directory for standalone setup instructions (e.g., `services/wallet/README.md`, `services/prediction/requirements.txt`).

---

## Usage
- Access the web interface at [http://localhost:3000](http://localhost:3000) (or your configured port)
- Use the dashboard to:
  - View wallet balances and transactions
  - Get spending predictions and insights
  - Simulate new transactions
- Developers can interact with the API for custom integrations.

---

## Contributing
We welcome contributions from both technical and non-technical users! You can help by:
- Submitting bug reports or feature requests
- Improving documentation
- Developing new features or improving AI models

---

## Contact
For questions, feedback, or collaboration, please open an issue or reach out to the project maintainers.

---

*Empowering smarter personal finance for everyone!*