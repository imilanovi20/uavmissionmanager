# UAV Mission Manager

> Developed as part of a graduate thesis at the Faculty of Organization and Informatics (FOI), University of Zagreb.
> Author: Ivan Milanović-Litre | Mentor: Doc. dr. sc. Marko Mijač | Varaždin, 2026.

UAV Mission Manager is a web-based system for planning and managing unmanned aerial vehicle (UAV) missions. The application enables operators to define mission objectives, assign UAVs and crew members, plan flight routes with waypoints, manage drone formations, detect obstacles, handle flight permits, and check weather conditions — all from a single platform.

The system focuses exclusively on the **mission planning phase** and does not connect to physical drones or execute missions in real time.

---

## Features

- **Authentication & Role Management** — JWT-based authentication with two roles: Administrator and Regular User. Administrators manage UAVs and users; regular users create and manage missions they are assigned to.
- **UAV Management** — Administrators can add, edit, and delete UAVs from the database, including configuration of additional equipment (cameras, sensors, etc.).
- **Mission Creation** — Step-by-step guided process for creating missions with a name, date, and description.
- **Weather Integration** — Automatic retrieval of weather forecast data (temperature, wind speed, precipitation) for the planned mission date using the OpenMeteo API.
- **UAV Selection** — Assign one or more UAVs to a mission from the available fleet.
- **Formation Planning** — Define the initial spatial formation of UAVs participating in the mission using a 2D visual editor.
- **Responsible Personnel** — Assign users responsible for overseeing the mission. Assigned users gain visibility into that mission.
- **Waypoint Planning** — Define the flight path by clicking on an interactive map or entering geographic coordinates manually. All waypoints are connected into a visible route.
- **Task Assignment** — The system automatically assigns Takeoff, Move to Position, and Land tasks to waypoints. Users can additionally assign Execute Command tasks (e.g., activate camera, start sensor) to specific waypoints — only for UAVs equipped with the relevant hardware.
- **Formation Changes** — Define formation change tasks at specific waypoints to dynamically adjust the UAV arrangement during the mission.
- **Obstacle Detection** — Uses the Overpass API to detect buildings, power lines, and other obstacles from OpenStreetMap data along the planned route.
- **Optimal Path Calculation** — Calculates the shortest safe path between waypoints using the A* algorithm, routing around detected obstacles.
- **Mission Duration Estimate** — Calculates the estimated mission duration based on route length and UAV speed, with a warning if the estimated time exceeds UAV battery capacity.
- **Permit Warnings** — Automatically analyzes the mission and alerts the user if special permits are required (e.g., DGU approval for aerial photography, air traffic control coordination for controlled airspace).
- **Mission Summary** — A final overview screen displaying the optimized route on a map, selected UAVs, assigned tasks per waypoint, responsible personnel, estimated duration, and all relevant warnings.

---

## Architecture

The system is built on a **4-layer architecture** that ensures clear separation of concerns, scalability, and maintainability.

**Data Access Layer (DAL)** is responsible for all communication with the database. It implements the Repository design pattern through generic `IRepository` and `IReadOnlyRepository` interfaces, and uses Entity Framework Core with a Code First approach to manage the Microsoft SQL Server database schema through migrations.

**Data Transfer Objects (DTO)** serve as the data contracts between layers. Instead of exposing internal database entities directly to the API, DTO objects carry only the data needed for each specific operation, improving security and reducing unnecessary data transfer.

**Business Logic Layer (BAL)** contains all application logic and services — including mission planning, path calculation, weather fetching, permit analysis, formation management, and email notifications. Controllers in the API layer call BAL services, keeping business logic independent of the presentation layer.

**API Layer** is implemented in ASP.NET Core Web API and acts as the entry point for all HTTP requests from the frontend. It handles routing, JWT authentication middleware, authorization, and returns structured JSON responses.

**Frontend** is a React + Vite single-page application that communicates with the backend exclusively through REST API calls.

**External integrations:**
- [OpenMeteo API](https://open-meteo.com/) — weather forecast data
- [Overpass API](https://overpass-api.de/) — obstacle detection from OpenStreetMap
- SMTP (Gmail) — email notifications when new users are created

**Tech stack:**

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | ASP.NET Core Web API, C# |
| Business Logic | Custom services (BAL) |
| Data Access | Entity Framework Core, Repository Pattern |
| Database | Microsoft SQL Server / LocalDB |
| Auth | JWT Bearer Tokens, BCrypt password hashing |

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) v18+
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server LocalDB
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled (2-Step Verification required)

---

### 1. Configure `appsettings.json`

The `appsettings.json` file is **not included in the repository** for security reasons. Create it manually at:

```
UAV_Mission_Manager_API/UAV_Mission_Manager/appsettings.json
```

Paste the following content and fill in your values:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UAVMissionManager;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUsername": "your_email@gmail.com",
    "SmtpPassword": "your_gmail_app_password",
    "FromEmail": "your_email@gmail.com",
    "FromName": "UAV Mission Manager"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key_minimum_32_characters_long",
    "Issuer": "UAVMissionManager",
    "Audience": "UAVMissionManagerUsers",
    "ExpiryMinutes": 60
  }
}
```

| Field | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string — adjust server name if needed |
| `EmailSettings:SmtpPassword` | Gmail **App Password**, not your regular Gmail login password |
| `Jwt:Key` | Random secret string, minimum 32 characters — keep this private |
| `Jwt:ExpiryMinutes` | Token expiry time in minutes (default: 60) |

> **How to get a Gmail App Password:** Go to [myaccount.google.com](https://myaccount.google.com) → Security → 2-Step Verification → App Passwords → Generate new password for "Mail".

---

### 2. Set Up the Database

Make sure SQL Server LocalDB is running, then apply EF Core migrations to create the database:

```bash
cd UAV_Mission_Manager_API
dotnet ef database update --project UAV_Mission_Manager_DAL --startup-project UAV_Mission_Manager
```

---

### 3. Run the Backend

```bash
cd UAV_Mission_Manager_API/UAV_Mission_Manager
dotnet run
```

The API will start at `https://localhost:7xxx` (check terminal output for the exact port).

Swagger UI is available at `https://localhost:7xxx/swagger` in development mode.

---

### 4. Run the Frontend

```bash
cd UAV_Mission_Manager_API/uav_mission_manager_ui
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## API Authentication

All protected endpoints require a JWT token. To authenticate via Swagger:

1. Call `POST /api/auth/login` with your credentials
2. Copy the token from the response
3. Click **Authorize** in Swagger UI and enter: `Bearer <your_token>`
4. All subsequent requests will be authenticated

---

## Limitations

- The system is designed exclusively for **mission planning** — it does not connect to physical UAVs or execute missions in real time.
- Obstacle detection is based on OpenStreetMap data, which does not include object height information.
- Weather data from OpenMeteo are forecasts and subject to change; real-time weather monitoring is not supported.
- An active internet connection is required for fetching data from external APIs (OpenMeteo, Overpass).
