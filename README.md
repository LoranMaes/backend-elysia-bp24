# Time registration - ElysiaJS

## Requirements

- Bun, [install here](https://bun.sh/)
  - Version used: v1.1.8

## Development

1. Create a new .env file and fill it in with your details

```bash
cp .env.example .env
```

2. To install all dependencies:

```bash
bun install
```

3. If there is no migrations folder (/drizzle)

```bash
bun drizzle-kit generate --dialect sqlite --schema ./src/db/schemas/*
```

4. To install the migrations

```bash
bun db:migrate
```

5. To seed the database

```bash
bun db:seed
```

6. To start the development server run:

```bash
bun run dev
```

## Handy commands

1. Create a visualization for the SQLite database
  > See the database [here](https://local.drizzle.studio)
  ```bash 
  bun db:studio
  ```
  

Open http://localhost:<your-port>/ with your browser to see the result.
