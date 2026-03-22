#!/bin/sh
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set — skipping migrations"
else
  echo "Running database migrations..."
  npx prisma migrate deploy || echo "WARNING: migrations failed, starting server anyway"
fi

exec node .next/standalone/server.js
