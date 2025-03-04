# Every Day Deals

## First time setup

### Install dependencies

```bash
# Global
npm install

# Backend
cd backend/
npm install

# Frontend
cd frontend/
npm install
```

### .env file

Duplicate `.env.example` and name it `.env` (in the root of the project).

Set `NODE_ENV` to `development` or `production`, eg.

```bash
# If set to production real life API data will be fetched
NODE_ENV=production

# If set to anything else dummyData will be used
NODE_ENV=development
NODE_ENV=staging
NODE_ENV=testing
# etc.
```

## Every day development

For development, there are two main ways to run the project.

First is to run the client in API mode, which is useful for developing with real API data:

```bash
npm run dev:api
```

Second is to run the client in development mode, which is useful for developing the frontend (styling and markup/html changes):

```bash
npm run dev
```
