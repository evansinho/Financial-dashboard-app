# **Financial-dashboard-app**  

> AI-Powered Platform with Frontend, Backend, and AI Services  

## **Table of Contents**  
- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Building and Running the Project](#building-and-running-the-project)  
- [Using Docker Hub Images](#using-docker-hub-images)  
- [Stopping and Cleaning Up](#stopping-and-cleaning-up)  
- [Troubleshooting](#troubleshooting)  

---

## **Project Overview**  

This project consists of three custom-built services:  

1. **Frontend** → Next.js (React) application  
2. **Backend** → Node.js (Express) API  
3. **AI-Service** → AI-powered service for advanced processing  
4. **PostgreSQL** → Database service for backend  

All services are containerized using Docker and can be run using `docker-compose`.  

---

## **Tech Stack**  

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js (Express), PostgreSQL  
- **AI-Service:** Python (FastAPI/Flask)  
- **Database:** PostgreSQL  
- **Infrastructure:** Docker, Docker Compose  

---

## **Prerequisites**  

Ensure you have the following installed:  

- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- [Git](https://git-scm.com/downloads)  

---

## **Installation**  

### **1. Clone the Repository**  
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### **2. Set Up Environment Variables**  
Create a `.env` file in the root directory and define environment variables:  

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
DATABASE_URL=postgresql://user:password@postgres:5432/mydb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=mydb
```

---

## **Building and Running the Project**  

### **1. Build and Start Containers**  
Run the following command to build and start all services:  
```sh
docker-compose up -d --build
```
- `-d` → Runs in detached mode (background)  
- `--build` → Ensures all services are rebuilt  

### **2. Check Running Containers**  
```sh
docker ps
```
Expected output:  
```
CONTAINER ID  IMAGE                          STATUS        PORTS
123abc456789  your-dockerhub-username/frontend   Up 2 mins  0.0.0.0:3000->3000/tcp
234def567890  your-dockerhub-username/backend    Up 2 mins  0.0.0.0:5000->5000/tcp
345ghi678901  your-dockerhub-username/ai-service Up 2 mins  0.0.0.0:8000->8000/tcp
456jkl789012  postgres:14                        Up 2 mins  0.0.0.0:5432->5432/tcp
```

### **3. Access the Application**  
- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:5000](http://localhost:5000)  
- **AI-Service:** [http://localhost:8000](http://localhost:8000)  

---

## **Using Docker Hub Images**  

If you want to use **pre-built images from Docker Hub** instead of building locally, update your `docker-compose.yml` like this:  

```yaml
services:
  frontend:
    image: your-dockerhub-username/frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000

  backend:
    image: your-dockerhub-username/backend:latest
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/mydb

  ai-service:
    image: your-dockerhub-username/ai-service:latest
    ports:
      - "8000:8000"
    depends_on:
      - backend

  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
```

Then pull and start the services using:  

```sh
docker-compose up -d
```

---

## **Stopping and Cleaning Up**  

### **1. Stop Containers**  
```sh
docker-compose down
```

### **2. Remove Unused Docker Images (Optional)**  
```sh
docker system prune -a
```

---

## **Troubleshooting**  

### **1. Docker Login Issues (`unauthorized: access token has insufficient scopes`)**  
- Run `docker login` and enter your credentials.  
- If using an **access token**, generate one from [Docker Hub Security Settings](https://hub.docker.com/settings/security) and use that instead of your password.  

### **2. Port Already in Use Error**  
If a service fails to start because the port is in use, stop any running processes using:  
```sh
sudo lsof -i :<port>
kill -9 <PID>
```
Example for port `3000`:  
```sh
sudo lsof -i :3000
kill -9 12345
```

### **3. Containers Not Starting Properly**  
Check logs for any errors:  
```sh
docker-compose logs -f
```

### **4. Database Connection Issues**  
If the backend cannot connect to PostgreSQL, check if the container is running:  
```sh
docker ps | grep postgres
```
If not running, start it manually:  
```sh
docker-compose up -d postgres
```

### **5. Manually Rebuild a Service**  
If a service has issues, rebuild it individually:  
```sh
docker-compose up -d --build frontend
```

---

## **Contributing**  
1. Fork the repository  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit changes (`git commit -m "Added new feature"`)  
4. Push to your branch (`git push origin feature-name`)  
5. Open a Pull Request  

---

## **License**  
This project is licensed under the [MIT License](LICENSE).
