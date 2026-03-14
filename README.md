# UAV Mission Manager

> Developed as part of a graduate thesis at the Faculty of Organization and Informatics (FOI), University of Zagreb.

UAV Mission Manager is a web-based system for planning, managing, and monitoring unmanned aerial vehicle (UAV) missions. The application enables operators to define mission objectives, assign UAVs and crew members, plan flight routes with waypoints, manage formations, track obstacles, handle flight permits, and monitor weather conditions — all from a single platform.

---

## Architecture

The system follows a **3-tier architecture** split across multiple projects:

```
UAV_Mission_Manager/
├── UAV_Mission_Manager/          # API layer (ASP.NET Core Web API)
│   ├── Controllers/              # REST API endpoints
│   ├── appsettings.json          # Configuration (not in repo - see setup below)
│   └── Program.cs                # App entry point & service registration
│
├── UAV_Mission_Manager_BAL/      # Business logic layer
│   └── Services/                 # EmailService, JwtService, MissionService, etc.
│
├── UAV_Mission_Manager_DAL/      # Data access layer
│   ├── Entities/                 # EF Core entity models
│   └── ApplicationDbContext.cs   # Database context
│
├── UAV_Mission_Manager_DTO/      # Shared Data Transfer Objects
│
└── uav_mission_manager_ui/       # Frontend (React + Vite)
```

**Tech stack:**
- **Backend:** ASP.NET Core Web API, Entity Framework Core, SQL Server
- **Auth:** JWT Bearer tokens
- **Frontend:** React, Vite
- **Email:** SMTP via Gmail App Password

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server LocalDB
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

---

### 1. Configure `appsettings.json`

The `appsettings.json` file is **not included in the repository** for security reasons. You need to create it manually.

Navigate to `UAV_Mission_Manager_API/UAV_Mission_Manager/` and create `appsettings.json` with the following content:

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

> **Note:** For `Jwt:Key`, generate a long random string (minimum 32 characters). For `SmtpPassword`, use a Gmail App Password, not your regular Gmail password.

---

### 2. Set Up the Database

Make sure SQL Server LocalDB is running, then apply EF Core migrations:

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

The API will start at `https://localhost:7xxx` (check terminal output for exact port).  
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

All protected endpoints require a JWT token. To authenticate:

1. Call `POST /api/auth/login` with your credentials
2. Copy the token from the response
3. In Swagger UI, click **Authorize** and enter: `Bearer <your_token>`
4. All subsequent requests will be authenticated

---

## Environment Notes

| Setting | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `EmailSettings:SmtpPassword` | Gmail App Password (not your Gmail login password) |
| `Jwt:Key` | Secret key for signing JWT tokens — keep this private |
| `Jwt:ExpiryMinutes` | Token expiry time in minutes (default: 60) |
