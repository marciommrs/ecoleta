import path from 'path';

module.exports = {
  client: 'sqlite3',
  connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: true
};

//Executar o migration: 
//npx knex migrate:latest --knexfile knexfile.ts migrate:latest
//npm run knex:migrate