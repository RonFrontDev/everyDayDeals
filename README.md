# Every Day Deals

## First time setup

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

### Start the server

```bash
# cd into the backend folder and run:
node server.js
```

### Start the client

There are two ways to start the client:

First is to serve files like in production, so frontend files run on same environment as the server. This is useful for testing the production build and getting real life fetched data from the live API in use.

```bash
# cd into the frontend folder and run:
npm run dev:serve
```

Second is to run the client in development mode, which is useful for developing the frontend (styling and markup/html changes).

```bash
# cd into the frontend folder and run:
npm run dev
```
