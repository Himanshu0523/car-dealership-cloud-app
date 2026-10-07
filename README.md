# Repository Name: car-dealership-cloud-app
# Project Name: Dealership Cloud Application (Best Cars Dealership Portal)

A multi-tier cloud-native car dealership web application with sentiment analysis, containerized with Docker and ready for Kubernetes deployment.

## Architecture Overview

```text
Browser → Django (main site + proxy)
            ├── SQLite        (car makes/models)
            ├── React         (auth UI)
            └── Express API   (dealers + reviews)
                    └── MongoDB
            └── Sentiment service (Flask + VADER)
```

## Services

- **Django Server (`/server`)**: Main web portal, user authentication, car make/model database (SQLite), and template rendering with proxy calls to microservices.
- **Dealership Database API (`/database`)**: Node.js + Express + Mongoose service interfacing with MongoDB for dealership locations and reviews.
- **Sentiment Analyzer (`/sentiment`)**: Python Flask microservice using VADER sentiment analysis for real-time review sentiment scoring.
- **Frontend Auth UI (`/frontend`)**: React + Vite application for authentication flows.
- **Kubernetes Manifests (`/k8s`)**: Deployments, Services, Secrets, and Ingress configuration.
- **CI/CD (`/.github/workflows/ci-cd.yml`)**: Automated linting, testing, and container build/publish workflow.

## Running Locally

### Option A: Docker Compose (Recommended)
```bash
docker compose up --build -d
# Seed MongoDB once healthy
docker compose exec database node seed.js
```

### Option B: Individual Services

1. **MongoDB**: Run local instance on `localhost:27017`
2. **Database Service**:
   ```bash
   cd database
   npm install
   npm run seed
   npm start # :3030
   ```
3. **Sentiment Service**:
   ```bash
   cd sentiment
   pip install -r requirements.txt
   python app.py # :5050
   ```
4. **Django Server**:
   ```bash
   cd server
   pip install -r requirements.txt
   python manage.py makemigrations djangoapp
   python manage.py migrate
   python manage.py loaddata djangoapp/fixtures/car_records.json
   python manage.py runserver 8000
   ```
5. **React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev # :5173
   ```
