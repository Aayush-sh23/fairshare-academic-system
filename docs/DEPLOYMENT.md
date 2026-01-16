# Deployment Guide

This guide covers deploying FairShare to various platforms.

## Table of Contents

- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [DigitalOcean](#digitalocean)
  - [AWS EC2](#aws-ec2)
- [Database Migration](#database-migration)
- [Environment Variables](#environment-variables)
- [Security Checklist](#security-checklist)

---

## Local Development

```bash
# Clone repository
git clone https://github.com/Aayush-sh23/fairshare-academic-system.git
cd fairshare-academic-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env

# Start development server
npm run dev
```

---

## Production Deployment

### Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create fairshare-app
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

**Note:** Heroku's ephemeral filesystem means SQLite data will be lost on dyno restart. Consider upgrading to PostgreSQL:

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Update database.js to use PostgreSQL
# Install pg package
npm install pg
```

---

### Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=your-super-secret-key
railway variables set NODE_ENV=production
```

5. **Deploy**
```bash
railway up
```

6. **Get URL**
```bash
railway domain
```

---

### DigitalOcean

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select appropriate size (minimum: 1GB RAM)
   - Add SSH key

2. **SSH into Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2**
```bash
npm install -g pm2
```

5. **Clone Repository**
```bash
git clone https://github.com/Aayush-sh23/fairshare-academic-system.git
cd fairshare-academic-system
```

6. **Install Dependencies**
```bash
npm install --production
```

7. **Create Environment File**
```bash
nano .env
```

Add:
```
PORT=3000
JWT_SECRET=your-super-secret-key
NODE_ENV=production
```

8. **Start with PM2**
```bash
pm2 start server.js --name fairshare
pm2 save
pm2 startup
```

9. **Setup Nginx (Optional)**
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/fairshare
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/fairshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t2.micro (free tier) or larger
   - Configure Security Group:
     - SSH (22) from your IP
     - HTTP (80) from anywhere
     - HTTPS (443) from anywhere
     - Custom TCP (3000) from anywhere (for testing)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

3. **Follow DigitalOcean steps 3-10**

4. **Setup Auto-scaling (Optional)**
   - Create AMI from your configured instance
   - Create Launch Template
   - Create Auto Scaling Group
   - Configure Load Balancer

---

## Database Migration

### SQLite to PostgreSQL

1. **Install PostgreSQL**
```bash
sudo apt install postgresql postgresql-contrib
```

2. **Create Database**
```bash
sudo -u postgres psql
CREATE DATABASE fairshare;
CREATE USER fairshare_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fairshare TO fairshare_user;
\q
```

3. **Update database.js**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'fairshare_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fairshare',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Update all db.prepare() calls to use pool.query()
```

4. **Install pg package**
```bash
npm install pg
```

5. **Update Environment Variables**
```
DB_USER=fairshare_user
DB_HOST=localhost
DB_NAME=fairshare
DB_PASSWORD=secure_password
DB_PORT=5432
```

---

## Environment Variables

### Required Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-key-minimum-32-characters

# Database (if using PostgreSQL)
DB_USER=fairshare_user
DB_HOST=localhost
DB_NAME=fairshare
DB_PASSWORD=secure_password
DB_PORT=5432
```

### Optional Variables

```bash
# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Security Checklist

### Before Deployment

- [ ] Change default JWT_SECRET
- [ ] Use strong passwords for database
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Remove console.log statements
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitor logs for suspicious activity

### Production Best Practices

```javascript
// Add to server.js

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

---

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs fairshare

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Log Management

```bash
# Install winston for better logging
npm install winston

# Create logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## Backup Strategy

### SQLite Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp fairshare.db backups/fairshare_$DATE.db

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### PostgreSQL Backup

```bash
# Backup
pg_dump fairshare > backup_$(date +%Y%m%d).sql

# Restore
psql fairshare < backup_20240115.sql
```

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 PID
```

**Permission denied:**
```bash
# Fix file permissions
chmod +x server.js
```

**Database connection error:**
```bash
# Check database status
sudo systemctl status postgresql
# Restart database
sudo systemctl restart postgresql
```

---

## Support

For deployment issues, please:
1. Check the [GitHub Issues](https://github.com/Aayush-sh23/fairshare-academic-system/issues)
2. Review logs: `pm2 logs fairshare`
3. Open a new issue with deployment details

---

**Happy Deploying! 🚀**