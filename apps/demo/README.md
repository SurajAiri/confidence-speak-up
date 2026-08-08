This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database & Waitlist API

The waitlist form on the landing page posts to `POST /api/waitlist`, which validates
the email and stores it in Postgres via [Drizzle ORM](https://orm.drizzle.team).

### Local development (Docker)

1. Start local Postgres:
   ```bash
   docker compose up -d
   ```
2. Copy the env file and adjust if needed (defaults already match `docker-compose.yml`):
   ```bash
   cp .env.example .env
   ```
3. Push the schema to your local DB:
   ```bash
   npm run db:push
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

`npm run db:studio` opens Drizzle Studio if you want a quick UI to browse signups.

### Production (Neon)

1. Create a project at [neon.tech](https://neon.tech) and copy the pooled connection
   string from the dashboard.
2. Set `DATABASE_URL` to that string in your deployment platform's env vars (e.g.
   Vercel project settings).
3. Run the migration against it once:
   ```bash
   DATABASE_URL="<your neon url>" npm run db:migrate
   ```

No code changes are needed between local Docker Postgres and Neon — both speak
standard Postgres wire protocol, and `src/db/index.ts` auto-detects whether SSL is
needed based on the host.

### Schema changes

After editing `src/db/schema.ts`:
```bash
npm run db:generate   # creates a new SQL migration in drizzle/
npm run db:migrate    # applies pending migrations
```
Use `npm run db:push` instead for quick local iteration without generating migration files.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
