# QA Automation Testing - Backend

## API Automation

### Tools
- **Postman** — API definition and collection
- **Newman** — Command-line collection runner
- **GitHub Actions** — CI automation

## Test Flow

The backend automation flow runs these steps:

1. Install dependencies
2. Start the backend server
3. Wait for the server to become ready
4. Ensure the admin user exists
5. Login as admin and update environment state
6. Register a worker user
7. Run the Postman collection with Newman

## Local Run

```bash
cd automation-engineer-test-be
npm install
```

Start the backend:

```bash
npm run dev
```

In a new terminal, run the bootstrap scripts in order:

```bash
node scripts/ensureAdmin.js
node scripts/loginAdmin.js
node scripts/registerWorker.js
```

Then run the Postman collection:

```bash
npm run test:postman
```

## CI Flow

The GitHub Actions workflow uses the same logical flow:

- `npm ci || npm install`
- `npm run dev` to start the backend
- wait for `http://localhost:8001` to become available
- `node scripts/ensureAdmin.js`
- `node scripts/loginAdmin.js`
- `node scripts/registerWorker.js`
- `npm run test:postman`

## Required environment values

The CI workflow provides these values as environment variables:

- `MONGO_URI` — MongoDB connection string
- `BASE_URL` — backend base URL (for example `http://localhost:8001`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Notes

- `test:postman` runs the Postman collection defined in `postman/collection.json` using the environment `postman/env.json`.
- The bootstrap scripts prepare test data before Newman executes the API tests.
