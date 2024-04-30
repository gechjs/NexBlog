# Deployment Guide for NexBlog

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/gechjs/NexBlog.git
cd NexBlog
```

### 2. Install Dependencies
```bash
npm run install-deps
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb+srv://blog:RD8paskYC8Ayj09u@cluster0.pflplid.mongodb.net/?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=4000

# Client URL
CLIENT_URL=http://localhost:3000
```

## Development

### Start Development Servers
```bash
npm run dev
```
This will start both the backend server (port 4000) and frontend development server (port 3000).

### Individual Services
```bash
# Start backend only
npm run server

# Start frontend only
npm run client
```

## Production Deployment

### Option 1: Traditional VPS/Server

1. **Build the frontend:**
```bash
npm run build
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/NexBlog/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Start the backend:**
```bash
npm start
```

4. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start server/index.js --name "nexblog-api"
pm2 startup
pm2 save
```

### Option 2: Docker Deployment

1. **Create Dockerfile:**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN cd client && npm ci && npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

2. **Build and run:**
```bash
docker build -t nexblog .
docker run -p 4000:4000 --env-file .env nexblog
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com

# Deploy
git push heroku main
```

#### Vercel (Frontend only)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd client
vercel --prod
```

#### Netlify (Frontend only)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/build`
4. Add redirect rule for API calls:
```
/api/*  https://your-backend-url.com/api/:splat  200
```

## Environment Variables

### Required Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLIENT_URL`: Frontend application URL

### Optional Variables
- `PORT`: Backend server port (default: 4000)

## Database Setup

### MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Add your IP to the whitelist
5. Update `MONGODB_URI` in `.env`

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
sudo systemctl start mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/nexblog
```

## Security Considerations

1. **Change default JWT secret** in production
2. **Use HTTPS** in production
3. **Enable CORS** only for your domain
4. **Use environment variables** for sensitive data
5. **Regular updates** of dependencies
6. **Database backups** for MongoDB

## Monitoring and Maintenance

### Logs
```bash
# PM2 logs
pm2 logs nexblog-api

# System logs
tail -f /var/log/nginx/error.log
```

### Performance Monitoring
- Use PM2 monitoring: `pm2 monit`
- Set up application monitoring (New Relic, DataDog)
- Monitor database performance

### Backup Strategy
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backup/$DATE"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR
tar -czf "$BACKUP_DIR.tar.gz" $BACKUP_DIR
rm -rf $BACKUP_DIR
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `CLIENT_URL` in `.env`
2. **Database Connection**: Verify `MONGODB_URI` and network access
3. **Build Failures**: Check Node.js version and clear cache
4. **Port Conflicts**: Ensure ports 3000 and 4000 are available

### Health Checks
```bash
# Backend health
curl http://localhost:4000/health

# Database connection
curl http://localhost:4000/
```

## Support

For issues and questions:
1. Check the logs
2. Verify environment variables
3. Test database connectivity
4. Review deployment configuration

---

**Note**: This deployment guide covers the most common deployment scenarios. Adjust according to your specific requirements and infrastructure.
