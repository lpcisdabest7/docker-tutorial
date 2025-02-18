# 📦 Docker & Docker Compose với Node.js

## 1. Docker là gì?
Docker là nền tảng giúp đóng gói ứng dụng + môi trường vào container:

- **Container** = gói độc lập, di động
- **Chạy mọi nơi** có cài Docker
- **Đảm bảo môi trường giống nhau**

## 2. Các khái niệm cơ bản

### **Image**
- **Template** để tạo container
- Được **build từ Dockerfile**
- Chứa **mọi thứ** để chạy ứng dụng

### **Container**
- **Instance** của image đang chạy
- **Độc lập** với các container khác
- Có thể **start/stop/delete**

### **Dockerfile**
```dockerfile
# Base image 
FROM node:20

# Thư mục làm việc
WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Cài dependencies
RUN npm install

# Port 
EXPOSE 3000

# Lệnh chạy
CMD ["npm", "start"]
```

## 3. Docker Compose là gì?
Tool để **chạy nhiều container cùng lúc**:
- **Định nghĩa** bằng file YAML
- **Quản lý dependencies** giữa services
- **Chia sẻ network/volume**

### **Ví dụ `docker-compose.yml`**
```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo
    ports: 
      - "27017:27017"
```

## 4. Thực hành

### **Bước 1: Setup project**
```bash
mkdir docker-tutorial
cd docker-tutorial
npm init -y
npm i express
``` 

### **Bước 2: Code `app.js`**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Docker!');
});

app.listen(3000);
```

### **Bước 3: Build & Run**
```bash
# Build image
docker build -t myapp .

# Run container
docker run -p 3000:3000 myapp

# Run với docker-compose 
docker-compose up
```

## 5. Lệnh thường dùng

### **Docker**
```bash
# List containers
docker ps

# Stop container 
docker stop <id>

# Xem logs
docker logs <id>

# Xóa container
docker rm <id>

# List images 
docker images
```

### **Docker Compose**
```bash
# Start
docker-compose up

# Start background
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up --build
```

## 6. Debug & Troubleshoot

### **Xem logs**
```bash
# Follow logs
docker-compose logs -f

# Log container cụ thể
docker logs <container_id>
```

### **Truy cập container**
```bash
# Interactive shell
docker exec -it <container_id> bash

# Kiểm tra process
docker top <container_id>
```

## 7. Best Practices

### **Security**
- Không chạy container với **root**
- Scan **image vulnerabilities**
- Dùng **official images**

### **Performance**
- **Tối ưu cache layers**
- **Multi-stage builds**
- **Minimal base images**

## 8. Demo project: Todo API

### **Project structure**
```
todo-api/
  ├── src/
  │   └── app.js
  ├── Dockerfile
  ├── docker-compose.yml
  └── package.json
```

### **Docker Compose setup**
```yaml
version: '3'

services:
  api:
    build: .
    ports: 
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
```

### **Chạy project**
```bash
# Build & start
docker-compose up --build

# Check logs
docker-compose logs api

# Stop all
docker-compose down
```