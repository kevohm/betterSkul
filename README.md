# Better REPL – MySQL REPL Playground

Better REPL is a **MySQL REPL-style playground** that lets users safely execute SQL queries via:

* 🧑‍💻 **CLI-based REPL** (Node.js)
* 🌐 **Web-based REPL UI** (React)
* 🔒 **Hardened Express API** with rate limiting, validation, and error normalization

This document explains **how to run it locally**, **what it currently offers**, and **where it’s heading next**.

---

## 1. What Better REPL Is

Better REPL mimics the feel of a real MySQL terminal while adding modern developer-friendly features:

* SQL execution against a real MySQL database
* Interactive REPL experience (CLI & Web)
* Safe-by-default validation and guardrails
* Designed for **learning, demos, interviews, and internal tooling**

---

## 2. Architecture Overview

```
┌────────────┐      HTTP       ┌──────────────┐
│  React UI  │ ─────────────▶ │ Express API  │
│ (Web REPL) │                │              │
└────────────┘                │  - CORS      │
        ▲                     │  - RateLimit │
        │                     │  - Validation│
        │                     │  - Errors    │
        │                     └──────┬───────┘
        │                            │
        │                            ▼
┌────────────┐                ┌──────────────┐
│ Node CLI   │ ─────────────▶ │ MySQL DB     │
│ (REPL)     │   mysql2       │ (Docker)    │
└────────────┘                └──────────────┘
```

---

## 3. Running Better REPL Locally

### 3.1 Prerequisites

* Node.js 18+
* Docker & Docker Compose
* MySQL client (optional)

---

### 3.2 Environment Setup

Create environment files:

```bash
.env.development
.env
```

Example values:

```env
DB_HOST=localhost
DB_USER=betterrepl
DB_PASSWORD=betterrepl
DB_NAME=better_repl
PORT=4000
```

---

### 3.3 Start Database (Docker)

```bash
npm run docker:dev
```

This will:

* Start MySQL in Docker
* Create volumes for persistence
* Expose the DB to the API & CLI

To reset everything:

```bash
npm run docker:dev:reset
```

---

### 3.4 Start the API Server

```bash
npm run dev
```

What happens:

* Express server starts on `http://localhost:4000`
* CORS allows `localhost:5173`
* Rate limiting enabled on `/api/*`
* MySQL connection pool initialized

Health check:

```bash
GET /api/health
```

---

### 3.5 Start the Web REPL UI

```bash
npm run dev   # from the frontend project
```

Open:

```
http://localhost:5173
```

You now have a **browser-based MySQL REPL**.

---

### 3.6 Start the CLI REPL

```bash
npm run dev:cli
```

You’ll see:

```
Welcome to MySQL REPL. Type "exit" to quit.
mysql>
```

---

## 4. Web REPL Features

### 4.1 Terminal-like Experience

* `mysql>` prompt
* Command history (↑ / ↓)
* Ctrl shortcuts:

  * `Ctrl + Enter` → force execute
  * `Ctrl + L` → clear screen
  * `Ctrl + C` → cancel input

---

### 4.2 SQL Execution

* Auto-executes when query ends with `;`
* Supports:

  * SELECT
  * INSERT / UPDATE / DELETE
  * DDL (CREATE / ALTER / DROP tables)

---

### 4.3 Smart Output Handling

* **SELECT** → ASCII-style table output
* **MODIFY / DDL** → affected rows, insert ID, warnings
* Execution time displayed

---

### 4.4 Built-in REPL Commands

```sql
status;
```

Shows database health & timestamp

```sql
exit;
```

Exits the playground

---

### 4.5 Autocomplete

* Press `Tab`
* Suggests SQL keywords like:

  * SELECT, INSERT, CREATE TABLE, JOIN, WHERE

---

### 4.6 Live DB Status Indicator

Header shows:

* 🟢 connected
* 🔴 down
* 🟡 unknown

---

## 5. CLI REPL Features

### 5.1 Native Terminal REPL

* Uses Node.js `readline`
* Real MySQL execution via `mysql2`
* Same DB as the web app

---

### 5.2 SQL Syntax Highlighting

Queries are colorized using `cli-highlight` before execution.

---

### 5.3 Dangerous SQL Warnings

Warns (non-blocking) on:

```sql
DROP DATABASE
DROP TABLE
TRUNCATE
```

---

### 5.4 Pretty Results

* SELECT → `console.table`
* Mutations → success feedback

---

## 6. API Safety & Hardening

### 6.1 Rate Limiting

* 100 requests / 15 minutes per IP
* Applied to `/api/*`

---

### 6.2 SQL Validation

* Non-empty SQL required
* Max query length: 20,000 chars
* Prevents malformed payload abuse

---

### 6.3 Error Normalization

Maps MySQL errors to HTTP responses:

| MySQL Code       | HTTP | Message          |
| ---------------- | ---- | ---------------- |
| ER_PARSE_ERROR   | 400  | SQL syntax error |
| ER_DUP_ENTRY     | 409  | Duplicate entry  |
| ER_NO_SUCH_TABLE | 404  | Table not found  |
| ETIMEDOUT        | 504  | Query timeout    |

---

## 7. Production Scripts

```json
"start": "NODE_ENV=production node index.js",
"start:cli": "NODE_ENV=production node repl.js"
```

* Locked-down CORS
* Cleaner error messages
* Same feature set

---

## 8. Future Improvements (Roadmap)

### Short-term

* Query history persistence
* Saved snippets
* Read-only mode toggle
* Explain / Describe queries

### Medium-term

* User authentication
* Role-based SQL permissions
* Schema visualizer
* Multiple database connections

### Long-term

* Query planner visualization
* Execution plan & cost analysis
* Sandbox databases per user
* AI-assisted SQL suggestions

---

## 9. Why This Matters

Better REPL demonstrates:

* Strong backend fundamentals (Express, MySQL, security)
* Real-world SQL handling
* REPL UX design (CLI + Web)
* Clean error handling & observability

Perfect for:

* Interviews
* Teaching SQL
* Internal tools
* Developer platforms

---

**Better REPL – SQL, without fear.** 🚀
