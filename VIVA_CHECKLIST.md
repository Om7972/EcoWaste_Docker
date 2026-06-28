# 🎓 College Viva & Project Demonstration Checklist

Prepare for your project viva or college demonstration by reviewing the following verification steps, test cases, and common questions.

---

## 📌 Section 1: Demonstration Checklist (Step-by-Step)

### 1. Database Initialization & Persistence Check
- [ ] **Action**: Stop the stack (`docker-compose down`), then restart it (`docker-compose up -d`).
- [ ] **Verification**: Run `docker exec -it ecowaste-mongodb mongosh --eval "show dbs"`. Confirm that the `ecowaste` database persists and that user accounts are intact.
- [ ] **Significance**: Proves MongoDB persistent volumes (`ecowaste_mongo_data`) are configured correctly.

### 2. Multi-Tenant Registration Flow
- [ ] **Action**: Navigate to `SaaS Ops` -> Register a new city (e.g. "Pune Municipality").
- [ ] **Verification**: Confirm a new organization is added in the database, with a unique isolated workspace domain.
- [ ] **Significance**: Proves multi-tenant workspace partitioning and subscription tier checks.

### 3. Fleet & Operations Audit
- [ ] **Action**: Add a new fleet vehicle (e.g. Plate Number `MH-12-AB-1234`), then add a driver and assign them. Log a fuel purchase expense of `$80`.
- [ ] **Verification**: Verify that the operational expense list immediately updates, and that the total spend metric is correctly recalculated.
- [ ] **Significance**: Proves real-time fleet coordination and dynamic KPI calculations.

### 4. Smart Bin Telemetry & Auto-Routing
- [ ] **Action**: Check the `Smart Bins` dashboard. Wait for a few seconds to see simulated IoT sensor updates.
- [ ] **Verification**: Bins > 80% turn Red, and routes recalculate automatically.
- [ ] **Significance**: Demonstrates live Socket.IO connection and route optimization engine.

### 5. Sustainability QR Scan & Citizen Portal
- [ ] **Action**: Go to `Ecosystem` -> simulated deposit of `5.5 kg` plastic. Click "Verify QR Deposit".
- [ ] **Verification**: A popup confirms Green Points credit, and the Carbon Footprint breakdown graphs immediately re-render.
- [ ] **Significance**: Proves full-stack reward validation loop.

---

## 💬 Section 2: Common Viva Questions & Answers

### Q1: How does your application achieve Multi-Tenant isolation?
> **Answer**: We use a **Logical/Shared Database Isolation** approach. Every data model (User, Vehicle, Driver, Expense, KPIMetric, Complaint) contains an `organization` ObjectId reference. The API endpoints extract the tenant identity from the JWT payload and filter queries accordingly, ensuring that operators from one city can never view or modify data belonging to another.

### Q2: What is the purpose of Nginx in this deployment architecture?
> **Answer**: Nginx acts as a unified reverse proxy and static content gateway. It listens on port `80`, serving compiled React assets directly to clients while forwarding all `/api/*` endpoint requests directly to the Node.js API container, eliminating CORS configuration issues in production.

### Q3: How do the IoT telemetry simulation and predictive overflows work?
> **Answer**: The backend runs a lightweight background telemetry generator simulating physical ultrasonic bin levels. A linear regression engine computes the filling rate based on historical timestamps and forecasts the hour of expected overflow, allowing proactive dispatch scheduling before bins start spilling.
