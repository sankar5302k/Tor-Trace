# Welcome to Tor trace - Large-Scale Deanonymization of Onion Services

# The Project
Tor Trace delivers precise, real-time traffic correlation and rapid forensic analysis, turning
complex anonymity breaches into actionable insights for law enforcement.

1. Identify the origin IP/location of a site using a container-based relay system.
2. Attach a small flag (tracker data) to each request to trace the traffic flow route
3. Store and dynamically update all flow routes in a database for instant police review through a simple interactive dashboard.

<img width="634" height="309" alt="image" src="https://github.com/user-attachments/assets/55709029-4e6b-489f-a1d3-0a039c5580bc" />

The main programming languages used in this repository are:

TypeScript: 93.4%
CSS: 3.4%
JavaScript: 3%
Dockerfile: 0.2%

```
.
├── README.md
├── Tortrace.exe
├── client.Dockerfile
├── docker-compose.yml
├── frontend/
├── mongo-init/
├── package.json
├── relay.Dockerfile
└── src/
```
# Project setup
1. Clone the project
   ```
   git clone https://github.com/sankar5302k/Tor-Trace.git
   ```
2. Once you have cloned, Make sure you are in the project directory
   ```
   docker compose up --build
   ```
3. Open another terminal, and run this commands
   ```
   cd frontend
   npm install
   npm run dev
   ```
# Final step
At last open the Tortrace.exe file to use the Service and start using it.

## Software requirements
1. NodeJS and npm
2. Docker Desktop

Thank you!
