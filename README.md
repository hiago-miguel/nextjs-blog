# Strapi & Next.JS Project

## Endpoints

The endpoints will be disabled after the project analysis.

* NextJS Endpoint: https://hiago-journey-nextjs.netlify.app/
* Strapi Endpoint: https://strapi-infnet.up.railway.app/
* Database Endpoint: ....us-east-2.aws.neon.tech (Hosted at Neon Tech)

## Local Build Instructions

### Strapi
```
cd api/
npm install
npm run develop
```

#### Environment Variables

```
# Server
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=<key1,key2,key3>
API_TOKEN_SALT=<SaltToken>
ADMIN_JWT_SECRET=<AdminJwtSecret>
TRANSFER_TOKEN_SALT=<TransferSaltToken>
JWT_SECRET=<JwtSecret>

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=<>....aws.neon.tech>
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=<strapi_user_password>
DATABASE_SSL=false
DATABASE_SCHEMA=strapi
DATABASE_FILENAME=
```

### Web 
```
cd web/
npm install
npm run start
```

## Netlify/railway Environments
The main branch of this repository is linked to Netlify (/web/) and Railway (/api/). This means that any new commit or merge done in the main branch results in a new automated deployment.

