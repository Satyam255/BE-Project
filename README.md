### 1️⃣ Start Python Microservice

```bash
cd python-server
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

2️⃣ Start Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Docker Commands

```
docker run -d --name piston_api -p 2000:2000 --privileged -v piston_data:/piston ghcr.io/engineer-man/piston
```

Check container status:

```
docker ps
docker logs piston_api
```

Install languages:
JavaScript (node)

```
Invoke-WebRequest -Uri "http://localhost:2000/api/v2/packages" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"language":"javascript","version":"18.15.0"}' -UseBasicParsing
```

Python

```
Invoke-WebRequest -Uri "http://localhost:2000/api/v2/packages" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"language":"python","version":"3.10.0"}' -UseBasicParsing
```

GCC — covers both C and C++

```
Invoke-WebRequest -Uri "http://localhost:2000/api/v2/packages" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"language":"gcc","version":"10.2.0"}' -UseBasicParsing
```

Java

```
Invoke-WebRequest -Uri "http://localhost:2000/api/v2/packages" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"language":"java","version":"15.0.2"}' -UseBasicParsing
```

Daily Use Commands
Start Piston when beginning work:

```
docker start piston_api
```

Stop Piston when done working:

```
docker stop piston_api
```

Check if Piston is running:

```
docker ps
```

View Piston logs if something goes wrong:

```
docker logs piston_api
```
