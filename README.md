# 🌿 EcoWaste - AI-Powered Smart Waste Management Platform

A full-stack, production-ready smart waste management platform built with React, Node.js, MongoDB, and Docker. Uses AI-powered waste classification, route optimization, and community-driven recycling programs.

![License](https://img.shields.io/badge/license-MIT-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Node](https://img.shields.io/badge/node-20+-brightgreen)
![React](https://img.shields.io/badge/react-18+-61DAFB)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Demo Credentials](#demo-credentials)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Waste Classification | Upload images for instant waste category prediction |
| 📊 Analytics Dashboard | Interactive charts showing waste management metrics |
| 🗺️ Recycling Center Locator | Find nearby centers on an interactive map |
| 📝 Complaint Tracking | Report and track garbage issues in real-time |
| 🏆 Reward Points | Earn points for recycling participation |
| 🚛 Route Optimization | AI-driven route planning for collection trucks |
| 🔔 Real-time Notifications | Stay updated on complaint status changes |
| 🌓 Dark/Light Mode | Toggle between themes |
| 👥 Role-based Access | Citizen, Admin, and Collector roles |
| 📱 Responsive Design | Mobile-first, works on all devices |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - UI framework
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Animations & transitions
- **Recharts** - Data visualization
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Leaflet** - Maps integration

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** + **CORS** - Security
- **Morgan** - HTTP logging

### DevOps
- **Docker** + **Docker Compose** - Containerization
- **Nginx** - Reverse proxy & static serving
- **Multi-stage builds** - Optimized images

---

## 📁 Project Structure

```
Assignment_7/
├── frontend/                # React TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── layout/      # Navbar, Footer, Layout
│   │   ├── context/         # Auth & Theme contexts
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Entry point
│   ├── Dockerfile           # Multi-stage frontend build
│   ├── nginx.conf           # Nginx configuration
│   └── .dockerignore
├── backend/                 # Express.js API
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers (MVC)
│   ├── middleware/          # Auth, upload middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Seed script, helpers
│   ├── uploads/             # File upload storage
│   ├── server.js            # Express app entry
│   ├── Dockerfile           # Multi-stage backend build
│   └── .dockerignore
├── docker-compose.yml       # Full stack orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecowaste.git
cd ecowaste
```

### 2. Local Setup (Without Docker)

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Edit with your MongoDB URI
npm run seed            # Seed demo data
npm run dev             # Start on port 5000
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev             # Start on port 5173
```

---

## 🐳 Docker Deployment (Production Ready)

The project includes a production-ready Docker setup using multi-stage builds, Alpine images, and custom bridge networking.

### Build & Run with Docker Compose
```bash
# Build and start all services in detached mode
docker-compose up --build -d

# Verify containers are running
docker ps

# List created images
docker images

# View logs for a specific service
docker-compose logs -f frontend

# Stop all services and remove containers
docker-compose down
```

*Frontend will be available on port 3000.*
*Backend will be available on port 5000.*
*MongoDB will be running on port 27017 with a persistent volume.*

### Individual Docker Builds & Docker Hub Push

If you want to build and push individual images to Docker Hub:

#### Frontend
```bash
cd frontend
# Build the optimized production image
docker build -t ecowaste-frontend .
# Tag for Docker Hub
docker tag ecowaste-frontend yourusername/ecowaste-frontend:latest
# Push to Docker Hub
docker push yourusername/ecowaste-frontend:latest
```

#### Backend
```bash
cd backend
# Build the optimized production image
docker build -t ecowaste-backend .
# Tag for Docker Hub
docker tag ecowaste-backend yourusername/ecowaste-backend:latest
# Push to Docker Hub
docker push yourusername/ecowaste-backend:latest
```

---

## ⚙️ CI/CD Workflow (GitHub Actions)

This project includes a complete CI/CD pipeline using GitHub Actions to automatically build and push Docker images to Docker Hub whenever code is pushed to the `main` branch.

### How to Configure the Workflow

1. **Create a Docker Hub Repository**:
   - Go to [Docker Hub](https://hub.docker.com/) and create an account.
   - You don't need to manually create repositories, the push command will create them automatically as `smartwaste-frontend` and `smartwaste-backend`.

2. **Add GitHub Secrets**:
   - Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
   - Click **New repository secret**.
   - Add the following secrets:
     - `DOCKERHUB_USERNAME`: Your Docker Hub username.
     - `DOCKERHUB_TOKEN`: An Access Token generated from Docker Hub (Account Settings -> Security -> New Access Token). *Do not use your account password.*

3. **Trigger the Workflow**:
   - The workflow is defined in `.github/workflows/docker-deploy.yml`.
   - It will automatically trigger when you push to the `main` branch.
   - You can also trigger it manually from the **Actions** tab in GitHub.

### Pulling and Running from Docker Hub

Once the CI/CD pipeline has published the images, anyone can run your application without needing to build it from source!

```bash
# Pull the latest frontend image
docker pull yourusername/smartwaste-frontend:latest

# Pull the latest backend image
docker pull yourusername/smartwaste-backend:latest

# Run the frontend (maps container port 3000 to host port 3000)
docker run -d -p 3000:3000 --name ecowaste-frontend yourusername/smartwaste-frontend:latest

# Run the backend (maps container port 5000 to host port 5000)
docker run -d -p 5000:5000 --name ecowaste-backend yourusername/smartwaste-backend:latest
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | Get all complaints |
| GET | `/api/complaints/my` | Get user's complaints |
| POST | `/api/complaints` | Create complaint (with images) |
| PUT | `/api/complaints/:id` | Update complaint |
| DELETE | `/api/complaints/:id` | Delete (admin only) |

### Waste Classification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waste/predict` | Upload image for AI prediction |
| GET | `/api/waste/history` | Get prediction history |
| GET | `/api/waste/stats` | Get waste statistics |

### Recycling Centers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recycling-centers` | Get all centers |
| GET | `/api/recycling-centers/nearby?lat=&lng=` | Get nearby centers |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | User stats |
| GET | `/api/dashboard/admin-stats` | Admin stats |
| GET | `/api/dashboard/analytics` | Analytics data |

### Rewards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rewards/points` | Get user points |
| GET | `/api/rewards/leaderboard` | Get leaderboard |
| POST | `/api/rewards/redeem` | Redeem points |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecowaste.io | demo123456 |
| Citizen | citizen@ecowaste.io | demo123456 |
| Collector | collector@ecowaste.io | demo123456 |

> Run `npm run seed` in the backend directory to create these users.

---

## 🎨 UI/UX Features

- **Glassmorphism** design with frosted glass effects
- **Framer Motion** page transitions and micro-animations
- **Dark/Light mode** with system preference detection
- **Responsive layout** optimized for all screen sizes
- **Interactive charts** with Recharts
- **Gradient backgrounds** and neon glow effects
- **Custom scrollbar** styling
- **Google Fonts** (Inter, Outfit)

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

Built with 💚 for a cleaner planet.
