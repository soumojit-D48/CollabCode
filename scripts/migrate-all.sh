#!/bin/bash
set -e

SERVICES=("auth-service" "room-service")

for SERVICE in "${SERVICES[@]}"; do
  echo ""
  echo "Running migrations for $SERVICE..."
  cd "services/$SERVICE"
  npx prisma migrate dev --name init
  cd "../.."
done

echo ""
echo "All migrations complete."