#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Define o caminho para o nosso arquivo de "trava"
SEED_LOCK_FILE="/app/.seeded"

# Executa as migrações do banco de dados
echo "Running database migrations..."
npx sequelize-cli db:migrate
echo "Migrations complete."

# Verifica se o arquivo de trava NÃO existe
if [ ! -f "$SEED_LOCK_FILE" ]; then
  # Se não existe, executa o seeder
  echo "Database not seeded yet. Running seeders..."
  npx sequelize-cli db:seed:all
  echo "Seeding complete."
  
  # Cria o arquivo de trava para não executar o seeder novamente
  touch $SEED_LOCK_FILE
  echo "Seed lock file created."
else
  # Se o arquivo já existe, informa que o passo será pulado
  echo "Database already seeded. Skipping."
fi

# Executa o comando principal passado para o script (npm start)
echo "Starting application..."
exec "$@"