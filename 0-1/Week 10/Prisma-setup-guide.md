# Prisma 7 + PostgreSQL Setup Cheatsheet

**Stack:** Node.js · TypeScript · PostgreSQL · Prisma ORM 7.10.1

## 1. Install dependencies

Runtime dependencies:

```bash
npm install @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 pg dotenv
```

Development dependencies:

```bash
npm install -D prisma@7.10.1
```

**Purpose of each package:**

- `prisma`: CLI for migrations, schema validation and client generation.
- `@prisma/client`: Prisma Client for database queries.
- `@prisma/adapter-pg`: PostgreSQL driver adapter.
- `pg`: PostgreSQL Node.js driver.
- `dotenv`: Loads environment variables.

## 2. Initialize Prisma

```bash
npx prisma init
```

This creates:

- `prisma/schema.prisma`
- `prisma7.config.ts`
- `.env`

**Important:** Prisma 7.10.1 may also install AI-agent skill files. Remove `.claude/`, `.windsurf/`, `.agents/` and `skills-lock.json` if unwanted. Check `package.json` for any unwanted skills-related postinstall script.

## 3. Configure environment variables

In `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
```

Replace the username, password and database name with your actual PostgreSQL credentials.

Never commit `.env` to Git.

## 4. Configure Prisma

### prisma7.config.ts

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Define your models here
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

**Important differences from older Prisma versions:**

- Generator provider is `prisma-client`, not `prisma-client-js`.
- Explicit client output path is required.
- Database URL is configured in `prisma7.config.ts`, not in the datasource block.
- Prisma 7 uses a driver adapter for this PostgreSQL setup.

## 5. Initialize Prisma Client

Create `src/config/db.ts`:

```ts
import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
```

**Why the adapter?**

Prisma 7 uses database driver adapters to connect Prisma Client to the underlying database driver. Here, PrismaPg connects Prisma to PostgreSQL through `pg`.

The dotenv import is important because the application runs independently of the Prisma CLI.

## 6. Generate Prisma Client

```bash
npx prisma generate
```

Generates the TypeScript client inside:

```text
src/generated/prisma/
```

## 7. Run database migrations

For the initial migration:

```bash
npx prisma migrate dev --name init
```

For subsequent schema changes:

```bash
npx prisma migrate dev --name migration_name
```
This creates a migration file and applies it to your development database.

## 8. Extra

Whenever you change the schema, you need to run `npx prisma migrate dev --name migration_name` and then `npx prisma generate`.
Delete the AI files and edit package.json too.

Add this in package.json:

```json
"allowScripts": {
    "esbuild@0.28.2": true,
    "prisma@7.10.1": true,
    "@prisma/engines@7.10.1": true
}
```

Add this in tsconfig.json:
~~~json
  "include": ["src/**/*.ts"]
~~~

Use in app.ts like this:

```ts
import prisma from "./config/db.js";

async function findUser(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: "raghav@gmail.com" },
    });
    console.log(user);
}
```

**Important:** If you encounter schema drift, don't blindly run `migrate reset`. It can delete existing database data. Investigate the differences first.

## 9. Useful Prisma commands

| Command                              | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| `npx prisma -v`                      | Check installed versions                 |
| `npx prisma validate`                | Validate schema                          |
| `npx prisma format`                  | Format schema                            |
| `npx prisma generate`                | Generate Prisma Client                   |
| `npx prisma migrate dev --name init` | Create and apply migration               |
| `npx prisma migrate status`          | Check migration status                   |
| `npx prisma studio`                  | Open visual database browser             |
| `npx prisma db pull`                 | Introspect existing database             |
| `npx prisma migrate reset`           | Reset development database (destructive) |

## 10. Verify the setup

```bash
npx tsc --noEmit
npx prisma validate
npx prisma generate
npm run dev
```

Your application should start without database connection or TypeScript errors.

## 11. Expected project structure

```text
project/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── generated/
│   │   └── prisma/
│   └── app.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── prisma7.config.ts
```

---

### Important reminders

1. Keep Prisma CLI and Client versions aligned.
2. Keep `.env` out of Git.
3. Commit migration files to Git.
4. Regenerate Prisma Client after schema changes.
5. Import Prisma Client from your custom generated output path.
6. Load dotenv in the application runtime.
7. Don't run destructive migration commands without checking existing data.
8. Remove unwanted AI-agent skill files after initialization.

**Official documentation:** [https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql)
