#!/bin/sh
set -e

# Run the Sequelize migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate
echo "Migrations complete."

# Check if users exist in the database
USER_EXISTS=$(psql -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM \"Users\";" | tr -d '[:space:]')

if [ "$USER_EXISTS" -eq 0 ]; then
  echo "Running database seeders..."
  npx sequelize-cli db:seed:all
  echo "Seeding complete."
else
  echo "Skipping seeders (users already exist)."
fi

# Start the server
exec "$@"
