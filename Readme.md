# Event Registration System — Backend API

A RESTful backend API built with **Node.js** and **Express.js** that manages events and user registrations. Data is persisted using a lightweight **JSON file-based storage** system — no external database required.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Events API](#events-api)
  - [Registrations API](#registrations-api)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Available Scripts](#available-scripts)

---

## Tech Stack

| Technology  | Version  | Purpose                         |
| ----------- | -------- | ------------------------------- |
| Node.js     | >= 18.x  | JavaScript runtime              |
| Express.js  | ^5.2.1   | Web framework                   |
| UUID        | ^14.0.0  | Unique ID generation            |
| dotenv      | ^17.4.2  | Environment variable management |
| Prettier    | ^3.8.3   | Code formatting                 |

> **Storage**: JSON flat-file storage. No external database is required. Files are auto-generated inside `BACKEND/data/` on first run.

---

## Project Structure

```
PROJECT IMP/
└── BACKEND/
    ├── src/
    │   ├── Controllers/
    │   │   ├── event.controller.js          # Business logic for events
    │   │   └── registration.controller.js   # Business logic for registrations
    │   ├── Models/
    │   │   ├── event.model.js               # Event CRUD operations (JSON file)
    │   │   └── registration.model.js        # Registration CRUD operations (JSON file)
    │   ├── Routes/
    │   │   ├── event.routes.js              # Event route definitions
    │   │   └── registration.routes.js       # Registration route definitions
    │   ├── Utils/
    │   │   ├── ApiError.js                  # Centralized error response class
    │   │   └── ApiResponse.js               # Standardized success response class
    │   ├── db/
    │   │   └── db.js                        # Initializes JSON data files on startup
    │   ├── app.js                           # Express app setup and route mounting
    │   └── index.js                         # Server entry point
    ├── data/                                # Auto-generated on first run
    │   ├── events.json                      # Persisted event records
    │   └── registration.json               # Persisted registration records
    ├── .env                                 # Local environment variables (not committed)
    ├── .env.example                         # Environment variable template
    └── package.json
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system before proceeding:

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** (comes bundled with Node.js)

Verify your installation:

```bash
node --version
npm --version
```

---

### Installation

**1. Clone the repository:**

```bash
git clone <your-repository-url>
cd "PROJECT IMP/BACKEND"
```

**2. Install dependencies:**

```bash
npm install
```

---

### Environment Variables

Create a `.env` file inside the `BACKEND/` directory by copying the provided template:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Open the `.env` file and configure the following variable:

```env
PORT=3000
```

> **Important:** The server will not start if `PORT` is not defined. Ensure this value is always set before running.

---

### Running the Server

**Development mode** — auto-restarts on file changes via `nodemon`:

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Upon successful startup, the console will display:

```
Server is running on port 3000
Database initialized
```

> On the **first run**, the `data/` directory along with `events.json` and `registration.json` are created automatically. No manual file setup is needed.

---

## API Reference

**Base URL:** `http://localhost:<PORT>`

All API endpoints are prefixed with: `/api/v1/`

---

### Health Check

Verify that the server is running and reachable.

```
GET /health
```

**Response — 200 OK:**

```json
{
  "message": "Server is healthy"
}
```

---

### Events API

Base path: `/api/v1/events`

---

#### POST /api/v1/events/create

Creates a new event.

**Request Body** (`application/json`):

| Field        | Type     | Required | Description                                        |
| ------------ | -------- | -------- | -------------------------------------------------- |
| `eventName`  | `string` | Yes      | A unique name for the event                        |
| `totalSeats` | `number` | Yes      | Total seat capacity. Must be greater than 0        |
| `eventDate`  | `string` | Yes      | ISO 8601 date string. Must be a future date        |

**Example Request Body:**

```json
{
  "eventName": "Tech Conference 2026",
  "totalSeats": 100,
  "eventDate": "2026-12-15T10:00:00.000Z"
}
```

**Success Response — 201 Created:**

```json
{
  "statusCode": 201,
  "message": "Event created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "eventName": "Tech Conference 2026",
    "totalSeats": 100,
    "eventDate": "2026-12-15T10:00:00.000Z",
    "availableSeats": 100,
    "registrations": []
  }
}
```

**Error Responses:**

| Status Code | Reason                                          |
| ----------- | ----------------------------------------------- |
| 400         | One or more required fields are missing         |
| 400         | `totalSeats` is zero or a negative number       |
| 400         | An event with the same name already exists      |
| 400         | The provided event date is not in the future    |

---

#### GET /api/v1/events

Retrieves a list of all events. Supports optional filtering and sorting.

**Query Parameters:**

| Parameter  | Type     | Required | Default | Description                                          |
| ---------- | -------- | -------- | ------- | ---------------------------------------------------- |
| `upcoming` | `string` | No       | —       | Pass `true` to return only future events             |
| `sort`     | `string` | No       | `asc`   | Sort direction by event date. Values: `asc`, `desc`  |

**Example Requests:**

```
GET /api/v1/events
GET /api/v1/events?upcoming=true
GET /api/v1/events?sort=desc
GET /api/v1/events?upcoming=true&sort=asc
```

**Success Response — 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Events retrieved successfully",
  "data": {
    "events": [
      {
        "availableSeats": 98,
        "totalRegistrations": 2,
        "status": "upcoming"
      }
    ]
  }
}
```

**Error Responses:**

| Status Code | Reason                                                   |
| ----------- | -------------------------------------------------------- |
| 404         | No events exist in the system                            |
| 404         | No upcoming events found (when `upcoming=true` is used)  |

---

### Registrations API

Base path: `/api/v1/registrations`

---

#### POST /api/v1/registrations/create/:eventId

Registers a user for a specific event.

**URL Parameters:**

| Parameter | Type     | Required | Description                         |
| --------- | -------- | -------- | ----------------------------------- |
| `eventId` | `string` | Yes      | The UUID of the target event        |

**Request Body** (`application/json`):

| Field   | Type     | Required | Description                      |
| ------- | -------- | -------- | -------------------------------- |
| `name`  | `string` | Yes      | Full name of the attendee        |
| `email` | `string` | Yes      | Email address of the attendee    |

**Example Request:**

```
POST /api/v1/registrations/create/550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "name": "Hamza Riaz",
  "email": "hamza@example.com"
}
```

**Success Response — 201 Created:**

```json
{
  "statusCode": 201,
  "message": "Registration created successfully",
  "data": {
    "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
    "name": "Hamza Riaz",
    "email": "hamza@example.com",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-06-06T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Status Code | Reason                                                    |
| ----------- | --------------------------------------------------------- |
| 400         | One or more required fields are missing                   |
| 404         | No event found with the provided `eventId`                |
| 400         | This email is already registered for the specified event  |
| 400         | No seats are available for this event                     |

---

#### POST /api/v1/registrations/cancel/:eventId

Cancels an existing registration and restores one available seat.

**URL Parameters:**

| Parameter | Type     | Required | Description                                  |
| --------- | -------- | -------- | -------------------------------------------- |
| `eventId` | `string` | Yes      | The UUID of the event to cancel from         |

**Request Body** (`application/json`):

| Field   | Type     | Required | Description                                |
| ------- | -------- | -------- | ------------------------------------------ |
| `email` | `string` | Yes      | The email address used during registration |

**Example Request:**

```
POST /api/v1/registrations/cancel/550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "email": "hamza@example.com"
}
```

**Success Response — 200 OK:**

```json
{
  "statusCode": 200,
  "message": "Registration cancelled successfully",
  "data": null
}
```

**Error Responses:**

| Status Code | Reason                                          |
| ----------- | ----------------------------------------------- |
| 400         | `email` or `eventId` is missing                 |
| 404         | No event found with the provided `eventId`      |
| 404         | No registration found for the provided email    |

---

## Data Models

### Event Object

```json
{
  "id": "string (UUID v4)",
  "eventName": "string (unique)",
  "totalSeats": "number",
  "eventDate": "string (ISO 8601)",
  "availableSeats": "number",
  "registrations": ["array of registration UUIDs"]
}
```

### Registration Object

```json
{
  "id": "string (UUID v4)",
  "name": "string",
  "email": "string",
  "eventId": "string (UUID v4)",
  "timestamp": "string (ISO 8601)"
}
```

---

## Error Handling

All error responses follow a consistent structure:

```json
{
  "statusCode": 400,
  "message": "Descriptive error message",
  "success": false
}
```

The application uses a centralized `ApiError` class along with Express's built-in error handling middleware to ensure all errors — whether validation failures or not-found cases — return a predictable, well-structured response.

---

## Available Scripts

All commands must be run from inside the `BACKEND/` directory.

| Script       | Command       | Description                                      |
| ------------ | ------------- | ------------------------------------------------ |
| Development  | `npm run dev` | Starts the server with nodemon (auto-restarts)   |
| Production   | `npm start`   | Starts the server using Node.js directly         |

---

*Built by Hamza Riaz*
