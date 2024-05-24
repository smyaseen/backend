# Backend

A NestJS App with Login, Signup feature, with latest technology, tools, and best practices.

## Features

- **[JWT]** - JWT Login, and Refresh Token setup
- **[Cors Origin]** - Allow only given origin

- **[Helmet]** - Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately. Generally, Helmet is just a collection of smaller middleware functions that set security-related HTTP headers

- **[Throttling]** -  to protect app from brute-force attacks

- **[Prisma ORM]** - using Prisma for efficient database handling
- **[MongoDB]** - using MongoDB for user database
- **[ESlint]** and **[Prettier]** - For clean, consistent, and error-free code
- **[Jest]** and **[React Testing Library]** - For rock-solid unit tests
- **[Husky]** - For Git Hooks, having auto commit check, lint-staged, and running tests on commit.
- **[Lint-Staged]** - For linting and prettier
- **[Import Resolver]** - For auto import resolve on save


## 🎯 Getting Started

To get started with this app, follow these steps:

1. Fork & clone repository:

```bash
## Don't forget to ⭐ star and fork it first :)
git clone https://github.com/smyaseen/backend.git
```

2. Add ENV variables

```bash
NODE_ENV=development or production
DATABASE_URL
SECRETKEY=
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
APP_LOGS=true
LOG_LEVEL=log
CORS_ORIGIN="http://localhost:5173"
```

3. Install the dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run start:dev
```

5. This project uses a git hook to enforce. To install the git hook, run the following command in the root directory of the project:

```sh
npm run prepare
```

## Running Tests

- **Unit tests**: Run Jest tests using `npm run coverage`
