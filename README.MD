# Username Backend

A simple backend service for managing usernames using PostgreSQL and Redis (with Bloom filter).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd username-backend
   ```

2. **Create a `.env` file:**
   Copy `.env.example` to `.env` and adjust values if needed.

3. **Build and start the services:**
   ```sh
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL on port `5432`
   - Redis (with Bloom filter) on port `6379`
   - Backend API on port `3000`

4. **Seed Data:**
   The backend automatically seeds the database with users on startup.

## API Routes

Base URL: `http://localhost:3000/`

### 1. Get Total Users

**GET** `/users/count`

**Response:**
```json
{ "count": 10000 }
```

---

### 2. Check if Username Exists

**GET** `/users/check/:username`

**Example:**
```
GET /check/johndoe
```

**Response:**
```json
{ "exists": true }
```

---

### 3. Create Username

**POST** `/users`

**Body:**
```json
{ "username": "newuser" }
```

**Response (success):**
```json
{ "id": 10001, "username": "newuser" }
```

**Response (if username exists):**
```json
{ "error": "Username already exists" }
```

---

## Stopping the Project

```sh
docker-compose down
```

---

## Notes

- The backend seeds the database with 10,000 users by default. You can change this by setting the `USER_COUNT` variable in your `.env` file.
- All data is stored in Docker volumes and will persist unless you remove the volumes.
