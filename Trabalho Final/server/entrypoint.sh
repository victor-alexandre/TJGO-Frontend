#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Run the Sequelize migrations to create/update database tables
echo "Running database migrations..."
npx sequelize-cli db:migrate
echo "Migrations complete."

# Run database seeders
echo "Running database seeders..."
npx sequelize-cli db:seed:all
echo "Seeding complete."


# Then, execute the command passed to the script (which will be "npm start" from the Dockerfile)
exec "$@"