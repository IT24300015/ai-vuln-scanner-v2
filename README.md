# AI-Powered Web Vulnerability Scanner

A web application that automatically scans websites for security vulnerabilities and generates detailed reports using AI. Built as a portfolio project to demonstrate full-stack development and cybersecurity knowledge.

## Live Demo

- Frontend: https://ai-vuln-scanner-v2.vercel.app
- Backend API: https://ai-vuln-scanner-v2-production.up.railway.app
- API Documentation: https://ai-vuln-scanner-v2-production.up.railway.app/docs
- GitHub: https://github.com/IT24300015/ai-vuln-scanner-v2

## What It Does

You enter a website URL and the scanner automatically checks it for common security vulnerabilities. After the scan completes an AI model analyzes the findings and writes a professional security report with recommendations on how to fix each issue.

The scanner currently detects these vulnerability types:

- SQL Injection
- Cross-Site Scripting (XSS)
- Missing Security Headers
- Exposed Sensitive Files
- Open Redirects

## Tech Stack

Backend is built with Python and FastAPI connected to a PostgreSQL database hosted on Railway. Authentication uses JWT tokens. The AI report generation uses the Groq API running the LLaMA 3.3 model.

Frontend is built with React JavaScript styled with Tailwind CSS and uses Recharts for the dashboard charts. The app is deployed on Vercel and communicates with the backend through REST API calls.

Backend:
- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT Authentication
- Groq AI LLaMA 3.3 70B

Frontend:
- React JavaScript
- Tailwind CSS
- Recharts
- React Router DOM
- Axios

DevOps:
- Docker and Docker Compose
- Railway for backend hosting
- Vercel for frontend hosting
- GitHub

## Running Locally

Clone the repository:

git clone https://github.com/IT24300015/ai-vuln-scanner-v2.git
cd ai-vuln-scanner-v2

Running with Docker:

docker compose up -d

Then open http://localhost:8080 in your browser.

Running manually:

Backend:
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Frontend:
cd frontend
npm install
npm run dev

## Environment Variables

Backend .env file:

DATABASE_URL=postgresql://your_database_url
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
APP_ENV=production
DEBUG=False
FREE_SCAN_LIMIT=30

Frontend .env file:

VITE_API_URL=https://your-backend-url.railway.app

## Project Structure

ai-vuln-scanner-v2/
  backend/
    app/
      api/
      core/
      models/
      scanners/
      services/
    alembic/
    requirements.txt
    Procfile
  frontend/
    src/
      pages/
      components/
      context/
      services/
  docker-compose.yml

## How the Scanner Works

When a scan is started the application crawls the target website to find all pages and forms. Then it runs five separate detection modules against each page. Each module checks for a specific vulnerability type and returns findings with a confidence score. Once all modules finish the results are sent to the Groq AI API which writes a professional security report with remediation steps.

The scan runs in the background so the user does not have to wait. The frontend polls the API every few seconds and automatically redirects to the results page when the scan is complete.

## Author

Nimesh Nilakshan
GitHub: https://github.com/IT24300015
Email: IT24300015@my.sliit.lk

## License

MIT License
